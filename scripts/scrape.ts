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
  const targetDate = date || new Date().toISOString().split("T")[0];
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

  // Process each video item
  const items = [];
  for (let i = 0; i < videoItems.length; i++) {
    const video = videoItems[i];
    console.log(`Processing ${i + 1}/${videoItems.length}: ${video.title}`);

    // Try to get full content from the video page
    let fullContent = video.brief;
    if (video.videoUrl) {
      const content = await fetchFullContent(video.videoUrl);
      if (content) {
        fullContent = content;
      }
    }

    items.push({
      id: `xwlb-${targetDate.replace(/-/g, "")}-${String(i + 1).padStart(2, "0")}`,
      date: targetDate,
      title: video.title,
      summary: video.brief || video.title,
      fullContent: fullContent || video.title,
      imageUrl:
        video.image ||
        `https://picsum.photos/seed/xwlb${targetDate.replace(/-/g, "")}${i}/800/450`,
      videoUrl: video.videoUrl || `https://tv.cctv.com/lm/xwlb/`,
      videoId: video.guid || video.id,
      duration: formatDuration(video.duration),
      order: i + 1,
      tags: generateTags(video.title),
    });

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 500));
  }

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
