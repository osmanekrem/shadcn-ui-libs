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
} from "@tanstack/react-table";
import FilterInput from "../filter-input";
import { Column, ColumnDef, TableOptions } from "../../../types/types";
import { cn, getValue } from "../../../lib/utils";
import { RankingInfo } from "@tanstack/match-sorter-utils";
import DebouncedInput from "../debounced-input";
import "../../../styles/globals.css";
import {
  Table as DefaultTable,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { fuzzyFilter, fuzzySort, useExternalState } from "./actions";
import ColumnVisibility from "../column-visibility";
import Pagination, { GoToPage, PageSize } from "../pagination";

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableHeader, DraggableTableCell } from "../draggable-header";
import { Checkbox } from "../../ui/checkbox";
import React from "react";
import {
  sanitizeSearchInput,
  validatePaginationParams,
  validateSortingParams,
  RateLimiter,
} from "../../../lib/security";
import { defaultTranslations, createTranslator } from "../../../lib/i18n";
import { Button } from "../../ui/button";

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
  tableOptions: TableOptions<TData>;
  className?: string;

  TableComponent?: React.ElementType;
  TableHeaderComponent?: React.ElementType;
  TableRowComponent?: React.ElementType;
  TableCellComponent?: React.ElementType;
  TableHeadComponent?: React.ElementType;
  TableBodyComponent?: React.ElementType;
  TableFooterComponent?: React.ElementType;
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
              className: "!w-8 flex-none order-[-1]",
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
      const [min, max] = filterValue;
      const numValue = Number(value);
      if (min !== null && min !== "" && numValue < min) return false;
      if (max !== null && max !== "" && numValue > max) return false;
      return true;
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
    tableOptions.columns.map((col) => col.id!)
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
      columnOrder,
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

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (active && over && active.id !== over.id) {
        onColumnOrderChange((columnOrder) => {
          const oldIndex = columnOrder.indexOf(active.id as string);
          const newIndex = columnOrder.indexOf(over.id as string);
          return arrayMove(columnOrder, oldIndex, newIndex);
        });
      }
    },
    [onColumnOrderChange]
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  // Add ref for table container
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [tableWidth, setTableWidth] = useState<number>(0);

  // Calculate column widths for CSS variables (performance optimization)
  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};

    // Calculate total column width and minimum widths
    let totalColumnWidth = 0;
    let totalMinWidth = 0;
    const columnData: Array<{
      header: any;
      currentSize: number;
      minSize: number;
    }> = [];

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      const currentSize = header.getSize();
      const minSize = header.column.columnDef.minSize || 20;

      columnData.push({ header, currentSize, minSize });
      totalColumnWidth += currentSize;
      totalMinWidth += minSize;
    }

    // Check if we should fill table width (default to true)
    const shouldFillTableWidth = tableOptions.fillTableWidth !== false;

    // If table width is available and total column width is less than table width,
    // distribute the extra space proportionally while respecting minimum widths
    if (
      shouldFillTableWidth &&
      tableWidth > 0 &&
      totalColumnWidth < tableWidth &&
      totalMinWidth <= tableWidth
    ) {
      const extraSpace = tableWidth - totalColumnWidth;
      const distributableSpace = tableWidth - totalMinWidth;

      for (const { header, currentSize, minSize } of columnData) {
        // Calculate proportional distribution of extra space
        const proportion =
          (currentSize - minSize) / (totalColumnWidth - totalMinWidth);
        const additionalSpace =
          distributableSpace > 0 ? distributableSpace * proportion : 0;
        const adjustedSize = Math.max(
          minSize,
          Math.floor(minSize + additionalSpace)
        );

        colSizes[`--header-${header.id}-size`] = adjustedSize;
        colSizes[`--col-${header.column.id}-size`] = adjustedSize;
      }
    } else {
      // Use original sizes if no adjustment needed
      for (const { header, currentSize } of columnData) {
        colSizes[`--header-${header.id}-size`] = currentSize;
        colSizes[`--col-${header.column.id}-size`] = currentSize;
      }
    }

    return colSizes;
  }, [
    table.getState().columnSizingInfo,
    table.getState().columnSizing,
    tableWidth,
    tableOptions.fillTableWidth,
  ]);

  // Add resize observer to track table width
  useEffect(() => {
    if (!tableContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setTableWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(tableContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div
        className={`opal-datatable flex flex-col gap-2 ${className}`}
        style={columnSizeVars}
      >
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
          <TableComponent style={{ tableLayout: "fixed", width: "100%" }}>
            <TableHeaderComponent>
              {table.getHeaderGroups().map((headerGroup) => (
                <>
                  <TableRowComponent
                    key={"header_" + headerGroup.id}
                    className={cn(tableOptions.rowClassName)}
                  >
                    <SortableContext
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      {headerGroup.headers.map((header) => {
                        return (
                          <DraggableHeader
                            header={header}
                            colClassName={tableOptions.colClassName}
                            TableHeadComponent={TableHeadComponent}
                            key={header.id}
                            reorderable={tableOptions.reorderable}
                            enableColumnResizing={
                              tableOptions.enableColumnResizing
                            }
                          />
                        );
                      })}
                    </SortableContext>
                  </TableRowComponent>
                </>
              ))}

              {showFilter && (
                <TableRowComponent className={tableOptions.filterRowClassName}>
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.map((header) => {
                      return (
                        <TableHeadComponent
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{ width: `${header.getSize()}px` }}
                        >
                          {header.isPlaceholder ? null : header.column.getCanFilter() ? (
                            <div className="flex w-full py-1 justify-start items-center">
                              <FilterInput
                                column={header.column as Column<TData>}
                                translations={tableOptions.translations}
                              />
                            </div>
                          ) : null}
                        </TableHeadComponent>
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
                        <SortableContext
                          key={cell.id}
                          items={columnOrder}
                          strategy={horizontalListSortingStrategy}
                        >
                          <DraggableTableCell<TData>
                            cell={cell}
                            colClassName={tableOptions.colClassName}
                            TableCellComponent={TableCellComponent}
                            key={cell.id}
                          />
                        </SortableContext>
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
