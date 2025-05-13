import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import useTranslations from '@/hooks/useTranslations';
import { Box, Typography, Paper, Button, CircularProgress, Divider, Chip } from '@mui/material';

const TranslationDebug: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { t, isLoading, error, lastUpdated } = useTranslations();
  const [rawTranslations, setRawTranslations] = useState<any>(null);
  const [isRawLoading, setIsRawLoading] = useState(false);
  const [languageToggleError, setLanguageToggleError] = useState<any>(null);
  const [fetchRawTranslationsError, setFetchRawTranslationsError] = useState<any>(null);

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

  // Toggle language
  const toggleLanguage = () => {
    try {
      console.log(`Toggling language from ${language} to ${language === 'en' ? 'sl' : 'en'}`);
      setLanguage(language === 'en' ? 'sl' : 'en');
    } catch (err) {
      console.error('Error toggling language:', err);
      setLanguageToggleError(err);
    }
  };

  // Fetch raw translations directly from the Netlify function
  const fetchRawTranslations = async () => {
    try {
      setIsRawLoading(true);
      const fetchUrl = `/api/translations?locale=${language}`;
      console.log(`Fetching raw translations from: ${fetchUrl}`);
      
      const response = await fetch(fetchUrl);
      console.log(`Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch raw translations: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Received raw translations with ${Object.keys(data).length} keys`);
      setRawTranslations(data);
    } catch (err) {
      console.error('Error fetching raw translations:', err);
      setFetchRawTranslationsError(err);
    } finally {
      setIsRawLoading(false);
    }
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
          {languageToggleError && (
            <Typography variant="body2" color="error.main">
              Error toggling language: {languageToggleError instanceof Error ? languageToggleError.message : String(languageToggleError)}
            </Typography>
          )}
          <Button 
            variant="outlined" 
            onClick={fetchRawTranslations} 
            size="small"
            disabled={isRawLoading}
          >
            Fetch Raw Translations
          </Button>
          {fetchRawTranslationsError && (
            <Typography variant="body2" color="error.main">
              Error fetching raw translations: {fetchRawTranslationsError instanceof Error ? fetchRawTranslationsError.message : String(fetchRawTranslationsError)}
            </Typography>
          )}
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
