'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  CircularProgress,
  Alert,
  AlertTitle,
  FormHelperText,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function ContactForm() {
  const t = useTranslations('contact.form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': document.documentElement.lang || 'en',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message');
      }

      setSubmitStatus({
        success: true,
        message: t('successMessage'),
      });
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        success: false,
        message: t('errorMessage'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {submitStatus && (
        <Alert 
          severity={submitStatus.success ? 'success' : 'error'} 
          sx={{ mb: 3 }}
          role="status"
          aria-live="polite"
        >
          <AlertTitle>
            {submitStatus.success ? t('successTitle') : t('errorTitle')}
          </AlertTitle>
          {submitStatus.message}
        </Alert>
      )}

      <Box mb={3}>
        <TextField
          margin="normal"
          fullWidth
          id="name"
          label={t('fields.name')}
          autoComplete="name"
          autoFocus
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register('name', {
            required: t('validation.required'),
            minLength: {
              value: 2,
              message: t('validation.minLength', { count: 2 }),
            },
          })}
          aria-required="true"
        />
      </Box>
      
      <Box mb={3}>
        <TextField
          margin="normal"
          fullWidth
          id="email"
          label={t('fields.email')}
          type="email"
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          {...register('email', {
            required: t('validation.required'),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('validation.email'),
            },
          })}
          aria-required="true"
        />
      </Box>
      
      <Box mb={3}>
        <TextField
          margin="normal"
          fullWidth
          id="subject"
          label={t('fields.subject')}
          error={!!errors.subject}
          helperText={errors.subject?.message}
          {...register('subject', {
            required: t('validation.required'),
            minLength: {
              value: 5,
              message: t('validation.minLength', { count: 5 }),
            },
          })}
          aria-required="true"
        />
      </Box>
      
      <Box mb={3}>
        <TextField
          margin="normal"
          fullWidth
          id="message"
          label={t('fields.message')}
          multiline
          rows={6}
          error={!!errors.message}
          helperText={errors.message?.message}
          {...register('message', {
            required: t('validation.required'),
            minLength: {
              value: 10,
              message: t('validation.minLength', { count: 10 }),
            },
          })}
          aria-required="true"
        />
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
          sx={{ minWidth: 150 }}
          aria-busy={isSubmitting}
          aria-live="polite"
        >
          {isSubmitting ? t('submitting') : t('submit')}
        </Button>
      </Box>
      
      <FormHelperText sx={{ mt: 2, textAlign: 'right' }}>
        {t('requiredField')}
      </FormHelperText>
    </Box>
  );
}
