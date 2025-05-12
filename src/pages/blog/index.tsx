import React from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/markdown';
import SharedLayout from '@/components/layout/SharedLayout';

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    summary: string;
    thumbnail?: string;
    tags?: string[];
  };
  content: string;
}

interface BlogPageProps {
  posts: BlogPost[];
}

export default function BlogPage({ posts }: BlogPageProps) {
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore our latest articles, stories, and insights about ecology, biodiversity, and sustainable living.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1">
            {post.frontmatter.thumbnail ? (
              <div className="h-56 overflow-hidden">
                <img 
                  src={post.frontmatter.thumbnail} 
                  alt={post.frontmatter.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ) : (
              <div className="h-56 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold px-6 text-center">{post.frontmatter.title}</span>
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center mb-3">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {new Date(post.frontmatter.date).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-green-700">
                <Link href={`/blog/${post.slug}`}>
                  {post.frontmatter.title}
                </Link>
              </h2>
              <p className="text-gray-700 mb-4 line-clamp-3">{post.frontmatter.summary}</p>
              <div className="flex justify-between items-center">
                <Link href={`/blog/${post.slug}`} className="text-green-700 hover:text-green-900 font-medium inline-flex items-center">
                  Read more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
              
              {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.frontmatter.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No blog posts found. Check back soon for new content!</p>
        </div>
      )}
    </div>
  );
}

BlogPage.getLayout = (page: React.ReactElement) => {
  return <SharedLayout>{page}</SharedLayout>;
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts('blog');
  
  // Ensure all post data is serializable
  const serializedPosts = posts.map(post => {
    // Create a deep copy to avoid modifying the original
    const serializedPost = {
      ...post,
      frontmatter: { ...post.frontmatter }
    };
    
    // Convert any Date objects to strings
    if (serializedPost.frontmatter.date) {
      if (serializedPost.frontmatter.date instanceof Date) {
        serializedPost.frontmatter.date = serializedPost.frontmatter.date.toISOString();
      } else if (typeof serializedPost.frontmatter.date === 'string') {
        // Ensure the date string is valid
        try {
          const dateObj = new Date(serializedPost.frontmatter.date);
          serializedPost.frontmatter.date = dateObj.toISOString();
        } catch (e) {
          // If date parsing fails, use current date
          serializedPost.frontmatter.date = new Date().toISOString();
        }
      }
    }
    
    return serializedPost;
  });
  
  return {
    props: {
      posts: serializedPosts
    }
  };
};
