# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-11-22

### 🎯 Tree-Shaking & Modular Architecture

#### Added

- **Modular i18n Structure**: i18n module restructured into modular architecture
  - Separate file for each language (`lib/i18n/locales/{lang}.ts`)
  - Tree-shakeable language imports
  - Separate entry points for each language (`/i18n/{lang}`)
- **Modular Security Structure**: Security utilities restructured into modular architecture
  - `lib/security/sanitize.ts` - Sanitization functions
  - `lib/security/validation.ts` - Validation functions
  - `lib/security/rate-limiter.ts` - Rate limiting
  - `lib/security/csp.ts` - CSP directives
- **Tree-shakeable Exports**: All utility functions made tree-shakeable

#### Changed

- **i18n Import Paths**: Tree-shakeable import paths added
  - `import { defaultTranslations } from 'tanstack-shadcn-table/i18n/en'`
  - `import { turkishTranslations } from 'tanstack-shadcn-table/i18n/tr'`
  - Backward compatibility maintained (old imports still work)
- **Security Import Paths**: Tree-shakeable import paths added
  - `import { sanitizeSearchInput } from 'tanstack-shadcn-table/security/sanitize'`
  - Backward compatibility maintained
- **Rollup Configuration**: Separate build entry points added for i18n languages
  - CJS and ESM bundles for each language
  - Tree-shaking optimization
- **DataTable Component**: Lazy loading optimizations
  - FilterInput, ColumnVisibility, Pagination are lazy loaded
  - DnD wrapper conditional loading
- **Import Statements**: All internal imports made tree-shakeable
  - `debounced-input.tsx` - Tree-shakeable security import
  - `filter-input.tsx` - Tree-shakeable security import
  - `faceted-filter.tsx` - Tree-shakeable security import

#### Improved

- **Bundle Size**: Smaller bundle size when using i18n
  - Only the used language is included in the bundle
  - Each language ~1KB (gzipped)
- **Code Splitting**: Better code splitting
  - i18n languages as separate chunks
  - Lazy loaded components
- **Developer Experience**: Better import options
  - Tree-shakeable imports recommended
  - Backward compatibility maintained
  - JSDoc comments added

#### Technical Details

- **i18n Bundle Sizes**:
  - English: 0.8KB (gzipped)
  - Turkish: 1.0KB (gzipped)
  - Spanish: 1.0KB (gzipped)
  - French: 1.0KB (gzipped)
  - German: 1.0KB (gzipped)
- **Security Module Structure**: Tree-shaking improved with modular structure
- **Build Output**: Separate CJS and ESM bundles for each language

#### Migration Guide

**Using tree-shakeable imports (recommended):**

```ts
// ✅ Tree-shakeable - only English is included in bundle
import { defaultTranslations } from "tanstack-shadcn-table/i18n/en";

// ✅ Tree-shakeable - only Turkish is included in bundle
import { turkishTranslations } from "tanstack-shadcn-table/i18n/tr";

// ✅ Tree-shakeable - only sanitizeSearchInput is included in bundle
import { sanitizeSearchInput } from "tanstack-shadcn-table/security/sanitize";
```

**Backward compatibility (still works):**

```ts
// ⚠️ Imports all languages (not tree-shakeable)
import {
  defaultTranslations,
  turkishTranslations,
} from "tanstack-shadcn-table";

// ⚠️ Imports all security utilities (not tree-shakeable)
import { sanitizeSearchInput } from "tanstack-shadcn-table";
```

#### Performance Impact

- **Bundle Size**: 80-90% reduction when using i18n (only the used language is loaded)
- **Initial Load**: Faster initial load (lazy loaded components)
- **Tree Shaking**: More effective dead code elimination
- **Code Splitting**: Better chunk management

## [1.0.1] - 2025-08-07

### 🚀 Major Bundle Size Optimization

#### Added

- **Bundle Size Analyzer**: Added `rollup-plugin-visualizer` for bundle analysis
- **Production Build Script**: Added `build:prod` script for optimized production builds
- **CSS Nano Integration**: Added CSS minification and optimization
- **Tree Shaking Configuration**: Enhanced tree shaking for better dead code elimination

#### Changed

- **Bundle Size Reduction**: Reduced bundle size by **55%** (from 216KB to 96KB)
- **Peer Dependencies Strategy**: Moved major dependencies to peer dependencies:
  - `@radix-ui/react-checkbox`
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-select`
  - `@radix-ui/react-slot`
  - `@tanstack/react-table`
  - `@tanstack/match-sorter-utils`
  - `class-variance-authority`
  - `clsx`
  - `lucide-react`
  - `tailwind-merge`
- **Rollup Configuration**: Enhanced build optimization:
  - Disabled source maps in production
  - Added aggressive Terser compression
  - Improved tree shaking settings
  - Added external dependencies configuration
- **Package.json Optimization**:
  - Added `sideEffects: false` for better tree shaking
  - Removed duplicate dependency declarations
  - Reorganized dependencies structure

#### Fixed

- **DND Kit Import Issues**: Fixed conditional import problems causing runtime errors
- **TypeScript Errors**: Resolved DragEndEvent type import issues
- **Build Warnings**: Cleaned up build process warnings

#### Technical Details

- **Source Map Removal**: Eliminated ~968KB of source map files in production
- **Terser Optimization**: Added multiple compression passes and unsafe optimizations
- **CSS Optimization**: Implemented CSS Nano with aggressive minification
- **External Dependencies**: Properly configured external dependencies to prevent bundling

#### Migration Guide

Users need to install peer dependencies manually:

```bash
npm install @radix-ui/react-checkbox @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-slot @tanstack/react-table @tanstack/match-sorter-utils class-variance-authority clsx lucide-react react react-dom tailwind-merge
```

#### Performance Impact

- **Bundle Size**: 55% reduction (216KB → 96KB)
- **Load Time**: Significantly faster initial load
- **Tree Shaking**: Better dead code elimination
- **Memory Usage**: Reduced memory footprint

## [1.0.0] - 2025-06-01

### 🎉 Initial Release

#### Added

- **Core DataTable Component**: Full-featured React table with TanStack Table v8
- **Advanced Filtering**: Text, range, select, boolean, and custom filters
- **Sorting & Pagination**: Multi-column sorting and flexible pagination
- **Column Management**: Reordering, resizing, and visibility controls
- **Row Selection**: Single and multi-row selection capabilities
- **Global Search**: Fuzzy search across all columns
- **Lazy Loading**: Server-side data loading support
- **Security Features**: XSS protection, input sanitization, rate limiting
- **Internationalization**: Support for 5 languages (EN, TR, ES, FR, DE)
- **TypeScript Support**: Full type safety and IntelliSense
- **Responsive Design**: Mobile-friendly table layout
- **Customizable Styling**: Tailwind CSS integration with shadcn/ui components

#### Features

- Drag & drop column reordering with DND Kit
- Interactive column resizing with visual handles
- Comprehensive filter system with multiple types
- Advanced pagination with customizable layouts
- Built-in security utilities and validation
- Accessibility features and ARIA support
- Performance optimizations for large datasets
- Custom component override capabilities

#### Documentation

- Comprehensive API documentation
- Multiple usage examples and patterns
- Security best practices guide
- Internationalization setup guide
- Performance optimization tips
