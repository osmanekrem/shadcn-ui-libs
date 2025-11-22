"use client";

import React from "react";
import { Header } from "@tanstack/react-table";
import { cn } from '@/lib/utils';

interface ColumnResizeHandleProps<TData> {
  header: Header<TData, unknown>;
  className?: string;
}

export function ColumnResizeHandle<TData>({
  header,
  className,
}: ColumnResizeHandleProps<TData>) {
  const { column } = header;
  const isResizing = column.getIsResizing();

  if (!column.getCanResize()) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none bg-transparent hover:bg-blue-500 active:bg-blue-600 focus:bg-blue-500 focus:outline-none",
        isResizing && "bg-blue-500",
        className
      )}
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      role="separator"
      aria-label={`Resize ${header.column.id} column`}
      aria-orientation="vertical"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          // Could implement keyboard-based resizing here
        }
      }}
      style={{
        transform: "translateX(50%)",
      }}
    >
      <div className="h-full w-full" />
    </div>
  );
}

export default ColumnResizeHandle;
