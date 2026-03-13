type StreamCardProps = {
  title: string;
  description: string;
};

function StreamCard({ title, description }: StreamCardProps) {
  return (
    <article
      style={{
        padding: "16px",
        borderRadius: "10px",
        background: "#f3f4f6",
      }}
    >
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p style={{ marginBottom: 0 }}>{description}</p>
    </article>
  );
}

export default StreamCard;