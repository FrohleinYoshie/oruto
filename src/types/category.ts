/** カテゴリーのDTO（UI表示用） */
export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  iconName: string | null;
}

/** カテゴリー + 所属アプリのDTO */
export interface CategoryWithAppsDTO extends CategoryDTO {
  apps: import("./app").AppDTO[];
}
