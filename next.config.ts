import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // Subdirectory deploy: https://<owner>.github.io/tech-note
  // Remove basePath if you configure a custom domain
  basePath: '/tech-note',
};

export default nextConfig;
