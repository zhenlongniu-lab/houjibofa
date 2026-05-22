/**
 * CCTV Xinwen Lianbo Scraper
 *
 * Fetches daily news summary from tv.cctv.com for the 新闻联播 (Xinwen Lianbo) program.
 * Run: npx tsx scripts/scrape.ts [date]
 * Default date: today (YYYY-MM-DD format)
 *
 * CCTV column id for 新闻联播: TOPC1451528971114112
 */

import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

const COLUMN_ID = "TOPC1451528971114112";
const API_BASE = "https://api.cntv.cn";
const DATA_DIR = path.join(__dirname, "..", "src", "data", "news");

interface VideoItem {
  id: string;
  title: string;
  brief: string;
  image: string;
  videoUrl: string;
  guid: string;
  date: string;
  duration: string;
}

function formatDateCN(dateStr: string): string {
  const parts = dateStr.split("-");
  return `${parts[0]}年${parseInt(parts[1])}月${parseInt(parts[2])}日`;
}

function extractDateFromTitle(title: string): string | null {
  // Title format: "《新闻联播》 20260521 21:00"
  const match = title.match(/(\d{4})(\d{2})(\d{2})/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function formatDuration(seconds: string | number): number {
  const s = typeof seconds === "string" ? parseInt(seconds) : seconds;
  return isNaN(s) ? 0 : s;
}

/**
 * Fetch video list for a column from CCTV API
 */
async function fetchVideoList(date: string): Promise<VideoItem[]> {
  const url = `${API_BASE}/NewVideo/getVideoListByColumn`;
  const params = {
    id: COLUMN_ID,
    n: "20",
    sort: "desc",
    p: "1",
    mode: "0",
    serviceId: "tvcctv",
    d: date,
  };

  try {
    const response = await axios.get(url, {
      params,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Referer: "https://tv.cctv.com/",
      },
      timeout: 15000,
    });

    if (response.data?.data?.list) {
      return response.data.data.list.map((item: any) => ({
        id: item.guid || item.video_id || "",
        title: item.title || "",
        brief: item.brief || "",
        image: item.image || item.img_url || "",
        videoUrl: item.url || item.video_url || "",
        guid: item.guid || "",
        date: item.create_time || date,
        duration: item.duration || "0",
      }));
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch video list:", error);
    return [];
  }
}

/**
 * Fetch detailed content for a specific video/article page
 */
async function fetchFullContent(pageUrl: string): Promise<string> {
  try {
    const response = await axios.get(pageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    // Try to extract article content from CCTV page
    const contentAreas = [
      ".content_area",
      ".cnt_main",
      ".text_content",
      "article",
      ".article-content",
    ];

    for (const selector of contentAreas) {
      const el = $(selector);
      if (el.length > 0) {
        return el.text().trim();
      }
    }

    // Fallback: extract all paragraphs
    const paragraphs: string[] = [];
    $("p").each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 20) {
        paragraphs.push(text);
      }
    });

    return paragraphs.join("\n");
  } catch (error) {
    console.error(`Failed to fetch full content from ${pageUrl}:`, error);
    return "";
  }
}

/**
 * Parse the episode summary text into individual news items.
 * Format: "1.xxx；\n2.xxx；\n...12.国内联播快讯：\n（1）...\n13.xxx..."
 */
function parseNewsItems(text: string): string[] {
  // Remove header line
  const body = text.replace(/^本期节目主要内容[：:]\s*/g, "").trim();

  // Split by top-level numbered items: "1.", "2.", ..., "16."
  const parts = body.split(/\n(?=\d{1,2}\.)/);
  const items: string[] = [];

  for (const part of parts) {
    // Remove the leading number and clean
    const cleaned = part.replace(/^\d{1,2}\.\s*/, "").trim();
    if (!cleaned) continue;
    // Skip "国内联播快讯" and "国际联播快讯" sub-items (they're aggregates)
    if (cleaned.startsWith("国内联播快讯") || cleaned.startsWith("国际联播快讯")) continue;
    // Skip "二十四节气"
    if (cleaned.startsWith("二十四节气")) continue;
    // Remove trailing semicolons and whitespace
    const title = cleaned.replace(/[；;]+$/, "").trim();
    if (title.length > 3) items.push(title);
  }

  return items;
}

const IMPORTANCE_SCORE: [RegExp, number][] = [
  [/习近平/g, 100],
  [/李强/g, 50],
  [/总理/g, 45],
  [/常委/g, 45],
  [/中央/g, 30],
  [/国务院/g, 30],
  [/外交/g, 25],
  [/国际/g, 25],
  [/军事/g, 20],
  [/军队/g, 20],
  [/改革/g, 20],
  [/经济/g, 20],
  [/科技/g, 15],
  [/航天/g, 15],
  [/文化/g, 10],
  [/教育/g, 10],
  [/医疗/g, 10],
  [/民生/g, 10],
];

function scoreImportance(text: string): number {
  let score = 0;
  for (const [pattern, points] of IMPORTANCE_SCORE) {
    pattern.lastIndex = 0; // reset g flag state
    if (pattern.test(text)) score += points;
  }
  return score;
}

function generateTags(title: string): string[] {
  const tagMap: Record<string, string[]> = {
    习近平: ["时政", "领导人"],
    李强: ["时政", "领导人"],
    常委: ["时政"],
    中央: ["时政"],
    改革: ["深化改革"],
    经济: ["经济"],
    GDP: ["经济"],
    农业: ["农业"],
    粮食: ["粮食安全"],
    航天: ["科技", "航天"],
    卫星: ["科技", "航天"],
    科技: ["科技"],
    外交: ["外交", "国际"],
    国际: ["国际"],
    军事: ["军事"],
    军队: ["军事"],
    疫情: ["卫生", "民生"],
    教育: ["教育"],
    医疗: ["民生", "医疗"],
    文化: ["文化"],
    体育: ["体育"],
    环境: ["环境"],
    生态: ["环境", "生态"],
    能源: ["能源"],
    交通: ["交通"],
  };

  const tags = new Set<string>();
  for (const [keyword, keywordTags] of Object.entries(tagMap)) {
    if (title.includes(keyword)) {
      keywordTags.forEach((t) => tags.add(t));
    }
  }

  return tags.size > 0 ? Array.from(tags) : ["综合"];
}

async function scrapeDaily(date?: string) {
  // Default to yesterday — 新闻联播 airs at 7 PM, available next morning
const targetDate = date || new Date(Date.now() - 86400000).toISOString().split("T")[0];
  console.log(`Scraping 新闻联播 for ${targetDate}...`);

  // Fetch video list
  const videoItems = await fetchVideoList(targetDate);

  if (videoItems.length === 0) {
    console.log(
      `No video items found for ${targetDate}. Using placeholder data.`
    );

    // Create empty daily data with a note
    const emptyDaily = {
      date: targetDate,
      dateFormatted: formatDateCN(targetDate),
      items: [],
    };

    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    fs.writeFileSync(
      path.join(DATA_DIR, `${targetDate}.json`),
      JSON.stringify(emptyDaily, null, 2),
      "utf-8"
    );

    console.log(`Empty data written for ${targetDate}`);
    return;
  }

  // Filter to target date only — CCTV API returns mixed dates
  const filtered = videoItems.filter((v) => {
    const itemDate = extractDateFromTitle(v.title);
    return itemDate === targetDate;
  });

  if (filtered.length === 0) {
    console.log(`No items match target date ${targetDate} after filtering.`);
    return;
  }

  console.log(`Filtered ${videoItems.length} items -> ${filtered.length} for ${targetDate}`);

  // Use the first (19:00) episode as primary source for parsing
  const primary = filtered[0];
  const summaryText = primary.brief || "";

  // Parse into individual news items
  let parsed = parseNewsItems(summaryText);

  // If first episode has sparse content, also try the second episode
  if (parsed.length < 8 && filtered.length > 1) {
    const secondary = filtered[1];
    if (secondary.brief) {
      const extra = parseNewsItems(secondary.brief);
      // Merge without duplicates (simple prefix match)
      const existing = new Set(parsed.map((s) => s.slice(0, 15)));
      for (const item of extra) {
        if (!existing.has(item.slice(0, 15))) {
          parsed.push(item);
        }
      }
    }
  }

  if (parsed.length === 0) {
    console.log(`No news items parsed for ${targetDate}`);
    return;
  }

  console.log(`Parsed ${parsed.length} individual news items`);

  // Score and rank by importance, take top 8
  const ranked = parsed
    .map((text, i) => ({ text, score: scoreImportance(text), idx: i }))
    .sort((a, b) => b.score - a.score || a.idx - b.idx)
    .slice(0, 8);

  console.log(`Ranked top ${ranked.length}:`);
  ranked.forEach((r) => console.log(`  [${r.score}] ${r.text.slice(0, 50)}...`));

  // Build items with images from the video items
  const items = ranked.map((r, i) => ({
    id: `xwlb-${targetDate.replace(/-/g, "")}-${String(i + 1).padStart(2, "0")}`,
    date: targetDate,
    title: r.text,
    summary: r.text,
    fullContent: r.text,
    imageUrl:
      i === 0 && primary.image
        ? primary.image
        : `https://picsum.photos/seed/xwlb${targetDate.replace(/-/g, "")}${i}/800/450`,
    videoUrl: primary.videoUrl || `https://tv.cctv.com/lm/xwlb/`,
    videoId: primary.guid || primary.id,
    duration: 0,
    order: i + 1,
    tags: generateTags(r.text),
  }));

  const dailyData = {
    date: targetDate,
    dateFormatted: formatDateCN(targetDate),
    items,
  };

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  fs.writeFileSync(
    path.join(DATA_DIR, `${targetDate}.json`),
    JSON.stringify(dailyData, null, 2),
    "utf-8"
  );

  console.log(
    `Data saved: ${items.length} items written to ${targetDate}.json`
  );
}

// Run
const dateArg = process.argv[2];
scrapeDaily(dateArg).catch(console.error);
