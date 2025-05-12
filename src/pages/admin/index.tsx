import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import SharedLayout from '@/components/layout/SharedLayout';

// Define the type for pages with custom layouts
interface PageWithLayout {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
}

const AdminPage: React.FC & PageWithLayout = () => {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Livada Biotope Admin
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to the Livada Biotope admin area. Please select an option below:
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={() => router.push('/admin/translations-editor')}
          >
            Translations Editor
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            onClick={() => router.push('/translation-preview')}
          >
            Translation Preview
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

// Define a custom layout for this page
AdminPage.getLayout = (page: React.ReactNode) => {
  return <SharedLayout>{page}</SharedLayout>;
};

export default AdminPage;
