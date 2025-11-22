/**
 * Content Security Policy helpers
 * Tree-shakeable - import only what you need
 * 
 * @example
 * import { CSP_DIRECTIVES } from 'tanstack-shadcn-table/lib/security/csp';
 * const cspHeader = Object.entries(CSP_DIRECTIVES)
 *   .map(([key, value]) => `${key} ${value}`)
 *   .join("; ");
 */
export const CSP_DIRECTIVES = {
  "default-src": "'self'",
  "script-src": "'self' 'unsafe-inline'",
  "style-src": "'self' 'unsafe-inline'",
  "img-src": "'self' data: https:",
  "font-src": "'self' data:",
  "connect-src": "'self'",
  "frame-src": "'none'",
  "object-src": "'none'",
  "base-uri": "'self'",
  "form-action": "'self'",
} as const;

