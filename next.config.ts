import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimal turbopack config to avoid Turbopack vs webpack conflict
  turbopack: {},
  // New way to externalize packages
  serverExternalPackages: ['@libsql/client', '@prisma/adapter-libsql'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
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

export default nextConfig;
