"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { NewsItem } from "@/lib/types";

interface NewsCardProps {
  item: NewsItem;
  index: number;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function NewsCard({ item, index }: NewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: 0.1 * index,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Link href={`/news/${item.id}?date=${item.date}`} className="block group">
        <article className="glass glass-hover p-0 overflow-hidden h-full flex flex-col">
          <div className="relative aspect-[16/9] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${item.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <span className="absolute bottom-3 right-3 glass px-2.5 py-1 text-xs text-text-secondary rounded-full">
              {formatDuration(item.duration)}
            </span>

            <span className="absolute top-3 left-3 text-[0.65rem] tracking-widest uppercase text-accent/70 font-medium">
              {String(item.order).padStart(2, "0")}
            </span>
          </div>

          <div className="flex-1 p-5 flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-text-primary leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-2">
              {item.title}
            </h3>

            <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 flex-1">
              {item.summary}
            </p>

            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.65rem] px-2 py-0.5 rounded-full bg-white/[0.04] text-text-muted border border-white/[0.04]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-1 text-xs text-accent/50 group-hover:text-accent transition-colors duration-300 mt-1">
              <span>查看详情</span>
              <svg
                className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
