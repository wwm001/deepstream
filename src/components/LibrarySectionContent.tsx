import LibraryAssetList from "./LibraryAssetList";
import LibraryControlPanel, {
  type LibraryFilter,
} from "./LibraryControlPanel";
import DashboardCardGrid from "./DashboardCardGrid";
import DashboardSectionStack from "./DashboardSectionStack";
import {
  dashboardSections,
  libraryAssets,
  type LibraryAsset,
} from "../data/dashboard";

type LibrarySectionContentProps = {
  libraryFilter: LibraryFilter;
  onLibraryFilterChange: (filter: LibraryFilter) => void;
  librarySearchTerm: string;
  onLibrarySearchTermChange: (value: string) => void;
  filteredLibraryAssets: LibraryAsset[];
};

function LibrarySectionContent({
  libraryFilter,
  onLibraryFilterChange,
  librarySearchTerm,
  onLibrarySearchTermChange,
  filteredLibraryAssets,
}: LibrarySectionContentProps) {
  const section = dashboardSections["ライブラリ"];

  return (
    <DashboardSectionStack>
      <LibraryControlPanel
        selectedFilter={libraryFilter}
        onSelectFilter={onLibraryFilterChange}
        searchTerm={librarySearchTerm}
        onSearchTermChange={onLibrarySearchTermChange}
        totalCount={libraryAssets.length}
        filteredCount={filteredLibraryAssets.length}
      />

      <LibraryAssetList items={filteredLibraryAssets} />

      <DashboardCardGrid cards={section.cards} />
    </DashboardSectionStack>
  );
}

export default LibrarySectionContent;