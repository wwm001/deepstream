export type DashboardCard = {
  title: string;
  description: string;
  type: string;
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