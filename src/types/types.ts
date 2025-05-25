import {
  ColumnDef as TSColumnDef,
  Column as TSColumn,
  GroupColumnDef as TSGroupColumnDef,
  DeepKeys,
  CellContext,
  ColumnFiltersState,
  PaginationState,
  ColumnSizingState,
} from "@tanstack/react-table";
import { TableTranslations } from "../lib/i18n";

export type TableOptions<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  globalFilter?: GlobalFilterType;
  filterRowClassName?: string;
  rowClassName?: string;
  colClassName?: string;
  filter?: boolean;
  reorderable?: boolean;

  pagination?: PaginationOptions;

  // Column sizing options
  enableColumnResizing?: boolean;
  columnResizeMode?: "onChange" | "onEnd";
  columnResizeDirection?: "ltr" | "rtl";

  // Internationalization
  translations?: TableTranslations;
} & Lazy &
  Sorting &
  ColumnFilters &
  Pagination &
  ColumnVisibility &
  ColumnOrder &
  RowSelection &
  ColumnSizing;

type ColumnVisibility =
  | {
      columnVisibility?: Record<string, boolean>;
      onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
    }
  | {
      columnVisibility?: never;
      onColumnVisibilityChange?: never;
    };

type Pagination =
  | {
      paginationState?: PaginationState;
      onPaginationChange?: (pagination: PaginationState) => void;
    }
  | {
      paginationState?: never;
      onPaginationChange?: never;
    };

type ColumnFilters =
  | {
      columnFilters?: ColumnFiltersState;
      onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
    }
  | {
      columnFilters?: never;
      onColumnFiltersChange?: never;
    };

type Sorting =
  | {
      sorting?: SortingState[];
      onSortingChange?: (sorting: SortingState[]) => void;
    }
  | {
      sorting?: never;
      onSortingChange?: never;
    };

type Lazy =
  | {
      lazy: true;
      onLazyLoad: (event: LazyLoadEvent) => void;
    }
  | {
      lazy?: false;
      onLazyLoad?: never;
    };

type ColumnOrder =
  | {
      columnOrder?: string[];
      onColumnOrderChange?: (order: string[]) => void;
    }
  | {
      columnOrder?: never;
      onColumnOrderChange?: never;
    };

type RowSelection =
  | {
      rowSelection?: Record<string, boolean>;
      onRowSelectionChange?: (selection: Record<string, boolean>) => void;
      enableRowSelectionFn?: (row: any) => boolean;
    }
  | {
      rowSelection?: never;
      onRowSelectionChange?: never;
      enableRowSelectionFn?: never;
    };

type GlobalFilterType = {
  show?: boolean;
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
};

type ColumnSizing =
  | {
      columnSizing?: ColumnSizingState;
      onColumnSizingChange?: (sizing: ColumnSizingState) => void;
      defaultColumn?: {
        size?: number;
        minSize?: number;
        maxSize?: number;
      };
    }
  | {
      columnSizing?: never;
      onColumnSizingChange?: never;
      defaultColumn?: never;
    };

export type ColumnDef<T> = {
  filter?: FilterType<T>;
  cell?: (info: CellContext<T, unknown>) => any;
  sortField?: string;
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  reorderable?: boolean;

  // Column sizing properties
  size?: number;
  minSize?: number;
  maxSize?: number;
  enableResizing?: boolean;
} & (
  | (
      | {
          accessorFn: (row: T) => any;
          id: string;
          accessorKey?: never;
          columns?: never;
        }
      | {
          accessorKey: DeepKeys<T>;
          accessorFn?: never;
          id?: string;
          columns?: never;
        }
    )
  | {
      columns: ColumnDef<T>[];
      accessorFn?: never;
      accessorKey?: never;
      id?: string;
    }
) &
  TSColumnDef<T, unknown>;

export type Column<T> = {
  columnDef: ColumnDef<T>;
} & TSColumn<T, unknown>;

export type GroupColumnDef<T> = {
  columns?: ColumnDef<T>[];
} & TSGroupColumnDef<T, unknown>;

export type FilterType<T> = {
  field: string;
  className?: string;
} & (
  | {
      type: "text";
      placeholder: string;
      showList?: boolean;
      showTotal?: boolean;
    }
  | {
      type: "range";
      minPlaceholder?: string;
      maxPlaceholder?: string;
      showLimit?: boolean;
      minLimit?: number | "faceted";
      maxLimit?: number | "faceted";
    }
  | {
      type: "select" | "multi-select";
      options: any[];
      optionLabel: string;
      optionValue: string;
      allLabel?: string;
    }
  | {
      type: "boolean";
      trueLabel?: string;
      falseLabel?: string;
      allLabel?: string;
    }
  | {
      type: "date";
    }
  | {
      type: "date-range";
    }
  | {
      type: "custom";
      component: React.ComponentType<{ column: Column<T> }>;
    }
);

export type PaginationOptions = {
  pageSizeOptions?: number[];
  pageSize: number;
  totalRecords: number;
  mode?: "advanced" | "default" | "compact";
  maxVisiblePages?: number;
  goToPageLabel?: string;
  pageSizeLabel?: string;
  className?: string;
  totalLabel?: string;
  layout?: ("total" | "pageSize" | "goto" | "buttons")[];
};

export type LazyLoadEvent = {
  first: number;
  rows: number;
  filters: ColumnFiltersState;
  globalFilter: string;
  sorting: SortingState[];
  page: number;
};

export type SortingState = {
  id: string;
  desc: boolean;
};
