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
  // Needed for static export with Next.js 13
  trailingSlash: true,
  // Enable static exports for Next.js 13
  output: 'export',
}

module.exports = nextConfig
