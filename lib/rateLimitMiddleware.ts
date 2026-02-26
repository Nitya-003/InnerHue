import { NextRequest, NextResponse } from 'next/server';
import RateLimiter, { RateLimiterConfig } from './rateLimiter';

/**
 * Creates middleware that applies rate limiting to API routes
 * @param config Configuration for the rate limiter
 * @returns Middleware function to use in API routes
 */
export function createRateLimitMiddleware(config: RateLimiterConfig) {
  const limiter = new RateLimiter(config);

  return async function rateLimitMiddleware(
    req: NextRequest,
    next: () => Promise<NextResponse>
  ): Promise<NextResponse> {
    const result = await limiter.isAllowed(req);

    if (!result.allowed) {
      const response = NextResponse.json(
        {
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${Math.ceil(
            (result.resetTime - Date.now()) / 1000
          )} seconds`,
          retryAfter: result.resetTime,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(result.resetTime),
          },
        }
      );

      return response;
    }

    const response = await next();

    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Limit', String(result.limit));
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', String(result.resetTime));

    return response;
  };
}

/**
 * Higher-order function to wrap API route handlers with rate limiting
 * @param handler The API route handler function
 * @param config Configuration for the rate limiter
 * @returns Wrapped handler with rate limiting
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: RateLimiterConfig
) {
  const limiter = new RateLimiter(config);

  return async function ratedHandler(req: NextRequest): Promise<NextResponse> {
    const result = await limiter.isAllowed(req);

    if (!result.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${Math.ceil(
            (result.resetTime - Date.now()) / 1000
          )} seconds`,
          retryAfter: result.resetTime,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(result.resetTime),
          },
        }
      );
    }

    try {
      const response = await handler(req);

      // Add rate limit headers to response
      response.headers.set('X-RateLimit-Limit', String(result.limit));
      response.headers.set('X-RateLimit-Remaining', String(result.remaining));
      response.headers.set('X-RateLimit-Reset', String(result.resetTime));

      return response;
    } catch (error) {
      // Even errors should include rate limit headers
      const errorResponse = NextResponse.json(
        {
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );

      errorResponse.headers.set('X-RateLimit-Limit', String(result.limit));
      errorResponse.headers.set('X-RateLimit-Remaining', String(result.remaining));
      errorResponse.headers.set('X-RateLimit-Reset', String(result.resetTime));

      return errorResponse;
    }
  };
}
