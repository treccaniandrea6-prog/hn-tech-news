export interface HackerNewsItem {
  id: number;
  title?: string;
  url?: string;
  time?: number; // unix seconds
  type?: string;
}