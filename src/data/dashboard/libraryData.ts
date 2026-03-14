import type { LibraryAsset } from "./types";

export const libraryAssets: LibraryAsset[] = [
  {
    name: "StatusPill",
    role: "状態ラベル表示コンポーネント",
    state: "stable",
    note: "Header や Dashboard で共通利用している基礎部品です。",
  },
  {
    name: "SectionHeader",
    role: "セクション見出し表示コンポーネント",
    state: "stable",
    note: "タイトル・説明・右側補助要素をまとめて扱える設計です。",
  },
  {
    name: "SidebarNavItem",
    role: "サイドバー項目の単体表示",
    state: "stable",
    note: "active 状態とクリック処理を受け持つ小粒の部品です。",
  },
  {
    name: "AppLayout",
    role: "全体レイアウトの司令塔",
    state: "active",
    note: "Header / Sidebar / Content / Footer の配置責務を集約しています。",
  },
  {
    name: "DashboardSummary",
    role: "セクション概要パネル",
    state: "active",
    note: "Current Section / Status / Focus をまとめて表示しています。",
  },
  {
    name: "DashboardDetailPanel",
    role: "セクション詳細情報の表示",
    state: "active",
    note: "各画面の文脈や運用メモを、詳細ブロックとして表示しています。",
  },
  {
    name: "SettingsStatusList",
    role: "設定専用の状態確認パネル",
    state: "active",
    note: "設定セクションだけに出る専用UIとして追加済みです。",
  },
  {
    name: "LibraryAssetList",
    role: "ライブラリ専用の資産一覧パネル",
    state: "active",
    note: "再利用部品の棚卸し表示を担う専用UIです。",
  },
  {
    name: "StreamEventTimeline",
    role: "ストリーム専用の更新履歴パネル",
    state: "active",
    note: "更新イベントの流れを時系列で示す専用UIです。",
  },
  {
    name: "HomeMissionPanel",
    role: "ホーム専用の全体方針パネル",
    state: "active",
    note: "現在地・安定運用・次段階を一目で示す専用UIです。",
  },
  {
    name: "SystemSnapshotPanel",
    role: "ホーム専用の派生メトリクス表示",
    state: "active",
    note: "各セクションの状態を要約表示する計器パネルです。",
  },
];