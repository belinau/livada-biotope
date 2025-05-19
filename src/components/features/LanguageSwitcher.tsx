'use client';

import { useState } from 'react';
import { 
  Button, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Tooltip,
  Box,
  useTheme,
  IconButton
} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useLanguage } from '@/contexts/LanguageContext';

const localeNames = {
  en: 'English',
  sl: 'Slovenščina',
} as const;

type Locale = keyof typeof localeNames;

export default function LanguageSwitcher() {
  const { locale, setLocale, localeNames: localeNamesFromContext } = useLanguage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (newLocale: string) => {
    setLocale(newLocale as any);
    handleClose();
  };

  // For mobile/compact view
  if (theme.breakpoints.down('sm')) {
    return (
      <Box>
        <Tooltip title="Change language">
          <IconButton
            onClick={handleClick}
            color="inherit"
            size="small"
            aria-label="Change language"
          >
            <TranslateIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
        >
          {Object.entries(localeNamesFromContext).map(([code, name]) => (
            <MenuItem 
              key={code} 
              selected={code === locale}
              onClick={() => handleLanguageChange(code)}
            >
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  // For desktop view
  return (
    <Box>
      <Tooltip title="Change language">
        <Button
          onClick={handleClick}
          color="inherit"
          startIcon={<TranslateIcon />}
          size="small"
          aria-label="Change language"
        >
          {localeNamesFromContext[locale as Locale]}
        </Button>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        {Object.entries(localeNamesFromContext).map(([code, name]) => (
          <MenuItem 
            key={code} 
            selected={code === locale}
            onClick={() => handleLanguageChange(code)}
          >
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
