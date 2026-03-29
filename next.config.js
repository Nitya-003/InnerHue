const isGithubActions = process.env.GITHUB_ACTIONS || false;
const shouldStaticExport = process.env.NEXT_OUTPUT_MODE === 'export';

let repoName = '';
if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY;
  repoName = `/${repo.split('/')[1]}`;
}

const nextPwa = require('next-pwa');

const pwaOptions = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
};

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  output: shouldStaticExport ? 'export' : 'standalone',
  basePath: repoName,
  assetPrefix: repoName,
  env: {
    NEXT_PUBLIC_BASE_PATH: repoName,
  },
  transpilePackages: [
    '@react-three/fiber',
    '@react-three/drei',
    'three',
  ],
  outputFileTracingRoot: __dirname,
};

// next-pwa has two API shapes across versions:
// 1) withPWA(nextConfig) where options live under nextConfig.pwa
// 2) withPWA(pwaOptions)(nextConfig)
const probe = nextPwa({});

module.exports =
  typeof probe === 'function'
    ? nextPwa(pwaOptions)(nextConfig)
    : nextPwa({ ...nextConfig, pwa: pwaOptions });
