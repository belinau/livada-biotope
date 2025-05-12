/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true,
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
}

module.exports = nextConfig
