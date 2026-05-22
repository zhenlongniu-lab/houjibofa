export interface NewsItem {
  id: string;
  date: string;
  title: string;
  summary: string;
  fullContent: string;
  videoUrl: string;
  videoId: string;
  order: number;
  tags: string[];
}

export interface DailyNews {
  date: string;
  dateFormatted: string;
  episodeImage: string;
  items: NewsItem[];
}
