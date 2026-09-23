import type { NextConfig } from 'next'

import process from 'node:process'

const nextConfig: NextConfig = {
  async redirects() {
    const username = process.env.HOME_USERNAME
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
