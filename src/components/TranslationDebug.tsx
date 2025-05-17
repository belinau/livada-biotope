import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import useTranslations from '@/hooks/useTranslations';
import { Box, Typography, Paper, Button, CircularProgress, Divider, Chip, Alert } from '@mui/material';

const TranslationDebug: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { t, isLoading, error, lastUpdated } = useTranslations();
  const [rawTranslations, setRawTranslations] = useState<any>(null);
  const [isRawLoading, setIsRawLoading] = useState(false);
  const [languageToggleError, setLanguageToggleError] = useState<any>(null);
  const [fetchRawTranslationsError, setFetchRawTranslationsError] = useState<any>(null);
  const [networkStatus, setNetworkStatus] = useState<string>('');
  const [responseDetails, setResponseDetails] = useState<string>('');

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
      setNetworkStatus('Starting fetch request...');
      setResponseDetails('');
      setFetchRawTranslationsError(null);
      
      const fetchUrl = `/api/translations?locale=${language}`;
      console.log(`Fetching raw translations from: ${fetchUrl}`);
      setNetworkStatus(`Fetching from: ${fetchUrl}`);
      
      const response = await fetch(fetchUrl);
      console.log(`Response status: ${response.status} ${response.statusText}`);
      setNetworkStatus(`Response received: ${response.status} ${response.statusText}`);
      
      // Log all response headers for debugging
      const headers: string[] = [];
      response.headers.forEach((value, key) => {
        headers.push(`${key}: ${value}`);
      });
      console.log('Response headers:', headers);
      setResponseDetails(`Headers: ${headers.join(', ')}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch raw translations: ${response.status} ${response.statusText}`);
      }
      
      const text = await response.text();
      console.log(`Raw response text:`, text);
      
      try {
        const data = JSON.parse(text);
        console.log(`Received raw translations with ${Object.keys(data).length} keys`);
        setNetworkStatus(`Success! Loaded ${Object.keys(data).length} translation keys`);
        setRawTranslations(data);
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        setNetworkStatus(`Error parsing JSON response`);
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
      }
    } catch (err) {
      console.error('Error fetching raw translations:', err);
      setNetworkStatus(`Error: ${err instanceof Error ? err.message : String(err)}`);
      setFetchRawTranslationsError(err);
    } finally {
      setIsRawLoading(false);
    }
  };

  // Direct test with fetch API to bypass any potential issues with the hook
  const directFetchTest = async () => {
    try {
      setIsRawLoading(true);
      setNetworkStatus('Starting direct fetch test...');
      
      // Try both API paths to see which one works
      const paths = [
        `/api/translations?locale=${language}`,
        `/.netlify/functions/translations?locale=${language}`
      ];
      
      let successfulResponse = null;
      
      for (const path of paths) {
        try {
          setNetworkStatus(`Testing path: ${path}`);
          console.log(`Testing direct fetch from: ${path}`);
          
          const response = await fetch(path);
          console.log(`Direct fetch response (${path}):`, response.status, response.statusText);
          
          if (response.ok) {
            const text = await response.text();
            try {
              const data = JSON.parse(text);
              console.log(`Direct fetch success from ${path} with ${Object.keys(data).length} keys`);
              setNetworkStatus(`Success with ${path}! Loaded ${Object.keys(data).length} keys`);
              successfulResponse = data;
              break;
            } catch (e) {
              console.error(`Invalid JSON from ${path}:`, text);
              setNetworkStatus(`Invalid JSON from ${path}`);
            }
          } else {
            console.error(`Failed fetch from ${path}:`, response.status, response.statusText);
            setNetworkStatus(`Failed fetch from ${path}: ${response.status}`);
          }
        } catch (pathError) {
          console.error(`Error with path ${path}:`, pathError);
          setNetworkStatus(`Error with path ${path}: ${pathError instanceof Error ? pathError.message : String(pathError)}`);
        }
      }
      
      if (successfulResponse) {
        setRawTranslations(successfulResponse);
      } else {
        setNetworkStatus('All fetch attempts failed');
        throw new Error('All fetch attempts failed');
      }
    } catch (err) {
      console.error('Error in direct fetch test:', err);
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
            sx={{ mr: 1 }}
          >
            Fetch Raw Translations
          </Button>
          <Button 
            variant="contained" 
            onClick={directFetchTest} 
            size="small"
            disabled={isRawLoading}
            color="secondary"
          >
            Direct Fetch Test
          </Button>
          {fetchRawTranslationsError && (
            <Typography variant="body2" color="error.main">
              Error fetching raw translations: {fetchRawTranslationsError instanceof Error ? fetchRawTranslationsError.message : String(fetchRawTranslationsError)}
            </Typography>
          )}
        </Box>
        
        {networkStatus && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {networkStatus}
          </Alert>
        )}
        
        {responseDetails && (
          <Alert severity="info" sx={{ mb: 2, wordBreak: 'break-all' }}>
            {responseDetails}
          </Alert>
        )}

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
            Click &#34;Fetch Raw Translations&#34; or &#34;Direct Fetch Test&#34; to load raw translation data
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default TranslationDebug;
