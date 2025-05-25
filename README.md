# Tanstack Shadcn Table

A powerful, feature-rich React table component built on top of TanStack Table v8 with shadcn/ui styling. This library provides a complete data table solution with advanced features like filtering, sorting, pagination, column reordering, row selection, and lazy loading.

## 🚀 Features

- **🎨 Beautiful UI**: Built with shadcn/ui components and Tailwind CSS
- **📊 Advanced Filtering**: Text, range, select, boolean, and custom filters
- **🔄 Sorting**: Multi-column sorting with fuzzy search support
- **📄 Pagination**: Flexible pagination with customizable layouts
- **🔀 Column Reordering**: Drag and drop column reordering
- **📏 Column Resizing**: Interactive column width adjustment with drag handles
- **✅ Row Selection**: Single and multi-row selection
- **🔍 Global Search**: Fuzzy search across all columns
- **⚡ Lazy Loading**: Server-side data loading support
- **👁️ Column Visibility**: Show/hide columns dynamically
- **📱 Responsive**: Mobile-friendly design
- **🎯 TypeScript**: Full TypeScript support
- **🧩 Customizable**: Highly customizable components and styling

## 📦 Installation

```bash
npm install tanstack-shadcn-table
```

### Peer Dependencies

Make sure you have the following peer dependencies installed:

```bash
npm install @tanstack/react-table @tanstack/match-sorter-utils class-variance-authority clsx lucide-react react react-dom
```

## 🎯 Quick Start

```tsx
import { DataTable, ColumnDef } from "tanstack-shadcn-table";

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
};

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    filter: {
      type: "text",
      field: "firstName",
      placeholder: "Search first name...",
    },
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "age",
    header: "Age",
    filter: {
      type: "range",
      field: "age",
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

const data: Person[] = [
  { firstName: "John", lastName: "Doe", age: 30, email: "john@example.com" },
  { firstName: "Jane", lastName: "Smith", age: 25, email: "jane@example.com" },
];

function App() {
  return (
    <DataTable
      tableOptions={{
        data,
        columns,
        pagination: {
          pageSize: 10,
          totalRecords: data.length,
        },
      }}
    />
  );
}
```

## 📚 API Reference

### DataTable Props

| Prop                   | Type                  | Description                                    |
| ---------------------- | --------------------- | ---------------------------------------------- |
| `tableOptions`         | `TableOptions<TData>` | Main configuration object for the table        |
| `className`            | `string`              | Additional CSS classes for the table container |
| `TableComponent`       | `React.ElementType`   | Custom table component (default: shadcn Table) |
| `TableHeaderComponent` | `React.ElementType`   | Custom table header component                  |
| `TableRowComponent`    | `React.ElementType`   | Custom table row component                     |
| `TableCellComponent`   | `React.ElementType`   | Custom table cell component                    |
| `TableHeadComponent`   | `React.ElementType`   | Custom table head component                    |
| `TableBodyComponent`   | `React.ElementType`   | Custom table body component                    |
| `TableFooterComponent` | `React.ElementType`   | Custom table footer component                  |

### TableOptions

```tsx
type TableOptions<T> = {
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

  // State management (optional - for controlled components)
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  sorting?: SortingState[];
  onSortingChange?: (sorting: SortingState[]) => void;
  paginationState?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  columnVisibility?: Record<string, boolean>;
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
  columnOrder?: string[];
  onColumnOrderChange?: (order: string[]) => void;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (selection: Record<string, boolean>) => void;
  columnSizing?: ColumnSizingState;
  onColumnSizingChange?: (sizing: ColumnSizingState) => void;
  defaultColumn?: {
    size?: number;
    minSize?: number;
    maxSize?: number;
  };

  // Lazy loading
  lazy?: boolean;
  onLazyLoad?: (event: LazyLoadEvent) => void;
};
```

### ColumnDef

```tsx
type ColumnDef<T> = {
  accessorKey?: string;
  accessorFn?: (row: T) => any;
  id?: string;
  header?: string | React.ComponentType;
  cell?: (info: CellContext<T, unknown>) => any;
  footer?: string | React.ComponentType;
  filter?: FilterType<T>;
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  enableSorting?: boolean;
  enableHiding?: boolean;
  columns?: ColumnDef<T>[]; // For grouped columns

  // Column sizing properties
  size?: number;
  minSize?: number;
  maxSize?: number;
  enableResizing?: boolean;
};
```

### Filter Types

#### Text Filter

```tsx
{
  type: 'text';
  field: string;
  placeholder: string;
  showList?: boolean;
  showTotal?: boolean;
}
```

#### Range Filter

```tsx
{
  type: 'range';
  field: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  showLimit?: boolean;
  minLimit?: number | 'faceted';
  maxLimit?: number | 'faceted';
}
```

#### Select Filter

```tsx
{
  type: 'select' | 'multi-select';
  field: string;
  options: any[];
  optionLabel: string;
  optionValue: string;
  allLabel?: string;
}
```

#### Boolean Filter

```tsx
{
  type: 'boolean';
  field: string;
  trueLabel?: string;
  falseLabel?: string;
  allLabel?: string;
}
```

#### Custom Filter

```tsx
{
  type: "custom";
  field: string;
  component: React.ComponentType<{ column: Column<T> }>;
}
```

## 🎨 Examples

### Basic Table with Filtering

```tsx
import { DataTable, ColumnDef } from "tanstack-shadcn-table";

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    filter: {
      type: "text",
      field: "firstName",
      placeholder: "Search first name...",
    },
  },
  {
    accessorKey: "age",
    header: "Age",
    filter: {
      type: "range",
      field: "age",
      showLimit: true,
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    filter: {
      type: "select",
      field: "status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      optionLabel: "label",
      optionValue: "value",
    },
  },
];

<DataTable
  tableOptions={{
    data,
    columns,
    filter: true,
    globalFilter: {
      show: true,
    },
  }}
/>;
```

### Table with Pagination

```tsx
<DataTable
  tableOptions={{
    data,
    columns,
    pagination: {
      pageSize: 10,
      totalRecords: 1000,
      pageSizeOptions: [5, 10, 20, 50],
      mode: "advanced",
      layout: ["total", "pageSize", "goto", "buttons"],
      pageSizeLabel: "Rows per page:",
      goToPageLabel: "Go to page:",
      totalLabel: "Total: {total} records",
    },
  }}
/>
```

### Table with Row Selection

```tsx
const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

<DataTable
  tableOptions={{
    data,
    columns,
    rowSelection,
    onRowSelectionChange: setRowSelection,
  }}
/>;
```

### Table with Column Reordering

```tsx
const [columnOrder, setColumnOrder] = useState<string[]>([
  "firstName",
  "lastName",
  "age",
]);

<DataTable
  tableOptions={{
    data,
    columns,
    reorderable: true,
    columnOrder,
    onColumnOrderChange: setColumnOrder,
  }}
/>;
```

### Lazy Loading Table

```tsx
const [data, setData] = useState<Person[]>([]);

const handleLazyLoad = (event: LazyLoadEvent) => {
  // Fetch data from server based on event parameters
  fetchDataFromServer({
    page: event.page,
    pageSize: event.rows,
    filters: event.filters,
    sorting: event.sorting,
    globalFilter: event.globalFilter,
  }).then(setData);
};

<DataTable
  tableOptions={{
    data,
    columns,
    lazy: true,
    onLazyLoad: handleLazyLoad,
    pagination: {
      pageSize: 20,
      totalRecords: 1000,
    },
  }}
/>;
```

### Grouped Columns

```tsx
const columns: ColumnDef<Person>[] = [
  {
    header: "Name",
    columns: [
      {
        accessorKey: "firstName",
        header: "First Name",
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
      },
    ],
  },
  {
    header: "Details",
    columns: [
      {
        accessorKey: "age",
        header: "Age",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
    ],
  },
];
```

### Custom Cell Rendering

```tsx
const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => (
      <img
        src={row.original.avatarUrl}
        alt="Avatar"
        className="w-8 h-8 rounded-full"
      />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
];
```

### Table with Column Resizing

```tsx
const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
    size: 200,
    minSize: 100,
    maxSize: 400,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    size: 150,
    enableResizing: false, // Disable resizing for this column
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 250,
  },
];

<DataTable
  tableOptions={{
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: "onChange", // or "onEnd"
    columnResizeDirection: "ltr", // or "rtl"
    columnSizing,
    onColumnSizingChange: setColumnSizing,
    defaultColumn: {
      size: 150,
      minSize: 50,
      maxSize: 500,
    },
  }}
/>;
```

## 🎨 Styling

The library uses Tailwind CSS classes and can be customized through:

1. **CSS Classes**: Pass custom classes through `className`, `rowClassName`, `colClassName`, etc.
2. **Custom Components**: Replace default components with your own
3. **Tailwind Configuration**: Customize the design system

### Custom Styling Example

```tsx
<DataTable
  className="my-custom-table"
  tableOptions={{
    data,
    columns,
    rowClassName: "hover:bg-gray-50",
    colClassName: "px-4 py-2",
    filterRowClassName: "bg-gray-100",
  }}
/>
```

## 🔧 Advanced Usage

### Server-Side Operations

```tsx
const [tableState, setTableState] = useState({
  pagination: { pageIndex: 0, pageSize: 10 },
  sorting: [],
  columnFilters: [],
  globalFilter: "",
});

const handleLazyLoad = async (event: LazyLoadEvent) => {
  const response = await fetch("/api/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  const result = await response.json();
  setData(result.data);
};

<DataTable
  tableOptions={{
    data,
    columns,
    lazy: true,
    onLazyLoad: handleLazyLoad,
    ...tableState,
    onPaginationChange: (pagination) =>
      setTableState((prev) => ({ ...prev, pagination })),
    onSortingChange: (sorting) =>
      setTableState((prev) => ({ ...prev, sorting })),
    onColumnFiltersChange: (columnFilters) =>
      setTableState((prev) => ({ ...prev, columnFilters })),
  }}
/>;
```

### Custom Filter Components

```tsx
const CustomDateFilter = ({ column }: { column: Column<Person> }) => {
  return (
    <input
      type="date"
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={(column.getFilterValue() as string) || ""}
      className="border rounded px-2 py-1"
    />
  );
};

const columns: ColumnDef<Person>[] = [
  {
    accessorKey: "birthDate",
    header: "Birth Date",
    filter: {
      type: "custom",
      field: "birthDate",
      component: CustomDateFilter,
    },
  },
];
```

### Column Sizing Configuration

The library provides comprehensive column sizing options based on [TanStack Table's Column Sizing Guide](https://tanstack.com/table/latest/docs/guide/column-sizing):

```tsx
// Default column sizing values
const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER,
};

// Configure column sizing
<DataTable
  tableOptions={{
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: "onEnd", // Recommended for large tables
    columnResizeDirection: "ltr",
    defaultColumn: {
      size: 200,
      minSize: 50,
      maxSize: 500,
    },
  }}
/>;
```

#### Column Resize Modes

- **`onEnd`** (default): Column size updates only when user finishes dragging. Better performance for complex tables.
- **`onChange`**: Column size updates immediately during dragging. Provides real-time feedback.

#### Performance Optimization

For large tables, the library automatically implements performance optimizations:

1. **CSS Variables**: Column widths are calculated once and applied via CSS variables
2. **Memoized Calculations**: Column size calculations are memoized to prevent unnecessary re-renders
3. **Optimized Rendering**: Table body is optimized during resize operations

```tsx
// Example with performance optimizations
const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

<DataTable
  tableOptions={{
    data: largeDataset,
    columns,
    enableColumnResizing: true,
    columnResizeMode: "onEnd", // Recommended for large tables
    columnSizing,
    onColumnSizingChange: setColumnSizing,
  }}
/>;
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TanStack Table](https://tanstack.com/table) - The powerful headless table library
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide React](https://lucide.dev/) - Beautiful icons

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.
