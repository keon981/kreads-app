import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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
