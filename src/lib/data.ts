import { DailyNews } from "./types";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src/data/news");

export function getLatestNews(): DailyNews | null {
  if (!fs.existsSync(DATA_DIR)) return null;

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .reverse();

  if (files.length === 0) return null;

  const latest = files[0];
  const raw = fs.readFileSync(path.join(DATA_DIR, latest), "utf-8");
  return JSON.parse(raw) as DailyNews;
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
