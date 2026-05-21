"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <header className="relative z-10 w-full pt-16 pb-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col items-center text-center max-w-3xl mx-auto"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[0.8rem] tracking-[0.3em] uppercase text-accent mb-6"
        >
          日拱一卒 · 功不唐捐
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-text-primary mb-4"
        >
          厚积薄发
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-lg sm:text-xl text-text-secondary max-w-xl leading-relaxed font-light"
        >
          每一次沉默的积淀，终将汇成破晓的光芒
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-sm text-text-muted mt-3 font-light tracking-wide"
        >
          Still waters run deep. Every silent step compounds into brilliance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-10 w-16 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
        />
      </motion.div>
    </header>
  );
}
