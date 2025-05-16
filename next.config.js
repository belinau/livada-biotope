/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

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
        hostname: '**.inaturalist.org',
      },
      {
        protocol: 'https',
        hostname: 'inaturalist-open-data.s3.amazonaws.com',
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
