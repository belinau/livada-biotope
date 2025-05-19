import { Metadata } from 'next';
import { Box, Card, CardContent, CardMedia, Container, Grid, Typography, Chip, Stack } from '@mui/material';
import Link from 'next/link';
import { getAllGalleries, getAllGalleryTags } from '@/lib/api/galleries';

type SearchParams = {
  searchParams?: {
    tag?: string;
  };
};

export const metadata: Metadata = {
  title: 'Photo Galleries - Livada Biotope',
  description: 'Explore our collection of photo galleries showcasing the beauty and biodiversity of Livada Biotope.',
};

export default async function GalleriesPage({ searchParams }: SearchParams) {
  const selectedTag = searchParams?.tag || null;
  const galleries = await getAllGalleries(selectedTag || undefined);
  const allTags = await getAllGalleryTags();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          Photo Galleries
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          {selectedTag 
            ? `Galleries tagged with "${selectedTag}"`
            : 'Explore our collection of photos showcasing the beauty of Livada Biotope'}
        </Typography>
      </Box>

      {/* Tag Filter */}
      {allTags.length > 0 && (
        <Box mb={6}>
          <Typography variant="h6" component="h2" gutterBottom>
            Filter by Tags
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {selectedTag && (
              <Chip
                label="Clear all"
                component={Link}
                href="/galleries"
                variant="outlined"
                size="small"
                clickable
                sx={{
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                  },
                }}
              />
            )}
            {allTags.map((tag) => (
              <Chip
                key={tag.name}
                label={`${tag.name} (${tag.count})`}
                component={Link}
                href={selectedTag === tag.name ? '/galleries' : `/galleries?tag=${encodeURIComponent(tag.name)}`}
                variant={selectedTag === tag.name ? 'filled' : 'outlined'}
                color="primary"
                size="small"
                clickable
                sx={{
                  '&.MuiChip-filled': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                  },
                  '&.MuiChip-outlined': {
                    borderColor: 'primary.light',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  },
                }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {galleries.length > 0 ? (
        <Grid container spacing={4}>
          {galleries.map((gallery) => (
            <Grid item xs={12} sm={6} lg={4} key={gallery.slug}>
              <Card 
                component={Link} 
                href={`/galleries/${gallery.slug}`}
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
                  height="240"
                  image={gallery.coverImage || '/images/default-gallery.jpg'}
                  alt={gallery.title}
                  sx={{
                    objectFit: 'cover',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    aspectRatio: '16/9',
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {gallery.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {gallery.description}
                  </Typography>
                  <Box mt="auto">
                    <Typography variant="caption" color="text.secondary">
                      {gallery.images.length} {gallery.images.length === 1 ? 'photo' : 'photos'} • {new Date(gallery.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                    {gallery.tags && gallery.tags.length > 0 && (
                      <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
                        {gallery.tags.slice(0, 3).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 20,
                              '& .MuiChip-label': {
                                px: 0.75,
                                py: 0.25,
                              },
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={6}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No galleries found{selectedTag ? ` with tag "${selectedTag}"` : ''}.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check back later for new photo galleries.
          </Typography>
        </Box>
      )}
    </Container>
  );
}
