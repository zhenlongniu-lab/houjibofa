export default function Header() {
  return (
    <header
      style={{
        maxWidth: 800,
        margin: "0 auto 1.25rem",
        padding: "3rem 0.25rem 0.5rem",
        textAlign: "center",
      }}
    >
      <p
        style={{
          color: "#b8b6b0",
          fontSize: "0.78rem",
          letterSpacing: "0.3em",
          marginBottom: "0.5rem",
        }}
      >
        日拱一卒 · 功不唐捐
      </p>

      <h1
        style={{
          fontFamily: 'Georgia, "Times New Roman", "Noto Serif SC", serif',
          fontSize: "2.8rem",
          fontWeight: 800,
          color: "#1a1a1a",
          letterSpacing: "0.04em",
          marginBottom: "0.75rem",
        }}
      >
        厚积薄发
      </h1>

      <p
        style={{
          color: "#6b7280",
          fontSize: "1.05rem",
          lineHeight: 1.8,
          maxWidth: 480,
          margin: "0 auto 0.25rem",
        }}
      >
        每一次沉默的积淀，终将汇成破晓的光芒
      </p>

      <p
        style={{
          color: "#b8b6b0",
          fontSize: "0.82rem",
          marginTop: "0.25rem",
        }}
      >
        Still waters run deep. Every silent step compounds into brilliance.
      </p>
    </header>
  );
}
