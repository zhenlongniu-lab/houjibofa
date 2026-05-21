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
        <article className="paper">
          {/* Date header with double divider */}
          <div style={{ textAlign: "center", paddingBottom: "1.25rem", marginBottom: "1.25rem", borderBottom: "3px double #1a1a1a" }}>
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
              {daily.dateFormatted} · 共 {daily.items.length} 条新闻
            </div>
          </div>

          {/* News grid — 2 columns like liziran's dailies */}
          <div className="news-grid">
            {daily.items
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
          </div>

          <div className="paper-footer">
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
