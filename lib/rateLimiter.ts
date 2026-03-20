import LRUCache from "lru-cache";

export interface RateLimiterConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface RateLimiterOptions {
  maxRequests?: number;
  windowMs?: number;
  keyGenerator?: (req: Request) => string;
}

class RateLimiter {
  private cache: LRUCache<string, { count: number; resetTime: number }>;
  private maxRequests: number;
  private windowMs: number;
  private keyGenerator: (req: Request) => string;

  constructor(config: RateLimiterConfig) {
    this.maxRequests = config.maxRequests || 100;
    this.windowMs = config.windowMs || 15 * 60 * 1000; // 15 minutes default
    this.keyGenerator = config.keyGenerator || this.defaultKeyGenerator;

    // Initialize LRU cache with cleanup
    this.cache = new LRUCache({
      max: 10000, // Maximum number of keys to store
      ttl: this.windowMs + 1000, // Slightly longer than window to avoid edge cases
      updateAgeOnGet: true,
    });
  }

  private defaultKeyGenerator(req: Request): string {
    // Use IP address or user-agent as key
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    return `rate-limit:${ip}`;
  }

  async isAllowed(req: Request): Promise<{
    allowed: boolean;
    current: number;
    limit: number;
    remaining: number;
    resetTime: number;
  }> {
    const key = this.keyGenerator(req);
    const now = Date.now();

    let record = this.cache.get(key);

    // Create new record or reset if window expired
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + this.windowMs,
      };
    } else {
      record.count++;
    }

    this.cache.set(key, record);

    const allowed = record.count <= this.maxRequests;
    const remaining = Math.max(0, this.maxRequests - record.count);

    return {
      allowed,
      current: record.count,
      limit: this.maxRequests,
      remaining,
      resetTime: record.resetTime,
    };
  }

  reset(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.cache.max,
      limit: this.maxRequests,
      windowMs: this.windowMs,
    };
  }
}

// Pre-configured rate limiters for different endpoints
export const apiRateLimiters = {
  // Strict limit for chat/AI endpoints
  chat: new RateLimiter({
    maxRequests: 30,
    windowMs: 60 * 1000, // 1 minute
  }),

  // More lenient for public endpoints
  public: new RateLimiter({
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  }),

  // Standard for API endpoints
  api: new RateLimiter({
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minute
  }),

  // For authentication endpoints
  auth: new RateLimiter({
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  }),
};

export default RateLimiter;

