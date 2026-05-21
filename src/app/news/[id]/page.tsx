import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsItem } from "@/lib/data";
import VideoPlayer from "@/components/VideoPlayer";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { id } = await params;
  const { date } = await searchParams;
  if (!date) return { title: "新闻详情 — 厚积薄发" };

  const item = getNewsItem(date, id);
  if (!item) return { title: "未找到 — 厚积薄发" };

  return {
    title: `${item.title} — 厚积薄发`,
    description: item.summary,
  };
}

export default async function NewsDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { date } = await searchParams;

  if (!date) notFound();

  const item = getNewsItem(date, id);
  if (!item) notFound();

  return (
    <>
      {/* Top bar */}
      <header
        style={{
          maxWidth: 800,
          margin: "0 auto 1.25rem",
          padding: "1rem 0.25rem 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#8b8984",
            textDecoration: "none",
            fontSize: "0.95rem",
            letterSpacing: "0.05em",
          }}
        >
          厚积薄发
        </Link>
      </header>

      <article className="paper">
        {/* Back link */}
        <Link
          href="/"
          style={{
            color: "#9ca3af",
            textDecoration: "none",
            fontSize: "0.88rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            marginBottom: "1.5rem",
          }}
        >
          ← 返回首页
        </Link>

        {/* Article header */}
        <header style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
            <span style={{ color: "#b8b6b0", fontSize: "0.8rem" }}>{item.date}</span>
            {item.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="section-title">{item.title}</h1>
          <p style={{ color: "#374151", fontSize: "1.05rem", lineHeight: 1.9, marginTop: "1rem" }}>
            {item.summary}
          </p>
        </header>

        {/* Image */}
        <div
          style={{
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: 8,
            backgroundImage: `url(${item.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            marginBottom: "2.5rem",
          }}
        />

        {/* Video */}
        <section style={{ marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: "1.3rem",
              fontWeight: 800,
              color: "#1a1a1a",
              marginBottom: "1rem",
            }}
          >
            视频片段
          </h2>
          <VideoPlayer videoUrl={item.videoUrl} title={item.title} />
        </section>

        {/* Full content */}
        <section>
          <h2
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: "1.3rem",
              fontWeight: 800,
              color: "#1a1a1a",
              marginBottom: "1.25rem",
            }}
          >
            详细报道
          </h2>
          <div style={{ fontSize: "1.05rem", lineHeight: 2, color: "#374151" }}>
            {item.fullContent.split("\n").map((p, i) => (
              <p key={i} style={{ marginBottom: "1rem" }}>
                {p}
              </p>
            ))}
          </div>
        </section>

        <div className="paper-footer">
          <span>数据来源：央视网</span>
          <span>{item.date}</span>
        </div>
      </article>

      <footer style={{ textAlign: "center", padding: "0 0 2rem", color: "#b8b6b0", fontSize: "0.8rem" }}>
        厚积薄发 · 日拱一卒，功不唐捐
      </footer>
    </>
  );
}
