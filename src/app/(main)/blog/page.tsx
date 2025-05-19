import { Metadata } from 'next';
import { Box, Card, CardContent, CardMedia, Container, Grid, Typography, Chip, Stack } from '@mui/material';
import Link from 'next/link';
import { getAllBlogPosts, getAllTags } from '@/lib/api/blog';
import { TagFilter } from '@/components/blog/TagFilter';

type SearchParams = {
  searchParams?: {
    tag?: string;
  };
};

export const metadata: Metadata = {
  title: 'Blog - Livada Biotope',
  description: 'Read our latest articles on sustainable living, eco-feminism, and land-based practices.',
};

export default async function BlogPage({ searchParams }: SearchParams) {
  const selectedTag = searchParams?.tag || null;
  const posts = await getAllBlogPosts(selectedTag || undefined);
  const allTags = await getAllTags();
  
  // Get the count of posts for each tag
  const tagsWithCounts = await Promise.all(
    allTags.map(async (tag) => {
      const postsWithTag = await getAllBlogPosts(tag.name);
      return {
        ...tag,
        count: postsWithTag.length,
      };
    })
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          Our Blog
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          {selectedTag 
            ? `Posts tagged with "${selectedTag}"`
            : 'Insights, stories, and updates on sustainable living and eco-feminism'}
        </Typography>
      </Box>

      {/* Tag Filter */}
      <TagFilter tags={tagsWithCounts} selectedTag={selectedTag} />

      <Grid container spacing={4}>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Grid item xs={12} md={6} lg={4} key={post.slug}>
              <Card 
                component={Link} 
                href={`/blog/${post.slug}`}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={post.thumbnail}
                  alt={post.title}
                  sx={{
                    objectFit: 'cover',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box flexGrow={1}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {post.summary}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                      {post.tags.slice(0, 3).map((tag) => (
                        <Typography 
                          key={tag} 
                          variant="caption"
                          sx={{
                            backgroundColor: 'action.hover',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            color: 'text.secondary',
                          }}
                        >
                          {tag}
                        </Typography>
                      ))}
                    </Box>
                    <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="h6" color="text.secondary" textAlign="center" py={4}>
              No blog posts found{selectedTag ? ` with tag "${selectedTag}"` : ''}.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}