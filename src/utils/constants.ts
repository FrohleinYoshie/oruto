// アプリが対応するプラットフォームの一覧
export const VALID_PLATFORMS = [
  "Web",
  "iOS",
  "Android",
  "Windows",
  "Mac",
  "Linux",
  "Chrome Extension",
  "Firefox Extension",
  "Edge Extension",
  "Safari Extension",
  "Other",
] as const;

// 価格タイプの選択肢
export const VALID_PRICING_TYPES = [
  "無料",
  "無料プランあり",
  "有料",
  "その他",
] as const;
