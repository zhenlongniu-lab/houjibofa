"use client";

import { motion } from "framer-motion";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  return (
    <div className="glass overflow-hidden">
      <div className="relative w-full aspect-[16/9] flex flex-col items-center justify-center gap-4 bg-black/30">
        {/* Play icon */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center"
        >
          <svg
            className="w-7 h-7 text-accent ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </motion.div>

        <p className="text-sm text-text-muted px-4 text-center">
          视频来自央视网，点击下方按钮在新标签页中观看
        </p>

        <motion.a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/15 border border-accent/25 text-accent text-sm hover:bg-accent/25 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          在央视网观看完整视频
        </motion.a>
      </div>

      <div className="px-5 py-3 border-t border-white/5">
        <p className="text-sm text-text-secondary truncate">{title}</p>
      </div>
    </div>
  );
}
