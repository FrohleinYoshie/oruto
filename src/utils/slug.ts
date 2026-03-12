// slug生成: 小文字化、スペースをハイフンに、特殊文字除去
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s　]+/g, "-") // 全角・半角スペースをハイフンに
    .replace(/[^a-z0-9\-]/g, "") // 英数字とハイフン以外を除去
    .replace(/-+/g, "-") // 連続ハイフンを1つに
    .replace(/^-|-$/g, ""); // 先頭・末尾のハイフンを除去
}
