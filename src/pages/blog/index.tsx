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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.slug} className="bg-white rounded-lg shadow-md overflow-hidden">
            {post.frontmatter.thumbnail && (
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.frontmatter.thumbnail} 
                  alt={post.frontmatter.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.frontmatter.title}</h2>
              <p className="text-gray-600 text-sm mb-2">
                {new Date(post.frontmatter.date).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-4">{post.frontmatter.summary}</p>
              <Link href={`/blog/${post.slug}`}>
                <span className="text-blue-500 hover:text-blue-700">Read more</span>
              </Link>
              
              {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.frontmatter.tags.map(tag => (
                    <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
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
