import * as React from "react";
import { Filter, X } from "lucide-react";
import { Column } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
// Tree-shakeable import - only imports sanitizeSearchInput
import { sanitizeSearchInput } from "../lib/security/sanitize";
import {
  TableTranslations,
  defaultTranslations,
  createTranslator,
} from "../lib/i18n";

export interface FacetedFilterProps<T = unknown> {
  /**
   * The table column
   */
  column: Column<T>;
  /**
   * Title/label for the filter
   */
  title?: string;
  /**
   * Maximum number of options to display
   */
  maxOptions?: number;
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
  /**
   * Translations for the component
   */
  translations?: TableTranslations;
  /**
   * Whether to show the count badge on the trigger
   */
  showCount?: boolean;
  /**
   * Custom option label formatter
   */
  formatOptionLabel?: (value: unknown) => string;
  /**
   * Whether to sort options alphabetically
   */
  sortOptions?: boolean;
}

/**
 * FacetedFilter - A multi-select filter component with facet counts
 *
 * Displays a dropdown with checkboxes for each unique value in the column,
 * showing the count of items for each value. Users can select multiple values
 * to filter the table.
 *
 * @example
 * ```tsx
 * import { FacetedFilter } from "tanstack-shadcn-table/table-elements";
 *
 * const columns: ColumnDef<Person>[] = [
 *   {
 *     accessorKey: "status",
 *     header: "Status",
 *     cell: ({ column }) => (
 *       <FacetedFilter
 *         column={column}
 *         title="Status"
 *         showCount
 *       />
 *     ),
 *   },
 * ];
 * ```
 */
export function FacetedFilter<T>({
  column,
  title,
  maxOptions = 100,
  trigger,
  align = "start",
  side = "bottom",
  className,
  size = "default",
  translations = defaultTranslations,
  showCount = true,
  formatOptionLabel,
  sortOptions = true,
}: Readonly<FacetedFilterProps<T>>) {
  const t = createTranslator(translations);
  const facetedUniqueValues = column.getFacetedUniqueValues();
  const filterValue = column.getFilterValue() as string[] | undefined;

  // Get unique values with their counts
  const options = React.useMemo(() => {
    const entries = Array.from(facetedUniqueValues.entries())
      .slice(0, maxOptions)
      .map(([value, count]) => ({
        value: value ?? "null",
        label:
          formatOptionLabel?.(value) ??
          (value === null || value === undefined
            ? t("filters.all")
            : String(value)),
        count,
        originalValue: value,
      }));

    if (sortOptions) {
      return entries.sort((a, b) => {
        // Sort null/undefined values last
        if (a.originalValue === null || a.originalValue === undefined) return 1;
        if (b.originalValue === null || b.originalValue === undefined)
          return -1;
        return a.label.localeCompare(b.label);
      });
    }

    return entries;
  }, [facetedUniqueValues, maxOptions, formatOptionLabel, sortOptions, t]);

  // Get selected values as an array
  const selectedValues = React.useMemo(() => {
    if (!filterValue) return [];
    if (Array.isArray(filterValue)) return filterValue;
    return [filterValue];
  }, [filterValue]);

  // Check if a value is selected
  const isSelected = (value: string) => {
    return selectedValues.includes(value);
  };

  // Toggle a value in the filter
  const toggleValue = (value: string) => {
    const sanitizedValue = sanitizeSearchInput(value);
    const currentValues = selectedValues.map((v) => sanitizeSearchInput(v));
    const newValues = currentValues.includes(sanitizedValue)
      ? currentValues.filter((v) => v !== sanitizedValue)
      : [...currentValues, sanitizedValue];

    if (newValues.length === 0) {
      column.setFilterValue(undefined);
    } else {
      column.setFilterValue(newValues);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    column.setFilterValue(undefined);
  };

  // Get the count of selected filters
  const selectedCount = selectedValues.length;

  // Default trigger button
  const defaultTrigger = (
    <Button
      variant="outline"
      size={size}
      className={cn("h-8 border-dashed", className)}
    >
      <Filter className="mr-2 h-4 w-4" />
      {title || column.id}
      {showCount && selectedCount > 0 && (
        <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
          {selectedCount}
        </span>
      )}
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
        className="w-[200px] p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="text-sm font-semibold">
            {title || column.id}
          </DropdownMenuLabel>
          {selectedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
            >
              <X className="mr-1 h-3 w-3" />
              {t("filters.clearFilter")}
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              {t("filters.noOptionsFound")}
            </div>
          ) : (
            options.map((option) => {
              const checked = isSelected(option.value);
              return (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={checked}
                  onCheckedChange={() => {
                    toggleValue(option.value);
                  }}
                  className="flex items-center justify-between"
                >
                  <span className="truncate">{option.label}</span>
                  <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                    {option.count}
                  </span>
                </DropdownMenuCheckboxItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
