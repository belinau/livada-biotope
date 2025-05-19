/** @jsxImportSource @emotion/react */
'use client';

import { useState, useEffect } from 'react';
import { Typography, Box, Container, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

// Types
type MetadataProps = {
  title: string;
  description: string;
  openGraph: {
    title: string;
    description: string;
    type: string;
    locale: string;
    siteName: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
  };
};

// Dynamically import client-side components with no SSR
const INaturalistFeed = dynamic(
  () => import('@/components/biodiversity/INaturalistFeed'),
  { 
    ssr: false,
    loading: () => (
      <Box py={4}>
        <Typography>Loading observations...</Typography>
      </Box>
    )
  }
);

const StyledSection = styled('section')(({ theme }) => ({
  padding: theme.spacing(8, 0),
  backgroundColor: theme.palette.background.default,
}));

type BiodiversityPageProps = {
  params: {
    locale: string;
  };
};

export default function BiodiversityPage({ params: { locale } }: BiodiversityPageProps) {
  const t = useTranslations('biodiversity');
  
  return (
    <Container maxWidth="lg">
      <Box py={6}>
        <Typography variant="h1" component="h1" gutterBottom>
          {t('title')}
        </Typography>
        
        <Typography variant="body1" paragraph>
          {t('description')}
        </Typography>
        
        <Box my={6}>
          <INaturalistFeed 
            maxItems={6}
            showTitle={true}
            showViewAll={true}
            locale={locale}
          />
        </Box>
      </Box>
    </Container>
  );
}

export async function generateMetadata({
  params: { locale },
}: BiodiversityPageProps): Promise<MetadataProps> {
  const t = await import(`@/messages/${locale}/biodiversity.json`).then(
    (mod) => mod.metadata
  );
  
  return {
    title: t.title,
    description: t.description,
    openGraph: {
      title: t.title,
      description: t.description,
      type: 'website',
      locale,
      siteName: 'Livada Biotope',
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.description,
    },
  };
}
