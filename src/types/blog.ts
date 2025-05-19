export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  thumbnail: string;
  tags: string[];
  content: string;
  author?: {
    name: string;
    avatar?: string;
  };
  relatedPosts?: string[];
}
