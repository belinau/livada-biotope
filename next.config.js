/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'livada-bio.netlify.app'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'livada-bio.netlify.app',
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
  // Auth0 requires server-side functionality, so we can't use static export
  // output: 'export',
  // Ensure assets are properly handled
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://livada-bio.netlify.app' : '',
}

module.exports = nextConfig
