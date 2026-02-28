import { test, expect } from "@playwright/test";

test.describe("認証ページ ナビゲーション", () => {
  test("ヘッダーのログインリンクからログインページへ遷移する", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("banner").getByRole("link", { name: "ログイン" }).click();

    await expect(page).toHaveURL("/login");
    await expect(
      page.getByRole("heading", { name: "アカウントにログイン" })
    ).toBeVisible();
  });

  test("ヘッダーの登録ボタンから登録ページへ遷移する", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("banner").getByRole("link", { name: "登録" }).click();

    await expect(page).toHaveURL("/signup");
    await expect(
      page.getByRole("heading", { name: "アカウントを作成" })
    ).toBeVisible();
  });

  test("ログインページから登録ページへのリンクが機能する", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByRole("link", { name: "登録" }).click();

    await expect(page).toHaveURL("/signup");
  });

  test("登録ページからログインページへのリンクが機能する", async ({
    page,
  }) => {
    await page.goto("/signup");

    await page.getByRole("link", { name: "ログイン" }).click();

    await expect(page).toHaveURL("/login");
  });
});

test.describe("ログインフォーム", () => {
  test("メールアドレスとパスワードの入力フィールドが表示される", async ({
    page,
  }) => {
    await page.goto("/login");

    await expect(page.getByPlaceholder("メールアドレス")).toBeVisible();
    await expect(page.getByPlaceholder("パスワード")).toBeVisible();
    await expect(page.getByRole("button", { name: "ログイン" })).toBeVisible();
  });

  test("不正な認証情報でエラーメッセージが表示される", async ({ page }) => {
    await page.goto("/login");

    await page.getByPlaceholder("メールアドレス").fill("wrong@example.com");
    await page.getByPlaceholder("パスワード").fill("wrongpassword");
    await page.getByRole("button", { name: "ログイン" }).click();

    // エラー時は URL の ?error= パラメータ経由でメッセージが表示される
    await expect(page).toHaveURL(/\/login\?error=/);
    await expect(page.getByRole("alert")).toBeVisible();
  });
});

test.describe("登録フォーム", () => {
  test("メールアドレスとパスワードの入力フィールドが表示される", async ({
    page,
  }) => {
    await page.goto("/signup");

    await expect(page.getByPlaceholder("メールアドレス")).toBeVisible();
    await expect(page.getByPlaceholder("パスワード")).toBeVisible();
    await expect(page.getByRole("button", { name: "登録する" })).toBeVisible();
  });
});
