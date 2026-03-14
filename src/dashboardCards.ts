import type { DashboardCard } from "./types";
import type { NavigationSection } from "./navigationItems";

type DashboardDetailItem = {
  label: string;
  value: string;
};

type DashboardSectionData = {
  description: string;
  statusLabel: string;
  focusLabel: string;
  detailItems: DashboardDetailItem[];
  cards: DashboardCard[];
};

export type SettingCheck = {
  label: string;
  value: string;
  state: "ok" | "watch" | "next";
  note: string;
};

export type LibraryAsset = {
  name: string;
  role: string;
  state: "stable" | "active" | "next";
  note: string;
};

export type StreamEvent = {
  title: string;
  detail: string;
  phase: "done" | "current" | "next";
};

export type HomeFocusItem = {
  label: string;
  title: string;
  detail: string;
  state: "now" | "ready" | "next";
};

export type DashboardSnapshotItem = {
  label: string;
  value: string;
  note: string;
  tone: "indigo" | "green" | "amber" | "gray";
};

export const settingsChecks: SettingCheck[] = [
  {
    label: "Dev Server",
    value: "Vite によるローカル確認フローを継続中",
    state: "ok",
    note: "画面確認のサイクルは安定しています。ポート切替が起きても動作自体は正常です。",
  },
  {
    label: "Git Sync",
    value: "main ブランチは GitHub と同期済み",
    state: "ok",
    note: "小さく変更して即 push する運用が定着しており、差分を長く抱え込んでいません。",
  },
  {
    label: "UI Direction",
    value: "静的モックから状態連動UIへ移行済み",
    state: "watch",
    note: "今後は見た目だけでなく、実データや実操作に寄せる段階に入ります。",
  },
  {
    label: "Next Expansion",
    value: "セクション別の専用表示を追加中",
    state: "next",
    note: "設定以外の画面にも、そのセクション専用の表示ブロックを増やしていく余地があります。",
  },
];

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
    state: "next",
    note: "今回追加する専用UIで、既存データから導出した数値を表示します。",
  },
];

export const streamEvents: StreamEvent[] = [
  {
    title: "UI骨格の初期構築",
    detail:
      "Header / Sidebar / Dashboard / Footer の基本構成を整え、DeepStream の画面ベースを確立しました。",
    phase: "done",
  },
  {
    title: "コンポーネント分割の実施",
    detail:
      "StatusPill、SectionHeader、SidebarNavItem、AppLayout などを分離し、小さな責務単位へ整理しました。",
    phase: "done",
  },
  {
    title: "状態連動UIへ移行",
    detail:
      "Sidebar の active 状態を App 管理へ移し、固定データではなく画面状態として扱う構成に変更しました。",
    phase: "current",
  },
  {
    title: "セクション専用UIの追加",
    detail:
      "設定・ライブラリ・ストリームの各画面に、それぞれ固有の補助パネルを追加する流れに入っています。",
    phase: "current",
  },
  {
    title: "実データ接続への準備",
    detail:
      "次は表示用の仮データを、より実運用に近いデータ構造や操作導線に寄せていく段階です。",
    phase: "next",
  },
];

export const homeFocusItems: HomeFocusItem[] = [
  {
    label: "Current Mode",
    title: "Prototype Flight",
    detail:
      "DeepStream は、静的モックから状態連動型の試作機へ移行し、画面ごとの性格が見え始めています。",
    state: "now",
  },
  {
    label: "Stable Routine",
    title: "Small Save Cycle",
    detail:
      "表示確認後にすぐ commit / push する運用が定着し、差分を長く抱えない安定した開発サイクルになっています。",
    state: "ready",
  },
  {
    label: "Visible Progress",
    title: "Section-Specific UI",
    detail:
      "ストリーム、ライブラリ、設定に固有パネルが入り、ホームを加えて全4画面が専用UIを持つ状態になりました。",
    state: "ready",
  },
  {
    label: "Next Orbit",
    title: "Toward Real Data",
    detail:
      "次段階では、仮置きの文言中心UIから、実データ構造や操作導線に近い形へ寄せていきます。",
    state: "next",
  },
];

export const dashboardSections: Record<NavigationSection, DashboardSectionData> =
  {
    ホーム: {
      description: "DeepStream 全体の現在地と重要ポイントを表示します。",
      statusLabel: "全体状況を監視中",
      focusLabel: "主要状態の可視化",
      detailItems: [
        {
          label: "Main Objective",
          value: "画面全体の状態と次の作業ポイントを一目で把握すること。",
        },
        {
          label: "Current Phase",
          value: "UI骨格の整備を終え、情報設計を実用寄りに調整する段階です。",
        },
        {
          label: "Operator Note",
          value:
            "最小単位で改修し、表示確認後に即 commit / push する運用が安定しています。",
        },
      ],
      cards: [
        {
          title: "Now Status",
          description: "DeepStream は起動中です。",
          type: "ステータス",
        },
        {
          title: "Mission Focus",
          description: "画面構成を実用レベルへ近づける段階です。",
          type: "次の一手",
        },
        {
          title: "Build State",
          description: "状態管理を導入し、静的モックを卒業しました。",
          type: "進行中",
        },
        {
          title: "Prototype Readiness",
          description: "UI確認と小分け保存を継続できる状態です。",
          type: "試作段階",
        },
      ],
    },
    ストリーム: {
      description: "進行中の更新や作業ログの流れを表示します。",
      statusLabel: "更新フローを追跡中",
      focusLabel: "作業の連続性確認",
      detailItems: [
        {
          label: "Stream Source",
          value: "UI更新、リファクタ、状態管理導入などの進行状況を集約します。",
        },
        {
          label: "Current Motion",
          value: "コンポーネント分割から、セクション連動型の画面へ進化しています。",
        },
        {
          label: "Next Stream Step",
          value: "今後は実データや実操作に近い表示へ寄せていく段階です。",
        },
      ],
      cards: [
        {
          title: "Recent Activity",
          description: "コンポーネント分割と状態管理の整備を進行中です。",
          type: "進行中",
        },
        {
          title: "Sidebar Control",
          description: "ナビゲーション選択が画面状態に連動しています。",
          type: "ステータス",
        },
        {
          title: "Next Update",
          description: "セクションごとの実データ表示をさらに磨きます。",
          type: "次の一手",
        },
        {
          title: "Flow Check",
          description: "表示確認と Git 保存の運用フローは安定しています。",
          type: "試作段階",
        },
      ],
    },
    ライブラリ: {
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
    },
    設定: {
      description: "環境情報や状態確認用の項目を表示します。",
      statusLabel: "開発環境を監視中",
      focusLabel: "同期状態の安定維持",
      detailItems: [
        {
          label: "Runtime",
          value: "Vite 開発サーバーを使い、ローカルで表示確認を継続しています。",
        },
        {
          label: "Git State",
          value:
            "main ブランチを基準に、ローカルと GitHub の同期状態を維持しています。",
        },
        {
          label: "Operational Rule",
          value: "表示確認後に即保存し、作業途中を長く抱えない運用を定着させています。",
        },
      ],
      cards: [
        {
          title: "Environment Check",
          description: "Vite 開発サーバーでローカル確認を継続しています。",
          type: "ステータス",
        },
        {
          title: "Git Sync",
          description: "main ブランチは GitHub と同期された状態です。",
          type: "進行中",
        },
        {
          title: "Next Config",
          description: "表示内容の実データ化と操作導線の強化を進めます。",
          type: "次の一手",
        },
        {
          title: "Prototype Ops",
          description: "ローカル確認 → commit → push の運用が定着しています。",
          type: "試作段階",
        },
      ],
    },
  };

const totalDashboardCards = Object.values(dashboardSections).reduce(
  (sum, section) => sum + section.cards.length,
  0
);

export const homeSystemSnapshotItems: DashboardSnapshotItem[] = [
  {
    label: "Sections",
    value: String(Object.keys(dashboardSections).length),
    note: "ホーム / ストリーム / ライブラリ / 設定 の4画面を搭載しています。",
    tone: "indigo",
  },
  {
    label: "Cards",
    value: String(totalDashboardCards),
    note: "全セクションを合計した表示カード数です。",
    tone: "green",
  },
  {
    label: "Assets",
    value: String(libraryAssets.length),
    note: "ライブラリで管理している再利用資産の数です。",
    tone: "gray",
  },
  {
    label: "Events",
    value: String(streamEvents.length),
    note: "ストリーム画面で追跡している更新イベント数です。",
    tone: "amber",
  },
  {
    label: "Checks",
    value: String(settingsChecks.length),
    note: "設定画面で監視している確認項目です。",
    tone: "gray",
  },
];