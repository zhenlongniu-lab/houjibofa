import { NextResponse } from "next/server";

const COLUMN_ID = "TOPC1451528971114112";
const API_BASE = "https://api.cntv.cn";
const REPO = "zhenlongniu-lab/houjibofa";
const BRANCH = "main";

function formatDateCN(dateStr: string): string {
  const parts = dateStr.split("-");
  return `${parts[0]}年${parseInt(parts[1])}月${parseInt(parts[2])}日`;
}

function extractDateFromTitle(title: string): string | null {
  const match = title.match(/(\d{4})(\d{2})(\d{2})/);
  if (!match) return null;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function parseNewsItems(text: string): string[] {
  const body = text.replace(/^本期节目主要内容[：:]\s*/g, "").trim();
  const parts = body.split(/\n(?=\d{1,2}\.)/);
  const items: string[] = [];
  for (const part of parts) {
    const cleaned = part.replace(/^\d{1,2}\.\s*/, "").trim();
    if (!cleaned) continue;
    if (cleaned.startsWith("国内联播快讯") || cleaned.startsWith("国际联播快讯")) continue;
    if (cleaned.startsWith("二十四节气")) continue;
    const title = cleaned.replace(/[；;]+$/, "").trim();
    if (title.length > 3) items.push(title);
  }
  return items;
}

const IMPORTANCE_SCORE: [RegExp, number][] = [
  [/习近平/g, 100], [/李强/g, 50], [/总理/g, 45], [/常委/g, 45],
  [/中央/g, 30], [/国务院/g, 30], [/外交/g, 25], [/国际/g, 25],
  [/军事/g, 20], [/军队/g, 20], [/改革/g, 20], [/经济/g, 20],
  [/科技/g, 15], [/航天/g, 15], [/文化/g, 10], [/教育/g, 10],
  [/医疗/g, 10], [/民生/g, 10],
];

function scoreImportance(text: string): number {
  let score = 0;
  for (const [pattern, points] of IMPORTANCE_SCORE) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) score += points;
  }
  return score;
}

function generateTags(title: string): string[] {
  const tagMap: Record<string, string[]> = {
    习近平: ["时政", "领导人"], 李强: ["时政", "领导人"], 常委: ["时政"],
    中央: ["时政"], 改革: ["深化改革"], 经济: ["经济"], GDP: ["经济"],
    农业: ["农业"], 粮食: ["粮食安全"], 航天: ["科技", "航天"],
    卫星: ["科技", "航天"], 科技: ["科技"], 外交: ["外交", "国际"],
    国际: ["国际"], 军事: ["军事"], 军队: ["军事"],
    疫情: ["卫生", "民生"], 教育: ["教育"], 医疗: ["民生", "医疗"],
    文化: ["文化"], 体育: ["体育"], 环境: ["环境"],
    生态: ["环境", "生态"], 能源: ["能源"], 交通: ["交通"],
  };
  const tags = new Set<string>();
  for (const [keyword, keywordTags] of Object.entries(tagMap)) {
    if (title.includes(keyword)) keywordTags.forEach((t) => tags.add(t));
  }
  return tags.size > 0 ? Array.from(tags) : ["综合"];
}

async function fetchVideoList(date: string) {
  const url = `${API_BASE}/NewVideo/getVideoListByColumn`;
  try {
    const res = await fetch(`${url}?${new URLSearchParams({
      id: COLUMN_ID, n: "20", sort: "desc", p: "1", mode: "0",
      serviceId: "tvcctv", d: date,
    })}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Referer: "https://tv.cctv.com/",
      },
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json() as any;
    if (data?.data?.list) {
      return data.data.list.map((item: any) => ({
        id: item.guid || item.video_id || "",
        title: item.title || "",
        brief: item.brief || "",
        image: item.image || item.img_url || "",
        videoUrl: item.url || item.video_url || "",
        guid: item.guid || "",
        date: item.create_time || date,
      }));
    }
    return [];
  } catch (e) {
    console.error("fetchVideoList error:", e);
    return [];
  }
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "GITHUB_TOKEN not set" }, { status: 500 });
  }

  // Scrape yesterday's news
  const today = new Date();
  const targetDate = new Date(today.getTime() - 86400000).toISOString().split("T")[0];
  console.log(`[cron] Scraping for ${targetDate}`);

  const videoItems = await fetchVideoList(targetDate);
  if (videoItems.length === 0) {
    return NextResponse.json({ ok: true, message: `No videos for ${targetDate}` });
  }

  const filtered = videoItems.filter((v) => extractDateFromTitle(v.title) === targetDate);
  if (filtered.length === 0) {
    return NextResponse.json({ ok: true, message: `No matching items for ${targetDate}` });
  }

  const primary = filtered[0];
  let parsed = parseNewsItems(primary.brief || "");

  if (parsed.length < 8 && filtered.length > 1) {
    const extra = parseNewsItems(filtered[1].brief || "");
    const existing = new Set(parsed.map((s) => s.slice(0, 15)));
    for (const item of extra) {
      if (!existing.has(item.slice(0, 15))) parsed.push(item);
    }
  }

  if (parsed.length === 0) {
    return NextResponse.json({ ok: true, message: "No news items parsed" });
  }

  const ranked = parsed
    .map((text, i) => ({ text, score: scoreImportance(text), idx: i }))
    .sort((a, b) => b.score - a.score || a.idx - b.idx)
    .slice(0, 8);

  const items = ranked.map((r, i) => ({
    id: `xwlb-${targetDate.replace(/-/g, "")}-${String(i + 1).padStart(2, "0")}`,
    date: targetDate,
    title: r.text,
    summary: r.text,
    fullContent: r.text,
    videoUrl: primary.videoUrl || "https://tv.cctv.com/lm/xwlb/",
    videoId: primary.guid || primary.id,
    order: i + 1,
    tags: generateTags(r.text),
  }));

  const dailyData = {
    date: targetDate,
    dateFormatted: formatDateCN(targetDate),
    episodeImage: primary.image || "",
    items,
  };

  const content = JSON.stringify(dailyData, null, 2);
  const contentBase64 = Buffer.from(content).toString("base64");
  const filePath = `src/data/news/${targetDate}.json`;

  // Check if file exists (for sha)
  let sha = "";
  try {
    const checkRes = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${filePath}?ref=${BRANCH}`,
      { headers: { Authorization: `Bearer ${token}`, "User-Agent": "vercel-cron" } }
    );
    if (checkRes.ok) {
      const d = await checkRes.json() as any;
      sha = d.sha || "";
    }
  } catch { /* file doesn't exist yet */ }

  // Commit via GitHub API
  const commitRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${filePath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "User-Agent": "vercel-cron",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `data: auto scrape ${targetDate}`,
        content: contentBase64,
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    }
  );

  if (!commitRes.ok) {
    const err = await commitRes.text();
    console.error("GitHub API error:", err);
    return NextResponse.json({ error: "GitHub commit failed", detail: err }, { status: 500 });
  }

  console.log(`[cron] Committed ${targetDate}.json with ${items.length} items`);
  return NextResponse.json({ ok: true, date: targetDate, items: items.length });
}
