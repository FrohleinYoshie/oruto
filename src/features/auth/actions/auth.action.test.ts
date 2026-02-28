// @vitest-environment node
// Server Actions はサーバーサイドで動作するため Node.js 環境でテストする

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─────────────────────────────────────────────────────────────
// vi.hoisted() でモック変数を宣言する
// vi.mock() はファイル先頭にホイストされるため、
// factory 内で参照する変数も vi.hoisted() でホイストする必要がある
// ─────────────────────────────────────────────────────────────
const {
  mockSignInWithPassword,
  mockSignUp,
  mockSignOut,
  mockRevalidatePath,
  mockRedirect,
} = vi.hoisted(() => ({
  mockSignInWithPassword: vi.fn(),
  mockSignUp: vi.fn(),
  mockSignOut: vi.fn(),
  mockRevalidatePath: vi.fn(),
  mockRedirect: vi.fn(),
}));

// Supabase クライアントをモック
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      auth: {
        signInWithPassword: mockSignInWithPassword,
        signUp: mockSignUp,
        signOut: mockSignOut,
      },
    })
  ),
}));

// Next.js キャッシュ無効化をモック
vi.mock("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}));

// redirect をモック
// 実際の Next.js では redirect() は例外をスローするが、
// テストでは純粋なスパイ関数として扱い呼び出し引数を検証する
vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

// ─────────────────────────────────────────────────────────────
// テスト対象（モック設定後にインポート）
// ─────────────────────────────────────────────────────────────
import { login, signup, signout } from "./auth.action";

// ─────────────────────────────────────────────────────────────
// ヘルパー関数
// ─────────────────────────────────────────────────────────────
function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  Object.entries(fields).forEach(([key, value]) => fd.append(key, value));
  return fd;
}

// ─────────────────────────────────────────────────────────────
// テストスイート
// ─────────────────────────────────────────────────────────────

describe("login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ログイン成功時に / にリダイレクトされる", async () => {
    mockSignInWithPassword.mockResolvedValue({ data: {}, error: null });

    await login(
      makeFormData({ email: "user@example.com", password: "pass123" })
    );

    expect(mockRedirect).toHaveBeenCalledWith("/");
  });

  it("ログイン成功時に revalidatePath('/') が呼ばれる", async () => {
    mockSignInWithPassword.mockResolvedValue({ data: {}, error: null });

    await login(
      makeFormData({ email: "user@example.com", password: "pass123" })
    );

    expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("ログイン失敗時に /login?error= にリダイレクトされる", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: {},
      error: { message: "Invalid login credentials" },
    });

    await login(
      makeFormData({ email: "wrong@example.com", password: "badpass" })
    );

    expect(mockRedirect).toHaveBeenCalledWith(
      expect.stringContaining("/login?error=")
    );
  });

  it("ログイン失敗時にエラーメッセージが URL エンコードされる", async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: {},
      error: { message: "Invalid credentials" },
    });

    await login(makeFormData({ email: "x@example.com", password: "bad" }));

    // エラーパラメータが URL エンコードされていることを確認する
    const call = mockRedirect.mock.calls[0][0] as string;
    expect(call).toMatch(/^\/login\?error=/);
    // エンコードされた日本語が含まれる
    expect(call).toContain("%");
  });

  it("フォームデータの email と password が Supabase に正確に渡される", async () => {
    mockSignInWithPassword.mockResolvedValue({ data: {}, error: null });

    await login(
      makeFormData({ email: "typed@example.com", password: "secret-pass" })
    );

    expect(mockSignInWithPassword).toHaveBeenCalledWith({
      email: "typed@example.com",
      password: "secret-pass",
    });
  });
});

describe("signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("登録成功時に / にリダイレクトされる", async () => {
    mockSignUp.mockResolvedValue({ data: {}, error: null });

    await signup(
      makeFormData({ email: "new@example.com", password: "pass123" })
    );

    expect(mockRedirect).toHaveBeenCalledWith("/");
  });

  it("登録成功時に revalidatePath('/') が呼ばれる", async () => {
    mockSignUp.mockResolvedValue({ data: {}, error: null });

    await signup(
      makeFormData({ email: "new@example.com", password: "pass123" })
    );

    expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("登録失敗時に /signup?error= にリダイレクトされる", async () => {
    mockSignUp.mockResolvedValue({
      data: {},
      error: { message: "User already registered", status: 422 },
    });

    await signup(
      makeFormData({ email: "existing@example.com", password: "pass" })
    );

    expect(mockRedirect).toHaveBeenCalledWith(
      expect.stringContaining("/signup?error=")
    );
  });

  it("フォームデータの email と password が Supabase に正確に渡される", async () => {
    mockSignUp.mockResolvedValue({ data: {}, error: null });

    await signup(
      makeFormData({ email: "new@example.com", password: "my-pass" })
    );

    expect(mockSignUp).toHaveBeenCalledWith({
      email: "new@example.com",
      password: "my-pass",
    });
  });
});

describe("signout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ログアウト成功時に / にリダイレクトされる", async () => {
    mockSignOut.mockResolvedValue({ error: null });

    await signout();

    expect(mockRedirect).toHaveBeenCalledWith("/");
  });

  it("ログアウト成功時に revalidatePath('/') が呼ばれる", async () => {
    mockSignOut.mockResolvedValue({ error: null });

    await signout();

    expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("ログアウトでエラーが発生してもリダイレクトされる（安全な縮退）", async () => {
    // セッションが既に切れているなど、サーバー側エラーが起きても
    // ユーザーを / に戻すことを保証する
    mockSignOut.mockResolvedValue({
      error: { message: "Session not found" },
    });

    await signout();

    expect(mockRedirect).toHaveBeenCalledWith("/");
  });
});
