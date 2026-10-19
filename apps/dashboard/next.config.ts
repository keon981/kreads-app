import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    globalNotFound: true,
  },
  transpilePackages: ['@workspace/server', '@workspace/ui'],
}

export default nextConfig
