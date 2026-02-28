'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  Github,
  Globe,
  Twitter,
  MapPin,
  Users,
  GitCommit,
  Star,
  BookOpen,
  RefreshCw,
  Search,
  ExternalLink,
} from 'lucide-react';
import { FloatingBackground } from '@/components/FloatingBackground';
import { ThemeToggle } from '@/components/ThemeToggle';

interface Contributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  name: string | null;
  bio: string | null;
  blog: string | null;
  twitter_username: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
}

function ContributorCardSkeleton() {
  return (
    <div className="bg-card backdrop-blur-md rounded-2xl p-6 border border-border animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-secondary/50 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="h-5 bg-secondary/50 rounded-lg w-32 mb-2" />
          <div className="h-3 bg-secondary/50 rounded-lg w-20 mb-3" />
          <div className="h-3 bg-secondary/50 rounded-lg w-full mb-1" />
          <div className="h-3 bg-secondary/50 rounded-lg w-4/5" />
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <div className="h-6 bg-secondary/50 rounded-full w-20" />
        <div className="h-6 bg-secondary/50 rounded-full w-24" />
      </div>
    </div>
  );
}

function ContributorCard({ contributor, index }: { contributor: Contributor; index: number }) {
  const displayName = contributor.name || contributor.login;
  const blogUrl =
    contributor.blog && contributor.blog.startsWith('http')
      ? contributor.blog
      : contributor.blog
        ? `https://${contributor.blog}`
        : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative bg-card hover:bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-border hover:border-purple-400/40 transition-all duration-300 shadow-lg hover:shadow-purple-500/10"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 pointer-events-none" />

      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full ring-2 ring-border group-hover:ring-purple-400/50 transition-all duration-300 overflow-hidden">
            <Image
              src={contributor.avatar_url}
              alt={displayName}
              width={64}
              height={64}
              className="rounded-full object-cover"
              unoptimized
            />
          </div>
          {/* Contribution badge */}
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
            <span className="text-[10px] font-bold text-white">
              {contributor.contributions > 99 ? '99+' : contributor.contributions}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-foreground truncate">{displayName}</h3>
            {contributor.name && (
              <span className="text-xs text-muted-foreground truncate">@{contributor.login}</span>
            )}
          </div>

          {contributor.location && (
            <div className="flex items-center gap-1 mt-1 text-muted-foreground text-xs">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{contributor.location}</span>
            </div>
          )}

          {contributor.bio && (
            <p className="text-muted-foreground text-xs leading-relaxed mt-2 line-clamp-2">
              {contributor.bio}
            </p>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-4 flex flex-wrap gap-2">
        <StatChip icon={<GitCommit className="w-3 h-3" />} label={`${contributor.contributions} commits`} color="purple" />
        <StatChip icon={<BookOpen className="w-3 h-3" />} label={`${contributor.public_repos} repos`} color="blue" />
        <StatChip icon={<Users className="w-3 h-3" />} label={`${contributor.followers} followers`} color="pink" />
      </div>

      {/* Links */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <a
          href={contributor.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary text-foreground text-xs font-medium transition-all duration-200 group/link"
          aria-label={`GitHub profile of ${displayName}`}
        >
          <Github className="w-3.5 h-3.5" />
          <span>GitHub</span>
          <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
        </a>

        {blogUrl && (
          <a
            href={blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary text-foreground text-xs font-medium transition-all duration-200 group/link"
            aria-label={`Website of ${displayName}`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Website</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
        )}

        {contributor.twitter_username && (
          <a
            href={`https://twitter.com/${contributor.twitter_username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-sky-500/30 text-foreground text-xs font-medium transition-all duration-200 group/link"
            aria-label={`Twitter profile of ${displayName}`}
          >
            <Twitter className="w-3.5 h-3.5" />
            <span>Twitter</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

function StatChip({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color: 'purple' | 'blue' | 'pink';
}) {
  const colors = {
    purple: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-500/20',
    blue: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-500/20',
    pink: 'bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-300 border-pink-200 dark:border-pink-500/20',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border ${colors[color]}`}>
      {icon}
      {label}
    </span>
  );
}

export default function ContributorsPage() {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [filtered, setFiltered] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'contributions' | 'name' | 'followers'>('contributions');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchContributors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/contributors');
      if (!res.ok) throw new Error('Failed to fetch contributors');
      const data = await res.json();
      setContributors(data.contributors);
      setFiltered(data.contributors);
      setLastUpdated(new Date());
    } catch (err) {
      setError((err as Error).message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributors();
  }, []);

  // Filter + sort whenever deps change
  useEffect(() => {
    let result = [...contributors];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.login.toLowerCase().includes(q) ||
          (c.name?.toLowerCase() ?? '').includes(q) ||
          (c.bio?.toLowerCase() ?? '').includes(q) ||
          (c.location?.toLowerCase() ?? '').includes(q)
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'contributions') return b.contributions - a.contributions;
      if (sortBy === 'followers') return b.followers - a.followers;
      const nameA = (a.name || a.login).toLowerCase();
      const nameB = (b.name || b.login).toLowerCase();
      return nameA.localeCompare(nameB);
    });

    setFiltered(result);
  }, [search, sortBy, contributors]);

  const totalCommits = contributors.reduce((sum, c) => sum + c.contributions, 0);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground font-sans">
      <FloatingBackground />

      <main id="main" className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <ThemeToggle />
          </div>

          <div className="text-center">
            {/* Icon cluster */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Star className="w-3 h-3 text-white fill-white" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4"
            >
              Our Contributors
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              InnerHue is built by an incredible open-source community. Every commit, issue, and
              pull request makes a difference — thank you all. 💜
            </motion.p>

            {/* Repo link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-5"
            >
              <a
                href="https://github.com/Nitya-003/InnerHue"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/50 hover:bg-secondary border border-border hover:border-border text-foreground text-sm font-medium transition-all duration-200"
              >
                <Github className="w-4 h-4" />
                Nitya-003/InnerHue
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </motion.div>
          </div>
        </motion.header>

        {/* Stats banner */}
        {!loading && !error && contributors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10"
          >
            {[
              {
                icon: <Users className="w-5 h-5 text-purple-400" />,
                value: contributors.length,
                label: 'Contributors',
                gradient: 'from-purple-500/20 to-purple-600/10',
                border: 'border-purple-500/20',
              },
              {
                icon: <GitCommit className="w-5 h-5 text-pink-400" />,
                value: totalCommits.toLocaleString(),
                label: 'Total Commits',
                gradient: 'from-pink-500/20 to-pink-600/10',
                border: 'border-pink-500/20',
              },
              {
                icon: <Star className="w-5 h-5 text-yellow-400" />,
                value: 'Open Source',
                label: 'MIT Licensed',
                gradient: 'from-yellow-500/20 to-yellow-600/10',
                border: 'border-yellow-500/20',
                className: 'col-span-2 md:col-span-1',
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${stat.gradient} backdrop-blur-md rounded-2xl p-5 border ${stat.border} ${stat.className ?? ''}`}
              >
                <div className="flex items-center gap-2 mb-1">{stat.icon}</div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Search + Sort controls */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search contributors…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-secondary/30 border border-border focus:border-purple-400/50 text-foreground placeholder-muted-foreground text-sm outline-none transition-all duration-200 focus:bg-secondary/50 focus:shadow-lg focus:shadow-purple-500/10"
              />
            </div>

            {/* Sort */}
            <div className="flex gap-2 flex-wrap">
              {(['contributions', 'name', 'followers'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSortBy(opt)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${sortBy === opt
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-secondary/50 border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={fetchContributors}
              title="Refresh"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border text-muted-foreground hover:text-foreground hover:bg-secondary text-sm transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </motion.div>
        )}

        {/* Result count */}
        {!loading && !error && search && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground mb-4"
          >
            Showing {filtered.length} of {contributors.length} contributors
          </motion.p>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <ContributorCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Failed to load contributors</h3>
            <p className="text-muted-foreground mb-6 text-sm max-w-sm mx-auto">{error}</p>
            <button
              onClick={fetchContributors}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/30"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>
          </motion.div>
        )}

        {/* Empty search state */}
        {!loading && !error && filtered.length === 0 && search && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground text-lg">No contributors found for &ldquo;{search}&rdquo;</p>
            <button
              onClick={() => setSearch('')}
              className="mt-4 text-purple-400 hover:text-purple-300 text-sm underline underline-offset-4"
            >
              Clear search
            </button>
          </motion.div>
        )}

        {/* Contributors grid */}
        {!loading && !error && filtered.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={sortBy + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              {filtered.map((contributor, i) => (
                <ContributorCard key={contributor.id} contributor={contributor} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Footer note */}
        {!loading && !error && contributors.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-14 text-muted-foreground/60 text-sm"
          >
            {lastUpdated && (
              <p>Last updated: {lastUpdated.toLocaleTimeString()}</p>
            )}
            <p className="mt-2">
              Want to contribute?{' '}
              <a
                href="https://github.com/Nitya-003/InnerHue/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline underline-offset-4 transition-colors"
              >
                Read the contributing guide
              </a>
              .
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
