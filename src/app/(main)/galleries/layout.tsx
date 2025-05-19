import { Box, Container, Typography } from '@mui/material';
import Link from 'next/link';

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
          color: 'white',
          py: 8,
          mb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" gutterBottom>
            Photo Galleries
          </Typography>
          <Typography variant="h6" component="p" sx={{ opacity: 0.9, maxWidth: '600px' }}>
            Explore our collection of photos showcasing the beauty and biodiversity of Livada Biotope.
          </Typography>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        {children}
      </Container>
    </>
  );
}
