import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import { getLatestNews } from "@/lib/data";
import type { DailyNews } from "@/lib/types";

export default function Home() {
  let daily: DailyNews | null = null;
  try {
    daily = getLatestNews();
  } catch {
    // no data yet
  }

  return (
    <>
      <Header />

      {daily ? (
        <article className="paper" style={{ padding: 0, overflow: "hidden" }}>
          {/* Hero — episode cover image with date overlay */}
          {daily.episodeImage && (
            <div
              style={{
                width: "100%",
                aspectRatio: "16/9",
                maxHeight: 420,
                backgroundImage: `url(${daily.episodeImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "1.5rem",
                  left: "2rem",
                  right: "2rem",
                }}
              >
                <div
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", "Noto Serif SC", serif',
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "0.05em",
                    marginBottom: "0.25rem",
                    textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  新闻联播摘要
                </div>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem" }}>
                  {daily.dateFormatted} · 精选 {daily.items.length} 条
                </div>
              </div>
            </div>
          )}

          {!daily.episodeImage && (
            <div style={{ textAlign: "center", padding: "2rem 2rem 0" }}>
              <div
                style={{
                  fontFamily: 'Georgia, "Times New Roman", "Noto Serif SC", serif',
                  fontSize: "2.2rem",
                  fontWeight: 800,
                  color: "#1a1a1a",
                  letterSpacing: "0.05em",
                  marginBottom: "0.25rem",
                }}
              >
                新闻联播摘要
              </div>
              <div style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
                {daily.dateFormatted} · 精选 {daily.items.length} 条
              </div>
            </div>
          )}

          {/* News grid */}
          <div className="news-grid" style={{ padding: "1.5rem 2rem 2rem" }}>
            {daily.items
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
          </div>

          <div className="paper-footer" style={{ padding: "0 2rem 1.25rem" }}>
            <span>数据来源：央视网</span>
            <span>每日自动更新</span>
          </div>
        </article>
      ) : (
        <article className="paper" style={{ textAlign: "center", paddingTop: "4rem", paddingBottom: "4rem" }}>
          <h2 className="section-title">今日新闻摘要准备中</h2>
          <p style={{ color: "#9ca3af", fontSize: "0.95rem", marginTop: "0.75rem" }}>
            正在从央视网获取今日《新闻联播》的重点摘要和视频片段。
            <br />
            每日自动更新，敬请期待。
          </p>
        </article>
      )}

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "0 0 2rem", color: "#b8b6b0", fontSize: "0.8rem" }}>
        厚积薄发 · 日拱一卒，功不唐捐
      </footer>

    </>
  );
}
