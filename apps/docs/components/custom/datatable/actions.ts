"use client";

import {
  FilterFn,
  isFunction,
  SortingFn,
  sortingFns,
  Updater,
} from "@tanstack/react-table";
import { rankItem, compareItems } from "@tanstack/match-sorter-utils";
import { OnChangeFn } from "@tanstack/react-table";
import { SetStateAction, useCallback, useRef, useState } from "react";

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

export function useExternalState<T>(
  externalState: T | undefined,
  onExternalChange: ((val: T) => void) | undefined,
  initialInternalState?: T
): [T, (val: React.SetStateAction<T>) => void] {
  const [internalState, setInternalState] = useState<T>(
    initialInternalState || (externalState as T)
  );

  const isControlled = externalState !== undefined;

  const value = isControlled ? externalState : internalState;

  const setValue = useCallback(
    (updater: React.SetStateAction<T>) => {
      const newValue =
        typeof updater === "function"
          ? (updater as (prev: T) => T)(value)
          : updater;
      if (isControlled) {
        onExternalChange?.(newValue);
      } else {
        setInternalState(newValue);
      }
    },
    [isControlled, value, onExternalChange]
  );

  return [value, setValue];
}
