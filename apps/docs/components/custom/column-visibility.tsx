"use client";

import { flexRender, isFunction, Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export default function ColumnVisibility({
  table,
  label,
}: {
  table: Table<any>;
  label?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          {label || "Columns"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {isFunction(column.columnDef.header)
                  ? flexRender(
                      column.columnDef.header,
                      table
                        .getHeaderGroups()
                        .find((headerGroup) =>
                          headerGroup.headers.some(
                            (header) => header.id === column.id
                          )
                        )
                        ?.headers.find((header) => header.id === column.id)!
                        .getContext()!
                    )
                  : column.columnDef.header || column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
