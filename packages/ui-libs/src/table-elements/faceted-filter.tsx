import type { Column } from "@tanstack/react-table";
import { Check, PlusCircle } from "lucide-react";
import type * as React from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Separator } from "../components/ui/separator";
import { cn } from "../lib/utils";
import { defaultTranslations } from "../lib/i18n/locales/en";
import { createTranslator } from "../lib/i18n/utils";
import type { TableTranslations } from "../lib/i18n/types";

export type FacetedFilterProps<TData, TValue> = {
  /**
   * The table column to filter
   */
  column?: Column<TData, TValue>;
  /**
   * Title of the filter button
   */
  title?: string;
  /**
   * Array of filter options
   */
  options: {
    /**
     * Display label for the option
     */
    label: string;
    /**
     * Value of the option
     */
    value: unknown;
    /**
     * Optional icon component to display next to the option
     */
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  /**
   * Translations object for internationalization
   * @default defaultTranslations
   */
  translations?: TableTranslations;
};

type DataTableFacetedFilterProps<TData, TValue> = FacetedFilterProps<
  TData,
  TValue
>;

/**
 * FacetedFilter - A flexible faceted filter component for table columns
 *
 * Displays a popover with a searchable list of filter options. Users can select
 * multiple options to filter the table data. Selected filters are displayed as
 * badges on the trigger button.
 *
 * @template TData - The type of data in the table
 * @template TValue - The type of the column value
 *
 * @param props - FacetedFilter component props
 * @param props.column - The table column to filter
 * @param props.title - Title of the filter button
 * @param props.options - Array of filter options with label, value, and optional icon
 * @param props.translations - Translations object for internationalization
 *
 * @returns The rendered FacetedFilter component
 *
 * @example
 * ```tsx
 * import { FacetedFilter } from "tanstack-shadcn-table/table-elements";
 * import { CheckCircle2, XCircle } from "lucide-react";
 *
 * const statusOptions = [
 *   { label: "Active", value: "active", icon: CheckCircle2 },
 *   { label: "Inactive", value: "inactive", icon: XCircle },
 * ];
 *
 * <FacetedFilter
 *   column={table.getColumn("status")}
 *   title="Status"
 *   options={statusOptions}
 * />
 * ```
 */
export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  translations = defaultTranslations,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const t = createTranslator(translations);
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as unknown[]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-8 border-dashed" size="sm" variant="outline">
          <PlusCircle />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator className="mx-2 h-4" orientation="vertical" />
              <Badge
                className="rounded-sm px-1 font-normal lg:hidden"
                variant="secondary"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden gap-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    className="rounded-sm px-1 font-normal"
                    variant="secondary"
                  >
                    {t("filters.selectedCount", { count: selectedValues.size })}
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option, index) => (
                      <Badge
                        className="rounded-sm px-1 font-normal"
                        key={`${option.value}-${index}`}
                        variant="secondary"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>{t("filters.noResultsFound")}</CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={`${option.value}-${index}`}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      const filterValues = Array.from(selectedValues);
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-[4px] border",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input [&_svg]:invisible"
                      )}
                    >
                      <Check className="size-3.5 text-primary-foreground" />
                    </div>
                    {option.icon && (
                      <option.icon className="size-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex size-4 items-center justify-center font-mono text-muted-foreground text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    className="justify-center text-center"
                    onSelect={() => column?.setFilterValue(undefined)}
                  >
                    {t("filters.clearFilters")}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Export alias for consistency
export const FacetedFilter = DataTableFacetedFilter;
