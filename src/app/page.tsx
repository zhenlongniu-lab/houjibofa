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
    <div className="relative flex-1 flex flex-col">
      <Header />

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        {daily ? (
          <>
            <div className="mb-8 text-center">
              <p className="text-sm text-text-muted tracking-wide">
                {daily.dateFormatted} · 共 {daily.items.length} 条新闻
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {daily.items
                .sort((a, b) => a.order - b.order)
                .map((item, i) => (
                  <NewsCard key={item.id} item={item} index={i} />
                ))}
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center flex-1 py-32">
            <div className="glass p-12 text-center max-w-md">
              <div className="text-5xl mb-6 opacity-30">&#x1F4F0;</div>
              <h2 className="text-xl font-semibold text-text-primary mb-3">
                今日新闻摘要准备中
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                正在从央视网获取今日《新闻联播》的重点摘要和视频片段。
                <br />
                每日自动更新，敬请期待。
              </p>
              <div className="mt-6 w-32 h-0.5 bg-accent/20 rounded-full mx-auto shimmer" />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center pb-8">
        <p className="text-xs text-text-muted">
          数据来源：央视网 · 每日自动更新
        </p>
      </footer>
    </div>
  );
}
