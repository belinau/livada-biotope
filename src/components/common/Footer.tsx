import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Livada Biotope
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sustainable living and community garden in Ljubljana, Slovenia.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column">
              <Link href="/about" color="inherit" underline="hover" sx={{ mb: 1 }}>
                About Us
              </Link>
              <Link href="/projects" color="inherit" underline="hover" sx={{ mb: 1 }}>
                Projects
              </Link>
              <Link href="/blog" color="inherit" underline="hover" sx={{ mb: 1 }}>
                Blog
              </Link>
              <Link href="/contact" color="inherit" underline="hover">
                Contact
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: info@livada.bio
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ljubljana, Slovenia
            </Typography>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Livada Biotope. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
