import type { DashboardSectionData, LibraryAsset } from "./types";

export const libraryAssets: LibraryAsset[] = [
  {
    id: "status-pill",
    name: "StatusPill",
    role: "状態ラベル表示コンポーネント",
    state: "stable",
    note: "Header や Dashboard で共通利用している基礎部品です。",
  },
  {
    id: "section-header",
    name: "SectionHeader",
    role: "セクション見出し表示コンポーネント",
    state: "stable",
    note: "タイトル・説明・右側補助要素をまとめて扱える設計です。",
  },
  {
    id: "sidebar-nav-item",
    name: "SidebarNavItem",
    role: "サイドバー項目の単体表示",
    state: "stable",
    note: "active 状態とクリック処理を受け持つ小粒の部品です。",
  },
  {
    id: "app-layout",
    name: "AppLayout",
    role: "全体レイアウトの司令塔",
    state: "active",
    note: "Header / Sidebar / Content / Footer の配置責務を集約しています。",
  },
  {
    id: "dashboard-summary",
    name: "DashboardSummary",
    role: "セクション概要パネル",
    state: "active",
    note: "Current Section / Status / Focus をまとめて表示しています。",
  },
  {
    id: "dashboard-detail-panel",
    name: "DashboardDetailPanel",
    role: "セクション詳細情報の表示",
    state: "active",
    note: "各画面の文脈や運用メモを、詳細ブロックとして表示しています。",
  },
  {
    id: "settings-status-list",
    name: "SettingsStatusList",
    role: "設定専用の状態確認パネル",
    state: "active",
    note: "設定セクションだけに出る専用UIとして追加済みです。",
  },
  {
    id: "library-asset-list",
    name: "LibraryAssetList",
    role: "ライブラリ専用の資産一覧パネル",
    state: "active",
    note: "再利用部品の棚卸し表示を担う専用UIです。",
  },
  {
    id: "stream-event-timeline",
    name: "StreamEventTimeline",
    role: "ストリーム専用の更新履歴パネル",
    state: "active",
    note: "更新イベントの流れを時系列で示す専用UIです。",
  },
  {
    id: "home-overview-panel",
    name: "HomeOverviewPanel",
    role: "ホーム専用の全体状況サマリー",
    state: "active",
    note: "トップ画面の全体信号をまとめて表示する専用UIです。",
  },
];

export const librarySectionData: DashboardSectionData = {
  description: "再利用できる部品や参照情報を整理して表示します。",
  statusLabel: "設計資産を蓄積中",
  focusLabel: "再利用部品の整理",
  detailItems: [
    {
      label: "Reusable Modules",
      value:
        "StatusPill / SectionHeader / SidebarNavItem / AppLayout を再利用可能な資産として保持しています。",
    },
    {
      label: "Design Policy",
      value: "過分解を避けつつ、小さく分けて責務を明確にする方針です。",
    },
    {
      label: "Library Direction",
      value: "今後は見た目だけでなく、実機能に直結する部品整理へ進めます。",
    },
  ],
  cards: [
    {
      title: "Reusable Parts",
      description: "StatusPill / SectionHeader / SidebarNavItem を再利用中です。",
      type: "ステータス",
    },
    {
      title: "Layout Module",
      description: "AppLayout に画面全体レイアウト責務を集約しました。",
      type: "進行中",
    },
    {
      title: "Next Extraction",
      description: "今後は実機能追加を優先し、過分解は避けます。",
      type: "次の一手",
    },
    {
      title: "Component Shelf",
      description: "小さく切って保存する設計資産が蓄積されています。",
      type: "試作段階",
    },
  ],
};