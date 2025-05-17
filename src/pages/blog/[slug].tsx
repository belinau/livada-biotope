import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { getPostBySlug, getAllPosts } from '@/lib/markdown';
import SharedLayout from '@/components/layout/SharedLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Box, 
  Container, 
  Typography, 
  Chip,
  Divider,
  Paper
} from '@mui/material';

interface BlogPostProps {
  post: {
    slug: string;
    frontmatter: {
      title_en: string;
      title_sl: string;
      date: string;
      summary_en: string;
      summary_sl: string;
      thumbnail?: string;
      tags?: string[];
    };
    content_en: MDXRemoteSerializeResult;
    content_sl: MDXRemoteSerializeResult;
  };
}

export default function BlogPostPage({ post }: BlogPostProps) {
  const { language } = useLanguage();
  
  // Get the appropriate content based on the current language
  const title = language === 'en' ? post.frontmatter.title_en : post.frontmatter.title_sl;
  const summary = language === 'en' ? post.frontmatter.summary_en : post.frontmatter.summary_sl;
  const content = language === 'en' ? post.content_en : post.content_sl;
  
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={new Date(post.frontmatter.date).toLocaleDateString(language === 'sl' ? 'sl-SI' : 'en-US')}
              size="small"
              sx={{ 
                bgcolor: 'primary.light', 
                color: 'white',
                fontWeight: 500
              }}
            />
            
            {post.frontmatter.tags && post.frontmatter.tags.map(tag => (
              <Chip 
                key={tag}
                label={tag}
                size="small"
                sx={{ 
                  bgcolor: 'background.paper', 
                  border: '1px solid',
                  borderColor: 'primary.light'
                }}
              />
            ))}
          </Box>
          
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 4, fontStyle: 'italic' }}>
            {summary}
          </Typography>
          
          {post.frontmatter.thumbnail && (
            <Box sx={{ mb: 4, height: 400, position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
              <StylizedImage 
                speciesName={{
                  en: post.frontmatter.title_en,
                  sl: post.frontmatter.title_sl
                }}
                backgroundColor="#f8f5e6"
                patternColor="#2e7d32"
                pattern="dots"
                height="100%"
                width="100%"
                hideLatinName={true}
              />
            </Box>
          )}
        </Box>
        
        <Divider sx={{ mb: 4 }} />
        
        <Box sx={{ typography: 'body1' }}>
          <MDXRemote {...content} />
        </Box>
      </Paper>
    </Container>
  );
}

// Add getLayout function to the page
BlogPostPage.getLayout = (page: React.ReactNode) => {
  return <SharedLayout>{page}</SharedLayout>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  
  const paths = posts.map((post) => ({
    params: {
      slug: post.slug,
    },
  }));
  
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = getPostBySlug(params?.slug as string);
  
  // Split the content into English and Slovenian parts
  const parts = post.content.split('<!-- Slovenian Content -->');
  const englishContent = parts[0].replace('<!-- English Content -->', '').trim();
  const slovenianContent = parts.length > 1 ? parts[1].trim() : '';
  
  // Serialize both language contents
  const content_en = await serialize(englishContent);
  const content_sl = await serialize(slovenianContent);
  
  return {
    props: {
      post: {
        ...post,
        content_en,
        content_sl,
      },
    },
  };
};
