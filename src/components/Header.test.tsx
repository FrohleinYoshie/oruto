// jsdom 環境で async Server Component をテストする
// Server Component は "await Component()" でJSXを取得してからレンダリングする

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

// ─────────────────────────────────────────────────────────────
// モック定義
// ─────────────────────────────────────────────────────────────

// Supabase サーバークライアントをモック
// cookies() から createClient() を経由するため、ここで完全に差し替える
const mockGetUser = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      auth: { getUser: mockGetUser },
    })
  ),
}));

// Server Action（signout）をモック
// form の action 属性に渡されるため、関数として存在する必要がある
vi.mock("@/features/auth/actions/auth.action", () => ({
  signout: vi.fn(),
}));

// ─────────────────────────────────────────────────────────────
// テストスイート
// ─────────────────────────────────────────────────────────────

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("共通要素", () => {
    it("ロゴ（オルト）へのリンクが表示される", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      render(await Header());

      const logo = screen.getByRole("link", { name: "オルト" });
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("href", "/");
    });

    it("header 要素がナビゲーションロールを持つ", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      render(await Header());

      // aria-label="メインナビゲーション" の nav 要素
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });

  describe("未認証ユーザー（user: null）", () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({ data: { user: null } });
    });

    it("ログインリンクが表示される", async () => {
      render(await Header());

      expect(screen.getByRole("link", { name: "ログイン" })).toBeInTheDocument();
    });

    it("登録リンクが表示される", async () => {
      render(await Header());

      expect(screen.getByRole("link", { name: "登録" })).toBeInTheDocument();
    });

    it("登録リンクが /signup を指す", async () => {
      render(await Header());

      expect(screen.getByRole("link", { name: "登録" })).toHaveAttribute(
        "href",
        "/signup"
      );
    });

    it("ログアウトボタンが表示されない", async () => {
      render(await Header());

      expect(
        screen.queryByRole("button", { name: "ログアウト" })
      ).not.toBeInTheDocument();
    });
  });

  describe("認証済みユーザー（user あり）", () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({
        data: {
          user: {
            id: "user-uuid-1234",
            email: "test@example.com",
            aud: "authenticated",
          },
        },
      });
    });

    it("ログアウトボタンが表示される", async () => {
      render(await Header());

      expect(
        screen.getByRole("button", { name: "ログアウト" })
      ).toBeInTheDocument();
    });

    it("ログインリンクが表示されない", async () => {
      render(await Header());

      expect(
        screen.queryByRole("link", { name: "ログイン" })
      ).not.toBeInTheDocument();
    });

    it("登録リンクが表示されない", async () => {
      render(await Header());

      expect(
        screen.queryByRole("link", { name: "登録" })
      ).not.toBeInTheDocument();
    });
  });
});
