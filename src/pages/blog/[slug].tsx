import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getMarkdownContent, getFiles } from '@/lib/markdown';
import SharedLayout from '@/components/layout/SharedLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import useTranslations from '@/hooks/useTranslations';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Chip,
  Divider,
  IconButton,
  Stack
} from '@mui/material';

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
  const { language } = useLanguage();
  const { t } = useTranslations();
  
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
        {/* Back to blog link */}
        <Box sx={{ mb: 4 }}>
          <Button
            component={Link}
            href="/blog"
            color="primary"
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              fontWeight: 500,
              '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.08)' }
            }}
            startIcon={
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            }
          >
            {language === 'en' ? 'Back to all articles' : 'Nazaj na vse članke'}
          </Button>
        </Box>
        
        {/* Article header */}
        <Box component="header" sx={{ mb: 5 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
            {post.frontmatter.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip 
              label={new Date(post.frontmatter.date).toLocaleDateString(language === 'sl' ? 'sl-SI' : 'en-US')}
              sx={{ 
                bgcolor: 'primary.light', 
                color: 'white',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            />
          </Box>
        </Box>
        
        {/* Featured image */}
        {post.frontmatter.thumbnail && (
          <Box component="figure" sx={{ mb: 5, position: 'relative', width: '100%', height: '400px', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
            <Image 
              src={post.frontmatter.thumbnail} 
              alt={post.frontmatter.title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              priority
              style={{ objectFit: 'cover' }}
            />
          </Box>
        )}
        
        {/* Article content */}
        <Paper elevation={0} sx={{ 
          p: 4, 
          mb: 5, 
          bgcolor: 'background.paper',
          borderRadius: 2,
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            color: 'text.primary',
            fontWeight: 'bold',
            mt: 4,
            mb: 2
          },
          '& h1': { fontSize: '2rem' },
          '& h2': { fontSize: '1.75rem' },
          '& h3': { fontSize: '1.5rem' },
          '& p': {
            color: 'text.secondary',
            mb: 2,
            lineHeight: 1.7
          },
          '& a': {
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
              color: 'primary.dark',
              textDecoration: 'underline'
            }
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto',
            borderRadius: 1,
            my: 3
          },
          '& ul, & ol': {
            pl: 4,
            mb: 3
          },
          '& li': {
            mb: 1
          },
          '& blockquote': {
            borderLeft: '4px solid',
            borderColor: 'primary.light',
            pl: 3,
            py: 1,
            my: 3,
            bgcolor: 'rgba(46, 125, 50, 0.05)',
            borderRadius: 1
          }
        }}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </Paper>
        
        {/* Tags */}
        {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
          <Box sx={{ mt: 6, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
              {language === 'en' ? 'Tags' : 'Oznake'}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {post.frontmatter.tags.map(tag => (
                <Chip 
                  key={tag} 
                  label={tag}
                  sx={{ 
                    bgcolor: 'background.paper', 
                    mb: 1,
                    '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.08)' }
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}
        
        {/* Share buttons */}
        <Box sx={{ mt: 6, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
            {language === 'en' ? 'Share this article' : 'Deli ta članek'}
          </Typography>
          <Stack direction="row" spacing={2}>
            <IconButton 
              component="a"
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.frontmatter.title)}&url=${encodeURIComponent(`https://livada-bio.netlify.app/blog/${post.slug}`)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ 
                color: '#1DA1F2', 
                '&:hover': { bgcolor: 'rgba(29, 161, 242, 0.1)' }
              }}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </IconButton>
            <IconButton 
              component="a"
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://livada-bio.netlify.app/blog/${post.slug}`)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ 
                color: '#4267B2', 
                '&:hover': { bgcolor: 'rgba(66, 103, 178, 0.1)' }
              }}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </IconButton>
            <IconButton 
              component="a"
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://livada-bio.netlify.app/blog/${post.slug}`)}&title=${encodeURIComponent(post.frontmatter.title)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ 
                color: '#0077B5', 
                '&:hover': { bgcolor: 'rgba(0, 119, 181, 0.1)' }
              }}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Container>
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
