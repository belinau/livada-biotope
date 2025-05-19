import { Box, Button, Container, Typography } from '@mui/material';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container maxWidth="md">
      <Box mt={8} textAlign="center">
        <Typography variant="h2" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" paragraph>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Button 
          component={Link} 
          href="/" 
          variant="contained" 
          color="primary"
          sx={{ mt: 2 }}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
}
