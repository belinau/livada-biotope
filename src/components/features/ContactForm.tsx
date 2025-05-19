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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  contactMethod: 'email' | 'phone' | '';
  phone?: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ContactForm() {
  const { locale } = useLanguage();
  const t = useTranslations('contact');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    contactMethod: '',
    phone: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('errors.nameRequired');
    }
    
    if (!formData.email) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
    }
    
    if (!formData.subject) {
      newErrors.subject = t('errors.subjectRequired');
    }
    
    if (!formData.message) {
      newErrors.message = t('errors.messageRequired');
    }
    
    if (formData.contactMethod === 'phone' && !formData.phone) {
      newErrors.phone = t('errors.phoneRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setStatus('loading');
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locale,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      setStatus('success');
      setMessage(t('successMessage'));
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        contactMethod: '',
        phone: '',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setMessage(t('errorMessage'));
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {t('title')}
      </Typography>
      
      {status === 'success' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}
      
      {status === 'error' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label={t('form.name')}
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={status === 'loading'}
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="email"
              name="email"
              type="email"
              label={t('form.email')}
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={status === 'loading'}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="subject"
              name="subject"
              label={t('form.subject')}
              value={formData.subject}
              onChange={handleChange}
              error={!!errors.subject}
              helperText={errors.subject}
              disabled={status === 'loading'}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.contactMethod}>
              <InputLabel id="contact-method-label">
                {t('form.preferredContact')}
              </InputLabel>
              <Select
                labelId="contact-method-label"
                id="contactMethod"
                name="contactMethod"
                value={formData.contactMethod}
                onChange={handleSelectChange}
                disabled={status === 'loading'}
                label={t('form.preferredContact')}
              >
                <MenuItem value="">
                  <em>{t('form.selectContactMethod')}</em>
                </MenuItem>
                <MenuItem value="email">{t('form.email')}</MenuItem>
                <MenuItem value="phone">{t('form.phone')}</MenuItem>
              </Select>
              {errors.contactMethod && (
                <FormHelperText>{errors.contactMethod}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          {formData.contactMethod === 'phone' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                type="tel"
                label={t('form.phoneNumber')}
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                disabled={status === 'loading'}
                required={formData.contactMethod === 'phone'}
              />
            </Grid>
          )}
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="message"
              name="message"
              label={t('form.message')}
              multiline
              rows={6}
              value={formData.message}
              onChange={handleChange}
              error={!!errors.message}
              helperText={errors.message}
              disabled={status === 'loading'}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={status === 'loading'}
              startIcon={status === 'loading' ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {status === 'loading' ? t('form.sending') : t('form.submit')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
