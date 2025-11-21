# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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