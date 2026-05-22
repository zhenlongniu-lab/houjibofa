import Link from "next/link";
import type { NewsItem } from "@/lib/types";

interface NewsCardProps {
  item: NewsItem;
}

const TAG_COLORS: Record<string, string> = {
  时政: "#b91c1c",
  领导人: "#991b1b",
  经济: "#1e40af",
  国际: "#7c3aed",
  外交: "#6d28d9",
  军事: "#4b5563",
  科技: "#0d9488",
  航天: "#0f766e",
  农业: "#65a30d",
  文化: "#c2410c",
  教育: "#2563eb",
  民生: "#059669",
  医疗: "#0891b2",
  环境: "#15803d",
  生态: "#166534",
  能源: "#ca8a04",
  交通: "#0369a1",
};

export default function NewsCard({ item }: NewsCardProps) {
  const primaryTag = item.tags[0] || "综合";
  const accentColor = TAG_COLORS[primaryTag] || "#6b7280";

  return (
    <Link
      href={`/news/${item.id}?date=${item.date}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <article
        className="news-card"
        style={{
          borderLeft: `3px solid ${accentColor}`,
          padding: "1.25rem 1.25rem 1.25rem 1.5rem",
          background: "#fefdfb",
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          transition: "box-shadow 0.15s ease",
        }}
      >
        {/* Order number + primary tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          <span
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.3rem",
              fontWeight: 800,
              color: accentColor,
              lineHeight: 1,
            }}
          >
            {String(item.order).padStart(2, "0")}
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              color: "#6b7280",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {primaryTag}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'Georgia, "Times New Roman", "Noto Serif SC", serif',
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#1a1a1a",
            lineHeight: 1.55,
            marginBottom: "0.5rem",
            flex: 1,
          }}
        >
          {item.title}
        </h3>

        {/* Tags row */}
        {item.tags.length > 1 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.3rem",
              marginTop: "0.5rem",
            }}
          >
            {item.tags.slice(1, 4).map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "0.65rem",
                  color: "#6b7280",
                  background: "#f3f4f6",
                  padding: "0.1rem 0.45rem",
                  borderRadius: 3,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Read link */}
        <div
          style={{
            marginTop: "1rem",
            fontSize: "0.78rem",
            color: "#9ca3af",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          阅读详情
          <span style={{ fontSize: "0.7rem" }}>→</span>
        </div>
      </article>
    </Link>
  );
}
