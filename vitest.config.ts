import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // ブラウザ相当の DOM 環境（Client Component テスト用）
    environment: "jsdom",
    // グローバル API（describe, it, expect 等）を import なしで使用可能にする
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: [
      "src/generated/**", // Prisma 自動生成コード
      "node_modules/**",
      "e2e/**",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      // カバレッジ対象: src/ のみ（ビルド成果物・自動生成コードを除く）
      include: ["src/**"],
      exclude: [
        "src/generated/**", // Prisma 自動生成コード
        "src/app/**",       // ページルート（E2E でカバー）
        "**/*.d.ts",
        "**/*.config.*",
        "vitest.setup.ts",
      ],
    },
  },
  resolve: {
    alias: {
      // tsconfig の @/* エイリアスと同期
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
