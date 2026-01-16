/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal turbopack config to avoid Turbopack vs webpack conflict
  turbopack: {},
  // New way to externalize packages
  serverExternalPackages: [],
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/.prisma/client/**/*'],
      '/*': ['./node_modules/.prisma/client/**/*'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  headers: async () => {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Ignore markdown and license files that are causing parsing errors
    config.module.rules.push({
      test: /\.(md|LICENSE|README\.md)$/,
      use: 'raw-loader', // or 'ignore-loader' if you just want to ignore them
    });
    return config;
  },
};

module.exports = nextConfig;
