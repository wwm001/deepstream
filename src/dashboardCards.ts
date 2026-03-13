import type { DashboardCard } from "./types";

export const dashboardCards: DashboardCard[] = [
  {
    title: "Now Status",
    description: "DeepStream は起動中です。",
    type: "ステータス",
  },
  {
    title: "Recent Activity",
    description: "コンポーネント分割とUI整理を進行中です。",
    type: "進行中",
  },
  {
    title: "Next Mission",
    description: "画面構成を実用レベルへ近づけます。",
    type: "次の一手",
  },
  {
    title: "Prototype Stage",
    description: "MacBook Pro 側で作業を継続しています。",
    type: "試作段階",
  },
];