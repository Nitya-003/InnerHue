const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  output: 'standalone',
};

// Temporarily disable PWA due to missing dependencies in CI
module.exports = nextConfig;
