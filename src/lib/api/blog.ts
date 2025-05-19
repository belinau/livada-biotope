import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost } from '@/types/blog';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export async function getAllBlogPosts(tag?: string): Promise<BlogPost[]> {
  const fileNames = fs.readdirSync(BLOG_DIR);
  const blogPosts: BlogPost[] = [];

  for (const fileName of fileNames) {
    if (fileName === 'TEMPLATE.md') continue;
    
    const slug = fileName.replace(/\.md$/, '');
    const post = await getBlogPostBySlug(slug);
    
    if (post) {
      // Filter by tag if provided
      if (!tag || post.tags.includes(tag)) {
        blogPosts.push(post);
      }
    }
  }

  // Sort posts by date in descending order
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getAllTags(): Promise<{ name: string; count: number }[]> {
  const posts = await getAllBlogPosts();
  const tagCounts: Record<string, number> = {};

  // Count occurrences of each tag
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  // Convert to array and sort by count (descending)
  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(BLOG_DIR, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title,
      date: data.date,
      summary: data.summary || '',
      thumbnail: data.thumbnail || '/images/default-blog-thumbnail.jpg',
      tags: data.tags || [],
      author: data.author || { name: 'Livada Team' },
      relatedPosts: data.relatedPosts || [],
      content,
    };
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return null;
  }
}

export async function getAllBlogPostSlugs(): Promise<{ slug: string }[]> {
  const fileNames = fs.readdirSync(BLOG_DIR);
  return fileNames
    .filter((fileName) => fileName !== 'TEMPLATE.md')
    .map((fileName) => ({
      slug: fileName.replace(/\.md$/, ''),
    }));
}
