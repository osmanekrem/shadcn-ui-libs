/**
 * Rate limiting utility class for preventing abuse and DoS attacks.
 * Tracks requests per identifier within a time window.
 * 
 * @example
 * ```tsx
 * import { RateLimiter } from 'tanstack-shadcn-table/security/rate-limiter';
 * 
 * // Create a rate limiter: 100 requests per minute
 * const limiter = new RateLimiter(100, 60000);
 * 
 * // Check if request is allowed
 * if (limiter.isAllowed('user-123')) {
 *   // Process request
 * } else {
 *   // Rate limit exceeded
 * }
 * 
 * // Reset rate limit for specific identifier
 * limiter.reset('user-123');
 * 
 * // Reset all rate limits
 * limiter.reset();
 * ```
 * 
 * @public
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  /**
   * Creates a new RateLimiter instance.
   * 
   * @param maxRequests - Maximum number of requests allowed in the time window (default: 100)
   * @param windowMs - Time window in milliseconds (default: 60000 = 1 minute)
   */
  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Checks if a request is allowed for the given identifier.
   * Automatically tracks the request if allowed.
   * 
   * @param identifier - Unique identifier for the requester (e.g., user ID, IP address)
   * @returns `true` if the request is allowed, `false` if rate limit is exceeded
   * 
   * @example
   * ```tsx
   * const limiter = new RateLimiter(10, 1000); // 10 requests per second
   * 
   * if (limiter.isAllowed('user-123')) {
   *   // Process request
   * } else {
   *   console.warn('Rate limit exceeded');
   * }
   * ```
   */
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];

    // Remove old requests outside the window
    const validRequests = requests.filter((time) => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(identifier, validRequests);

    return true;
  }

  /**
   * Resets rate limit tracking for a specific identifier or all identifiers.
   * 
   * @param identifier - Optional identifier to reset. If not provided, resets all.
   * 
   * @example
   * ```tsx
   * const limiter = new RateLimiter(10, 1000);
   * 
   * // Reset specific user
   * limiter.reset('user-123');
   * 
   * // Reset all users
   * limiter.reset();
   * ```
   */
  reset(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }
}

