'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales } from '@/i18n/request';

export default function Header() {
  const pathname = usePathname();
  
  // Extract the current locale from the pathname
  const currentLocale = pathname.split('/')[1] || 'en';
  
  // Function to get the path with a different locale
  const getLocalizedPath = (locale: string) => {
    if (!pathname) return '/';
    const segments = pathname.split('/');
    segments[1] = locale; // Replace the locale segment
    return segments.join('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
            Livada Biotop
          </Link>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} href="/about">
            About
          </Button>
          <Button color="inherit" component={Link} href="/events">
            Events
          </Button>
          <Button color="inherit" component={Link} href="/contact">
            Contact
          </Button>
          <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
            {locales.map((locale) => (
              <Button
                key={locale}
                variant={currentLocale === locale ? 'outlined' : 'text'}
                color="inherit"
                href={getLocalizedPath(locale)}
                component={Link}
                size="small"
                sx={{
                  minWidth: 'auto',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {locale.toUpperCase()}
              </Button>
            ))}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
