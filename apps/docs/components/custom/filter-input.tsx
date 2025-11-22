"use client";

import React from "react";
import DebouncedInput from "./debounced-input";
import { Column, ColumnDef } from '@/types/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from '@/lib/utils';
import { sanitizeFilterValue, sanitizeSearchInput } from '@/lib/security';
import {
  TableTranslations,
  defaultTranslations,
  createTranslator,
} from '@/lib/i18n';

function FilterInput<T>({
  column,
  translations = defaultTranslations,
}: {
  column: Column<T>;
  translations?: TableTranslations;
}) {
  const t = createTranslator(translations);
  const columnFilterValue = column.getFilterValue();
  const filter = (column.columnDef as ColumnDef<T>)?.filter;

  const sortedUniqueValues = React.useMemo(
    () =>
      filter?.type === "range"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000)
            .map((value) =>
              typeof value === "string" ? sanitizeSearchInput(value) : value
            ),
    [column.getFacetedUniqueValues(), filter?.type]
  );

  if (!filter?.field) return null;

  // Sanitize current filter value
  const sanitizedFilterValue = React.useMemo(() => {
    if (!filter?.type) return columnFilterValue;
    return sanitizeFilterValue(columnFilterValue, filter.type);
  }, [columnFilterValue, filter?.type]);

  if (filter?.type === "range") {
    const {
      minPlaceholder = t("filters.min"),
      maxPlaceholder = t("filters.max"),
      showLimit = false,
      minLimit,
      maxLimit,
    } = filter ?? {};

    // Validate and sanitize range limits
    const safeMinLimit =
      typeof minLimit === "number"
        ? Math.max(-1000000, Math.min(1000000, minLimit))
        : minLimit;
    const safeMaxLimit =
      typeof maxLimit === "number"
        ? Math.max(-1000000, Math.min(1000000, maxLimit))
        : maxLimit;

    return (
      <div className="flex space-x-1 w-full">
        <DebouncedInput
          type="number"
          min={
            safeMinLimit === "faceted"
              ? Number(column.getFacetedMinMaxValues()?.[0] ?? "")
              : safeMinLimit
          }
          max={
            safeMaxLimit === "faceted"
              ? Number(column.getFacetedMinMaxValues()?.[1] ?? "")
              : safeMaxLimit
          }
          value={(sanitizedFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) => {
            // Validate and sanitize numeric input
            const numValue =
              value === "" || value === null || value === undefined
                ? undefined
                : Number(value);

            if (
              numValue !== undefined &&
              (isNaN(numValue) || numValue < -1000000 || numValue > 1000000)
            ) {
              return; // Reject invalid values
            }
            column.setFilterValue((old: [number, number]) => {
              if (numValue === undefined && old?.[1] === undefined) {
                return undefined;
              }
              return [numValue, old?.[1]];
            });
          }}
          placeholder={`${sanitizeSearchInput(minPlaceholder)} ${
            showLimit
              ? safeMinLimit === "faceted"
                ? column.getFacetedMinMaxValues()?.[0] !== undefined
                  ? `(${column.getFacetedMinMaxValues()?.[0]})`
                  : ""
                : `(${safeMinLimit})`
              : ""
          }`}
          className="flex-1 min-w-16 h-8"
        />
        <DebouncedInput
          type="number"
          min={
            safeMinLimit === "faceted"
              ? Number(column.getFacetedMinMaxValues()?.[0] ?? "")
              : safeMinLimit
          }
          max={
            safeMaxLimit === "faceted"
              ? Number(column.getFacetedMinMaxValues()?.[1] ?? "")
              : safeMaxLimit
          }
          value={(sanitizedFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) => {
            // Validate and sanitize numeric input
            const numValue =
              value === "" || value === null || value === undefined
                ? undefined
                : Number(value);
            if (
              numValue !== undefined &&
              (isNaN(numValue) || numValue < -1000000 || numValue > 1000000)
            ) {
              return; // Reject invalid values
            }
            column.setFilterValue((old: [number, number]) => {
              if (numValue === undefined && old?.[0] === undefined) {
                return undefined;
              }
              return [old?.[0], numValue];
            });
          }}
          placeholder={`${sanitizeSearchInput(maxPlaceholder)} ${
            showLimit
              ? safeMaxLimit === "faceted"
                ? column.getFacetedMinMaxValues()?.[1] !== undefined
                  ? `(${column.getFacetedMinMaxValues()?.[1]})`
                  : ""
                : `(${safeMaxLimit})`
              : ""
          }`}
          className="flex-1 min-w-16 h-8"
        />
      </div>
    );
  }

  if (filter?.type === "select") {
    const {
      options,
      optionLabel = "label",
      optionValue = "value",
      allLabel = t("filters.all"),
    } = filter ?? {};

    // Sanitize options
    const safeOptions = (options ?? sortedUniqueValues).slice(0, 1000); // Limit options to prevent DoS

    return (
      <Select
        value={(sanitizedFilterValue as string) ?? "all"}
        onValueChange={(value) => {
          const sanitizedValue = sanitizeSearchInput(value);
          column.setFilterValue(sanitizedValue === "all" ? "" : sanitizedValue);
        }}
      >
        <SelectTrigger className="h-8 w-full">
          <SelectValue placeholder={sanitizeSearchInput(allLabel)} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{sanitizeSearchInput(allLabel)}</SelectItem>
          {safeOptions.map((option: any, index: number) => {
            const value =
              typeof option === "object"
                ? sanitizeSearchInput(String(option[optionValue]))
                : sanitizeSearchInput(String(option));
            const label =
              typeof option === "object"
                ? sanitizeSearchInput(String(option[optionLabel]))
                : sanitizeSearchInput(String(option));
            return (
              <SelectItem value={value} key={`${value}-${index}`}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  }

  if (filter?.type === "boolean") {
    const {
      trueLabel = t("filters.true"),
      falseLabel = t("filters.false"),
      allLabel = t("filters.all"),
    } = filter ?? {};
    return (
      <Select
        value={(sanitizedFilterValue as string) ?? "all"}
        onValueChange={(value) => {
          // Only allow specific boolean values
          if (!["all", "true", "false"].includes(value)) return;
          column.setFilterValue(value === "all" ? "" : value);
        }}
      >
        <SelectTrigger className="h-8 w-full">
          <SelectValue placeholder={sanitizeSearchInput(allLabel)} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{sanitizeSearchInput(allLabel)}</SelectItem>
          <SelectItem value="true">{sanitizeSearchInput(trueLabel)}</SelectItem>
          <SelectItem value="false">
            {sanitizeSearchInput(falseLabel)}
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

  if (filter?.type === "text") {
    return (
      <>
        {filter?.showList && (
          <datalist id={column.id + "list"}>
            {sortedUniqueValues
              .slice(0, 100)
              .map((value: any, index: number) => (
                <option value={value} key={`${value}-${index}`} />
              ))}
          </datalist>
        )}
        <DebouncedInput
          className={cn("w-full h-8", filter?.className)}
          onChange={(value) => {
            const sanitizedValue = sanitizeSearchInput(String(value));
            column.setFilterValue(sanitizedValue);
          }}
          placeholder={`${sanitizeSearchInput(filter?.field)} ${filter?.showTotal ? `(${Math.min(column.getFacetedUniqueValues().size, 9999)})` : ""}`}
          type="text"
          value={(sanitizedFilterValue ?? "") as string}
          list={filter?.showList ? column.id + "list" : undefined}
          maxLength={1000} // Prevent extremely long inputs
        />
      </>
    );
  }

  if (filter?.type === "custom") {
    const { component: CustomComponent, ...rest } = filter;
    // Note: Custom components should implement their own security measures
    return <CustomComponent column={column} {...rest} />;
  }

  return null;
}

export default FilterInput;
