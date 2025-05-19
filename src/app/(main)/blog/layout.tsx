import { Metadata } from 'next';
import { Box, Container, Typography } from '@mui/material';

export const metadata: Metadata = {
  title: 'Blog - Livada Biotope',
  description: 'Read our latest articles on sustainable living, eco-feminism, and land-based practices.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box 
        component="header" 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          py: 6,
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Blog
          </Typography>
          <Typography variant="h5" component="p" sx={{ opacity: 0.9 }}>
            Insights, stories, and updates on sustainable living and eco-feminism
          </Typography>
        </Container>
      </Box>
      
      <Box component="main" sx={{ flex: 1, pb: 6 }}>
        {children}
      </Box>
    </Box>
  );
}
