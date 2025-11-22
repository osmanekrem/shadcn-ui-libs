"use client";

import { flexRender, Header } from "@tanstack/react-table";
import React, { CSSProperties } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableCell, TableHead } from "../components/ui/table";
import { ColumnDef } from "../types/types";
import { ArrowDownUp, MenuIcon, SortAsc, SortDesc } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Cell } from "@tanstack/react-table";
import ColumnResizeHandle from "./column-resize-handle";

type DraggableHeaderProps<T> = {
  header: Header<T, unknown>;
  colClassName?: string;
  TableHeadComponent?: React.ElementType;
  reorderable?: boolean;
  enableColumnResizing?: boolean;
};

export function DraggableHeader<T>({
  header,
  TableHeadComponent = TableHead,
  colClassName = "",
  reorderable = false,
  enableColumnResizing = false,
}: DraggableHeaderProps<T>) {
  const isSelectionColumn = header.column.id === "selection";

  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
      disabled: isSelectionColumn || !reorderable,
    });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: isSelectionColumn
      ? undefined
      : CSS.Translate.toString(transform),
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
            {reorderable &&
              header.column.id !== "selection" &&
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

export function DraggableTableCell<T>({
  cell,
  colClassName = "",
  TableCellComponent = TableCell,
}: {
  cell: Cell<T, unknown>;
  colClassName?: string;
  TableCellComponent?: React.ElementType;
}) {
  const isSelectionColumn = cell.column.id === "selection";

  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
    disabled: isSelectionColumn,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: isSelectionColumn
      ? undefined
      : CSS.Translate.toString(transform),
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

