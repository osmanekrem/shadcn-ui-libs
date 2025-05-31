import { flexRender, Header } from "@tanstack/react-table";
import React, { CSSProperties } from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableCell, TableHead } from "../ui/table";
import { ColumnDef } from "../../types/types";
import { ArrowDownUp, MenuIcon, SortAsc, SortDesc } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
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
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    minWidth: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
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
        "flex items-center justify-start overflow-hidden gap-1.5 whitespace-nowrap text-ellipsis",
        enableColumnResizing && "relative"
      )}
    >
      {header.isPlaceholder ? null : (
        <>
          <div className="flex items-center justify-start gap-1.5 flex-1 min-w-0">
            {flexRender(header.column.columnDef.header, header.getContext())}
            {(!!(header.column.columnDef as ColumnDef<T>).enableSorting &&
              {
                asc: <SortAsc className="inline size-4" />,
                desc: <SortDesc className="inline size-4" />,
              }[header.column.getIsSorted() as string]) ?? (
              <ArrowDownUp className="inline size-4" />
            )}
          </div>
          {reorderable &&
            ((header.column.columnDef as ColumnDef<T>).reorderable ?? true) && (
              <Button
                variant="ghost"
                className="ml-auto size-4 flex shrink-0"
                {...attributes}
                {...listeners}
              >
                <span className="sr-only">Drag to reorder</span>
                <MenuIcon className=" size-4" />
              </Button>
            )}
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
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    minWidth: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableCellComponent
      style={style}
      ref={setNodeRef}
      className={cn(
        (cell.column.columnDef as ColumnDef<T>).className,
        colClassName,
        "flex items-center justify-start overflow-hidden gap-1.5 whitespace-nowrap text-ellipsis"
      )}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCellComponent>
  );
}
