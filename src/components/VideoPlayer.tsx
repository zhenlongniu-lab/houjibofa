"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="glass overflow-hidden">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <AnimatePresence>
          {isLoading && (
            <motion.div
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 z-10"
            >
              <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              <span className="text-sm text-text-muted">视频加载中...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <iframe
          src={videoUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="autoplay; encrypted-media"
          onLoad={() => setIsLoading(false)}
        />
      </div>
      <div className="px-5 py-3 border-t border-white/5">
        <p className="text-sm text-text-secondary truncate">{title}</p>
      </div>
    </div>
  );
}
