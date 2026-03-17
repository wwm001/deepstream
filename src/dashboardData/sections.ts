import type { NavigationSection } from "../navigationItems";
import type { DashboardSectionData } from "./types";
import { homeSectionData } from "./homeData";
import { streamSectionData } from "./streamData";
import { librarySectionData } from "./libraryData";
import { settingsSectionData } from "./settingsData";

export const dashboardSections: Record<NavigationSection, DashboardSectionData> =
  {
    ホーム: homeSectionData,
    ストリーム: streamSectionData,
    ライブラリ: librarySectionData,
    設定: settingsSectionData,
  };