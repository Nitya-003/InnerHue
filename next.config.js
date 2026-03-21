const isGithubActions = process.env.GITHUB_ACTIONS || false;

let repoName = '';
if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY;
  repoName = `/${repo.split('/')[1]}`;
}

const withPWA = require('next-pwa');

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  output: 'export', 
  basePath: repoName,
  assetPrefix: repoName,
  transpilePackages: [
    '@react-three/fiber',
    '@react-three/drei',
    'three',
  ],
  outputFileTracingRoot: __dirname,
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
};

module.exports = withPWA(nextConfig)