'use client';

import { Box, Container, Link as MuiLink, Typography } from '@mui/material';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Livada Biotop. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, md: 0 } }}>
            <MuiLink
              component={Link}
              href="/privacy"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Privacy Policy
            </MuiLink>
            <MuiLink
              component={Link}
              href="/terms"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Terms of Service
            </MuiLink>
            <MuiLink
              component={Link}
              href="/contact"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Contact Us
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
