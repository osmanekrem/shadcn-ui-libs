/**
 * Security utilities - Backward compatibility export
 * 
 * @deprecated Use tree-shakeable imports instead:
 * 
 * @example
 * // ✅ Tree-shakeable - only imports sanitizeSearchInput
 * import { sanitizeSearchInput } from 'tanstack-shadcn-table/lib/security/sanitize';
 * 
 * // ❌ Imports all security utilities (not tree-shakeable)
 * import { sanitizeSearchInput } from 'tanstack-shadcn-table/lib/security';
 * 
 * For backward compatibility, this file re-exports from the modular structure.
 */

// Re-export from modular structure for backward compatibility
export { sanitizeHtml, sanitizeSearchInput, sanitizeFilterValue } from './security/sanitize';
export { validatePaginationParams, validateSortingParams, validateFileUpload } from './security/validation';
export { RateLimiter } from './security/rate-limiter';
export { CSP_DIRECTIVES } from './security/csp';
