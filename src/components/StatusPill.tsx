type StatusPillProps = {
  label: string;
  tone?: "gray" | "indigo" | "green" | "amber";
  uppercase?: boolean;
};

const toneStyles: Record<
  NonNullable<StatusPillProps["tone"]>,
  {
    color: string;
    background: string;
    border: string;
    shadow: string;
  }
> = {
  gray: {
    color: "#475569",
    background: "#f8fafc",
    border: "#cbd5e1",
    shadow: "rgba(148, 163, 184, 0.18)",
  },
  indigo: {
    color: "#4338ca",
    background: "#eef2ff",
    border: "#c7d2fe",
    shadow: "rgba(99, 102, 241, 0.18)",
  },
  green: {
    color: "#047857",
    background: "#ecfdf5",
    border: "#a7f3d0",
    shadow: "rgba(16, 185, 129, 0.18)",
  },
  amber: {
    color: "#b45309",
    background: "#fffbeb",
    border: "#fde68a",
    shadow: "rgba(245, 158, 11, 0.18)",
  },
};

function StatusPill({
  label,
  tone = "gray",
  uppercase = true,
}: StatusPillProps) {
  const toneStyle = toneStyles[tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        maxWidth: "100%",
        padding: "7px 12px",
        borderRadius: "999px",
        background: toneStyle.background,
        border: `1px solid ${toneStyle.border}`,
        color: toneStyle.color,
        fontSize: "11px",
        fontWeight: 800,
        letterSpacing: uppercase ? "0.08em" : "0.02em",
        textTransform: uppercase ? "uppercase" : "none",
        lineHeight: 1.2,
        boxShadow: `0 4px 10px ${toneStyle.shadow}`,
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "999px",
          background: toneStyle.color,
          boxShadow: `0 0 0 4px ${toneStyle.shadow}`,
          flex: "0 0 auto",
        }}
      />

      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>
    </span>
  );
}

export default StatusPill;