"use client";

import {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  lazy,
  ComponentType,
  Suspense,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  FilterFn,
  SortingFn,
  Header,
  Table,
} from "@tanstack/react-table";
import type {
  Column,
  ColumnDef,
  TableOptions,
  PaginationOptions,
} from "../types/types";
import type { TableTranslations } from "../lib/i18n";
import { cn, getValue } from "../lib/utils";
import { RankingInfo } from "@tanstack/match-sorter-utils";
import DebouncedInput from "../ui-elements/debounced-input";
import {
  Table as DefaultTable,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { fuzzyFilter, fuzzySort, useExternalState } from "./actions";

// Type definitions for lazy components
type FilterInputProps<T> = {
  column: Column<T>;
  translations?: TableTranslations;
};

type ColumnVisibilityProps = {
  table: Table<any>;
  label?: string;
};

type PaginationContentProps<T> = {
  table: Table<T>;
  pagination: PaginationOptions;
  translations?: TableTranslations;
  t: (key: string, params?: Record<string, any>) => string;
};

// Lazy load optional features for better code splitting
const FilterInputLazy = lazy(() =>
  import("./filter-input.js").then((module) => ({
    default: module.default as unknown as ComponentType<FilterInputProps<any>>,
  }))
);
const ColumnVisibilityLazy = lazy(() =>
  import("./column-visibility.js").then((module) => ({
    default: module.default as unknown as ComponentType<ColumnVisibilityProps>,
  }))
);

// Pagination content component (lazy loaded)
const PaginationContentLazy = lazy(() =>
  import("./pagination.js").then((module) => ({
    default: ({
      table,
      pagination,
      translations,
      t,
    }: PaginationContentProps<any>) => {
      const Pagination = module.default;
      const GoToPage = module.GoToPage;
      const PageSize = module.PageSize;

      return (
        <div className="flex items-center justify-between py-4">
          <div className="flex flex-wrap items-center justify-between gap-4 px-2 text-sm">
            {(
              pagination.layout || ["total", "pageSize", "goto", "buttons"]
            ).map((item: string) => {
              switch (item) {
                case "total":
                  return (
                    <span key="total">
                      {(
                        pagination.totalLabel ||
                        t("pagination.totalRecords", {
                          total: table.getFilteredRowModel().rows.length,
                        })
                      )?.replace(
                        "{total}",
                        String(table.getFilteredRowModel().rows.length)
                      )}
                    </span>
                  );
                case "pageSize":
                  return (
                    !!pagination.pageSizeOptions && (
                      <PageSize
                        key="pageSize"
                        pagination={pagination}
                        onSetPageSize={(size: number) => {
                          table.setPageSize(size);
                        }}
                        pageSize={table.getState().pagination.pageSize}
                        label={pagination.pageSizeLabel}
                        translations={translations}
                      />
                    )
                  );
                case "goto":
                  return (
                    <GoToPage
                      key="goto"
                      label={pagination.goToPageLabel}
                      currentPage={table.getState().pagination.pageIndex}
                      onSetPage={(pageIndex: number) =>
                        table.setPageIndex(pageIndex)
                      }
                      totalPages={table.getPageCount()}
                      translations={translations}
                    />
                  );
                case "buttons":
                  const PaginationComponent =
                    Pagination as React.ComponentType<any>;
                  return (
                    <PaginationComponent
                      key="buttons"
                      canNextPage={table.getCanNextPage()}
                      canPreviousPage={table.getCanPreviousPage()}
                      currentPage={table.getState().pagination.pageIndex}
                      onNext={() => table.nextPage()}
                      onPrevious={() => table.previousPage()}
                      onSetPage={(pageIndex: number) =>
                        table.setPageIndex(pageIndex)
                      }
                      totalPages={table.getPageCount()}
                      className={pagination.className}
                      maxVisiblePages={pagination.maxVisiblePages}
                      mode={pagination.mode}
                      translations={translations}
                    />
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      );
    },
  }))
);

// Conditional imports for @dnd-kit - only loaded when reorderable is true
import {
  DraggableHeaderLazy,
  DraggableTableCellLazy,
} from "./draggable-header-lazy";
import {
  DndWrapper,
  SortableContextWrapper,
  SensorsCreatorLazy,
  lazyLoadDndUtilities,
} from "./dnd-wrapper";
import { Checkbox } from "../components/ui/checkbox";
import React from "react";
// Import only used security utilities for better tree-shaking
import { sanitizeSearchInput } from "../lib/security/sanitize";
import {
  validatePaginationParams,
  validateSortingParams,
} from "../lib/security/validation";
import { RateLimiter } from "../lib/security/rate-limiter";
import { defaultTranslations, createTranslator } from "../lib/i18n";
import { Button } from "../components/ui/button";

type DraggableFilterCellProps<TData> = {
  readonly header: Header<TData, unknown>;
  readonly colClassName?: string;
  readonly TableHeadComponent: React.ElementType;
  readonly translations?: TableTranslations;
  readonly isTableDragging?: boolean;
};

// Inner component that always calls hooks for filter cells
function DraggableFilterCellWithHooks<TData>({
  header,
  colClassName = "",
  TableHeadComponent,
  translations,
  isTableDragging = false,
  useSortableHook,
  CSSUtil,
}: DraggableFilterCellProps<TData> & {
  useSortableHook: any;
  CSSUtil: any;
}) {
  // Always call hooks - they're guaranteed to be available here
  const { isDragging, setNodeRef, transform } = useSortableHook({
    id: header.column.id,
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSSUtil.Translate.toString(transform),
    transition:
      isDragging || isTableDragging ? "none" : "transform 0.05s ease-out",
    zIndex: isDragging ? 1 : 0,
    width: header.getSize(),
    minWidth: header.column.columnDef.minSize || 100,
    maxWidth: header.column.columnDef.maxSize || "none",
  };

  return (
    <TableHeadComponent
      key={header.column.id}
      colSpan={header.colSpan}
      ref={setNodeRef}
      style={style}
      className={cn(
        (header.column.columnDef as ColumnDef<TData>).headerClassName,
        (header.column.columnDef as ColumnDef<TData>).className,
        colClassName
      )}
    >
      <div className="w-full">
        {flexRender(
          !header.isPlaceholder && header.column.getCanFilter() ? (
            <Suspense fallback={<div className="h-9 w-full" />}>
              <FilterInputLazy
                column={header.column as unknown as Column<any>}
                translations={translations}
              />
            </Suspense>
          ) : null,
          header.getContext()
        )}
      </div>
    </TableHeadComponent>
  );
}

// DraggableFilterCell component for filter row
function DraggableFilterCell<TData>({
  header,
  colClassName = "",
  TableHeadComponent,
  translations,
  isTableDragging = false,
  reorderable = false,
}: DraggableFilterCellProps<TData> & { reorderable?: boolean }) {
  const [useSortableFn, setUseSortableFn] = React.useState<any>(null);
  const [CSSFn, setCSSFn] = React.useState<any>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (reorderable && !isLoaded) {
      Promise.all([
        import("@dnd-kit/sortable").then((mod) => mod.useSortable),
        import("@dnd-kit/utilities").then((mod) => mod.CSS),
      ]).then(([useSortableFn, CSSUtil]) => {
        setUseSortableFn(() => useSortableFn);
        setCSSFn(() => CSSUtil);
        setIsLoaded(true);
      });
    }
  }, [reorderable, isLoaded]);

  // If reorderable and loaded, use hook-using component
  if (reorderable && isLoaded && useSortableFn && CSSFn) {
    return (
      <DraggableFilterCellWithHooks
        header={header}
        colClassName={colClassName}
        TableHeadComponent={TableHeadComponent}
        translations={translations}
        isTableDragging={isTableDragging}
        useSortableHook={useSortableFn}
        CSSUtil={CSSFn}
      />
    );
  }

  // Non-draggable version (fallback or when reorderable is false)
  return (
    <TableHeadComponent
      key={header.column.id}
      colSpan={header.colSpan}
      style={{
        width: header.getSize(),
        minWidth: header.column.columnDef.minSize || 100,
        maxWidth: header.column.columnDef.maxSize || "none",
      }}
      className={cn(
        (header.column.columnDef as ColumnDef<TData>).headerClassName,
        (header.column.columnDef as ColumnDef<TData>).className,
        colClassName
      )}
    >
      <div className="w-full">
        {flexRender(
          !header.isPlaceholder && header.column.getCanFilter() ? (
            <Suspense fallback={<div className="h-9 w-full" />}>
              <FilterInputLazy
                column={header.column as Column<TData>}
                translations={translations}
              />
            </Suspense>
          ) : null,
          header.getContext()
        )}
      </div>
    </TableHeadComponent>
  );
}

declare module "@tanstack/react-table" {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }

  interface SortingFns {
    fuzzy: SortingFn<unknown>;
  }
}

/**
 * Props for the DataTable component
 *
 * @template TData - The type of data in each row
 *
 * @example
 * ```tsx
 * <DataTable
 *   tableOptions={{
 *     data: users,
 *     columns: userColumns,
 *     pagination: { pageSize: 10, totalRecords: 100 },
 *   }}
 *   className="my-table"
 * />
 * ```
 */
export type DataTableProps<TData> = {
  /** Main configuration object for the table */
  readonly tableOptions: TableOptions<TData>;
  /** Additional CSS classes for the table container */
  readonly className?: string;

  /** Custom table component (default: shadcn Table) */
  readonly TableComponent?: React.ElementType;
  /** Custom table header component */
  readonly TableHeaderComponent?: React.ElementType;
  /** Custom table row component */
  readonly TableRowComponent?: React.ElementType;
  /** Custom table cell component */
  readonly TableCellComponent?: React.ElementType;
  /** Custom table head component */
  readonly TableHeadComponent?: React.ElementType;
  /** Custom table body component */
  readonly TableBodyComponent?: React.ElementType;
  /** Custom table footer component */
  readonly TableFooterComponent?: React.ElementType;
};

/**
 * A powerful, feature-rich React table component built on top of TanStack Table v8 with shadcn/ui styling.
 *
 * Features:
 * - Advanced filtering (text, range, select, boolean, custom)
 * - Multi-column sorting with fuzzy search support
 * - Flexible pagination with customizable layouts
 * - Column reordering (drag & drop)
 * - Column resizing with interactive drag handles
 * - Row selection (single and multi-row)
 * - Global search with fuzzy matching
 * - Lazy loading for server-side data
 * - Column visibility controls
 * - Internationalization support (5 languages)
 * - Built-in security features (XSS protection, input sanitization)
 *
 * @template TData - The type of data in each row
 *
 * @param props - DataTable component props
 * @param props.tableOptions - Main configuration object for the table
 * @param props.className - Additional CSS classes for the table container
 * @param props.TableComponent - Custom table component (default: shadcn Table)
 * @param props.TableHeaderComponent - Custom table header component
 * @param props.TableRowComponent - Custom table row component
 * @param props.TableCellComponent - Custom table cell component
 * @param props.TableHeadComponent - Custom table head component
 * @param props.TableBodyComponent - Custom table body component
 * @param props.TableFooterComponent - Custom table footer component
 *
 * @returns The rendered DataTable component
 *
 * @example
 * ```tsx
 * import { DataTable, ColumnDef } from "tanstack-shadcn-table";
 *
 * type Person = {
 *   firstName: string;
 *   lastName: string;
 *   age: number;
 * };
 *
 * const columns: ColumnDef<Person>[] = [
 *   {
 *     accessorKey: "firstName",
 *     header: "First Name",
 *     filter: {
 *       type: "text",
 *       field: "firstName",
 *       placeholder: "Search...",
 *     },
 *   },
 *   {
 *     accessorKey: "age",
 *     header: "Age",
 *     filter: {
 *       type: "range",
 *       field: "age",
 *     },
 *   },
 * ];
 *
 * function App() {
 *   return (
 *     <DataTable
 *       tableOptions={{
 *         data: people,
 *         columns,
 *         pagination: {
 *           pageSize: 10,
 *           totalRecords: people.length,
 *         },
 *       }}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With lazy loading
 * <DataTable
 *   tableOptions={{
 *     data,
 *     columns,
 *     lazy: true,
 *     onLazyLoad: async (event) => {
 *       const result = await fetchData({
 *         page: event.page,
 *         pageSize: event.rows,
 *         filters: event.filters,
 *         sorting: event.sorting,
 *       });
 *       setData(result.data);
 *     },
 *     pagination: {
 *       pageSize: 20,
 *       totalRecords: 1000,
 *     },
 *   }}
 * />
 * ```
 */
export function DataTable<TData>({
  tableOptions,
  className = "",
  TableComponent = DefaultTable,
  TableHeaderComponent = TableHeader,
  TableHeadComponent = TableHead,
  TableRowComponent = TableRow,
  TableCellComponent = TableCell,
  TableBodyComponent = TableBody,
  TableFooterComponent = TableFooter,
}: DataTableProps<TData>) {
  // Validation
  if (!tableOptions.data || !Array.isArray(tableOptions.data)) {
    console.warn("DataTable: data should be an array");
    return <div>No data provided</div>;
  }

  if (!tableOptions.columns || !Array.isArray(tableOptions.columns)) {
    console.warn("DataTable: columns should be an array");
    return <div>No columns provided</div>;
  }

  // Security: Limit data size to prevent DoS
  if (tableOptions.data.length > 100000) {
    console.warn(
      "DataTable: Large dataset detected, consider using lazy loading"
    );
  }

  // Rate limiter for lazy loading
  const rateLimiter = useMemo(() => new RateLimiter(10, 1000), []); // 10 requests per second

  // Create translator function
  const t = useMemo(() => {
    const translations = tableOptions.translations || defaultTranslations;
    return createTranslator(translations);
  }, [tableOptions.translations]);

  const columns = useMemo(() => {
    return [
      ...(tableOptions.rowSelection
        ? [
            {
              id: "selection",
              header: ({ table }) => (
                <Checkbox
                  checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                  }
                  onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                  }
                  aria-label={t("selection.selectAll")}
                />
              ),
              className: "!w-8 flex-none",
              cell: ({ row }) => (
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => {
                    row.toggleSelected(!!value);
                  }}
                  aria-label={t("selection.selectRow")}
                />
              ),
              enableSorting: false,
              enableHiding: false,
              enableResizing: false,
              reorderable: false,
              size: 40,
              minSize: 40,
              maxSize: 40,
            } as ColumnDef<TData>,
          ]
        : []),
      ...(tableOptions.columns || []),
    ];
  }, [tableOptions.columns, tableOptions.rowSelection, t]);
  const data = useMemo(() => tableOptions.data, [tableOptions.data]);

  const filterFn: FilterFn<any> = useCallback((row, columnId, filterValue) => {
    if (!filterValue) return true;

    const column = table.getColumn(columnId);
    const columnDef = column?.columnDef as ColumnDef<TData>;

    if (!columnDef) return true;

    const filter = columnDef.filter;

    if (!filter) return true;

    const value = getValue(row.original, filter.field, null);

    if (value === null) return true;

    if (Array.isArray(filterValue)) {
      // Check if it's a range filter (array of two numbers)
      if (
        filterValue.length === 2 &&
        (typeof filterValue[0] === "number" ||
          filterValue[0] === null ||
          filterValue[0] === "") &&
        (typeof filterValue[1] === "number" ||
          filterValue[1] === null ||
          filterValue[1] === "")
      ) {
        const [min, max] = filterValue;
        const numValue = Number(value);
        if (min !== null && min !== "" && numValue < min) return false;
        if (max !== null && max !== "" && numValue > max) return false;
        return true;
      }
      // Otherwise, treat as multi-select filter (array of strings)
      if (filterValue.length === 0) return true;
      const stringValue = String(value);
      return filterValue.includes(stringValue);
    }

    if (typeof filterValue === "string") {
      if (filterValue === "") return true;

      if (filter?.type === "boolean") {
        return String(value) === filterValue;
      }

      if (filter?.type === "select") {
        return value === filterValue;
      }

      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    }

    return true;
  }, []);

  const [columnFilters, onColumnFiltersChange] = useExternalState(
    tableOptions.columnFilters,
    tableOptions.onColumnFiltersChange,
    []
  );

  const [sorting, onSortingChange] = useExternalState(
    tableOptions.sorting,
    tableOptions.onSortingChange,
    []
  );

  const [pagination, onPaginationChange] = useExternalState(
    tableOptions.paginationState,
    tableOptions.onPaginationChange,
    {
      pageIndex: 0,
      pageSize: tableOptions.pagination?.pageSize || 10,
    }
  );

  const [columnVisibility, onColumnVisibilityChange] = useExternalState(
    tableOptions.columnVisibility,
    tableOptions.onColumnVisibilityChange,
    {}
  );

  const [columnOrder, onColumnOrderChange] = useExternalState(
    tableOptions.columnOrder,
    tableOptions.onColumnOrderChange,
    tableOptions.columns
      .map((col) => col.id!)
      .filter((id) => id !== "selection")
  );

  const [globalFilter, onGlobalFilterChange] = useExternalState(
    tableOptions.globalFilter?.globalFilter,
    tableOptions.globalFilter?.onGlobalFilterChange,
    ""
  );

  const [rowSelection, onRowSelectionChange] = useExternalState(
    tableOptions.rowSelection,
    tableOptions.onRowSelectionChange,
    {}
  );

  const [columnSizing, onColumnSizingChange] = useExternalState(
    tableOptions.columnSizing,
    tableOptions.onColumnSizingChange,
    {}
  );

  const [showFilter, setShowFilter] = useExternalState(
    tableOptions.showFilter,
    tableOptions.onShowFilterChange,
    false
  );

  // Track drag state to prevent animations during drag operations
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (tableOptions.lazy) {
      const { onLazyLoad } = tableOptions;
      if (onLazyLoad) {
        // Rate limiting check
        if (!rateLimiter.isAllowed("lazy-load")) {
          console.warn("Lazy load rate limit exceeded");
          return;
        }

        // Validate and sanitize parameters
        const validatedPagination = validatePaginationParams(
          pagination.pageIndex,
          pagination.pageSize
        );

        const validatedSorting = validateSortingParams(sorting);

        const sanitizedGlobalFilter =
          typeof globalFilter === "string"
            ? sanitizeSearchInput(globalFilter)
            : "";

        // Validate column filters
        const validatedFilters = columnFilters.map((filter) => ({
          ...filter,
          value:
            typeof filter.value === "string"
              ? sanitizeSearchInput(filter.value)
              : filter.value,
        }));

        onLazyLoad({
          first: validatedPagination.pageIndex * validatedPagination.pageSize,
          rows: validatedPagination.pageSize,
          filters: validatedFilters,
          globalFilter: sanitizedGlobalFilter,
          page: validatedPagination.pageIndex,
          sorting: validatedSorting,
        });
      }
    }
  }, [
    columnFilters,
    globalFilter,
    pagination,
    sorting,
    tableOptions.lazy,
    rateLimiter,
  ]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters: tableOptions.columnFilters ?? columnFilters,
      globalFilter,
      sorting,
      columnVisibility,
      columnOrder: tableOptions.rowSelection
        ? ["selection", ...columnOrder]
        : columnOrder,
      pagination,
      rowSelection,
      columnSizing,
    },
    rowCount: tableOptions.pagination?.totalRecords || data.length,
    manualPagination: !!tableOptions.lazy,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    sortingFns: {
      fuzzy: fuzzySort,
    },
    manualFiltering: tableOptions.lazy,
    manualSorting: tableOptions.lazy,
    globalFilterFn: "fuzzy",
    enableRowSelection: (row) => {
      if (tableOptions.enableRowSelectionFn) {
        return tableOptions.enableRowSelectionFn(row);
      }
      return tableOptions.rowSelection !== undefined;
    },
    // Column sizing configuration
    enableColumnResizing: tableOptions.enableColumnResizing ?? true,
    columnResizeMode: tableOptions.columnResizeMode ?? "onEnd",
    columnResizeDirection: tableOptions.columnResizeDirection ?? "ltr",
    defaultColumn: {
      filterFn: filterFn,
      size: 150,
      minSize: 20,
      maxSize: Number.MAX_SAFE_INTEGER,
      ...tableOptions.defaultColumn,
    },
    onGlobalFilterChange,
    onColumnFiltersChange,
    onSortingChange,
    onPaginationChange,
    onColumnVisibilityChange,
    onColumnOrderChange,
    onRowSelectionChange,
    onColumnSizingChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    initialState: {
      columnVisibility: tableOptions.columnVisibility ?? {},
      columnFilters: tableOptions.columnFilters ?? [],
      sorting: tableOptions.sorting ?? [],
      globalFilter: "",
      columnSizing: tableOptions.columnSizing ?? {},
    },
  });

  // Check if reorderable is enabled
  const isReorderable = tableOptions.reorderable ?? false;

  // Memoize sortable items to ensure consistency (only needed if reorderable)
  const sortableItems = useMemo(() => {
    if (!isReorderable) return [];
    const tableColumnOrder = table.getState().columnOrder || [];
    const nonSelectionColumns = tableColumnOrder.filter(
      (id) => id !== "selection"
    );
    return nonSelectionColumns;
  }, [table.getState().columnOrder, isReorderable]);

  // Lazy load DND utilities only if reorderable
  const [dndUtilities, setDndUtilities] = React.useState<{
    closestCenter: any;
    restrictToHorizontalAxis: any;
    arrayMove: any;
    horizontalListSortingStrategy: any;
  } | null>(null);
  const [isDndLoaded, setIsDndLoaded] = React.useState(!isReorderable);

  React.useEffect(() => {
    if (isReorderable && !isDndLoaded) {
      lazyLoadDndUtilities().then((utils) => {
        setDndUtilities(utils);
        setIsDndLoaded(true);
      });
    }
  }, [isReorderable, isDndLoaded]);

  // Store sensors state - will be set by SensorsCreator component
  const [sensors, setSensors] = React.useState<any[]>([]);

  // Memoize the callback to avoid recreating it on every render
  const handleSensorsReady = useCallback((newSensors: any[]) => {
    setSensors(newSensors);
  }, []);

  const handleDragEnd = useCallback(
    (event: any) => {
      if (!dndUtilities) return;

      const { active, over } = event;
      setIsDragging(false);

      if (active && over && active.id !== over.id) {
        if (active.id === "selection") return;

        const currentColumnOrder = table.getState().columnOrder || [];
        const nonSelectionColumns = currentColumnOrder.filter(
          (id) => id !== "selection"
        );

        const oldIndex = nonSelectionColumns.indexOf(active.id as string);
        const newIndex = nonSelectionColumns.indexOf(over.id as string);

        if (oldIndex === -1 || newIndex === -1) {
          console.warn("Invalid indices", { oldIndex, newIndex });
          return;
        }

        const reorderedArray = dndUtilities.arrayMove(
          nonSelectionColumns,
          oldIndex,
          newIndex
        );

        onColumnOrderChange(reorderedArray);
      }
    },
    [onColumnOrderChange, table, dndUtilities]
  );

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  // Add ref for table container
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Render table content (with or without DND wrapper)
  const tableContent = (
    <div className={`opal-datatable flex flex-col gap-2 ${className}`}>
      <div className="flex flex-row gap-2 justify-between">
        <div className="flex flex-row gap-2">
          {tableOptions.globalFilter?.show && (
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => {
                const sanitizedValue =
                  typeof value === "string"
                    ? sanitizeSearchInput(value)
                    : String(value);
                table.setGlobalFilter(sanitizedValue);
              }}
              className=""
              placeholder={t("filters.searchAllColumns")}
              maxLength={500}
              type="search"
            />
          )}
          {tableOptions.filter && tableOptions.showFilterButton && (
            <Button onClick={() => setShowFilter(!showFilter)}>
              {showFilter ? t("filters.hideFilter") : t("filters.showFilter")}
            </Button>
          )}
        </div>
        <div className="flex flex-row gap-2">
          {tableOptions.columnVisibility && (
            <Suspense fallback={<div className="h-9 w-9" />}>
              <ColumnVisibilityLazy table={table} />
            </Suspense>
          )}
        </div>
      </div>
      <div className="flex flex-col" ref={tableContainerRef}>
        {isReorderable && isDndLoaded && dndUtilities ? (
          <SortableContextWrapper
            items={sortableItems}
            strategy={dndUtilities.horizontalListSortingStrategy}
          >
            <TableComponent>
              <TableHeaderComponent>
                {table.getHeaderGroups().map((headerGroup) => (
                  <>
                    <TableRowComponent
                      key={"header_" + headerGroup.id}
                      className={cn(tableOptions.rowClassName)}
                    >
                      {headerGroup.headers.map((header) => {
                        return (
                          <DraggableHeaderLazy
                            header={header}
                            colClassName={tableOptions.colClassName}
                            TableHeadComponent={TableHeadComponent}
                            key={header.column.id}
                            reorderable={
                              header.column.id === "selection"
                                ? false
                                : isReorderable
                            }
                            enableColumnResizing={
                              tableOptions.enableColumnResizing
                            }
                          />
                        );
                      })}
                    </TableRowComponent>
                  </>
                ))}

                {showFilter && (
                  <TableRowComponent
                    className={cn(
                      tableOptions.filterRowClassName,
                      tableOptions.rowClassName
                    )}
                  >
                    {table.getHeaderGroups().map((headerGroup) =>
                      headerGroup.headers.map((header) => {
                        // Render selection column filter
                        if (header.column.id === "selection") {
                          return (
                            <TableHeadComponent
                              key={header.column.id}
                              colSpan={header.colSpan}
                              style={{
                                width: header.getSize(),
                                minWidth:
                                  header.column.columnDef.minSize || 100,
                                maxWidth:
                                  header.column.columnDef.maxSize || "none",
                              }}
                              className={cn(
                                (header.column.columnDef as ColumnDef<TData>)
                                  .headerClassName,
                                (header.column.columnDef as ColumnDef<TData>)
                                  .className,
                                tableOptions.colClassName
                              )}
                            >
                              <div className="w-full">
                                {flexRender(
                                  header.isPlaceholder ? null : header.column.getCanFilter() ? (
                                    <Suspense
                                      fallback={<div className="h-9 w-full" />}
                                    >
                                      <FilterInputLazy
                                        column={header.column as Column<TData>}
                                        translations={tableOptions.translations}
                                      />
                                    </Suspense>
                                  ) : null,
                                  header.getContext()
                                )}
                              </div>
                            </TableHeadComponent>
                          );
                        }

                        return (
                          <DraggableFilterCell<TData>
                            header={header}
                            colClassName={tableOptions.colClassName}
                            TableHeadComponent={TableHeadComponent}
                            translations={tableOptions.translations}
                            isTableDragging={isDragging}
                            reorderable={isReorderable}
                            key={header.column.id}
                          />
                        );
                      })
                    )}
                  </TableRowComponent>
                )}
              </TableHeaderComponent>
              <TableBodyComponent>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <TableRowComponent
                      key={row.id}
                      className={tableOptions.filterRowClassName}
                    >
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <DraggableTableCellLazy<TData>
                            cell={cell}
                            colClassName={tableOptions.colClassName}
                            TableCellComponent={TableCellComponent}
                            reorderable={isReorderable}
                            key={cell.column.id}
                          />
                        );
                      })}
                    </TableRowComponent>
                  );
                })}
              </TableBodyComponent>
              {table
                .getAllLeafColumns()
                .some(
                  (col) =>
                    (col.columnDef as ColumnDef<TData>)?.footer !== undefined
                ) && (
                <TableFooterComponent>
                  {table.getFooterGroups().map((footerGroup) => {
                    if (
                      !footerGroup.headers.some(
                        (header) =>
                          (header.column.columnDef as ColumnDef<TData>)?.footer
                      )
                    ) {
                      return null;
                    }
                    return (
                      <TableRowComponent key={footerGroup.id}>
                        {footerGroup.headers.map((header) => (
                          <TableHeadComponent
                            key={header.id}
                            colSpan={header.colSpan}
                            style={{ width: `${header.getSize()}px` }}
                            className={cn(
                              (header.column.columnDef as ColumnDef<TData>)
                                ?.footerClassName,
                              (header.column.columnDef as ColumnDef<TData>)
                                .className,
                              tableOptions.colClassName
                            )}
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.footer,
                                  header.getContext()
                                )}
                          </TableHeadComponent>
                        ))}
                      </TableRowComponent>
                    );
                  })}
                </TableFooterComponent>
              )}
            </TableComponent>
          </SortableContextWrapper>
        ) : (
          <TableComponent>
            <TableHeaderComponent>
              {table.getHeaderGroups().map((headerGroup) => (
                <>
                  <TableRowComponent
                    key={"header_" + headerGroup.id}
                    className={cn(tableOptions.rowClassName)}
                  >
                    {headerGroup.headers.map((header) => {
                      return (
                        <DraggableHeaderLazy
                          header={header}
                          colClassName={tableOptions.colClassName}
                          TableHeadComponent={TableHeadComponent}
                          key={header.column.id}
                          reorderable={false}
                          enableColumnResizing={
                            tableOptions.enableColumnResizing
                          }
                        />
                      );
                    })}
                  </TableRowComponent>
                </>
              ))}

              {showFilter && (
                <TableRowComponent
                  className={cn(
                    tableOptions.filterRowClassName,
                    tableOptions.rowClassName
                  )}
                >
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.map((header) => {
                      if (header.column.id === "selection") {
                        return (
                          <TableHeadComponent
                            key={header.column.id}
                            colSpan={header.colSpan}
                            style={{
                              width: header.getSize(),
                              minWidth: header.column.columnDef.minSize || 100,
                              maxWidth:
                                header.column.columnDef.maxSize || "none",
                            }}
                            className={cn(
                              (header.column.columnDef as ColumnDef<TData>)
                                .headerClassName,
                              (header.column.columnDef as ColumnDef<TData>)
                                .className,
                              tableOptions.colClassName
                            )}
                          >
                            <div className="w-full">
                              {flexRender(
                                header.isPlaceholder ? null : header.column.getCanFilter() ? (
                                  <Suspense
                                    fallback={<div className="h-9 w-full" />}
                                  >
                                    <FilterInputLazy
                                      column={header.column as Column<TData>}
                                      translations={tableOptions.translations}
                                    />
                                  </Suspense>
                                ) : null,
                                header.getContext()
                              )}
                            </div>
                          </TableHeadComponent>
                        );
                      }

                      return (
                        <DraggableFilterCell<TData>
                          header={header}
                          colClassName={tableOptions.colClassName}
                          TableHeadComponent={TableHeadComponent}
                          translations={tableOptions.translations}
                          isTableDragging={false}
                          reorderable={false}
                          key={header.column.id}
                        />
                      );
                    })
                  )}
                </TableRowComponent>
              )}
            </TableHeaderComponent>
            <TableBodyComponent>
              {table.getRowModel().rows.map((row) => {
                return (
                  <TableRowComponent
                    key={row.id}
                    className={tableOptions.filterRowClassName}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <DraggableTableCellLazy<TData>
                          cell={cell}
                          colClassName={tableOptions.colClassName}
                          TableCellComponent={TableCellComponent}
                          reorderable={false}
                          key={cell.column.id}
                        />
                      );
                    })}
                  </TableRowComponent>
                );
              })}
            </TableBodyComponent>
            {table
              .getAllLeafColumns()
              .some(
                (col) =>
                  (col.columnDef as ColumnDef<TData>)?.footer !== undefined
              ) && (
              <TableFooterComponent>
                {table.getFooterGroups().map((footerGroup) => {
                  if (
                    !footerGroup.headers.some(
                      (header) =>
                        (header.column.columnDef as ColumnDef<TData>)?.footer
                    )
                  ) {
                    return null;
                  }
                  return (
                    <TableRowComponent key={footerGroup.id}>
                      {footerGroup.headers.map((header) => (
                        <TableHeadComponent
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{ width: `${header.getSize()}px` }}
                          className={cn(
                            (header.column.columnDef as ColumnDef<TData>)
                              ?.footerClassName,
                            (header.column.columnDef as ColumnDef<TData>)
                              .className,
                            tableOptions.colClassName
                          )}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.footer,
                                header.getContext()
                              )}
                        </TableHeadComponent>
                      ))}
                    </TableRowComponent>
                  );
                })}
              </TableFooterComponent>
            )}
          </TableComponent>
        )}
        {tableOptions.pagination && (
          <Suspense
            fallback={
              <div className="flex items-center justify-between py-4">
                <div className="h-9 w-full" />
              </div>
            }
          >
            <PaginationContentLazy
              table={table}
              pagination={tableOptions.pagination}
              translations={tableOptions.translations}
              t={t}
            />
          </Suspense>
        )}
      </div>
    </div>
  );

  // Wrap with DndContext only if reorderable is enabled and loaded
  if (isReorderable && isDndLoaded && dndUtilities) {
    return (
      <>
        {/* Create sensors using hooks in component body */}
        {isDndLoaded && (
          <Suspense fallback={null}>
            <SensorsCreatorLazy onSensorsReady={handleSensorsReady} />
          </Suspense>
        )}
        {/* Render DND wrapper when sensors are ready */}
        {sensors.length > 0 ? (
          <DndWrapper
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            sensors={sensors}
            collisionDetection={dndUtilities.closestCenter}
            modifiers={[dndUtilities.restrictToHorizontalAxis]}
          >
            {tableContent}
          </DndWrapper>
        ) : (
          tableContent
        )}
      </>
    );
  }

  // Otherwise, render without DND wrapper
  return tableContent;
}

export default DataTable;
export { fuzzyFilter, fuzzySort };
