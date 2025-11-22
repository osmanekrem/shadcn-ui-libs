"use client";

import React, { Suspense, lazy } from "react";
import { flexRender, Header } from "@tanstack/react-table";
import { TableCell, TableHead } from "../../ui/table";
import { ColumnDef } from "../../../types/types";
import { ArrowDownUp, MenuIcon, SortAsc, SortDesc } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { Cell } from "@tanstack/react-table";
import ColumnResizeHandle from "../column-resize-handle";

// Lazy load useSortable hook
const useSortableLazy = lazy(() =>
  import("@dnd-kit/sortable").then((mod) => ({
    default: mod.useSortable,
  }))
);

const CSSLazy = lazy(() =>
  import("@dnd-kit/utilities").then((mod) => ({
    default: mod.CSS,
  }))
);

type DraggableHeaderProps<T> = {
  header: Header<T, unknown>;
  colClassName?: string;
  TableHeadComponent?: React.ElementType;
  reorderable?: boolean;
  enableColumnResizing?: boolean;
};

// Non-draggable header component (fallback when reorderable is false)
function NonDraggableHeader<T>({
  header,
  TableHeadComponent = TableHead,
  colClassName = "",
  enableColumnResizing = false,
}: Omit<DraggableHeaderProps<T>, "reorderable">) {
  return (
    <TableHeadComponent
      colSpan={header.colSpan}
      style={{
        width: header.getSize(),
        minWidth: header.column.columnDef.minSize || 100,
        maxWidth: header.column.columnDef.maxSize || "none",
      }}
      onClick={() => {
        if (
          header.column.getCanSort() &&
          (header.column.columnDef as ColumnDef<T>).enableSorting
        ) {
          header.column.toggleSorting();
        }
      }}
      className={cn(
        (header.column.columnDef as ColumnDef<T>).headerClassName,
        (header.column.columnDef as ColumnDef<T>).className,
        colClassName,
        !!(header.column.columnDef as ColumnDef<T>).enableSorting &&
          "cursor-pointer select-none",
        "relative",
        enableColumnResizing && "group"
      )}
    >
      {header.isPlaceholder ? null : (
        <>
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <span className="truncate">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </span>
              {(!!(header.column.columnDef as ColumnDef<T>).enableSorting &&
                {
                  asc: <SortAsc className="inline size-4 flex-shrink-0" />,
                  desc: <SortDesc className="inline size-4 flex-shrink-0" />,
                }[header.column.getIsSorted() as string]) ?? (
                <ArrowDownUp className="inline size-4 flex-shrink-0" />
              )}
            </div>
          </div>
          {enableColumnResizing && <ColumnResizeHandle header={header} />}
        </>
      )}
    </TableHeadComponent>
  );
}

// Inner component that always calls hooks
// This component is only rendered when modules are loaded
function DraggableHeaderWithHooks<T>({
  header,
  TableHeadComponent = TableHead,
  colClassName = "",
  enableColumnResizing = false,
  useSortableHook,
  CSSUtil,
}: DraggableHeaderProps<T> & {
  useSortableHook: any;
  CSSUtil: any;
}) {
  const isSelectionColumn = header.column.id === "selection";

  // Always call hooks - they're guaranteed to be available here
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortableHook({
      id: header.column.id,
      disabled: isSelectionColumn,
    });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: isSelectionColumn
      ? undefined
      : CSSUtil.Translate.toString(transform),
    transition: isSelectionColumn
      ? undefined
      : isDragging
        ? "none"
        : "transform 0.05s ease-out",
    zIndex: isDragging ? 1 : 0,
    width: header.getSize(),
    minWidth: header.column.columnDef.minSize || 100,
    maxWidth: header.column.columnDef.maxSize || "none",
  };

  return (
    <TableHeadComponent
      colSpan={header.colSpan}
      ref={setNodeRef}
      style={style}
      onClick={() => {
        if (
          header.column.getCanSort() &&
          (header.column.columnDef as ColumnDef<T>).enableSorting
        ) {
          header.column.toggleSorting();
        }
      }}
      className={cn(
        (header.column.columnDef as ColumnDef<T>).headerClassName,
        (header.column.columnDef as ColumnDef<T>).className,
        colClassName,
        !!(header.column.columnDef as ColumnDef<T>).enableSorting &&
          "cursor-pointer select-none",
        "relative",
        enableColumnResizing && "group"
      )}
    >
      {header.isPlaceholder ? null : (
        <>
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <span className="truncate">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </span>
              {(!!(header.column.columnDef as ColumnDef<T>).enableSorting &&
                {
                  asc: <SortAsc className="inline size-4 flex-shrink-0" />,
                  desc: <SortDesc className="inline size-4 flex-shrink-0" />,
                }[header.column.getIsSorted() as string]) ?? (
                <ArrowDownUp className="inline size-4 flex-shrink-0" />
              )}
            </div>
            {header.column.id !== "selection" &&
              ((header.column.columnDef as ColumnDef<T>).reorderable ??
                true) && (
                <Button
                  variant="ghost"
                  className="size-6 p-0 flex-shrink-0"
                  {...attributes}
                  {...listeners}
                >
                  <span className="sr-only">Drag to reorder</span>
                  <MenuIcon className="size-4" />
                </Button>
              )}
          </div>
          {enableColumnResizing && <ColumnResizeHandle header={header} />}
        </>
      )}
    </TableHeadComponent>
  );
}

// Draggable header component (lazy loaded)
// This component loads modules and conditionally renders the hook-using component
function DraggableHeaderInner<T>({
  header,
  TableHeadComponent = TableHead,
  colClassName = "",
  reorderable = false,
  enableColumnResizing = false,
}: DraggableHeaderProps<T>) {
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

  const isSelectionColumn = header.column.id === "selection";

  // If not loaded yet or not reorderable, use non-draggable version
  if (!reorderable || !isLoaded || isSelectionColumn) {
    return (
      <NonDraggableHeader
        header={header}
        TableHeadComponent={TableHeadComponent}
        colClassName={colClassName}
        enableColumnResizing={enableColumnResizing}
      />
    );
  }

  // Render component that uses hooks - hooks are always called in same order
  return (
    <DraggableHeaderWithHooks
      header={header}
      TableHeadComponent={TableHeadComponent}
      colClassName={colClassName}
      enableColumnResizing={enableColumnResizing}
      useSortableHook={useSortableFn}
      CSSUtil={CSSFn}
      reorderable={reorderable}
    />
  );
}

export function DraggableHeaderLazy<T>(props: DraggableHeaderProps<T>) {
  // If not reorderable, use non-draggable version immediately
  if (!props.reorderable) {
    return <NonDraggableHeader {...props} />;
  }

  // Otherwise, lazy load the draggable version
  return (
    <Suspense fallback={<NonDraggableHeader {...props} />}>
      <DraggableHeaderInner {...props} />
    </Suspense>
  );
}

// Inner component for table cells that always calls hooks
function DraggableTableCellWithHooks<T>({
  cell,
  colClassName = "",
  TableCellComponent = TableCell,
  useSortableHook,
  CSSUtil,
}: {
  cell: Cell<T, unknown>;
  colClassName?: string;
  TableCellComponent?: React.ElementType;
  useSortableHook: any;
  CSSUtil: any;
}) {
  const isSelectionColumn = cell.column.id === "selection";

  // Always call hooks - they're guaranteed to be available here
  const { isDragging, setNodeRef, transform } = useSortableHook({
    id: cell.column.id,
    disabled: isSelectionColumn,
  });

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: isSelectionColumn
      ? undefined
      : CSSUtil.Translate.toString(transform),
    transition: isSelectionColumn
      ? undefined
      : isDragging
        ? "none"
        : "transform 0.05s ease-out",
    zIndex: isDragging ? 1 : 0,
    width: cell.column.getSize(),
    minWidth: cell.column.columnDef.minSize || 100,
    maxWidth: cell.column.columnDef.maxSize || "none",
  };

  return (
    <TableCellComponent
      style={style}
      ref={setNodeRef}
      className={cn(
        (cell.column.columnDef as ColumnDef<T>).className,
        colClassName
      )}
    >
      <div className="truncate">
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    </TableCellComponent>
  );
}

export function DraggableTableCellLazy<T>({
  cell,
  colClassName = "",
  TableCellComponent = TableCell,
  reorderable = false,
}: {
  cell: Cell<T, unknown>;
  colClassName?: string;
  TableCellComponent?: React.ElementType;
  reorderable?: boolean;
}) {
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

  const isSelectionColumn = cell.column.id === "selection";

  if (!reorderable || !isLoaded || isSelectionColumn) {
    return (
      <TableCellComponent
        style={{
          width: cell.column.getSize(),
          minWidth: cell.column.columnDef.minSize || 100,
          maxWidth: cell.column.columnDef.maxSize || "none",
        }}
        className={cn(
          (cell.column.columnDef as ColumnDef<T>).className,
          colClassName
        )}
      >
        <div className="truncate">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      </TableCellComponent>
    );
  }

  // Render component that uses hooks - hooks are always called in same order
  return (
    <DraggableTableCellWithHooks
      cell={cell}
      colClassName={colClassName}
      TableCellComponent={TableCellComponent}
      useSortableHook={useSortableFn}
      CSSUtil={CSSFn}
    />
  );
}

