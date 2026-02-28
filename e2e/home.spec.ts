import { test, expect } from "@playwright/test";

test.describe("ホームページ", () => {
  test("タイトルとヒーローセクションが表示される", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/オルト/);
    await expect(
      page.getByRole("heading", { level: 1 })
    ).toContainText("あのツールの代わり、みんな何使ってる？");
  });

  test("サービス説明文が表示される", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByText("アフィリエイトによる順位操作は一切ありません")
    ).toBeVisible();
  });

  test("検索フォームが表示される", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByPlaceholder("アプリ名を入力（例: Evernote）")
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "検索" })).toBeVisible();
  });

  test("検索語を入力してボタンをクリックすると /search ページへ遷移する", async ({
    page,
  }) => {
    await page.goto("/");

    await page
      .getByPlaceholder("アプリ名を入力（例: Evernote）")
      .fill("Notion");
    await page.getByRole("button", { name: "検索" }).click();

    await expect(page).toHaveURL("/search?q=Notion");
  });

  test("ヘッダーのロゴが表示される", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("banner").getByText("オルト")).toBeVisible();
  });

  test("フッターのコピーライトが表示される", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("contentinfo")).toContainText("オルト");
  });

  test.describe("未認証ユーザー向け", () => {
    test("ヘッダーにログインと登録のリンクが表示される", async ({ page }) => {
      await page.goto("/");

      const header = page.getByRole("banner");
      await expect(header.getByRole("link", { name: "ログイン" })).toBeVisible();
      await expect(header.getByRole("link", { name: "登録" })).toBeVisible();
    });

    test("アカウント登録を促すリンクが表示される", async ({ page }) => {
      await page.goto("/");

      await expect(
        page.getByRole("link", { name: "アカウント登録（無料）" })
      ).toBeVisible();
    });
  });
});
