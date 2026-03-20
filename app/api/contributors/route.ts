import { NextResponse, NextRequest } from 'next/server';
import { withRateLimit } from '@/lib/rateLimitMiddleware';
import fs from 'fs/promises';
import path from 'path';

export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

export interface ContributorWithDetails extends GitHubContributor {
  name: string | null;
  bio: string | null;
  blog: string | null;
  twitter_username: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
}

const REPO_OWNER = 'Nitya-003';
const REPO_NAME = 'InnerHue';

async function fetchWithAuth(url: string) {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    headers,
    next: { revalidate: 300 }, // cache for 5 minutes
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export const GET = withRateLimit(
  async (req: NextRequest) => {
    try {
      // If a pre-generated contributors JSON exists in the repo (updated by automation),
      // prefer serving that to avoid hitting GitHub rate limits.
      try {
        const dataPath = path.join(process.cwd(), 'data', 'contributors.json');
        const raw = await fs.readFile(dataPath, 'utf-8').catch(() => null);
        if (raw) {
          const parsed = JSON.parse(raw);
          return NextResponse.json(
            { contributors: parsed, total: parsed.length },
            {
              status: 200,
              headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
              },
            }
          );
        }
      } catch (e) {
        // ignore and fall back to live GitHub fetch
      }
      // Fetch all contributors (up to 100 per page)
      const contributors: GitHubContributor[] = await fetchWithAuth(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=100&anon=0`
      );

      // Filter out bots
      const humans = contributors.filter((c) => c.type !== 'Bot');

      // Fetch detailed profiles in parallel (batch to avoid rate limits)
      const detailed: ContributorWithDetails[] = await Promise.all(
        humans.map(async (contributor) => {
          try {
            const user = await fetchWithAuth(
              `https://api.github.com/users/${contributor.login}`
            );
            return {
              ...contributor,
              name: user.name ?? null,
              bio: user.bio ?? null,
              blog: user.blog ?? null,
              twitter_username: user.twitter_username ?? null,
              location: user.location ?? null,
              public_repos: user.public_repos ?? 0,
              followers: user.followers ?? 0,
            };
          } catch {
            // Fallback if user profile fetch fails
            return {
              ...contributor,
              name: null,
              bio: null,
              blog: null,
              twitter_username: null,
              location: null,
              public_repos: 0,
              followers: 0,
            };
          }
        })
      );

      return NextResponse.json(
        { contributors: detailed, total: detailed.length },
        {
          status: 200,
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        }
      );
    } catch (error) {
      console.error('Failed to fetch contributors:', error);
      return NextResponse.json(
        { error: 'Failed to fetch contributors', contributors: [], total: 0 },
        { status: 500 }
      );
    }
  },
  {
    maxRequests: 100, // 100 requests
    windowMs: 15 * 60 * 1000, // per 15 minutes
  }
);
