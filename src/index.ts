// Styles
import "./styles/globals.css";

// Main Components
export {
  DataTable,
  fuzzyFilter,
  fuzzySort,
} from "./components/custom/datatable";

// Utility Components
export { default as DebouncedInput } from "./components/custom/debounced-input";
export { default as FilterInput } from "./components/custom/filter-input";
export { default as ColumnResizeHandle } from "./components/custom/column-resize-handle";

// Security Utilities
export {
  sanitizeHtml,
  sanitizeSearchInput,
  sanitizeFilterValue,
  validatePaginationParams,
  validateSortingParams,
  validateFileUpload,
  RateLimiter,
  CSP_DIRECTIVES,
} from "./lib/security";

// Internationalization
export {
  defaultTranslations,
  turkishTranslations,
  spanishTranslations,
  frenchTranslations,
  germanTranslations,
  availableLanguages,
  createTranslator,
  t,
  interpolate,
} from "./lib/i18n";
export type { TableTranslations, SupportedLanguage } from "./lib/i18n";

// Types
export type {
  Column,
  ColumnDef,
  FilterType,
  TableOptions,
  PaginationOptions,
  LazyLoadEvent,
  SortingState,
} from "./types/types";

// Utils
export { cn, getValue } from "./lib/utils";
