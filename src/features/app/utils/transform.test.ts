// @vitest-environment node
// サーバーサイドの変換ロジックを Node.js 環境でテストする

import { describe, it, expect } from "vitest";
import { toCategoryDTO } from "./transform";

// Prisma の Category 型を模したテスト用フィクスチャ
// prisma generate 後に src/generated/prisma/client から型定義が利用可能になる
const makeFakeCategory = (overrides: {
  id?: string;
  name?: string;
  slug?: string;
  iconName?: string | null;
  createdAt?: Date;
} = {}) => ({
  id: "test-uuid-1234-5678-abcd",
  name: "メモ・ドキュメント",
  slug: "note-taking",
  iconName: "notebook" as string | null,
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  ...overrides,
});

describe("toCategoryDTO", () => {
  it("Prisma Category を CategoryDTO に正しく変換する", () => {
    const category = makeFakeCategory();

    const dto = toCategoryDTO(category);

    expect(dto).toEqual({
      id: "test-uuid-1234-5678-abcd",
      name: "メモ・ドキュメント",
      slug: "note-taking",
      iconName: "notebook",
    });
  });

  it("createdAt は DTO に含まれない（UI 不要なフィールドの排除）", () => {
    const category = makeFakeCategory();

    const dto = toCategoryDTO(category);

    // DB の内部フィールドが UI 層に漏れていないことを確認する
    expect("createdAt" in dto).toBe(false);
  });

  it("iconName が null の場合は null として保持する", () => {
    const category = makeFakeCategory({ iconName: null });

    const dto = toCategoryDTO(category);

    expect(dto.iconName).toBeNull();
  });

  it("iconName が文字列の場合はそのまま変換する", () => {
    const category = makeFakeCategory({ iconName: "star" });

    const dto = toCategoryDTO(category);

    expect(dto.iconName).toBe("star");
  });

  it("id と slug が正確に変換される", () => {
    const category = makeFakeCategory({
      id: "specific-id-9999",
      slug: "productivity",
    });

    const dto = toCategoryDTO(category);

    expect(dto.id).toBe("specific-id-9999");
    expect(dto.slug).toBe("productivity");
  });

  it("変換後の DTO が期待するキーのみを持つ", () => {
    const category = makeFakeCategory();

    const dto = toCategoryDTO(category);

    const dtoKeys = Object.keys(dto).sort();
    expect(dtoKeys).toEqual(["iconName", "id", "name", "slug"]);
  });
});
