
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// .env.local を優先的に読み込む（Next.jsと同じ挙動にする）
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // CLIによるマイグレーション・スキーマ操作はdirect接続（PgBouncer非経由）を使う
    url: process.env.POSTGRES_URL_NON_POOLING ?? "",
  },
});
