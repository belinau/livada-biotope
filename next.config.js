/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const path = require('path');

const nextConfig = {
  // i18n configuration
  i18n,
  
  // Specify dependencies that should be transpiled
  transpilePackages: ['react-markdown', 'remark', 'remark-html'],
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'livada-bio.netlify.app', 'livada-biotope.netlify.app', 'static.inaturalist.org', 'inaturalist-open-data.s3.amazonaws.com', 'via.placeholder.com', 'inaturalist-assets.s3.amazonaws.com', 'static.inaturalist.org'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'livada-bio.netlify.app',
      },
      {
        protocol: 'https',
        hostname: 'livada-biotope.netlify.app',
      },
      {
        protocol: 'https',
        hostname: 'static.inaturalist.org',
      },
      {
        protocol: 'https',
        hostname: 'inaturalist-open-data.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'inaturalist-assets.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  // Simple configuration to avoid ESM issues
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  // Needed for better URL handling
  trailingSlash: true,
  // Ensure assets are properly handled
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://livada-bio.netlify.app' : '',
  // Add webpack configuration
  webpack: (config, { isServer }) => {
    // Handle Material-UI ESM modules
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mui/material': '@mui/material/legacy',
      '@mui/styled-engine': '@mui/styled-engine/legacy',
      '@mui/system': '@mui/system/legacy',
      '@mui/base': '@mui/base/legacy',
      '@mui/utils': '@mui/utils/legacy',
    };

    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/styles': path.resolve(__dirname, 'src/styles'),
      '@/public': path.resolve(__dirname, 'public'),
    };

    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
