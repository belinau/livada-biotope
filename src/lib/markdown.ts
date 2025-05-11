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
export function getAllPosts(contentType: string) {
  const files = getFiles(`src/content/${contentType}`);
  const posts = files.map(filename => {
    const filePath = path.join(process.cwd(), 'src', 'content', contentType, filename);
    const { frontmatter, content } = getMarkdownContent(filePath);
    
    return {
      slug: filename.replace(/\.md$/, ''),
      frontmatter,
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
