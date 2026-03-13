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
          value: "最小単位で改修し、表示確認後に即 commit / push する運用が安定しています。",
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
          value: "StatusPill / SectionHeader / SidebarNavItem / AppLayout を再利用可能な資産として保持しています。",
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
          value: "main ブランチを基準に、ローカルと GitHub の同期状態を維持しています。",
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