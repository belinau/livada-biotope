import React from 'react';
import { Helmet } from 'react-helmet';

const MetaTags = ({ title, description, imageUrl }) => {
  const defaultTitle = 'Livada Bio';
  const defaultDescription = 'An interdisciplinary art project exploring urban biodiversity.';
  const defaultImageUrl = `${window.location.origin}/logo512.png`;

  const pageTitle = title ? `${title} | Livada Bio` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImageUrl = imageUrl || defaultImageUrl;

  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImageUrl} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImageUrl} />
    </Helmet>
  );
};

export default MetaTags;
