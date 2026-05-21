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
    <div className="relative flex-1 flex flex-col">
      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors mb-8 group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </Link>

        {/* Article header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[0.7rem] tracking-widest uppercase text-accent/70 font-medium">
              {String(item.order).padStart(2, "0")}
            </span>
            <span className="text-xs text-text-muted">{item.date}</span>
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[0.65rem] px-2 py-0.5 rounded-full bg-white/[0.04] text-text-muted border border-white/[0.04]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight mb-6">
            {item.title}
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed">{item.summary}</p>
        </header>

        {/* Image */}
        <div className="glass overflow-hidden mb-10">
          <div
            className="w-full aspect-[16/9] bg-cover bg-center"
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          />
        </div>

        {/* Video */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-text-primary mb-4">视频片段</h2>
          <VideoPlayer videoUrl={item.videoUrl} title={item.title} />
        </section>

        {/* Full content */}
        <section className="glass p-8">
          <h2 className="text-xl font-semibold text-text-primary mb-6">详细报道</h2>
          <div className="prose prose-invert prose-sm max-w-none">
            {item.fullContent.split("\n").map((p, i) => (
              <p key={i} className="text-text-secondary leading-relaxed mb-4">
                {p}
              </p>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 w-full text-center pb-8">
        <p className="text-xs text-text-muted">
          数据来源：央视网 · 每日自动更新
        </p>
      </footer>
    </div>
  );
}
