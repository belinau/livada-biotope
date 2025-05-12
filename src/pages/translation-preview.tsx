import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import useTranslations from '@/hooks/useTranslations';
import SharedLayout from '@/components/layout/SharedLayout';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  CircularProgress,
  Divider,
  Chip,
  Alert
} from '@mui/material';

// Define the type for pages with custom layouts
interface PageWithLayout {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
}

const TranslationPreview: React.FC & PageWithLayout = () => {
  const { language, setLanguage } = useLanguage();
  const { t, loading, error } = useTranslations();
  const [customKey, setCustomKey] = useState<string>('');
  const [customResult, setCustomResult] = useState<string | null>(null);

  // Sample translation keys to demonstrate
  const sampleKeys = [
    'nav.home',
    'nav.about',
    'nav.projects',
    'nav.events',
    'events.title',
    'events.subtitle',
    'home.title',
    'home.subtitle',
    'projects.title',
    'sensors.title'
  ];

  const handleTestKey = () => {
    if (customKey) {
      setCustomResult(t(customKey, `Key not found: ${customKey}`));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Translation System Preview
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Current Language: <Chip label={language === 'en' ? 'English' : 'Slovenian'} color="primary" />
        </Typography>
        
        <Box sx={{ mt: 2, mb: 3 }}>
          <Button 
            variant={language === 'en' ? 'contained' : 'outlined'} 
            onClick={() => setLanguage('en')}
            sx={{ mr: 2 }}
          >
            Switch to English
          </Button>
          <Button 
            variant={language === 'sl' ? 'contained' : 'outlined'} 
            onClick={() => setLanguage('sl')}
          >
            Switch to Slovenian
          </Button>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Loading translations...
            </Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <Typography variant="body1" sx={{ mb: 3 }}>
            Translations loaded successfully from serverless function!
          </Typography>
        )}
      </Paper>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Sample Translations
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              {sampleKeys.map((key) => (
                <Grid item xs={12} key={key}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Key: <code>{key}</code>
                    </Typography>
                    <Typography variant="body1">
                      {t(key, `[Translation not found for: ${key}]`)}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Test Custom Translation Key
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Enter translation key"
                variant="outlined"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="e.g., home.title"
                sx={{ mb: 2 }}
              />
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleTestKey}
                disabled={!customKey}
              >
                Test Key
              </Button>
            </Box>
            
            {customResult !== null && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Result for key: <code>{customKey}</code>
                </Typography>
                <Typography variant="body1">
                  {customResult}
                </Typography>
              </Paper>
            )}
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                How It Works
              </Typography>
              <Typography variant="body2" paragraph>
                1. The <code>useTranslations</code> hook fetches translations from the serverless function
              </Typography>
              <Typography variant="body2" paragraph>
                2. Translations are loaded based on the current language setting
              </Typography>
              <Typography variant="body2" paragraph>
                3. The <code>t(key, defaultValue)</code> function returns the translation for the given key
              </Typography>
              <Typography variant="body2">
                4. If a translation is not found, the default value is returned
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Managing Translations
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Typography variant="body1" paragraph>
          To manage translations, visit the <a href="/admin/translations-editor" style={{ color: '#2e7d32', fontWeight: 'bold' }}>Translations Editor</a>.
        </Typography>
        
        <Typography variant="body1" paragraph>
          The editor allows you to:
        </Typography>
        
        <ul>
          <li>View all available translations</li>
          <li>Edit existing translations</li>
          <li>Add new translation keys</li>
          <li>Search for specific translations</li>
        </ul>
        
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Note: You need to be authenticated to access the translations editor.
        </Typography>
      </Paper>
    </Container>
  );
};

// Define a custom layout for this page
TranslationPreview.getLayout = (page: React.ReactNode) => {
  return <SharedLayout>{page}</SharedLayout>;
};

export default TranslationPreview;
