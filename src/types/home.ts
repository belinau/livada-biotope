export interface Project {
  slug: string;
  title_en: string;
  title_sl: string;
  summary_en?: string;
  summary_sl?: string;
  thumbnail?: string;
  date?: string;
}

export interface Event {
  title_en: string;
  title_sl: string;
  date: string;
  description_en?: string;
  description_sl?: string;
  link?: string;
}

export interface HomePageData {
  title_en: string;
  title_sl: string;
  summary_en: string;
  summary_sl: string;
  hero_text_en: string;
  hero_text_sl: string;
  subtitle_en: string;
  subtitle_sl: string;
  hero_image: string;
  intro_en: string;
  intro_sl: string;
  featured_projects: Project[];
  featured_events: Event[];
}
