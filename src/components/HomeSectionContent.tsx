import StreamCard from "./StreamCard";
import HomeMissionPanel from "./HomeMissionPanel";
import SystemSnapshotPanel from "./SystemSnapshotPanel";
import {
  dashboardSections,
  homeFocusItems,
  homeSystemSnapshotItems,
} from "../dashboardCards";

function HomeSectionContent() {
  const section = dashboardSections["ホーム"];

  return (
    <>
      <HomeMissionPanel items={homeFocusItems} />
      <SystemSnapshotPanel items={homeSystemSnapshotItems} />

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

export default HomeSectionContent;