import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/privacy',
        destination: '/#privacy',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
