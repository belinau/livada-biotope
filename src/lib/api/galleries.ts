import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Gallery, GalleryImage } from '@/types/gallery';

const GALLERIES_DIR = path.join(process.cwd(), 'src/content/galleries');

export async function getAllGalleries(tag?: string): Promise<Gallery[]> {
  const fileNames = fs.readdirSync(GALLERIES_DIR);
  const galleries: Gallery[] = [];

  for (const fileName of fileNames) {
    if (fileName === 'TEMPLATE.md') continue;
    
    const slug = fileName.replace(/\.md$/, '');
    const gallery = await getGalleryBySlug(slug);
    
    if (gallery) {
      // Filter by tag if provided
      if (!tag || !gallery.tags || gallery.tags.includes(tag)) {
        galleries.push(gallery);
      }
    }
  }

  // Sort galleries by date in descending order
  return galleries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getGalleryBySlug(slug: string): Promise<Gallery | null> {
  try {
    const fullPath = path.join(GALLERIES_DIR, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Use the first image as cover if not specified
    const coverImage = data.coverImage || (data.gallery?.[0]?.image || '');
    
    return {
      slug,
      title: data.title,
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      coverImage,
      images: data.gallery || [],
      tags: data.tags || [],
    };
  } catch (error) {
    console.error(`Error loading gallery ${slug}:`, error);
    return null;
  }
}

export async function getAllGallerySlugs(): Promise<{ slug: string }[]> {
  const fileNames = fs.readdirSync(GALLERIES_DIR);
  return fileNames
    .filter((fileName) => fileName !== 'TEMPLATE.md')
    .map((fileName) => ({
      slug: fileName.replace(/\.md$/, ''),
    }));
}

export async function getAllGalleryTags(): Promise<{ name: string; count: number }[]> {
  const galleries = await getAllGalleries();
  const tagCounts: Record<string, number> = {};

  // Count occurrences of each tag
  galleries.forEach(gallery => {
    gallery.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  // Convert to array and sort by count (descending)
  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
