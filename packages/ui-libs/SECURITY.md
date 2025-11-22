# 🔒 Security

The library includes comprehensive security measures to protect against common web vulnerabilities.

**💡 Tip:** For better tree-shaking and smaller bundle sizes, import security utilities directly from sub-modules (e.g., `tanstack-shadcn-table/security/sanitize`). See examples below.

## Built-in Security Features

### 🛡️ **XSS Protection**

All user inputs are automatically sanitized to prevent Cross-Site Scripting attacks:

```tsx
// ✅ Tree-shakeable imports (recommended)
import {
  sanitizeHtml,
  sanitizeSearchInput,
} from "tanstack-shadcn-table/security/sanitize";

// ⚠️ Alternative (imports all security utilities)
import { sanitizeHtml, sanitizeSearchInput } from "tanstack-shadcn-table";

// Automatic sanitization in all filter inputs
<DataTable
  tableOptions={{
    data,
    columns,
    globalFilter: {
      show: true, // Global search is automatically sanitized
    },
  }}
/>;
```

### 🚦 **Rate Limiting**

Built-in rate limiting prevents abuse and DoS attacks:

```tsx
// ✅ Tree-shakeable import (recommended)
import { RateLimiter } from "tanstack-shadcn-table/security/rate-limiter";

// ⚠️ Alternative (imports all security utilities)
import { RateLimiter } from "tanstack-shadcn-table";

// Custom rate limiter for API calls
const rateLimiter = new RateLimiter(100, 60000); // 100 requests per minute

const handleLazyLoad = (event) => {
  if (!rateLimiter.isAllowed("user-123")) {
    console.warn("Rate limit exceeded");
    return;
  }
  // Proceed with API call
};
```

### 🔍 **Input Validation**

All inputs are validated and sanitized:

```tsx
// Numeric inputs are bounded
const columns = [
  {
    accessorKey: "price",
    filter: {
      type: "range",
      field: "price",
      minLimit: 0, // Automatically enforced
      maxLimit: 1000000, // Prevents overflow
    },
  },
];
```

## Security Utilities

**💡 Tip:** For better tree-shaking, import security utilities directly from sub-modules:

```tsx
// ✅ Tree-shakeable - only imports sanitizeSearchInput
import { sanitizeSearchInput } from "tanstack-shadcn-table/security/sanitize";

// ✅ Tree-shakeable - only imports validation functions
import { validatePaginationParams } from "tanstack-shadcn-table/security/validation";

// ⚠️ Imports all security utilities (not tree-shakeable)
import { sanitizeSearchInput } from "tanstack-shadcn-table";
```

### **sanitizeHtml(input: string)**

Removes dangerous HTML content:

```tsx
// ✅ Tree-shakeable import (recommended)
import { sanitizeHtml } from "tanstack-shadcn-table/security/sanitize";

// ⚠️ Alternative (imports all security utilities)
import { sanitizeHtml } from "tanstack-shadcn-table";

const safeContent = sanitizeHtml('<script>alert("xss")</script>Hello');
// Result: "Hello"
```

### **sanitizeSearchInput(input: string)**

Sanitizes search and filter inputs:

```tsx
// ✅ Tree-shakeable import (recommended)
import { sanitizeSearchInput } from "tanstack-shadcn-table/security/sanitize";

// ⚠️ Alternative (imports all security utilities)
import { sanitizeSearchInput } from "tanstack-shadcn-table";

const safeSearch = sanitizeSearchInput('user"; DROP TABLE users; --');
// Result: "user DROP TABLE users "
```

### **validatePaginationParams(pageIndex, pageSize)**

Validates pagination to prevent abuse:

```tsx
// ✅ Tree-shakeable import (recommended)
import { validatePaginationParams } from "tanstack-shadcn-table/security/validation";

// ⚠️ Alternative (imports all security utilities)
import { validatePaginationParams } from "tanstack-shadcn-table";

const { pageIndex, pageSize } = validatePaginationParams(-1, 999999);
// Result: { pageIndex: 0, pageSize: 1000 } // Bounded values
```

### **validateFileUpload(file: File)**

Validates file uploads in custom cells:

```tsx
// ✅ Tree-shakeable import (recommended)
import { validateFileUpload } from "tanstack-shadcn-table/security/validation";

// ⚠️ Alternative (imports all security utilities)
import { validateFileUpload } from "tanstack-shadcn-table";

const CustomFileCell = ({ value }) => {
  const handleFileUpload = (file) => {
    const { isValid, error } = validateFileUpload(file);
    if (!isValid) {
      alert(error);
      return;
    }
    // Process safe file
  };
};
```

## Content Security Policy

Use the provided CSP directives for additional security:

```tsx
// ✅ Tree-shakeable import (recommended)
import { CSP_DIRECTIVES } from "tanstack-shadcn-table/security/csp";

// ⚠️ Alternative (imports all security utilities)
import { CSP_DIRECTIVES } from "tanstack-shadcn-table";

// In your HTML head or server configuration
const cspHeader = Object.entries(CSP_DIRECTIVES)
  .map(([key, value]) => `${key} ${value}`)
  .join("; ");

// Result: "default-src 'self'; script-src 'self' 'unsafe-inline'; ..."
```

## Security Best Practices

### 1. **Server-Side Validation**

Always validate data on the server:

```tsx
// ✅ Tree-shakeable import (recommended)
import { sanitizeSearchInput } from "tanstack-shadcn-table/security/sanitize";

// Client-side (additional layer)
const handleLazyLoad = (event) => {
  // Client-side sanitization
  const sanitizedFilters = event.filters.map((filter) => ({
    ...filter,
    value: sanitizeSearchInput(filter.value),
  }));

  // Send to server
  api.getData({ ...event, filters: sanitizedFilters });
};

// Server-side (primary validation)
app.post("/api/data", (req, res) => {
  // Always validate and sanitize on server
  const { filters, sorting, pagination } = validateRequest(req.body);
  // Process request
});
```

### 2. **Secure Custom Components**

Implement security in custom components:

```tsx
// ✅ Tree-shakeable import (recommended)
import { sanitizeHtml } from "tanstack-shadcn-table/security/sanitize";

const SecureCustomCell = ({ value }) => {
  // Sanitize any user-provided content
  const safeValue = sanitizeHtml(String(value));

  return (
    <div
      dangerouslySetInnerHTML={{ __html: safeValue }}
      // Only if you need HTML rendering
    />
  );
};
```

### 3. **Environment Configuration**

Configure security settings based on environment:

```tsx
const securityConfig = {
  development: {
    rateLimitRequests: 1000,
    maxDataSize: 100000,
  },
  production: {
    rateLimitRequests: 100,
    maxDataSize: 10000,
  },
};

<DataTable
  tableOptions={{
    data: data.slice(0, securityConfig[env].maxDataSize),
    // ... other options
  }}
/>;
```

### 4. **Audit and Monitoring**

Monitor for security events:

```tsx
const secureTable = (
  <DataTable
    tableOptions={{
      data,
      columns,
      onLazyLoad: (event) => {
        // Log security events
        console.log("Data request:", {
          timestamp: new Date().toISOString(),
          filters: event.filters.length,
          sorting: event.sorting.length,
          user: getCurrentUser().id,
        });

        handleLazyLoad(event);
      },
    }}
  />
);
```

## Security Checklist

- ✅ **Input Sanitization**: All inputs automatically sanitized
- ✅ **XSS Protection**: HTML content filtered
- ✅ **Rate Limiting**: Built-in request throttling
- ✅ **Input Validation**: Type and range validation
- ✅ **File Upload Security**: Safe file type validation
- ✅ **CSP Support**: Content Security Policy helpers
- ⚠️ **Server Validation**: Implement on your backend
- ⚠️ **Authentication**: Implement user authentication
- ⚠️ **Authorization**: Implement data access controls

