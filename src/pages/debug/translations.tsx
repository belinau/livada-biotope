import React from 'react';
import Head from 'next/head';
import TranslationDebug from '@/components/TranslationDebug';
import SharedLayout from '@/components/layout/SharedLayout';

const TranslationsDebugPage = () => {
  return (
    <>
      <Head>
        <title>Translation Debug - Livada Biotope</title>
        <meta name="description" content="Debug page for translations" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <TranslationDebug />
    </>
  );
};

// Use the SharedLayout for this page
TranslationsDebugPage.getLayout = (page: React.ReactNode) => {
  return <SharedLayout>{page}</SharedLayout>;
};

export default TranslationsDebugPage;
