import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  transpilePackages: ['@workspace/server', '@workspace/ui'],
}

export default nextConfig
