type StatusPillProps = {
  label: string;
  tone?: "indigo" | "gray";
};

const toneStyles = {
  indigo: {
    color: "#4f46e5",
    background: "#eef2ff",
  },
  gray: {
    color: "#374151",
    background: "#f9fafb",
  },
};

function StatusPill({ label, tone = "gray" }: StatusPillProps) {
  const style = toneStyles[tone];

  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: style.color,
        background: style.background,
        padding: "6px 10px",
        borderRadius: "999px",
        border: tone === "gray" ? "1px solid #e5e7eb" : "none",
      }}
    >
      {label}
    </span>
  );
}

export default StatusPill;