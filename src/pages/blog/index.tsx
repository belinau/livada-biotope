import React from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/markdown';
import SharedLayout from '@/components/layout/SharedLayout';
import { useLanguage } from '@/contexts/LanguageContext';


import Grid from '@/components/ui/Grid'; // Using our custom Grid component
import StylizedImage from '@/components/StylizedImage';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  CardActions,
  Button,
  Chip,
  Paper,
  Divider
} from '@mui/material';

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
  const { language } = useLanguage();

  
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
          {language === 'en' ? 'Blog' : 'Blog'}
        </Typography>
        <Typography variant="h5" component="p" sx={{ maxWidth: '800px', mx: 'auto', color: 'text.secondary' }}>
          {language === 'en' 
            ? 'Explore our latest articles, stories, and insights about ecology, biodiversity, and sustainable living.'
            : 'Raziščite naše najnovejše članke, zgodbe in vpoglede o ekologiji, biotski raznovrstnosti in trajnostnem življenju.'}
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item xs={12} md={6} lg={4} key={post.slug} component="div">
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6
              }
            }}>
              <CardActionArea component={Link} href={`/blog/${post.slug}`}>
                {post.frontmatter.thumbnail ? (
                  <Box sx={{ height: 220, position: 'relative', overflow: 'hidden' }}>
                    <StylizedImage 
                      speciesName={{
                        en: post.frontmatter.title,
                        sl: post.frontmatter.title
                      }}
                      backgroundColor="#f8f5e6"
                      patternColor="#2e7d32"
                      pattern="dots"
                      height="100%"
                      width="100%"
                      hideLatinName={true}
                    />
                  </Box>
                ) : (
                  <Box sx={{ 
                    height: 220, 
                    background: 'linear-gradient(to right, #60ad5e, #2e7d32)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 2
                  }}>
                    <Typography variant="h5" component="span" sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>
                      {post.frontmatter.title}
                    </Typography>
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={new Date(post.frontmatter.date).toLocaleDateString(language === 'sl' ? 'sl-SI' : 'en-US')}
                      size="small"
                      sx={{ 
                        bgcolor: 'primary.light', 
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                  <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {post.frontmatter.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {post.frontmatter.summary}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                <Button 
                  size="small" 
                  color="primary" 
                  component={Link} 
                  href={`/blog/${post.slug}`}
                  endIcon={
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </Box>
                  }
                >
                  {language === 'en' ? 'Read more' : 'Preberi več'}
                </Button>
              </CardActions>
              
              {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                <Box sx={{ px: 2, pb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {post.frontmatter.tags.map(tag => (
                    <Chip 
                      key={tag} 
                      label={tag}
                      size="small"
                      sx={{ bgcolor: 'background.paper', fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {posts.length === 0 && (
        <Paper elevation={0} sx={{ textAlign: 'center', py: 6, bgcolor: 'background.paper' }}>
          <Typography variant="h6" color="text.secondary">
            {language === 'en' ? 'No blog posts found. Check back soon for new content!' : 'Ni najdenih objav na blogu. Kmalu preverite za novo vsebino!'}
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

BlogPage.getLayout = (page: React.ReactElement) => {
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
