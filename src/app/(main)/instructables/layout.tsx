import { Metadata } from 'next';
import { Box, Container, Typography } from '@mui/material';

export const metadata: Metadata = {
  title: 'Instructables - Livada Biotope',
  description: 'Step-by-step guides for sustainable living and DIY projects',
};

export default function InstructablesLayout({
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
            Instructables
          </Typography>
          <Typography variant="h5" component="p" sx={{ opacity: 0.9 }}>
            Step-by-step guides for sustainable living and DIY projects
          </Typography>
        </Container>
      </Box>
      
      <Box component="main" sx={{ flex: 1, pb: 6 }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
}
