import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import useTranslations from '@/hooks/useTranslations';
import { Box, Typography, Paper, Button, CircularProgress, Divider, Chip } from '@mui/material';

const TranslationDebug: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { t, isLoading, error, lastUpdated } = useTranslations();
  const [rawTranslations, setRawTranslations] = useState<any>(null);
  const [isRawLoading, setIsRawLoading] = useState(false);

  // Common translation keys to test
  const testKeys = [
    'nav.home',
    'Navbar.home',
    'nav.projects',
    'Navbar.biodiversity',
    'Navbar.instructables',
    'Navbar.ecofeminism',
    'nav.events',
    'nav.contact',
    'Navbar.blog'
  ];

  // Fetch raw translations directly from the Netlify function
  const fetchRawTranslations = async () => {
    try {
      setIsRawLoading(true);
      const response = await fetch(`/.netlify/functions/translations?locale=${language}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch raw translations: ${response.status}`);
      }
      const data = await response.json();
      setRawTranslations(data);
    } catch (err) {
      console.error('Error fetching raw translations:', err);
    } finally {
      setIsRawLoading(false);
    }
  };

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'sl' : 'en');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Translation Debug
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current language: <Chip label={language} color="primary" size="small" />
          </Typography>
          <Button 
            variant="outlined" 
            onClick={toggleLanguage} 
            size="small"
            sx={{ mr: 1 }}
          >
            Toggle Language
          </Button>
          <Button 
            variant="outlined" 
            onClick={fetchRawTranslations} 
            size="small"
            disabled={isRawLoading}
          >
            Fetch Raw Translations
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Translation Hook Status
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            Loading: {isLoading ? 'Yes' : 'No'}
          </Typography>
          <Typography variant="body2">
            Error: {error ? error.message : 'None'}
          </Typography>
          <Typography variant="body2">
            Last Updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Never'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Test Translations
        </Typography>
        
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <Box component="ul" sx={{ pl: 2 }}>
            {testKeys.map(key => (
              <Typography component="li" key={key} variant="body2">
                <strong>{key}:</strong> {t(key, `[Missing: ${key.replace(/"/g, '\\"')}]`)}
              </Typography>
            ))}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          Raw Translations
        </Typography>
        
        {isRawLoading ? (
          <CircularProgress size={24} />
        ) : rawTranslations ? (
          <Box sx={{ 
            maxHeight: 300, 
            overflow: 'auto', 
            bgcolor: 'grey.100', 
            p: 2, 
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: '0.8rem'
          }}>
            <pre>{JSON.stringify(rawTranslations, null, 2)}</pre>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Click &quot;Fetch Raw Translations&quot; to view the raw data
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default TranslationDebug;
