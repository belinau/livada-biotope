import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';
import { Instructable } from '@/types/instructables';

const INSTRUCTABLES_DIR = path.join(process.cwd(), 'src/content/instructables');

// Helper to read and parse markdown files
const readMarkdownFile = (filePath: string) => {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  return { ...data, content } as Omit<Instructable, 'slug'>;
};

// Get all instructables (cached)
export const getInstructables = cache(async (): Promise<Instructable[]> => {
  try {
    const filenames = fs.readdirSync(INSTRUCTABLES_DIR);
    
    return filenames
      .filter((filename) => filename.endsWith('.md'))
      .map((filename) => {
        const slug = filename.replace(/\.md$/, '');
        const filePath = path.join(INSTRUCTABLES_DIR, filename);
        const instructable = readMarkdownFile(filePath);
        return { ...instructable, slug };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error loading instructables:', error);
    return [];
  }
});

// Get a single instructable by slug (cached)
export const getInstructableBySlug = cache(async (slug: string): Promise<Instructable | null> => {
  try {
    const filePath = path.join(INSTRUCTABLES_DIR, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const instructable = readMarkdownFile(filePath);
    return { ...instructable, slug };
  } catch (error) {
    console.error(`Error loading instructable ${slug}:`, error);
    return null;
  }
});

// Get all instructable slugs (for static generation)
export const getAllInstructableSlugs = async (): Promise<string[]> => {
  try {
    const filenames = fs.readdirSync(INSTRUCTABLES_DIR);
    return filenames
      .filter((filename) => filename.endsWith('.md'))
      .map((filename) => filename.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error getting instructable slugs:', error);
    return [];
  }
};
