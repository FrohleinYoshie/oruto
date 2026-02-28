// jsdom 環境で Client Component をテストする（デフォルト環境）

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchInput from "./SearchInput";

// next/navigation をモック: useRouter が jsdom 環境では動作しないため
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("SearchInput", () => {
  // 各テスト前にモックの呼び出し履歴をリセットする
  beforeEach(() => {
    mockPush.mockClear();
  });

  describe("表示", () => {
    it("検索入力フィールドが表示される", () => {
      render(<SearchInput />);

      const input = screen.getByRole("textbox", { name: "アプリ名を検索" });
      expect(input).toBeInTheDocument();
    });

    it("プレースホルダーが表示される", () => {
      render(<SearchInput />);

      expect(
        screen.getByPlaceholderText("アプリ名を入力（例: Evernote）")
      ).toBeInTheDocument();
    });

    it("検索ボタンが表示される", () => {
      render(<SearchInput />);

      expect(
        screen.getByRole("button", { name: "検索" })
      ).toBeInTheDocument();
    });
  });

  describe("フォーム送信", () => {
    it("検索語を入力してボタンをクリックすると /search?q= にナビゲートする", async () => {
      const user = userEvent.setup();
      render(<SearchInput />);

      await user.type(screen.getByRole("textbox"), "Evernote");
      await user.click(screen.getByRole("button", { name: "検索" }));

      expect(mockPush).toHaveBeenCalledOnce();
      expect(mockPush).toHaveBeenCalledWith("/search?q=Evernote");
    });

    it("Enter キーでも送信できる", async () => {
      const user = userEvent.setup();
      render(<SearchInput />);

      await user.type(screen.getByRole("textbox"), "Notion{Enter}");

      expect(mockPush).toHaveBeenCalledOnce();
      expect(mockPush).toHaveBeenCalledWith("/search?q=Notion");
    });

    it("空文字では検索しない（router.push が呼ばれない）", async () => {
      const user = userEvent.setup();
      render(<SearchInput />);

      await user.click(screen.getByRole("button", { name: "検索" }));

      expect(mockPush).not.toHaveBeenCalled();
    });

    it("スペースのみでは検索しない（trim 後に空文字になるため）", async () => {
      const user = userEvent.setup();
      render(<SearchInput />);

      await user.type(screen.getByRole("textbox"), "   ");
      await user.click(screen.getByRole("button", { name: "検索" }));

      expect(mockPush).not.toHaveBeenCalled();
    });

    it("日本語の検索語が URL エンコードされる", async () => {
      const user = userEvent.setup();
      render(<SearchInput />);

      await user.type(screen.getByRole("textbox"), "Google ドキュメント");
      await user.click(screen.getByRole("button", { name: "検索" }));

      // encodeURIComponent("Google ドキュメント") = "Google%20%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88"
      expect(mockPush).toHaveBeenCalledWith(
        "/search?q=Google%20%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88"
      );
    });

    it("前後のスペースがトリムされてから検索される", async () => {
      const user = userEvent.setup();
      render(<SearchInput />);

      await user.type(screen.getByRole("textbox"), "  Notion  ");
      await user.click(screen.getByRole("button", { name: "検索" }));

      // trim() された "Notion" で検索される
      expect(mockPush).toHaveBeenCalledWith("/search?q=Notion");
    });
  });
});
