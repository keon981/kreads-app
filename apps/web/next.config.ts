import type { NextConfig } from 'next'

const devAllowedOrigins: string[] = JSON.parse(
  process.env.DEV_ALLOWED_ORIGINS ?? '[]',
)

const nextConfig: NextConfig = {
  allowedDevOrigins: devAllowedOrigins,
  cacheComponents: true,
  transpilePackages: ['@workspace/ui'],
  async redirects() {
    const username = process.env.NEXT_PUBLIC_HOME_USERNAME
    if (!username) return []

    return [
      {
        source: '/',
        destination: `/${username}`,
        permanent: false,
      },
    ]
  },
}

export default nextConfig
