import React, { useState, useEffect, ReactElement } from 'react';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

interface LayoutProps {
  children: ReactElement;
}

interface PageWithLayout {
  getLayout?: (page: ReactElement) => ReactElement;
}

interface PostFrontmatter {
  title: string;
  date: string;
  summary: string;
  thumbnail?: string;
  tags?: string[];
}

interface BlogPost {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
}

interface EditorPageProps {
  posts: BlogPost[];
}

const SimpleEditor: React.FC<EditorPageProps> & PageWithLayout = ({ posts: initialPosts }) => {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  // Check if user is already authenticated
  useEffect(() => {
    const auth = localStorage.getItem('livada_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const securePassword = 'Livada@Biotope#2025!';
    
    if (password === securePassword) {
      setIsAuthenticated(true);
      localStorage.setItem('livada_auth', 'true');
      setMessage('');
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPost(null);
    setTitle('');
    setContent('');
    setSummary('');
    localStorage.removeItem('livada_auth');
  };

  const handleSelectPost = (post: BlogPost) => {
    setCurrentPost(post);
    setTitle(post.frontmatter.title);
    setContent(post.content);
    setSummary(post.frontmatter.summary || '');
  };

  const handleCreateNew = () => {
    const newPost: BlogPost = {
      slug: `new-post-${Date.now()}`,
      frontmatter: {
        title: 'New Post',
        date: new Date().toISOString(),
        summary: 'Enter a summary here',
        tags: []
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

    const frontmatter = {
      ...currentPost.frontmatter,
      title,
      summary,
      date: new Date().toISOString()
    };

    const markdownContent = `---
title: ${frontmatter.title}
date: ${frontmatter.date}
summary: ${frontmatter.summary}
${frontmatter.thumbnail ? `thumbnail: ${frontmatter.thumbnail}\n` : ''}${frontmatter.tags && frontmatter.tags.length > 0 ? `tags:\n  - ${frontmatter.tags.join('\n  - ')}\n` : ''}---

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
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Admin Login
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
            >
              Login
            </Button>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Paper>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Simple Content Editor
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/')}
        >
          Back to Site
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateNew}
        >
          Create New Post
        </Button>
      </Box>

      {currentPost ? (
        <Box>
          <Box mb={3}>
            <TextField
              fullWidth
              margin="normal"
              label="Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              variant="outlined"
            />
          </Box>
          <Box mb={3}>
            <TextField
              fullWidth
              margin="normal"
              label="Summary"
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              variant="outlined"
            />
          </Box>
          <Box mb={3}>
            <TextField
              fullWidth
              margin="normal"
              label="Content"
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              variant="outlined"
              multiline
              rows={10}
            />
          </Box>
          <Box mb={3}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownload}
            >
              Download Markdown File
            </Button>
          </Box>
          {message && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
        </Box>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Typography variant="h6" component="h2">
            Select a post from the sidebar or create a new one
          </Typography>
        </Box>
      )}
    </Container>
  );
}

SimpleEditor.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export const getStaticProps: GetStaticProps = async () => {
  const posts: BlogPost[] = [];
  
  return {
    props: {
      posts,
      ...(await serverSideTranslations('en', ['common'])),
    },
  };
};

export default SimpleEditor;
