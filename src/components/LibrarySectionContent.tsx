import { useMemo, useState } from "react";
import LibraryAssetList from "./LibraryAssetList";
import LibraryControlPanel, {
  type LibraryFilter,
} from "./LibraryControlPanel";
import DashboardCardGrid from "./DashboardCardGrid";
import DashboardSectionStack from "./DashboardSectionStack";
import { dashboardSections, libraryAssets } from "../dashboardCards";

function LibrarySectionContent() {
  const section = dashboardSections["ライブラリ"];
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>("all");
  const [librarySearchTerm, setLibrarySearchTerm] = useState("");

  const filteredLibraryAssets = useMemo(() => {
    const normalizedSearchTerm = librarySearchTerm.trim().toLowerCase();

    return libraryAssets.filter((item) => {
      const matchesFilter =
        libraryFilter === "all" ? true : item.state === libraryFilter;

      const matchesSearch =
        normalizedSearchTerm.length === 0
          ? true
          : `${item.name} ${item.role} ${item.note}`
              .toLowerCase()
              .includes(normalizedSearchTerm);

      return matchesFilter && matchesSearch;
    });
  }, [libraryFilter, librarySearchTerm]);

  return (
    <DashboardSectionStack>
      <LibraryControlPanel
        selectedFilter={libraryFilter}
        onSelectFilter={setLibraryFilter}
        searchTerm={librarySearchTerm}
        onSearchTermChange={setLibrarySearchTerm}
        totalCount={libraryAssets.length}
        filteredCount={filteredLibraryAssets.length}
      />

      <LibraryAssetList items={filteredLibraryAssets} />

      <DashboardCardGrid cards={section.cards} />
    </DashboardSectionStack>
  );
}

export default LibrarySectionContent;