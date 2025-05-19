'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales } from '@/config';
import { Button, ButtonGroup, Menu, MenuItem, ListItemIcon, Typography, useTheme } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useState, useCallback } from 'react';

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const switchToLocale = useCallback(
    (newLocale: string) => {
      // Remove the current locale from the path
      const pathWithoutLocale = pathname.replace(/^\/(en|sl)/, '');
      
      // Add the new locale to the path
      const newPath = `/${newLocale}${pathWithoutLocale || '/'}`;
      
      // Navigate to the new path
      router.push(newPath);
      handleClose();
    },
    [pathname, router]
  );

  // Don't render if we don't have a valid locale
  if (!locales.includes(locale as any)) {
    return null;
  }

  return (
    <>
      <Button
        id="language-button"
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        startIcon={<TranslateIcon />}
        sx={{
          color: 'inherit',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        {locale.toUpperCase()}
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {locales.map((lang) => (
          <MenuItem
            key={lang}
            selected={locale === lang}
            onClick={() => switchToLocale(lang)}
            sx={{
              minWidth: 100,
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              },
            }}
          >
            <ListItemIcon>
              <Typography variant="inherit">
                {lang === 'en' ? '🇬🇧' : '🇸🇮'}
              </Typography>
            </ListItemIcon>
            <Typography variant="inherit">
              {lang === 'en' ? 'English' : 'Slovenščina'}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
