import React, { useState, useEffect } from 'react';
import { GetStaticProps } from 'next';
import { getAllPosts } from '@/lib/markdown';
import SharedLayout from '@/components/layout/SharedLayout';
import path from 'path';
import fs from 'fs';

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

interface EditorPageProps {
  posts: BlogPost[];
}

export default function SimpleEditorPage({ posts: initialPosts }: EditorPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState(initialPosts);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [message, setMessage] = useState('');

  // Check if user is already authenticated
  useEffect(() => {
    const auth = localStorage.getItem('livada_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    // More secure password with special characters and numbers
    const securePassword = 'Livada@Biotope#2025!';
    
    // Simple password check - in a real app, use a more secure method
    if (password === securePassword) {
      setIsAuthenticated(true);
      localStorage.setItem('livada_auth', 'true');
      console.log('Authentication successful');
    } else {
      setMessage('Incorrect password. Please try again.');
      console.log('Authentication failed: incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('livada_auth');
  };

  const handleSelectPost = (post: BlogPost) => {
    setCurrentPost(post);
    setTitle(post.frontmatter.title);
    setContent(post.content);
    setSummary(post.frontmatter.summary || '');
  };

  const handleCreateNew = () => {
    const newPost = {
      slug: `new-post-${Date.now()}`,
      frontmatter: {
        title: 'New Post',
        date: new Date().toISOString(),
        summary: 'Enter a summary here'
      },
      content: '# New Post\n\nStart writing your content here.'
    };
    setCurrentPost(newPost);
    setTitle(newPost.frontmatter.title);
    setContent(newPost.content);
    setSummary(newPost.frontmatter.summary);
  };

  const handleDownload = () => {
    if (!currentPost) return;

    // Create the frontmatter
    const frontmatter = {
      ...currentPost.frontmatter,
      title,
      summary,
      date: new Date().toISOString()
    };

    // Create the markdown content
    const markdownContent = `---
title: ${frontmatter.title}
date: ${frontmatter.date}
summary: ${frontmatter.summary}
${frontmatter.thumbnail ? `thumbnail: ${frontmatter.thumbnail}` : ''}
${frontmatter.tags && frontmatter.tags.length > 0 ? `tags:\n  - ${frontmatter.tags.join('\n  - ')}` : ''}
---

${content}`;

    // Create a blob and download link
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMessage('File downloaded! Save it to src/content/blog/ in your repository.');
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6">Simple Content Editor</h1>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </button>
          {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Simple Content Editor</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <button
              onClick={handleCreateNew}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
              Create New Post
            </button>
          </div>
          <h2 className="text-xl font-semibold mb-4">Existing Posts</h2>
          <ul className="divide-y divide-gray-200">
            {posts.map((post) => (
              <li key={post.slug} className="py-2">
                <button
                  onClick={() => handleSelectPost(post)}
                  className="text-left w-full hover:text-blue-500"
                >
                  {post.frontmatter.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3 bg-white p-4 rounded-lg shadow-md">
          {currentPost ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Summary</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Content (Markdown)</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md h-64 font-mono"
                />
              </div>
              <div className="mb-4">
                <button
                  onClick={handleDownload}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Download Markdown File
                </button>
              </div>
              {message && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
                  {message}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select a post from the sidebar or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

SimpleEditorPage.getLayout = (page: React.ReactElement) => {
  return <SharedLayout>{page}</SharedLayout>;
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts('posts');
  
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
