import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Box, Container, Typography, Chip, Button, Grid } from '@mui/material';
import { ArrowBack, NavigateBefore, NavigateNext } from '@mui/icons-material';
import Link from 'next/link';
import { getGalleryBySlug, getAllGalleries } from '@/lib/api/galleries';
import { GalleryImageGrid } from '@/components/gallery/GalleryImageGrid';

type Params = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const gallery = await getGalleryBySlug(params.slug);
  
  if (!gallery) {
    return {
      title: 'Gallery Not Found',
    };
  }

  return {
    title: `${gallery.title} - Livada Biotope Gallery`,
    description: gallery.description || `Photo gallery: ${gallery.title}`,
    openGraph: {
      title: gallery.title,
      description: gallery.description || `Photo gallery: ${gallery.title}`,
      images: gallery.images.slice(0, 3).map(img => img.image),
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  const galleries = await getAllGalleries();
  return galleries.map((gallery) => ({
    slug: gallery.slug,
  }));
}

export default async function GalleryPage({ params }: Params) {
  const gallery = await getGalleryBySlug(params.slug);
  const allGalleries = await getAllGalleries();
  
  if (!gallery) {
    notFound();
  }

  // Get the previous and next galleries for navigation
  const currentIndex = allGalleries.findIndex(g => g.slug === gallery.slug);
  const prevGallery = currentIndex > 0 ? allGalleries[currentIndex - 1] : null;
  const nextGallery = currentIndex < allGalleries.length - 1 ? allGalleries[currentIndex + 1] : null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button 
        component={Link} 
        href="/galleries" 
        startIcon={<ArrowBack />} 
        sx={{ mb: 3 }}
      >
        Back to Galleries
      </Button>
      
      <Box mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          {gallery.title}
        </Typography>
        
        {gallery.description && (
          <Typography variant="h5" color="text.secondary" paragraph>
            {gallery.description}
          </Typography>
        )}
        
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={2} mb={3}>
          <Typography variant="body2" color="text.secondary">
            {gallery.images.length} {gallery.images.length === 1 ? 'photo' : 'photos'} • {new Date(gallery.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
          
          {gallery.tags && gallery.tags.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={1} ml="auto">
              {gallery.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  component={Link}
                  href={`/galleries?tag=${encodeURIComponent(tag)}`}
                  size="small"
                  variant="outlined"
                  clickable
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
      
      {/* Gallery Grid */}
      <GalleryImageGrid images={gallery.images} />
      
      {/* Gallery Navigation */}
      {(prevGallery || nextGallery) && (
        <Box mt={6} pt={4} borderTop={1} borderColor="divider">
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={12} sm="auto">
              {prevGallery && (
                <Button
                  component={Link}
                  href={`/galleries/${prevGallery.slug}`}
                  startIcon={<NavigateBefore />}
                  sx={{ textTransform: 'none' }}
                >
                  Previous: {prevGallery.title}
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm="auto">
              {nextGallery && (
                <Button
                  component={Link}
                  href={`/galleries/${nextGallery.slug}`}
                  endIcon={<NavigateNext />}
                  sx={{ textTransform: 'none' }}
                >
                  Next: {nextGallery.title}
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
}
