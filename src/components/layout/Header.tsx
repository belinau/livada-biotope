import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  useScrollTrigger, 
  Slide, 
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import EventIcon from '@mui/icons-material/Event';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LanguageSwitcher from '@/components/features/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

interface NavItem {
  id: string;
  label: {
    en: string;
    sl: string;
  };
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: { en: 'Home', sl: 'Domov' },
    path: '/',
    icon: <HomeIcon fontSize="small" />
  },
  {
    id: 'about',
    label: { en: 'About', sl: 'O nas' },
    path: '/about',
    icon: <InfoIcon fontSize="small" />
  },
  {
    id: 'events',
    label: { en: 'Events', sl: 'Dogodki' },
    path: '/events',
    icon: <EventIcon fontSize="small" />
  },
  {
    id: 'contact',
    label: { en: 'Contact', sl: 'Kontakt' },
    path: '/contact',
    icon: <ContactMailIcon fontSize="small" />
  },
];

const HideOnScroll: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

const Header: React.FC<HeaderProps> = ({ onMenuClick, title = 'Livada Biotope' }) => {
  const { language } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    handleClose();
  };

  return (
    <HideOnScroll>
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={onMenuClick}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 700,
              '& a': {
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                }
              }
            }}
          >
            <Link href="/">{title}</Link>
          </Typography>


          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    mx: 0.5,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  {item.label[language as keyof typeof item.label]}
                </Button>
              ))}
              <Box sx={{ ml: 2 }}>
                <LanguageSwitcher />
              </Box>
            </Box>
          )}

          {isMobile && (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                {navItems.map((item) => (
                  <MenuItem key={item.id} onClick={() => handleNavigation(item.path)}>
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText>{item.label[language as keyof typeof item.label]}</ListItemText>
                  </MenuItem>
                ))}
                <Divider />
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                  <LanguageSwitcher />
                </Box>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

// Export as both named and default
export { Header };
export default Header;
