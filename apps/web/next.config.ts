import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@rm/shared'],
  output: 'standalone',
  // Monorepo: trace files from the repo root so packages/shared is included.
  outputFileTracingRoot: path.join(import.meta.dirname, '../..'),
};

export default nextConfig;
