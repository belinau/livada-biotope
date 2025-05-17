import React from 'react';
import { 
  ButtonGroup, 
  Button, 
  Tooltip, 
  useTheme, 
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: 'en' | 'sl') => {
    setLanguage(lang);
    handleClose();
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'sl', label: 'Slovenščina' },
  ];

  // For mobile/compact view
  if (theme.breakpoints.down('sm')) {
    return (
      <Box>
        <Tooltip title="Change language">
          <Button
            onClick={handleClick}
            color="inherit"
            startIcon={<TranslateIcon />}
            size="small"
            aria-label="Change language"
            aria-controls="language-menu"
            aria-haspopup="true"
          >
            {language.toUpperCase()}
          </Button>
        </Tooltip>
        <Menu
          id="language-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          MenuListProps={{ 'aria-labelledby': 'language-button' }}
        >
          {languages.map((lang) => (
            <MenuItem 
              key={lang.code} 
              selected={language === lang.code}
              onClick={() => handleLanguageChange(lang.code as 'en' | 'sl')}
            >
              <ListItemText primary={lang.label} />
              {language === lang.code && (
                <ListItemIcon>
                  <span style={{ color: theme.palette.primary.main }}>✓</span>
                </ListItemIcon>
              )}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    );
  }

  // For desktop view
  return (
    <ButtonGroup 
      variant="outlined" 
      size="small"
      aria-label="Language switcher"
      sx={{
        '& .MuiButton-root': {
          minWidth: '60px',
          textTransform: 'none',
          '&:not(:last-child)': {
            borderRight: 'none',
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          },
        },
      }}
    >
      {languages.map((lang) => (
        <Button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code as 'en' | 'sl')}
          variant={language === lang.code ? 'contained' : 'outlined'}
          color={language === lang.code ? 'primary' : 'inherit'}
          className={language === lang.code ? 'Mui-selected' : ''}
          aria-pressed={language === lang.code}
        >
          {lang.code.toUpperCase()}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default LanguageSwitcher;
