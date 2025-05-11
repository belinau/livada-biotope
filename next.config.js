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
  // Enable static exports
  output: 'export',
  // Disable server components for static export
  experimental: {
    appDir: false,
  },
  // Needed for static export with Next.js 13+
  trailingSlash: true,
}

module.exports = nextConfig
