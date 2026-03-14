import type { StreamEvent } from "./types";

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