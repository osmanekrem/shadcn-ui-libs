"use client";

import React, { useCallback } from "react";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Ellipsis,
} from "lucide-react";
import { PaginationOptions } from "../types/types";
import DebouncedInput from "../ui-elements/debounced-input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../components/ui/select";
import {
  TableTranslations,
  defaultTranslations,
  createTranslator,
} from "../lib/i18n";

type Props = {
  totalPages: number;
  currentPage: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSetPage: (page: number) => void;
  className?: string;
  mode?: "default" | "compact" | "advanced";
  maxVisiblePages?: number;
  translations?: TableTranslations;
};

export default function Pagination({
  onNext,
  onPrevious,
  onSetPage,
  canNextPage,
  canPreviousPage,
  totalPages = 0,
  currentPage = 0,
  className,
  mode = "default",
  maxVisiblePages = 7,
  translations = defaultTranslations,
}: Props) {
  const t = createTranslator(translations);

  const getVisiblePages = useCallback(() => {
    const pages = [];

    switch (mode) {
      case "advanced": {
        if (totalPages <= maxVisiblePages) {
          // Case 1: 7 veya daha az sayfa - hepsini göster (1,2,3,4,5,6,7)
          for (let i = 0; i < totalPages; i++) {
            pages.push(i);
          }
        } else {
          // 7'den fazla sayfa için case hesaplama
          const leftPages = Math.floor((maxVisiblePages - 3) / 2); // Sol tarafta kaç sayfa (ellipsis ve first/last hariç)
          const rightPages = maxVisiblePages - 3 - leftPages; // Sağ tarafta kaç sayfa

          const isNearStart = currentPage < leftPages + 1;
          const isNearEnd = currentPage >= totalPages - rightPages - 1;

          if (isNearStart) {
            // Case 2: Başlangıçta (1,2,3,4,5,...,12)
            for (let i = 0; i < maxVisiblePages - 2; i++) {
              // maxVisiblePages-2 = 5 sayfa
              pages.push(i);
            }
            pages.push(-1); // ellipsis
            pages.push(totalPages - 1); // last page
          } else if (isNearEnd) {
            // Case 4: Sonda (1,...,8,9,10,11,12)
            pages.push(0); // first page
            pages.push(-1); // ellipsis
            for (
              let i = totalPages - (maxVisiblePages - 2);
              i < totalPages;
              i++
            ) {
              // Son 5 sayfa
              pages.push(i);
            }
          } else {
            // Case 3: Ortada (1,...,5,6,7,...,12)
            pages.push(0); // first page
            pages.push(-1); // left ellipsis

            // Ortada 3 sayfa: current-1, current, current+1
            const middlePages = maxVisiblePages - 4; // 4 = first + 2 ellipsis + last
            const startMiddle = currentPage - Math.floor(middlePages / 2);

            for (let i = 0; i < middlePages; i++) {
              pages.push(startMiddle + i);
            }

            pages.push(-2); // right ellipsis
            pages.push(totalPages - 1); // last page
          }
        }
        break;
      }

      case "default": {
        if (totalPages <= maxVisiblePages) {
          for (let i = 0; i < totalPages; i++) {
            pages.push(i);
          }
        } else {
          // 5'ten fazla sayfa: kaydırmalı window + ellipsis
          const isNearEnd = currentPage >= totalPages - maxVisiblePages + 1;

          if (isNearEnd) {
            // Son kısımda: son 5 sayfayı göster (8,9,10,11,12)
            for (let i = totalPages - maxVisiblePages; i < totalPages; i++) {
              pages.push(i);
            }
          } else {
            // Başta veya ortada: current'tan başlayıp 4 sayfa + ellipsis + last
            const startPage = Math.max(0, currentPage);
            for (let i = startPage; i < startPage + maxVisiblePages - 1; i++) {
              pages.push(i);
            }
            pages.push(-1); // ellipsis
            pages.push(totalPages - 1); // last page
          }
        }
        break;
      }

      case "compact": {
        if (totalPages <= maxVisiblePages) {
          for (let i = 0; i < totalPages; i++) {
            pages.push(i);
          }
        } else {
          let start = Math.max(
            0,
            currentPage - Math.floor(maxVisiblePages / 2)
          );
          let end = Math.min(totalPages - 1, start + maxVisiblePages - 1);

          if (end === totalPages - 1) {
            start = Math.max(0, end - maxVisiblePages + 1);
          }

          for (let i = start; i <= end; i++) {
            pages.push(i);
          }
        }
        break;
      }
    }

    return pages;
  }, [totalPages, currentPage, mode, maxVisiblePages]);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Button
        variant="ghost"
        size={"icon"}
        onClick={() => onSetPage(0)}
        disabled={!canPreviousPage}
        aria-label={t("pagination.first")}
      >
        <ChevronsLeftIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size={"icon"}
        onClick={() => onPrevious()}
        disabled={!canPreviousPage}
        aria-label={t("pagination.previous")}
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>

      {/* Page Numbers */}
      {getVisiblePages().map((page, index) => {
        if (page === -1 || page === -2) {
          return (
            <span
              key={index}
              className="size-9 flex items-center justify-center text-gray-500"
            >
              <Ellipsis className="h-4 w-4" />
            </span>
          );
        }

        return (
          <Button
            key={index}
            variant={currentPage === page ? "default" : "ghost"}
            size="icon"
            onClick={() => onSetPage(page)}
          >
            {page + 1}
          </Button>
        );
      })}
      <Button
        variant="ghost"
        size={"icon"}
        onClick={() => onNext()}
        disabled={!canNextPage}
        aria-label={t("pagination.next")}
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size={"icon"}
        onClick={() => onSetPage(totalPages - 1)}
        disabled={!canNextPage || totalPages === 0}
        aria-label={t("pagination.last")}
      >
        <ChevronsRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

type GoToPageProps = {
  totalPages: number;
  currentPage: number;
  onSetPage: (page: number) => void;
  className?: string;
  label?: string;
  translations?: TableTranslations;
};

export function GoToPage({
  currentPage,
  onSetPage,
  totalPages,
  className,
  label,
  translations = defaultTranslations,
}: GoToPageProps) {
  const t = createTranslator(translations);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && (
        <span className="text-sm text-gray-700">
          {label || t("pagination.goToPage")}
        </span>
      )}
      <DebouncedInput
        type="number"
        min={1}
        max={totalPages}
        value={currentPage + 1}
        onChange={(value) => {
          const page = value ? Number(value) - 1 : 0;
          onSetPage(page);
        }}
        className="w-16 h-8 border border-gray-300 rounded-md px-2"
        placeholder={t("pagination.page")}
      />
      <span className="text-sm text-gray-700">
        {t("pagination.of")} {totalPages}
      </span>
    </div>
  );
}

export function PageSize({
  pageSize,
  className,
  onSetPageSize,
  pagination,
  label,
  translations = defaultTranslations,
}: {
  onSetPageSize: (size: number) => void;
  pageSize: number;
  className?: string;
  pagination: PaginationOptions;
  label?: string;
  translations?: TableTranslations;
}) {
  const t = createTranslator(translations);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && (
        <span className="text-sm truncate text-gray-700">
          {label || t("pagination.rowsPerPage")}
        </span>
      )}
      <Select
        value={pageSize.toString()}
        onValueChange={(e: string) => {
          const size = parseInt(e, 10);
          if (!isNaN(size) && size > 0) {
            onSetPageSize(size);
          }
        }}
      >
        <SelectTrigger>
          <span className="text-sm text-gray-700">{pageSize}</span>
        </SelectTrigger>
        <SelectContent>
          {pagination.pageSizeOptions?.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

