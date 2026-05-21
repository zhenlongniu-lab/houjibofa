export interface NewsItem {
  id: string;
  date: string;
  title: string;
  summary: string;
  fullContent: string;
  imageUrl: string;
  videoUrl: string;
  videoId: string;
  duration: number;
  order: number;
  tags: string[];
}

export interface DailyNews {
  date: string;
  dateFormatted: string;
  items: NewsItem[];
}
