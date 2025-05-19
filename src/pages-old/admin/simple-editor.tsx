import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GetStaticProps } from 'next';
import { Box, Typography, TextField, Button, Paper, Container } from '@mui/material';

const SimpleEditor = () => {
  const t = useTranslations('Admin.SimpleEditor');
  const [content, setContent] = useState('');

  const handleSave = () => {
    // Handle save logic here
    console.log('Content saved:', content);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('title')}
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('contentPlaceholder')}
          sx={{ mb: 3 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" color="primary">
            {t('cancel')}
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSave}
          >
            {t('save')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SimpleEditor;

// If you need to use getStaticProps for translations
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      // You can pass translation messages here if needed
      messages: (await import(`@/messages/${locale}.json`)).default
    }
  };
};