import { useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import GrassIcon from '@mui/icons-material/Grass';
import LanguageSwitcher from '../features/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

const navItems = [
  { id: 'home', path: '/' },
  { id: 'biodiversity', path: '/biodiversity' },
  { id: 'events', path: '/events' },
  { id: 'gallery', path: '/galleries' },
  { id: 'blog', path: '/blog' },
  { id: 'about', path: '/about' },
  { id: 'contact', path: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const t = useTranslations('navigation');
  const { locale, setLocale } = useLanguage();

  const handleDrawerToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleNavClick = useCallback((path: string) => {
    router.push(path);
    setMobileOpen(false);
  }, [router]);

  const drawer = (
    <Box
      sx={{
        width: 250,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
      role="presentation"
      onClick={handleDrawerToggle}
      onKeyDown={handleDrawerToggle}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <GrassIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="div">
            {t('siteName')}
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.id}
            onClick={() => handleNavClick(item.path)}
            selected={pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'action.selected',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              },
            }}
          >
            <ListItemText primary={t(`nav.${item.id}`)} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        <LanguageSwitcher />
      </Box>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => router.push('/')}>
            <GrassIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontWeight: 700,
                letterSpacing: '.1rem',
                textDecoration: 'none',
              }}
            >
              {t('siteName')}
            </Typography>
          </Box>


          {/* Desktop navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                sx={{
                  my: 2,
                  mx: 1,
                  color: pathname === item.path ? 'primary.main' : 'text.primary',
                  display: 'block',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: 'primary.main',
                  },
                }}
              >
                {t(`nav.${item.id}`)}
              </Button>
            ))}
            <Box sx={{ ml: 2 }}>
              <LanguageSwitcher />
            </Box>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}
