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
        className="daily-card"
        style={{
          borderTop: `3px solid ${accentColor}`,
        }}
      >
        {/* Number */}
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "1.4rem",
            fontWeight: 800,
            color: accentColor,
            lineHeight: 1,
            marginBottom: "0.5rem",
            display: "block",
          }}
        >
          {String(item.order).padStart(2, "0")}
        </span>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'Georgia, "Times New Roman", "Noto Serif SC", serif',
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#1a1a1a",
            lineHeight: 1.6,
            flex: 1,
            marginBottom: "0.75rem",
          }}
        >
          {item.title}
        </h3>

        {/* Tags + CTA row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
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
          <span style={{ fontSize: "0.78rem", color: "#9ca3af" }}>→</span>
        </div>
      </article>
    </Link>
  );
}
