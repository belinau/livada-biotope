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
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Back to blog link */}
        <div className="mb-8">
          <a href="/blog" className="text-green-700 hover:text-green-900 font-medium inline-flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to all articles
          </a>
        </div>
        
        {/* Article header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.frontmatter.title}</h1>
          <div className="flex items-center text-gray-600">
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              {new Date(post.frontmatter.date).toLocaleDateString()}
            </span>
          </div>
        </header>
        
        {/* Featured image */}
        {post.frontmatter.thumbnail && (
          <figure className="mb-10">
            <img 
              src={post.frontmatter.thumbnail} 
              alt={post.frontmatter.title}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </figure>
        )}
        
        {/* Article content */}
        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-a:text-green-700 prose-a:no-underline hover:prose-a:text-green-900 prose-img:rounded-lg">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        
        {/* Tags */}
        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.frontmatter.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Share buttons */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Share this article</h3>
          <div className="flex space-x-4">
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.frontmatter.title)}&url=${encodeURIComponent(`https://livada-biotope.netlify.app/blog/${post.slug}`)}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://livada-biotope.netlify.app/blog/${post.slug}`)}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://livada-biotope.netlify.app/blog/${post.slug}`)}&title=${encodeURIComponent(post.frontmatter.title)}`} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-900">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </article>
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
