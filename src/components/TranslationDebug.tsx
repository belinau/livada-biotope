'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useTranslations } from 'next-intl';

const TranslationDebug: React.FC = () => {
  const { locale, setLocale, localeNames } = useLanguage();
  const t = useTranslations('common');

  // Common translation keys to test
  const testKeys = [
    'nav.home',
    'nav.projects',
    'nav.biodiversity',
    'nav.instructables',
    'nav.ecofeminism',
    'nav.events',
    'nav.contact',
    'nav.blog'
  ];

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        Translation Debug
      </Typography>
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">Current Locale:</Typography>
        <Typography variant="body1">{locale}</Typography>
      </Box>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">Available Locales:</Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          {Object.entries(localeNames).map(([code, name]) => (
            <Box 
              key={code}
              onClick={() => setLocale(code as any)}
              sx={{
                px: 2,
                py: 1,
                borderRadius: 1,
                bgcolor: code === locale ? 'primary.main' : 'action.hover',
                color: code === locale ? 'primary.contrastText' : 'text.primary',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: code === locale ? 'primary.dark' : 'action.selected',
                },
              }}
            >
              {name} ({code})
            </Box>
          ))}
        </Box>
      </Box>
      
      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Test Translations:
        </Typography>
        {testKeys.map((key) => (
          <Box key={key} sx={{ mb: 1 }}>
            <Typography component="span" sx={{ fontWeight: 'bold', mr: 1 }}>{key}:</Typography>
            <Typography component="span" color="text.secondary">
              {t(key) || 'Translation key not found'}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default TranslationDebug;
