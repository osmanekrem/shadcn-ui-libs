import * as React from "react";
import { MoreVertical } from "lucide-react";
import { Row } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

export interface RowAction<T = unknown> {
  /**
   * Unique identifier for the action
   */
  id: string;
  /**
   * Label to display
   */
  label: string;
  /**
   * Icon component (from lucide-react)
   */
  icon?: React.ComponentType<{ className?: string }>;
  /**
   * Click handler
   */
  onClick: (row: Row<T>) => void;
  /**
   * Whether the action is disabled
   */
  disabled?: boolean | ((row: Row<T>) => boolean);
  /**
   * Whether the action is destructive (will be styled differently)
   */
  destructive?: boolean;
  /**
   * Separator before this action
   */
  separator?: boolean;
}

export interface RowActionsProps<T = unknown> {
  /**
   * The table row
   */
  row: Row<T>;
  /**
   * Array of actions to display
   */
  actions: RowAction<T>[];
  /**
   * Custom trigger button (optional)
   */
  trigger?: React.ReactNode;
  /**
   * Alignment of the dropdown menu
   */
  align?: "start" | "center" | "end";
  /**
   * Side of the trigger to show the dropdown
   */
  side?: "top" | "right" | "bottom" | "left";
  /**
   * Additional className for the trigger button
   */
  className?: string;
  /**
   * Size of the trigger button
   */
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * RowActions - A flexible row actions component for table rows
 *
 * Displays a dropdown menu with customizable actions for each table row.
 *
 * @example
 * ```tsx
 * import { RowActions } from "tanstack-shadcn-table/table-elements";
 * import { Edit, Trash2, Eye } from "lucide-react";
 *
 * const columns: ColumnDef<Person>[] = [
 *   // ... other columns
 *   {
 *     id: "actions",
 *     header: "Actions",
 *     cell: ({ row }) => (
 *       <RowActions
 *         row={row}
 *         actions={[
 *           {
 *             id: "view",
 *             label: "View",
 *             icon: Eye,
 *             onClick: (row) => console.log("View", row.original),
 *           },
 *           {
 *             id: "edit",
 *             label: "Edit",
 *             icon: Edit,
 *             onClick: (row) => console.log("Edit", row.original),
 *           },
 *           {
 *             id: "delete",
 *             label: "Delete",
 *             icon: Trash2,
 *             destructive: true,
 *             onClick: (row) => console.log("Delete", row.original),
 *           },
 *         ]}
 *       />
 *     ),
 *   },
 * ];
 * ```
 */
export function RowActions<T>({
  row,
  actions,
  trigger,
  align = "end",
  side = "bottom",
  className,
  size = "icon",
}: Readonly<RowActionsProps<T>>) {
  if (!actions || actions.length === 0) {
    return null;
  }

  const defaultTrigger = (
    <Button
      variant="ghost"
      size={size}
      className={cn("h-8 w-8 p-0", className)}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="sr-only">Open menu</span>
      <MoreVertical className="h-4 w-4" />
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        {trigger || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        onClick={(e) => e.stopPropagation()}
      >
        {actions.map((action, index) => {
          const isDisabled =
            typeof action.disabled === "function"
              ? action.disabled(row)
              : action.disabled;

          const Icon = action.icon;

          const item = (
            <DropdownMenuItem
              key={action.id}
              disabled={isDisabled}
              onClick={(e) => {
                e.stopPropagation();
                if (!isDisabled) {
                  action.onClick(row);
                }
              }}
              className={cn(
                action.destructive &&
                  "text-destructive hover:text-destructive hover:bg-destructive/10 focus:text-destructive focus:bg-destructive/10"
              )}
            >
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {action.label}
            </DropdownMenuItem>
          );

          if (action.separator && index > 0) {
            return (
              <React.Fragment key={action.id}>
                <DropdownMenuSeparator />
                {item}
              </React.Fragment>
            );
          }

          return item;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
