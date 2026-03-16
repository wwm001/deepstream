import LibraryAssetForm from "./LibraryAssetForm";
import LibraryAssetList from "./LibraryAssetList";
import LibraryControlPanel, {
  type LibraryFilter,
  type LibrarySort,
} from "./LibraryControlPanel";
import LibraryStateSummary from "./LibraryStateSummary";
import DashboardCardGrid from "./DashboardCardGrid";
import DashboardSectionStack from "./DashboardSectionStack";
import {
  dashboardSections,
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
  totalLibraryAssets: number;
  summaryCounts: {
    stableCount: number;
    activeCount: number;
    nextCount: number;
  };
  onAddLibraryAsset: (input: {
    name: string;
    role: string;
    state: LibraryAsset["state"];
    note: string;
  }) => void;
  onRemoveLibraryAsset: (assetId: string) => void;
};

function LibrarySectionContent({
  libraryFilter,
  onLibraryFilterChange,
  librarySort,
  onLibrarySortChange,
  librarySearchTerm,
  onLibrarySearchTermChange,
  filteredLibraryAssets,
  totalLibraryAssets,
  summaryCounts,
  onAddLibraryAsset,
  onRemoveLibraryAsset,
}: LibrarySectionContentProps) {
  const section = dashboardSections["ライブラリ"];

  return (
    <DashboardSectionStack>
      <LibraryStateSummary
        stableCount={summaryCounts.stableCount}
        activeCount={summaryCounts.activeCount}
        nextCount={summaryCounts.nextCount}
      />

      <LibraryAssetForm onAddAsset={onAddLibraryAsset} />

      <LibraryControlPanel
        selectedFilter={libraryFilter}
        onSelectFilter={onLibraryFilterChange}
        selectedSort={librarySort}
        onSelectSort={onLibrarySortChange}
        searchTerm={librarySearchTerm}
        onSearchTermChange={onLibrarySearchTermChange}
        totalCount={totalLibraryAssets}
        filteredCount={filteredLibraryAssets.length}
      />

      <LibraryAssetList
        items={filteredLibraryAssets}
        onRemoveAsset={onRemoveLibraryAsset}
      />

      <DashboardCardGrid cards={section.cards} />
    </DashboardSectionStack>
  );
}

export default LibrarySectionContent;