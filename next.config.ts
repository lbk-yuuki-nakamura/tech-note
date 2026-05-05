import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/**': ['./posts/**/*'],
    },
  },
};

export default nextConfig;
