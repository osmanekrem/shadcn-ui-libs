"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
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
} from "@tanstack/react-table";
import FilterInput from '@/components/custom/filter-input';
import { Column, ColumnDef, TableOptions } from '@/types/types';
import { cn, getValue } from '@/lib/utils';
import { RankingInfo } from "@tanstack/match-sorter-utils";
import DebouncedInput from '@/components/custom/debounced-input';
import {
  Table as DefaultTable,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fuzzyFilter, fuzzySort, useExternalState } from '@/components/custom/datatable/actions';
import ColumnVisibility from '@/components/custom/column-visibility';
import Pagination, { GoToPage, PageSize } from '@/components/custom/pagination';

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { DraggableHeader, DraggableTableCell } from '@/components/custom/draggable-header';
import { Checkbox } from '@/components/ui/checkbox';
import React from "react";
import {
  sanitizeSearchInput,
  validatePaginationParams,
  validateSortingParams,
  RateLimiter,
} from '@/lib/security';
import {
  defaultTranslations,
  createTranslator,
  TableTranslations,
} from '@/lib/i18n';
import { Button } from '@/components/ui/button';

type DraggableFilterCellProps<TData> = {
  readonly header: Header<TData, unknown>;
  readonly colClassName?: string;
  readonly TableHeadComponent: React.ElementType;
  readonly translations?: TableTranslations;
  readonly isTableDragging?: boolean;
};

// DraggableFilterCell component for filter row
function DraggableFilterCell<TData>({
  header,
  colClassName = "",
  TableHeadComponent,
  translations,
  isTableDragging = false,
}: DraggableFilterCellProps<TData>) {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: header.column.id,
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform),
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
            <FilterInput
              column={header.column as Column<TData>}
              translations={translations}
            />
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

export type DataTableProps<TData> = {
  readonly tableOptions: TableOptions<TData>;
  readonly className?: string;

  readonly TableComponent?: React.ElementType;
  readonly TableHeaderComponent?: React.ElementType;
  readonly TableRowComponent?: React.ElementType;
  readonly TableCellComponent?: React.ElementType;
  readonly TableHeadComponent?: React.ElementType;
  readonly TableBodyComponent?: React.ElementType;
  readonly TableFooterComponent?: React.ElementType;
};

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

  // Memoize sortable items to ensure consistency
  const sortableItems = useMemo(() => {
    const tableColumnOrder = table.getState().columnOrder || [];
    const nonSelectionColumns = tableColumnOrder.filter(
      (id) => id !== "selection"
    );

    return nonSelectionColumns;
  }, [table.getState().columnOrder]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      // Reset drag state
      setIsDragging(false);

      if (active && over && active.id !== over.id) {
        // Prevent moving the selection column
        if (active.id === "selection") {
          return;
        }

        // Get current column order immediately
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

        // Calculate new order
        const reorderedArray = arrayMove(
          nonSelectionColumns,
          oldIndex,
          newIndex
        );

        // Update column order immediately
        onColumnOrderChange(reorderedArray);
      }
    },
    [onColumnOrderChange, table]
  );

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // Add ref for table container
  const tableContainerRef = useRef<HTMLDivElement>(null);

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
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
              <ColumnVisibility table={table} />
            )}
          </div>
        </div>
        <div className="flex flex-col" ref={tableContainerRef}>
          <SortableContext
            items={sortableItems}
            strategy={horizontalListSortingStrategy}
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
                          <DraggableHeader
                            header={header}
                            colClassName={tableOptions.colClassName}
                            TableHeadComponent={TableHeadComponent}
                            key={header.column.id}
                            reorderable={
                              header.column.id === "selection"
                                ? false
                                : tableOptions.reorderable
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
                                    <FilterInput
                                      column={header.column as Column<TData>}
                                      translations={tableOptions.translations}
                                    />
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
                          <DraggableTableCell<TData>
                            cell={cell}
                            colClassName={tableOptions.colClassName}
                            TableCellComponent={TableCellComponent}
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
          </SortableContext>
          {tableOptions.pagination && (
            <div className="flex items-center justify-between py-4">
              <div className="flex flex-wrap items-center justify-between gap-4 px-2 text-sm">
                {(
                  tableOptions.pagination.layout || [
                    "total",
                    "pageSize",
                    "goto",
                    "buttons",
                  ]
                ).map((item) => {
                  switch (item) {
                    case "total":
                      return (
                        <span key="total">
                          {(
                            tableOptions.pagination!.totalLabel ||
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
                        !!tableOptions.pagination!.pageSizeOptions && (
                          <PageSize
                            pagination={tableOptions.pagination!}
                            onSetPageSize={(size: number) => {
                              table.setPageSize(size);
                            }}
                            pageSize={table.getState().pagination.pageSize}
                            label={tableOptions.pagination!.pageSizeLabel}
                            translations={tableOptions.translations}
                          />
                        )
                      );

                    case "goto":
                      return (
                        <GoToPage
                          label={tableOptions.pagination!.goToPageLabel}
                          currentPage={table.getState().pagination.pageIndex}
                          onSetPage={(pageIndex: number) =>
                            table.setPageIndex(pageIndex)
                          }
                          totalPages={table.getPageCount()}
                          translations={tableOptions.translations}
                        />
                      );
                    case "buttons":
                      return (
                        <Pagination
                          canNextPage={table.getCanNextPage()}
                          canPreviousPage={table.getCanPreviousPage()}
                          currentPage={table.getState().pagination.pageIndex}
                          onNext={() => table.nextPage()}
                          onPrevious={() => table.previousPage()}
                          onSetPage={(pageIndex: number) =>
                            table.setPageIndex(pageIndex)
                          }
                          totalPages={table.getPageCount()}
                          className={tableOptions.pagination!.className}
                          maxVisiblePages={
                            tableOptions.pagination!.maxVisiblePages
                          }
                          mode={tableOptions.pagination!.mode}
                          translations={tableOptions.translations}
                        />
                      );
                  }
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
}

export default DataTable;
export { fuzzyFilter, fuzzySort };
