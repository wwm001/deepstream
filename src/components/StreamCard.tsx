type StreamCardProps = {
  title: string;
  description: string;
};

function StreamCard({ title, description }: StreamCardProps) {
  return (
    <article
      style={{
        padding: "16px",
        borderRadius: "12px",
        background: "#f3f4f6",
        border: "1px solid #e5e7eb",
        minHeight: "140px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: "12px",
          fontSize: "16px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          marginBottom: 0,
          color: "#4b5563",
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </article>
  );
}

export default StreamCard;