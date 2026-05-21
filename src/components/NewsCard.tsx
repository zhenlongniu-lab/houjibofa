import Link from "next/link";
import type { NewsItem } from "@/lib/types";

interface NewsCardProps {
  item: NewsItem;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function NewsCard({ item }: NewsCardProps) {
  return (
    <Link
      href={`/news/${item.id}?date=${item.date}`}
      className="daily-card"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          borderRadius: 6,
          backgroundImage: `url(${item.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginBottom: "0.75rem",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            background: "rgba(0,0,0,0.65)",
            color: "#faf9f6",
            fontSize: "0.7rem",
            padding: "0.15rem 0.5rem",
            borderRadius: 3,
            fontFamily: "monospace",
          }}
        >
          {formatDuration(item.duration)}
        </span>
        <span
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.6rem",
            fontWeight: 500,
            letterSpacing: "0.15em",
          }}
        >
          {String(item.order).padStart(2, "0")}
        </span>
      </div>

      {/* Title — Georgia serif */}
      <div
        style={{
          fontFamily: 'Georgia, "Times New Roman", "Noto Serif SC", serif',
          fontSize: "1.1rem",
          fontWeight: 800,
          color: "#1a1a1a",
          marginBottom: "0.35rem",
          lineHeight: 1.4,
        }}
        className="line-clamp-2"
      >
        {item.title}
      </div>

      {/* Summary */}
      <p
        style={{
          fontSize: "0.92rem",
          lineHeight: 1.75,
          color: "#374151",
          flex: 1,
          marginBottom: "0.75rem",
        }}
        className="line-clamp-3"
      >
        {item.summary}
      </p>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" }}>
          {item.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div
        style={{
          display: "block",
          textAlign: "center",
          color: "#faf9f6",
          background: "#1a1a1a",
          textDecoration: "none",
          fontSize: "0.88rem",
          padding: "0.5rem 1rem",
          borderRadius: 4,
          border: "1px solid #1a1a1a",
          marginTop: "auto",
        }}
      >
        阅读详情 →
      </div>
    </Link>
  );
}
