/**
 * URL検証ユーティリティ
 *
 * 5層の防御でURLの安全性を検証する:
 * 1. フォーマットバリデーション（HTTPS必須、トップページのみ）
 * 2. 短縮URL・IPアドレス直打ちブロック
 * 3. 危険ドメインパターンチェック（自前実装、将来Web Risk APIに差し替え可能）
 * 4. サービス名とドメインの整合性チェック
 * 5. ホモグラフ・タイポスクワッティング対策
 */

// 既知の短縮URLサービスドメイン
const URL_SHORTENER_DOMAINS = new Set([
  "bit.ly",
  "t.co",
  "tinyurl.com",
  "goo.gl",
  "ow.ly",
  "is.gd",
  "buff.ly",
  "rebrand.ly",
  "cutt.ly",
  "short.io",
  "bl.ink",
  "lnk.to",
  "soo.gd",
  "s.id",
  "qr.ae",
  "amzn.to",
  "youtu.be",
  "rb.gy",
  "trib.al",
  "dlvr.it",
]);

// 悪用されやすい無料ホスティングのドメインパターン
const SUSPICIOUS_HOSTING_PATTERNS = [
  /^.+\.pages\.dev$/,       // Cloudflare Pages（正規利用も多いが注意）
  /^.+\.netlify\.app$/,     // Netlify
  /^.+\.vercel\.app$/,      // Vercel（正規利用も多いが注意）
  /^.+\.herokuapp\.com$/,   // Heroku
  /^.+\.firebaseapp\.com$/, // Firebase
  /^.+\.web\.app$/,         // Firebase Hosting
  /^.+\.glitch\.me$/,       // Glitch
  /^.+\.repl\.co$/,         // Replit
  /^.+\.000webhostapp\.com$/, // 000webhost
];

export interface UrlValidationResult {
  valid: boolean;
  error?: string;
  warnings: string[];
}

/** メインのURL検証関数 */
export function validateUrl(
  url: string,
  serviceName?: string
): UrlValidationResult {
  const warnings: string[] = [];

  // レイヤー1: フォーマットバリデーション
  const formatResult = validateFormat(url);
  if (formatResult.error) {
    return { valid: false, error: formatResult.error, warnings };
  }

  const parsed = formatResult.parsed!;

  // レイヤー2: 短縮URL・IPアドレスブロック
  const shortenerResult = checkShortenerAndIp(parsed);
  if (shortenerResult.error) {
    return { valid: false, error: shortenerResult.error, warnings };
  }

  // レイヤー3: 危険ドメインチェック
  const safetyResult = checkUrlSafety(parsed);
  if (safetyResult.warning) {
    warnings.push(safetyResult.warning);
  }

  // レイヤー4: サービス名との整合性チェック
  if (serviceName) {
    const matchResult = checkServiceNameMatch(serviceName, parsed.hostname);
    if (matchResult.warning) {
      warnings.push(matchResult.warning);
    }
  }

  // レイヤー5: ホモグラフ検出
  const homographResult = checkHomograph(parsed.hostname);
  if (homographResult.error) {
    return { valid: false, error: homographResult.error, warnings };
  }

  return { valid: true, warnings };
}

// --- レイヤー1: フォーマットバリデーション ---

function validateFormat(url: string): {
  error?: string;
  parsed?: URL;
} {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { error: "有効なURLを入力してください。" };
  }

  // HTTPS必須
  if (parsed.protocol !== "https:") {
    return { error: "URLはHTTPS（https://）で始まる必要があります。" };
  }

  // トップページのみ（パスが / または空のみ許可）
  if (parsed.pathname !== "/" && parsed.pathname !== "") {
    return {
      error:
        "公式サイトのトップページURL（例: https://example.com）を入力してください。サブページのURLは登録できません。",
    };
  }

  // クエリパラメータ・フラグメント禁止
  if (parsed.search) {
    return {
      error: "クエリパラメータ付きのURLは登録できません。トップページのURLを入力してください。",
    };
  }
  if (parsed.hash) {
    return {
      error: "フラグメント（#）付きのURLは登録できません。トップページのURLを入力してください。",
    };
  }

  return { parsed };
}

// --- レイヤー2: 短縮URL・IPアドレスブロック ---

function checkShortenerAndIp(parsed: URL): { error?: string } {
  // 短縮URLチェック
  if (isShortenerDomain(parsed.hostname)) {
    return {
      error: "短縮URLは登録できません。公式サイトの正式なURLを入力してください。",
    };
  }

  // IPアドレス直打ちチェック（IPv4）
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(parsed.hostname)) {
    return {
      error: "IPアドレスでのURL登録はできません。ドメイン名を使用してください。",
    };
  }

  // IPv6チェック
  if (parsed.hostname.startsWith("[") || parsed.hostname.includes(":")) {
    return {
      error: "IPアドレスでのURL登録はできません。ドメイン名を使用してください。",
    };
  }

  // localhost チェック
  if (
    parsed.hostname === "localhost" ||
    parsed.hostname.endsWith(".localhost")
  ) {
    return { error: "ローカルホストのURLは登録できません。" };
  }

  return {};
}

/** 短縮URLドメインか判定 */
export function isShortenerDomain(hostname: string): boolean {
  return URL_SHORTENER_DOMAINS.has(hostname.toLowerCase());
}

// --- レイヤー3: 危険ドメインチェック（将来Web Risk APIに差し替え可能） ---

function checkUrlSafety(parsed: URL): { warning?: string } {
  const hostname = parsed.hostname.toLowerCase();

  // 無料ホスティングパターンチェック
  for (const pattern of SUSPICIOUS_HOSTING_PATTERNS) {
    if (pattern.test(hostname)) {
      return {
        warning:
          "このURLは無料ホスティングサービスのドメインです。公式サイトのURLか確認してください。",
      };
    }
  }

  return {};
}

/**
 * 将来Web Risk APIに差し替える場合のインターフェース
 * 現在はスタブ実装（常にsafe）
 */
export async function checkUrlSafetyAsync(
  url: string
): Promise<{ safe: boolean; reason?: string }> {
  void url;
  // TODO: 収益化時にGoogle Web Risk APIに差し替え
  // https://cloud.google.com/web-risk/docs/lookup-api
  return { safe: true };
}

// --- レイヤー4: サービス名とドメインの整合性チェック ---

export function checkServiceNameMatch(
  serviceName: string,
  hostname: string
): { warning?: string } {
  // サービス名を正規化（小文字、スペース・記号除去）
  const normalizedName = serviceName
    .toLowerCase()
    .replace(/[\s\-_.+]/g, "");

  // ドメインからTLD・サブドメインを除去して比較
  // 例: "www.notion.so" → "notion"
  const domainParts = hostname.toLowerCase().split(".");
  // www を除去
  const filteredParts = domainParts.filter((p) => p !== "www");
  // TLDを除いた部分（例: notion.so → notion）
  const domainCore =
    filteredParts.length > 1
      ? filteredParts.slice(0, -1).join("")
      : filteredParts[0];

  // サービス名がドメインに含まれるかチェック
  if (
    !domainCore.includes(normalizedName) &&
    !normalizedName.includes(domainCore)
  ) {
    return {
      warning: `サービス名「${serviceName}」とURL のドメイン「${hostname}」が一致しません。正しい公式URLか確認してください。`,
    };
  }

  return {};
}

// --- レイヤー5: ホモグラフ・タイポスクワッティング対策 ---

function checkHomograph(hostname: string): { error?: string } {
  // Punycode検出（xn--で始まるドメイン = 非ASCIIを含む国際化ドメイン）
  const labels = hostname.split(".");
  for (const label of labels) {
    if (label.startsWith("xn--")) {
      return {
        error:
          "国際化ドメイン（非ASCII文字を含むドメイン）は登録できません。正規のASCIIドメインを使用してください。",
      };
    }
  }

  // ASCII範囲外の文字チェック（ブラウザがPunycodeに変換しない場合の対策）
  if (/[^\u0000-\u007F]/.test(hostname)) {
    return {
      error:
        "ドメイン名に非ASCII文字が含まれています。ホモグラフ攻撃の可能性があるため登録できません。",
    };
  }

  return {};
}
