// HTMLタグを除去するサニタイズ関数
export function sanitizeText(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}
