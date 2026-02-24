const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  output: 'standalone',
  transpilePackages: [
    '@react-three/fiber',
    '@react-three/drei',
    'three',
  ],
  experimental: {
    outputFileTracingRoot: undefined,
  },
};

module.exports = withPWA(nextConfig)
