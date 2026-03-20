export const navigationItems = [
  "ホーム",
  "ストリーム",
  "ライブラリ",
  "レポート",
  "設定",
] as const;

export type NavigationSection = (typeof navigationItems)[number];