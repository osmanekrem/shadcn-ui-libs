/**
 * English translations
 */

import type { TableTranslations } from "../types";

export const defaultTranslations: TableTranslations = {
  pagination: {
    previous: "Previous",
    next: "Next",
    first: "First",
    last: "Last",
    page: "Page",
    of: "of",
    rowsPerPage: "Rows per page",
    goToPage: "Go to page",
    totalRecords: "Total: {total} records",
    showingXtoYofZ: "Showing {from} to {to} of {total} entries",
    noData: "No data available",
  },

  filters: {
    search: "Search",
    searchAllColumns: "Search all columns...",
    showFilter: "Show Filter",
    hideFilter: "Hide Filter",
    clearFilter: "Clear filter",
    clearAllFilters: "Clear all filters",
    filterBy: "Filter by {column}",
    all: "All",
    true: "True",
    false: "False",
    min: "Min",
    max: "Max",
    from: "From",
    to: "To",
    selectOption: "Select option",
    noOptionsFound: "No options found",
  },

  sorting: {
    sortAscending: "Sort ascending",
    sortDescending: "Sort descending",
    clearSort: "Clear sort",
    sortBy: "Sort by {column}",
  },

  columns: {
    hide: "Hide",
    show: "Show",
    toggleVisibility: "Toggle column visibility",
    resetColumns: "Reset columns",
    reorderColumns: "Reorder columns",
    resizeColumn: "Resize column",
  },

  selection: {
    selectAll: "Select all",
    selectRow: "Select row",
    deselectAll: "Deselect all",
    selectedCount: "{count} selected",
    selectAllOnPage: "Select all on this page",
    selectAllRows: "Select all rows",
  },

  status: {
    loading: "Loading...",
    error: "An error occurred",
    noResults: "No results found",
    retry: "Retry",
    loadMore: "Load more",
  },

  security: {
    rateLimitExceeded: "Rate limit exceeded. Please try again later.",
    invalidInput: "Invalid input detected",
    fileSizeExceeded: "File size exceeds limit",
    fileTypeNotAllowed: "File type not allowed",
    inputTooLong: "Input is too long",
  },

  accessibility: {
    sortColumn: "Sort column {column}",
    filterColumn: "Filter column {column}",
    selectAllRows: "Select all rows",
    selectRow: "Select row {row}",
    columnHeader: "Column header {column}",
    tableCaption: "Data table with {rows} rows and {columns} columns",
    resizeHandle: "Resize column {column}",
    dragHandle: "Drag to reorder column {column}",
  },
};

