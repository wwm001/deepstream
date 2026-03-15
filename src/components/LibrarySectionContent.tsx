import LibraryAssetList from "./LibraryAssetList";
import LibraryControlPanel, {
  type LibraryFilter,
  type LibrarySort,
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
  librarySort: LibrarySort;
  onLibrarySortChange: (sort: LibrarySort) => void;
  librarySearchTerm: string;
  onLibrarySearchTermChange: (value: string) => void;
  filteredLibraryAssets: LibraryAsset[];
};

function LibrarySectionContent({
  libraryFilter,
  onLibraryFilterChange,
  librarySort,
  onLibrarySortChange,
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
        selectedSort={librarySort}
        onSelectSort={onLibrarySortChange}
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