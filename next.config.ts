import type { NextConfig } from 'next'

// Set CDN_URL env var before `npm run build` on the server to serve
// _next/static/ from CloudFront instead of EC2. Leave unset for local dev.
// Example: CDN_URL="https://dn2k1twc7nphc.cloudfront.net" npm run build
const CDN_URL = process.env.CDN_URL || ''

const nextConfig: NextConfig = {
  assetPrefix: CDN_URL || undefined,
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'gsap', '@gsap/react', 'lenis', 'keen-slider'],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.zurichgraphics.com' }],
        destination: 'https://zurichgraphics.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
