import { useEffect, useMemo, useState, useCallback } from "react";
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
import { ArrowDownUp, SortAsc, SortDesc } from "lucide-react";
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

  const [showFilter, setShowFilter] = useState<boolean>(false);

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
                  aria-label="Select all"
                />
              ),
              className: "!w-8 flex-none order-[-1]",
              cell: ({ row }) => (
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => {
                    row.toggleSelected(!!value);
                  }}
                  aria-label="Select row"
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
  }, [tableOptions.columns, tableOptions.rowSelection]);
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
    tableOptions.onColumnFiltersChange
  );

  const [sorting, onSortingChange] = useExternalState(
    tableOptions.sorting,
    tableOptions.onSortingChange
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
    tableOptions.onColumnVisibilityChange
  );

  const [columnOrder, onColumnOrderChange] = useExternalState(
    tableOptions.columnOrder,
    tableOptions.onColumnOrderChange,
    tableOptions.columns.map((col) => col.id!)
  );

  const [globalFilter, onGlobalFilterChange] = useExternalState(
    tableOptions.globalFilter?.globalFilter,
    tableOptions.globalFilter?.onGlobalFilterChange
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

  useEffect(() => {
    if (tableOptions.lazy) {
      const { onLazyLoad } = tableOptions;
      if (onLazyLoad) {
        onLazyLoad({
          first: pagination.pageIndex * pagination.pageSize,
          rows: pagination.pageSize,
          filters: columnFilters,
          globalFilter,
          page: pagination.pageIndex,
          sorting,
        });
      }
    }
  }, [columnFilters, globalFilter, pagination, sorting, tableOptions.lazy]);

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

  // Calculate column widths for CSS variables (performance optimization)
  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className={`opal-datatable ${className}`} style={columnSizeVars}>
        <div>
          {tableOptions.globalFilter?.show && (
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => {
                table.setGlobalFilter(value);
              }}
              className=""
              placeholder="Search all columns..."
            />
          )}
          {tableOptions.filter && (
            <button onClick={() => setShowFilter(!showFilter)}>
              {showFilter ? "Hide Filter" : "Show Filter"}
            </button>
          )}
        </div>
        <div className="flex flex-col">
          <TableComponent>
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
          <div className="flex items-center justify-between py-4">
            {tableOptions.pagination && (
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
                            "Total: {total}"
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
                        />
                      );
                  }
                })}
              </div>
            )}
          </div>
          <ColumnVisibility table={table} />
        </div>
      </div>
    </DndContext>
  );
}

export default DataTable;
export { fuzzyFilter, fuzzySort };
