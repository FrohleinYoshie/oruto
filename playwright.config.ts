import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",

  // テストを並列実行する
  fullyParallel: true,

  // CI では意図的な .only の使用を禁止する（コミット忘れ防止）
  forbidOnly: !!process.env.CI,

  // CI では失敗時に2回リトライ、ローカルではリトライなし
  retries: process.env.CI ? 2 : 0,

  // CI ではシリアル実行（並列実行によるDB競合を防ぐ）
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ["html"],
    // CI では GitHub Actions 向けにリスト形式も出力
    ...(process.env.CI ? ([["github"]] as const) : []),
  ],

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",

    // 失敗した最初のテストでトレースを取得（デバッグ用）
    trace: "on-first-retry",

    // スクリーンショットは失敗時のみ取得
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // ローカルでは既存サーバーを再利用、CI では常に新規起動
  webServer: {
    command: "npm run dev",
    url: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NODE_ENV: "test",
    },
  },
});
