const withNextIntl = require('next-intl/plugin')('./i18n/config.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    emotion: true,
  },
  images: {
    domains: ['inaturalist-open-data.s3.amazonaws.com', 'images.unsplash.com', 'res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Removed experimental.serverActions as it's enabled by default now
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't include node modules in client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        dgram: false,
        cluster: false,
      };
    }

    // Handle font files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    });

    // Handle SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  typescript: {
    // Set this to false if you want to proceed with type checking in production
    ignoreBuildErrors: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = withNextIntl(nextConfig);