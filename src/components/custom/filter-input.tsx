import React from "react";
import DebouncedInput from "./debounced-input";
import { Column, ColumnDef } from "../../types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "../../lib/utils";

function FilterInput<T>({ column }: { column: Column<T> }) {
  const columnFilterValue = column.getFilterValue();
  const filter = (column.columnDef as ColumnDef<T>)?.filter;

  const sortedUniqueValues = React.useMemo(
    () =>
      filter?.type === "range"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000),
    [column.getFacetedUniqueValues(), filter?.type]
  );

  if (!filter?.field) return null;

  if (filter?.type === "range") {
    const {
      minPlaceholder = "Min",
      maxPlaceholder = "Max",
      showLimit = false,
      minLimit,
      maxLimit,
    } = filter ?? {};
    return (
      <div className="flex space-x-1.5">
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="number"
          min={
            minLimit === "faceted"
              ? Number(column.getFacetedMinMaxValues()?.[0] ?? "")
              : minLimit
          }
          max={
            maxLimit === "faceted"
              ? Number(column.getFacetedMinMaxValues()?.[1] ?? "")
              : maxLimit
          }
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => {
              if (value === "" && old?.[1] === undefined) {
                return undefined;
              }
              return [value === "" ? undefined : Number(value), old?.[1]];
            })
          }
          placeholder={`${minPlaceholder} ${
            showLimit
              ? minLimit === "faceted"
                ? column.getFacetedMinMaxValues()?.[0] !== undefined
                  ? `(${column.getFacetedMinMaxValues()?.[0]})`
                  : ""
                : `(${minLimit})`
              : ""
          }`}
          className="flex-1 min-w-16 h-8"
        />
        <DebouncedInput
          type="number"
          min={
            minLimit === "faceted"
              ? Number(column.getFacetedMinMaxValues()?.[0] ?? "")
              : minLimit
          }
          max={
            maxLimit === "faceted"
              ? Number(column.getFacetedMinMaxValues()?.[1] ?? "")
              : maxLimit
          }
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => {
              if (value === "" && old?.[0] === undefined) {
                return undefined;
              }
              return [old?.[0], value === "" ? undefined : Number(value)];
            })
          }
          placeholder={`${maxPlaceholder} ${
            showLimit
              ? maxLimit === "faceted"
                ? column.getFacetedMinMaxValues()?.[1] !== undefined
                  ? `(${column.getFacetedMinMaxValues()?.[1]})`
                  : ""
                : `(${maxLimit})`
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
      allLabel = "All",
    } = filter ?? {};

    return (
      <Select
        value={(columnFilterValue as string) ?? "all"}
        onValueChange={(value) =>
          column.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder={allLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{allLabel}</SelectItem>
          {(options ?? sortedUniqueValues).map((option: any) => {
            const value =
              typeof option === "object" ? option[optionValue] : option;
            const label =
              typeof option === "object" ? option[optionLabel] : option;
            return (
              <SelectItem value={value} key={value}>
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
      trueLabel = "True",
      falseLabel = "False",
      allLabel = "All",
    } = filter ?? {};
    return (
      <Select
        value={(columnFilterValue as string) ?? "all"}
        onValueChange={(value) =>
          column.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="h-8">
          <SelectValue placeholder={allLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{allLabel}</SelectItem>
          <SelectItem value="true">{trueLabel}</SelectItem>
          <SelectItem value="false">{falseLabel}</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  if (filter?.type === "text") {
    return (
      <>
        {filter?.showList && (
          <datalist id={column.id + "list"}>
            {sortedUniqueValues.map((value: any) => (
              <option value={value} key={value} />
            ))}
          </datalist>
        )}
        <DebouncedInput
          className={cn("w-full h-8", filter?.className)}
          onChange={(value) => column.setFilterValue(value)}
          placeholder={`${filter?.field} ${filter?.showTotal ? `(${column.getFacetedUniqueValues().size})` : ""}`}
          type="text"
          value={(columnFilterValue ?? "") as string}
          list={filter?.showList ? column.id + "list" : undefined}
        />
      </>
    );
  }

  if (filter?.type === "custom") {
    const { component: CustomComponent, ...rest } = filter;
    return <CustomComponent column={column} {...rest} />;
  }

  return null;
}

export default FilterInput;
