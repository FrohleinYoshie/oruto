# Oruto

あのツールの代わり、みんな何使ってる？

ユーザー投票ベースのアプリ代替ツールデータベース。アフィリエイトに左右されない、リアルな声で代替ツールを探せるサービス。

## プロジェクト概要

Oruto は「このアプリの代わりに何を使っている？」というユーザーの疑問に、コミュニティの投票で答えるサービスです。アフィリエイト報酬に影響されない、純粋なユーザーの声をもとにアプリの代替ツールを見つけることができます。

## 技術スタック

### フロントエンド

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

### バックエンド / DB

- Supabase (Auth + PostgreSQL)
- Prisma ORM

### インフラ

- Docker (Node 20 Alpine)

## セットアップ

### 前提条件

- Docker / Docker Compose
- Supabase プロジェクト（認証・DB用）

### 環境変数

`.env.example` を `.env` にコピーし、以下を設定：

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
POSTGRES_HOST=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
```

### Docker で起動

```bash
docker compose up
```

開発サーバーが `http://localhost:3000` で起動します。

## npm スクリプト

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド（Prisma 型生成含む） |
| `npm run lint` | ESLint 実行 |
| `npm run db:generate` | Prisma クライアント生成 |
| `npm run db:migrate` | DB マイグレーション作成・適用 |
| `npm run db:push` | スキーマを DB に反映 |
| `npm run db:studio` | Prisma Studio（DB GUI）起動 |

## ドキュメント

- [アーキテクチャ](docs/architecture.md)
- [データベース設計](docs/database.md)
- [認証](docs/auth.md)
- [UI デザイントークン](docs/ui-design-tokens.md)
- [ロードマップ](docs/roadmap.md)

## ライセンス

未定
