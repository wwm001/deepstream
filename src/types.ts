export type DashboardCardType =
  | "ステータス"
  | "進行中"
  | "次の一手"
  | "試作段階";

export type DashboardCard = {
  title: string;
  description: string;
  type: DashboardCardType;
};

export type NavigationItem = {
  label: string;
  active: boolean;
};

export type AppMeta = {
  title: string;
  subtitle: string;
  footerText: string;
  badge: string;
  statusText: string;
};