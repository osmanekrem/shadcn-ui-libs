/**
 * Security utilities - Tree-shakeable exports
 * 
 * Import only what you need:
 * 
 * @example
 * // ✅ Tree-shakeable - only imports sanitizeSearchInput
 * import { sanitizeSearchInput } from 'tanstack-shadcn-table/security/sanitize';
 * 
 * // ❌ Imports all security utilities
 * import { sanitizeSearchInput } from 'tanstack-shadcn-table/lib/security';
 */

// Core sanitization functions (most commonly used)
export { sanitizeSearchInput } from './sanitize';
export { sanitizeFilterValue } from './sanitize';
export { sanitizeHtml } from './sanitize';

// Validation functions
export { validatePaginationParams } from './validation';
export { validateSortingParams } from './validation';
export { validateFileUpload } from './validation';

// Rate limiting
export { RateLimiter } from './rate-limiter';

// CSP helpers (rarely used, tree-shakeable)
export { CSP_DIRECTIVES } from './csp';

// Re-export all for convenience (not tree-shakeable)
export * from './sanitize';
export * from './validation';
export * from './rate-limiter';
export * from './csp';

