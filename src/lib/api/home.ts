import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { HomePageData } from '@/types/home';

export async function getHomePageData(): Promise<HomePageData> {
  try {
    const homeFilePath = path.join(process.cwd(), 'src/content/pages/home.md');
    const homeContent = fs.readFileSync(homeFilePath, 'utf8');
    const { data } = matter(homeContent);
    
    // Validate and type cast the data
    return data as unknown as HomePageData;
  } catch (error) {
    console.error('Error loading home page data:', error);
    throw new Error('Failed to load home page data');
  }
}
