import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Box, Container, Typography, Avatar, Chip, Stack, Divider, Button, Grid } from '@mui/material';
import { CalendarMonth, Person, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/api/blog';
import { MarkdownContent } from '@/components/MarkdownContent';

type Params = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Livada Biotope`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: [post.thumbnail],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author?.name || 'Livada Team'],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Params) {
  const post = await getBlogPostBySlug(params.slug);
  const allPosts = await getAllBlogPosts();
  
  if (!post) {
    notFound();
  }

  // Get related posts based on tags
  const relatedPosts = allPosts
    .filter((p) => 
      p.slug !== post.slug && 
      p.tags.some(tag => post.tags.includes(tag))
    )
    .slice(0, 3);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        component={Link} 
        href="/blog" 
        startIcon={<ArrowBack />} 
        sx={{ mb: 3 }}
      >
        Back to Blog
      </Button>
      
      <Box mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          {post.title}
        </Typography>
        
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <Person color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {post.author?.name || 'Livada Team'}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarMonth color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>
          
          <Box flexGrow={1} />
          
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {post.tags.map((tag) => (
              <Chip 
                key={tag} 
                label={tag} 
                size="small"
                component={Link}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                clickable
                sx={{ 
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                }}
              />
            ))}
          </Stack>
        </Box>
        
        <Box 
          component="img"
          src={post.thumbnail}
          alt={post.title}
          sx={{
            width: '100%',
            maxHeight: '500px',
            objectFit: 'cover',
            borderRadius: 2,
            mb: 4,
            boxShadow: 3,
          }}
        />
        
        <Box sx={{ '& > *': { mb: 3 } }}>
          <MarkdownContent content={post.content} />
        </Box>
      </Box>
      
      {relatedPosts.length > 0 && (
        <Box mt={8}>
          <Divider sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2">
              Related Posts
            </Typography>
          </Divider>
          
          <Grid container spacing={4}>
            {relatedPosts.map((relatedPost) => (
              <Grid item xs={12} md={4} key={relatedPost.slug}>
                <Box 
                  component={Link} 
                  href={`/blog/${relatedPost.slug}`}
                  sx={{
                    display: 'block',
                    textDecoration: 'none',
                    '&:hover': {
                      '& h3': {
                        color: 'primary.main',
                      },
                    },
                  }}
                >
                  <Box 
                    component="img"
                    src={relatedPost.thumbnail}
                    alt={relatedPost.title}
                    sx={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: 2,
                      mb: 2,
                    }}
                  />
                  <Typography variant="h6" component="h3" gutterBottom>
                    {relatedPost.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {relatedPost.summary.length > 100 
                      ? `${relatedPost.summary.substring(0, 100)}...` 
                      : relatedPost.summary}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}