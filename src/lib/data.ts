import { DailyNews } from "./types";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src/data/news");

export function getLatestNews(): DailyNews | null {
  // Always show yesterday — scrape runs at 8:30 AM for previous day's 新闻联播
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  return getNewsByDate(yesterday);
}

export function getNewsByDate(date: string): DailyNews | null {
  const filePath = path.join(DATA_DIR, `${date}.json`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as DailyNews;
}

export function getNewsItem(date: string, id: string) {
  const daily = getNewsByDate(date);
  if (!daily) return null;
  return daily.items.find((item) => item.id === id) ?? null;
}

export function getAllDates(): string[] {
  if (!fs.existsSync(DATA_DIR)) return [];

  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""))
    .sort()
    .reverse();
}
