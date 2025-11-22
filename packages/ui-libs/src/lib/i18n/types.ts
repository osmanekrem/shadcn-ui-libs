/**
 * Internationalization (i18n) types for the table library
 */

export interface TableTranslations {
  // Pagination
  pagination: {
    previous: string;
    next: string;
    first: string;
    last: string;
    page: string;
    of: string;
    rowsPerPage: string;
    goToPage: string;
    totalRecords: string;
    showingXtoYofZ: string; // "Showing {from} to {to} of {total} entries"
    noData: string;
  };

  // Filters
  filters: {
    search: string;
    searchAllColumns: string;
    showFilter: string;
    hideFilter: string;
    clearFilter: string;
    clearAllFilters: string;
    filterBy: string;
    all: string;
    true: string;
    false: string;
    min: string;
    max: string;
    from: string;
    to: string;
    selectOption: string;
    noOptionsFound: string;
    // Faceted filter
    selectedCount: string; // "{count} selected"
    clearFilters: string;
    noResultsFound: string;
  };

  // Sorting
  sorting: {
    sortAscending: string;
    sortDescending: string;
    clearSort: string;
    sortBy: string;
  };

  // Column management
  columns: {
    hide: string;
    show: string;
    toggleVisibility: string;
    resetColumns: string;
    reorderColumns: string;
    resizeColumn: string;
  };

  // Row selection
  selection: {
    selectAll: string;
    selectRow: string;
    deselectAll: string;
    selectedCount: string; // "{count} selected"
    selectAllOnPage: string;
    selectAllRows: string;
  };

  // Loading and errors
  status: {
    loading: string;
    error: string;
    noResults: string;
    retry: string;
    loadMore: string;
  };

  // Security
  security: {
    rateLimitExceeded: string;
    invalidInput: string;
    fileSizeExceeded: string;
    fileTypeNotAllowed: string;
    inputTooLong: string;
  };

  // Accessibility
  accessibility: {
    sortColumn: string;
    filterColumn: string;
    selectAllRows: string;
    selectRow: string;
    columnHeader: string;
    tableCaption: string;
    resizeHandle: string;
    dragHandle: string;
  };
}

export type SupportedLanguage = "en" | "tr" | "es" | "fr" | "de";

