'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslations } from 'next-intl';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';

export default function NewsletterSignup() {
  const { locale } = useLanguage();
  const t = useTranslations('newsletter');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage(t('emailRequired'));
      return;
    }

    setStatus('loading');
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, locale }),
      });

      if (!response.ok) {
        throw new Error('Subscription failed');
      }

      setStatus('success');
      setMessage(t('subscriptionSuccess'));
      setEmail('');
    } catch (error) {
      console.error('Error subscribing:', error);
      setStatus('error');
      setMessage(t('subscriptionError'));
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h5" component="h3" gutterBottom>
        {t('title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {t('description')}
      </Typography>
      
      {status === 'success' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
          <TextField
            fullWidth
            type="email"
            label={t('emailLabel')}
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            placeholder={t('emailPlaceholder')}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={status === 'loading'}
            sx={{ whiteSpace: 'nowrap', minWidth: 150 }}
          >
            {status === 'loading' ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t('subscribeButton')
            )}
          </Button>
        </Box>
      </Box>
      
      <Typography variant="caption" color="text.secondary" display="block" mt={1}>
        {t('privacyNotice')}
      </Typography>
    </Paper>
  );
}
