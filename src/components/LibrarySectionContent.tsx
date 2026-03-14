import { useMemo, useState } from "react";
import StreamCard from "./StreamCard";
import LibraryAssetList from "./LibraryAssetList";
import LibraryControlPanel, {
  type LibraryFilter,
} from "./LibraryControlPanel";
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
    <>
      <LibraryControlPanel
        selectedFilter={libraryFilter}
        onSelectFilter={setLibraryFilter}
        searchTerm={librarySearchTerm}
        onSearchTermChange={setLibrarySearchTerm}
        totalCount={libraryAssets.length}
        filteredCount={filteredLibraryAssets.length}
      />

      <LibraryAssetList items={filteredLibraryAssets} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        {section.cards.map((card) => (
          <StreamCard
            key={card.title}
            title={card.title}
            description={card.description}
            type={card.type}
          />
        ))}
      </div>
    </>
  );
}

export default LibrarySectionContent;