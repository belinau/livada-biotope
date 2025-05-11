import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { getAllPosts, getMarkdownContent, getFiles } from '@/lib/markdown';
import SharedLayout from '@/components/layout/SharedLayout';
import path from 'path';
import ReactMarkdown from 'react-markdown';

interface BlogPostProps {
  post: {
    slug: string;
    frontmatter: {
      title: string;
      date: string;
      summary: string;
      thumbnail?: string;
      tags?: string[];
    };
    content: string;
  };
}

export default function BlogPostPage({ post }: BlogPostProps) {
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{post.frontmatter.title}</h1>
        <p className="text-gray-600 mb-6">
          {new Date(post.frontmatter.date).toLocaleDateString()}
        </p>
        
        {post.frontmatter.thumbnail && (
          <div className="mb-8">
            <img 
              src={post.frontmatter.thumbnail} 
              alt={post.frontmatter.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
        
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        
        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.frontmatter.tags.map(tag => (
              <span key={tag} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

BlogPostPage.getLayout = (page: React.ReactElement) => {
  return <SharedLayout>{page}</SharedLayout>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const files = getFiles('src/content/blog');
  
  const paths = files.map(filename => ({
    params: {
      slug: filename.replace(/\.md$/, '')
    }
  }));
  
  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };
  const filePath = path.join(process.cwd(), 'src/content/blog', `${slug}.md`);
  const { frontmatter, content } = getMarkdownContent(filePath);
  
  // Ensure all data is serializable
  const serializedFrontmatter = { ...frontmatter };
  
  // Convert any Date objects to strings
  if (serializedFrontmatter.date) {
    if (serializedFrontmatter.date instanceof Date) {
      serializedFrontmatter.date = serializedFrontmatter.date.toISOString();
    } else if (typeof serializedFrontmatter.date === 'string') {
      // Ensure the date string is valid
      try {
        const dateObj = new Date(serializedFrontmatter.date);
        serializedFrontmatter.date = dateObj.toISOString();
      } catch (e) {
        // If date parsing fails, use current date
        serializedFrontmatter.date = new Date().toISOString();
      }
    }
  }
  
  return {
    props: {
      post: {
        slug,
        frontmatter: serializedFrontmatter,
        content
      }
    }
  };
};
