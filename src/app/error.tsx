'use client';

import { useEffect } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Container maxWidth="md">
      <Box mt={8} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Something went wrong!
        </Typography>
        <Typography variant="body1" paragraph>
          {error.message || 'An unexpected error occurred'}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => reset()}
          sx={{ mt: 2 }}
        >
          Try again
        </Button>
      </Box>
    </Container>
  );
}
