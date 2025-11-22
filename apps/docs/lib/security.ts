export function sanitizeHtml(input: string): string {
  if (typeof input !== "string") return "";

  return (
    input
      // Remove script tags
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      // Remove javascript: URLs
      .replace(/javascript:/gi, "")
      // Remove on* event handlers
      .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "")
      // Remove data: URLs (except safe ones)
      .replace(/data:(?!image\/(png|jpe?g|gif|svg\+xml))[^;]*;/gi, "")
      // Remove style attributes that could contain expressions
      .replace(/style\s*=\s*["'][^"']*expression\s*\([^"']*["']/gi, "")
  );
}

/**
 * Sanitizes search input to prevent injection attacks
 */
export function sanitizeSearchInput(input: string): string {
  if (typeof input !== "string") return "";

  return (
    input
      // Remove SQL injection patterns
      .replace(/['";\\]/g, "")
      // Remove potential script injections
      .replace(/<[^>]*>/g, "")
      // Limit length to prevent DoS
      .slice(0, 1000)
      .trim()
  );
}

/**
 * Validates and sanitizes column filter values
 */
export function sanitizeFilterValue(value: any, filterType: string): any {
  if (value === null || value === undefined) return value;

  switch (filterType) {
    case "text":
    case "custom":
      return typeof value === "string" ? sanitizeSearchInput(value) : "";

    case "select":
    case "multi-select":
      if (Array.isArray(value)) {
        return value.map((v) =>
          typeof v === "string" ? sanitizeSearchInput(v) : ""
        );
      }
      return typeof value === "string" ? sanitizeSearchInput(value) : "";

    case "range":
      if (Array.isArray(value)) {
        return value.map((v) => {
          const num = Number(v);
          return isNaN(num) ? null : Math.max(-1000000, Math.min(1000000, num));
        });
      }
      const num = Number(value);
      return isNaN(num) ? null : Math.max(-1000000, Math.min(1000000, num));

    case "boolean":
      return typeof value === "boolean" ? value : Boolean(value);

    case "date":
    case "date-range":
      if (Array.isArray(value)) {
        return value.map((v) => {
          const date = new Date(v);
          return isNaN(date.getTime())
            ? null
            : date.toISOString().split("T")[0];
        });
      }
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0];

    default:
      return typeof value === "string" ? sanitizeSearchInput(value) : value;
  }
}

/**
 * Validates pagination parameters to prevent abuse
 */
export function validatePaginationParams(
  pageIndex: number,
  pageSize: number
): {
  pageIndex: number;
  pageSize: number;
} {
  const safePageIndex = Math.max(
    0,
    Math.min(10000, Math.floor(Number(pageIndex) || 0))
  );
  const safePageSize = Math.max(
    1,
    Math.min(1000, Math.floor(Number(pageSize) || 10))
  );

  return {
    pageIndex: safePageIndex,
    pageSize: safePageSize,
  };
}

/**
 * Validates sorting parameters
 */
export function validateSortingParams(sorting: any[]): any[] {
  if (!Array.isArray(sorting)) return [];

  return sorting
    .slice(0, 10) // Limit number of sort columns
    .map((sort) => {
      if (!sort || typeof sort !== "object") return null;

      const id =
        typeof sort.id === "string" ? sanitizeSearchInput(sort.id) : "";
      const desc = Boolean(sort.desc);

      return id ? { id, desc } : null;
    })
    .filter(Boolean);
}

/**
 * Rate limiting utility for preventing abuse
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

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

  reset(identifier?: string): void {
    if (identifier) {
      this.requests.delete(identifier);
    } else {
      this.requests.clear();
    }
  }
}

/**
 * Content Security Policy helpers
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

/**
 * Validates file uploads (if used in custom cells)
 */
export function validateFileUpload(file: File): {
  isValid: boolean;
  error?: string;
} {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File size exceeds 10MB limit",
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "File type not allowed",
    };
  }

  return { isValid: true };
}
