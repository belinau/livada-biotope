import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import SharedLayout from '@/components/layout/SharedLayout';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

// Define the type for pages with custom layouts
interface PageWithLayout {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
}

const AdminPage: React.FC & PageWithLayout = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth();
  
  // Handle login
  const handleLogin = () => {
    // Simple login without specifying connection to let Auth0 handle it
    loginWithRedirect();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Livada Biotope Admin
          </Typography>
          <Typography variant="body1" paragraph>
            You need to be authenticated to access the admin area.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<LoginIcon />}
            onClick={handleLogin}
            sx={{ mt: 2 }}
          >
            Log In with Auth0
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Livada Biotope Admin
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={() => logout()}
          >
            Logout
          </Button>
        </Box>
        
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
