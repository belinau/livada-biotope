import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Get all files from a directory
export function getFiles(dir: string) {
  const directory = path.join(process.cwd(), dir);
  try {
    return fs.readdirSync(directory);
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
    return [];
  }
}

// Get content from a markdown file
export function getMarkdownContent(filePath: string) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      frontmatter: data,
      content
    };
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return {
      frontmatter: {},
      content: ''
    };
  }
}

// Get all posts from a specific content type (blog, projects, events)
export function getAllPosts(contentType: string = 'posts') {
  const files = getFiles(`src/content/${contentType}`);
  const posts = files.filter(filename => filename.endsWith('.md')).map(filename => {
    const filePath = path.join(process.cwd(), 'src', 'content', contentType, filename);
    const { frontmatter, content } = getMarkdownContent(filePath);
    
    // Ensure all date objects are converted to strings for serialization
    const serializedFrontmatter = { ...frontmatter };
    if (serializedFrontmatter.date && serializedFrontmatter.date instanceof Date) {
      serializedFrontmatter.date = serializedFrontmatter.date.toISOString();
    }
    if (serializedFrontmatter.eventDate && serializedFrontmatter.eventDate instanceof Date) {
      serializedFrontmatter.eventDate = serializedFrontmatter.eventDate.toISOString();
    }
    
    return {
      slug: filename.replace(/\.md$/, ''),
      frontmatter: serializedFrontmatter,
      content
    };
  });
  
  // Sort posts by date if they have a date field
  return posts.sort((a, b) => {
    if (a.frontmatter.date && b.frontmatter.date) {
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    }
    return 0;
  });
}

// Get a specific post by slug
export function getPostBySlug(slug: string, contentType: string = 'posts') {
  const filePath = path.join(process.cwd(), 'src', 'content', contentType, `${slug}.md`);
  
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return {
        slug,
        frontmatter: {},
        content: ''
      };
    }
    
    const { frontmatter, content } = getMarkdownContent(filePath);
    
    // Ensure all date objects are converted to strings for serialization
    const serializedFrontmatter = { ...frontmatter };
    if (serializedFrontmatter.date && serializedFrontmatter.date instanceof Date) {
      serializedFrontmatter.date = serializedFrontmatter.date.toISOString();
    }
    
    return {
      slug,
      frontmatter: serializedFrontmatter,
      content
    };
  } catch (error) {
    console.error(`Error getting post by slug ${slug}:`, error);
    return {
      slug,
      frontmatter: {},
      content: ''
    };
  }
}

// Get all projects
export function getAllProjects() {
  return getAllPosts('projects');
}

// Get a specific project by slug
export function getProjectBySlug(slug: string) {
  return getPostBySlug(slug, 'projects');
}
