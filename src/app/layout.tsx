import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "オルト.jp | あのツールの代わり、みんな何使ってる？",
  description:
    "アフィリエイトに汚染されていない、純粋なユーザー投票ベースの代替ツール検索データベース",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
