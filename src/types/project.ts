export interface ProjectFrontmatter {
  title_en: string;
  title_sl: string;
  summary_en: string;
  summary_sl: string;
  thumbnail?: string;
  date?: string;
  status?: string;
  partners?: string[];
}

export interface Project extends ProjectFrontmatter {
  slug: string;
  content: string;
}
