import nextPwa from 'next-pwa';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isGithubActions = process.env.GITHUB_ACTIONS || false;
const shouldStaticExport = process.env.NEXT_OUTPUT_MODE === 'export';

let repoName = '';
if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY;
  repoName = `/${repo.split('/')[1]}`;
}

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

const probe = nextPwa({});

export default typeof probe === 'function'
  ? nextPwa(pwaOptions)(nextConfig)
  : nextPwa({ ...nextConfig, pwa: pwaOptions });
