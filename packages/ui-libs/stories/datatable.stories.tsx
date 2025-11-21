import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { DataTable } from "../src/components/custom/datatable";
import { ColumnDef, LazyLoadEvent, TableOptions } from "../src/types/types";
import {
  availableLanguages,
  SupportedLanguage,
  TableTranslations,
} from "../src/lib/i18n";

type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  status: {
    label: string;
    id: string;
  };
  progress: number;
  isActive: boolean;
};

const defaultData: Person[] = [
  {
    firstName: "tanner",
    lastName: "linsley",
    age: 24,
    visits: 100,
    status: {
      label: "In Relationship",
      id: "in-relationship",
    },
    progress: 50,
    isActive: true,
  },
  {
    firstName: "tandy",
    lastName: "miller",
    age: 40,
    visits: 40,
    status: {
      label: "Single",
      id: "single",
    },
    progress: 80,
    isActive: false,
  },
  {
    firstName: "joe",
    lastName: "dirte",
    age: 45,
    visits: 20,
    status: {
      label: "Complicated",
      id: "complicated",
    },
    progress: 10,
    isActive: false,
  },
];

const meta = {
  title: "Tanstack Table/DataTable",
  component: DataTable<Person>,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    tableOptions: {
      onLazyLoad: { type: "function", control: false },
    },
  },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const columns: ColumnDef<Person>[] = [
  {
    header: "Name",
    id: "firstName",
    accessorKey: "firstName",
    cell: (info) => info.getValue(),
    filter: {
      type: "text",
      field: "firstName",
      placeholder: "Search first name",
      className: "w-32",
    },
  },
  {
    accessorFn: (row) => row.lastName,
    id: "lastName",
    cell: (info) => info.getValue(),
    header: () => <span>Last Name</span>,
  },
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    id: "fullName",
    header: "Full Name",
    cell: (info) => info.getValue(),
    filter: {
      type: "custom",
      component: ({ column }) => (
        <div>
          <input
            onChange={(e) => column.setFilterValue(e.target.value)}
            value={column.getFilterValue() as string}
          />
        </div>
      ),
      field: "fullName",
    },
    sortingFn: "fuzzy",
    filterFn: "fuzzy",
  },
  {
    id: "age",
    accessorKey: "age",
    header: () => "Age",
    filter: {
      type: "range",
      field: "age",
    },
  },
  {
    id: "visits",
    accessorKey: "visits",
    header: () => <span>Visits</span>,
    filter: {
      type: "range",
      field: "visits",
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: (info) => (info.getValue() as any).label,
    filter: {
      type: "select",
      field: "status.id",
      optionLabel: "label",
      optionValue: "id",
      options: [
        { label: "In Relationship", id: "in-relationship" },
        { label: "Single", id: "single" },
        { label: "Complicated", id: "complicated" },
      ],
    },
  },
  {
    id: "progress",
    accessorKey: "progress",
    header: "Profile Progress",
    filter: {
      type: "range",
      field: "progress",
      showLimit: true,
      minLimit: 0,
      maxLimit: 100,
    },
    enableSorting: true,
  },
  {
    id: "isActive",
    accessorKey: "isActive",
    header: "Is Active",
    cell: (info) => <div>{info.getValue() ? "Active" : "Inactive"}</div>,
    filter: {
      type: "boolean",
      field: "isActive",
    },
  },
];

export const Default: Story = {
  args: {
    tableOptions: {
      data: defaultData,
      columns: columns,
      filter: true,
      showFilterButton: true,
    } as TableOptions<Person>,

    className: "w-full flex flex-col min-w-screen",
  },
};

export const WithPagination: Story = {
  args: {
    tableOptions: {
      data: defaultData,
      columns: columns,

      pagination: {
        pageSize: 20,
        totalRecords: 500,
        pageSizeLabel: "Rows per page",
        goToPageLabel: "Go to page",
        mode: "default",
      },
    },
  },
};

function onLazyLoad(event: LazyLoadEvent) {
  let lazyData: Person[] = [];
  for (let i = 0; i < 500; i++) {
    lazyData.push({
      firstName: `tanner ${i}`,
      lastName: "linsley",
      age: 24,
      visits: 100,
      status: {
        label: "In Relationship",
        id: "in-relationship",
      },
      progress: 50,
      isActive: true,
    });
  }
  if (event.filters?.length > 0 || event.sorting?.length > 0) {
    const { sorting } = event;
    const { filters } = event;
    filters.forEach((filter) => {
      const { value, id } = filter;
      const filterType = columns.find((col) => col.id === id)?.filter?.type;
      if (value) {
        switch (filterType) {
          case "select":
          case "multi-select":
            lazyData = lazyData.filter((item) => {
              const itemValue = item[filter.id];
              return itemValue?.id === value;
            });
            break;
          case "boolean":
            lazyData = lazyData.filter((item) => {
              const itemValue = item[filter.id];
              return itemValue === value;
            });
            break;
          case "date":
            lazyData = lazyData.filter((item) => {
              const itemValue = item[filter.id];
              return itemValue === value;
            });
            break;
          case "date-range":
            lazyData = lazyData.filter((item) => {
              const itemValue = item[filter.id];
              return itemValue >= value[0] && itemValue <= value[1];
            });
            break;
          case "range":
            lazyData = lazyData.filter((item) => {
              const itemValue = item[filter.id];
              return itemValue >= value[0] && itemValue <= value[1];
            });
            break;
          case "text":
            lazyData = lazyData.filter((item) => {
              const itemValue = item[filter.id];
              return itemValue
                .toLowerCase()
                .includes((value as string).toLowerCase());
            });
            break;
          default:
            lazyData = lazyData.filter((item) => {
              const itemValue = item[filter.id];
              return itemValue
                .toLowerCase()
                .includes((value as string).toLowerCase());
            });
        }
      }
    });
    sorting.forEach((sort) => {
      const { id, desc } = sort;
      lazyData = lazyData.sort((a, b) => {
        const aValue = a[id];
        const bValue = b[id];
        if (aValue < bValue) {
          return desc ? 1 : -1;
        }
        if (aValue > bValue) {
          return desc ? -1 : 1;
        }
        return 0;
      });
    });

    return lazyData.slice(0, event.rows);
  } else {
    const { first, rows } = event;
    const start = first;
    const end = first + rows;

    return lazyData.slice(start, end);
  }
}

export const ControlledPagination = () => {
  const [data, setData] = useState<Person[]>(defaultData);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  return (
    <DataTable<Person>
      tableOptions={{
        data: data,
        columns: columns,
        pagination: {
          pageSize: pageSize,
          totalRecords: 500,
          pageSizeLabel: "Rows per page",
          goToPageLabel: "Go to page",
          mode: "default",
        },
      }}
    />
  );
};

export const Lazy = () => {
  const [data, setData] = useState<Person[]>([]);
  return (
    <DataTable<Person>
      tableOptions={{
        data: data,
        columns: columns,
        onLazyLoad: (event) => {
          const lazyData = onLazyLoad(event);
          setData(lazyData);
          console.log("Lazy load event", event, lazyData);
        },

        pagination: {
          pageSize: 20,
          totalRecords: 500,
          pageSizeLabel: "Rows per page",
          goToPageLabel: "Go to page",
          mode: "default",
        },

        lazy: true,
      }}
    />
  );
};

export const ColumnsOrder = () => {
  const [data, setData] = useState<Person[]>(defaultData);
  const [columnsOrder, setColumnsOrder] = useState<string[]>([
    "firstName",
    "lastName",
    "fullName",
    "age",
    "visits",
    "status",
    "progress",
    "isActive",
  ]);

  return (
    <>
      <button>
        <span
          onClick={() => {
            setColumnsOrder([
              "firstName",
              "lastName",
              "fullName",
              "age",
              "visits",
              "status",
              "progress",
              "isActive",
            ]);
          }}
        >
          Reset
        </span>
      </button>
      <button>
        <span
          onClick={() => {
            setColumnsOrder((prev) =>
              prev.includes("fullName")
                ? prev.filter((col) => col !== "fullName")
                : [...prev, "fullName"]
            );
          }}
        >
          Toggle Full Name
        </span>
      </button>
      <DataTable<Person>
        className="w-full flex flex-col max-w-3xl"
        tableOptions={{
          data: data,
          columns: columns,
          columnOrder: columnsOrder,
          onColumnOrderChange: (order) => {
            setColumnsOrder(order);
            console.log("Column order changed", order);
          },
        }}
      />
    </>
  );
};

export const HeaderGroups = () => {
  const [data, setData] = useState<Person[]>(defaultData);

  const columns: ColumnDef<Person>[] = [
    {
      header: "Name",
      columns: [
        {
          accessorKey: "firstName",
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        },
        {
          accessorFn: (row) => row.lastName,
          id: "lastName",
          cell: (info) => info.getValue(),
          header: () => <span>Last Name</span>,
          footer: (props) => props.column.id,
        },
      ],
    },
    {
      header: "Info",
      columns: [
        {
          accessorKey: "age",
          header: () => "Age",
          footer: (props) => props.column.id,
        },
        {
          header: "More Info",
          columns: [
            {
              accessorKey: "visits",
              header: () => <span>Visits</span>,
              footer: (props) => props.column.id,
            },
            {
              accessorKey: "status",
              header: "Status",
              footer: (props) => props.column.id,
            },
            {
              accessorKey: "progress",
              header: "Profile Progress",
              footer: (props) => props.column.id,
            },
          ],
        },
      ],
    },
  ];

  return (
    <DataTable<Person>
      tableOptions={{
        data,
        columns,
      }}
    />
  );
};

export const Reorderable = () => {
  const [data, setData] = useState<Person[]>(defaultData);
  const [columnsOrder, setColumnsOrder] = useState<string[]>([
    "firstName",
    "lastName",
    "fullName",
    "age",
    "visits",
    "status",
    "progress",
    "isActive",
  ]);

  return (
    <DataTable<Person>
      tableOptions={{
        data: data,
        columns: columns,
        columnOrder: columnsOrder,
        onColumnOrderChange: (order) => {
          setColumnsOrder(order);
          console.log("Column order changed", order);
        },
        reorderable: true,
      }}
    />
  );
};

export const RowSelection = () => {
  const [data, setData] = useState<Person[]>(defaultData);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  return (
    <DataTable<Person>
      tableOptions={{
        data: data,
        columns: columns,
        rowSelection: rowSelection,
        onRowSelectionChange: (selection) => {
          setRowSelection(selection);
          console.log("Row selection changed", selection);
        },
        reorderable: true,
      }}
    />
  );
};

export const ColumnSizing = () => {
  const [data, setData] = useState<Person[]>(defaultData);
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});

  const resizableColumns: ColumnDef<Person>[] = [
    {
      header: "Name",
      id: "firstName",
      accessorKey: "firstName",
      cell: (info) => info.getValue(),
      size: 200,
      minSize: 100,
      maxSize: 400,
      filter: {
        type: "text",
        field: "firstName",
        placeholder: "Search first name",
        className: "w-32",
      },
    },
    {
      accessorFn: (row) => row.lastName,
      id: "lastName",
      cell: (info) => info.getValue(),
      header: () => <span>Last Name</span>,
      size: 150,
      minSize: 80,
      maxSize: 300,
    },
    {
      id: "age",
      accessorKey: "age",
      header: () => "Age",
      size: 80,
      minSize: 60,
      maxSize: 120,
      filter: {
        type: "range",
        field: "age",
      },
    },
    {
      id: "visits",
      accessorKey: "visits",
      header: () => <span>Visits</span>,
      size: 100,
      minSize: 80,
      maxSize: 150,
      filter: {
        type: "range",
        field: "visits",
      },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: (info) => (info.getValue() as any).label,
      size: 120,
      enableResizing: false, // Disable resizing for this column
      filter: {
        type: "select",
        field: "status.id",
        optionLabel: "label",
        optionValue: "id",
        options: [
          { label: "In Relationship", id: "in-relationship" },
          { label: "Single", id: "single" },
          { label: "Complicated", id: "complicated" },
        ],
      },
    },
    {
      id: "progress",
      accessorKey: "progress",
      header: "Profile Progress",
      size: 150,
      minSize: 100,
      maxSize: 250,
      filter: {
        type: "range",
        field: "progress",
        showLimit: true,
        minLimit: 0,
        maxLimit: 100,
      },
      enableSorting: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setColumnSizing({})}
        >
          Reset Column Sizes
        </button>
        <span className="text-sm text-gray-600">
          Drag column borders to resize. Status column is not resizable.
        </span>
      </div>

      <DataTable<Person>
        tableOptions={{
          data: data,
          columns: resizableColumns,
          enableColumnResizing: true,
          columnResizeMode: "onChange",
          columnSizing,
          onColumnSizingChange: (sizing) => {
            setColumnSizing(sizing);
            console.log("Column sizing changed", sizing);
          },
          defaultColumn: {
            size: 150,
            minSize: 50,
            maxSize: 500,
          },
          filter: true,
        }}
      />

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Current Column Sizes:</h3>
        <pre className="text-sm">{JSON.stringify(columnSizing, null, 2)}</pre>
      </div>
    </div>
  );
};

export const ColumnSizingPerformant = () => {
  const [data, setData] = useState<Person[]>(defaultData);
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <span className="text-sm text-gray-600">
          Performance optimized mode - resize updates on drag end only
        </span>
      </div>

      <DataTable<Person>
        tableOptions={{
          data: data,
          columns: columns,
          enableColumnResizing: true,
          columnResizeMode: "onEnd", // Better performance for complex tables
          columnSizing,
          onColumnSizingChange: setColumnSizing,
          defaultColumn: {
            size: 150,
            minSize: 50,
            maxSize: 400,
          },
        }}
      />
    </div>
  );
};

export const SecurityDemo = () => {
  const [data, setData] = useState<Person[]>(defaultData);
  const [securityLogs, setSecurityLogs] = useState<string[]>([]);

  // Simulate malicious data
  const maliciousData: Person[] = [
    {
      firstName: '<script>alert("XSS")</script>John',
      lastName: 'Doe"; DROP TABLE users; --',
      age: 999999999, // Large number
      visits: -1000000, // Negative number
      status: {
        label: '<img src="x" onerror="alert(\'XSS\')">',
        id: "malicious",
      },
      progress: 150, // Out of range
      isActive: true,
    },
    ...defaultData,
  ];

  const addSecurityLog = (message: string) => {
    setSecurityLogs((prev) => [
      ...prev.slice(-9),
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">🔒 Security Demo</h3>
        <p className="text-sm text-yellow-700">
          This demo shows how the table handles potentially malicious input. All
          inputs are automatically sanitized and validated.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => {
            setData(maliciousData);
            addSecurityLog(
              "Loaded data with potential XSS and injection attempts"
            );
          }}
        >
          Load Malicious Data
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => {
            setData(defaultData);
            addSecurityLog("Loaded clean data");
          }}
        >
          Load Clean Data
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          onClick={() => {
            setSecurityLogs([]);
          }}
        >
          Clear Logs
        </button>
      </div>

      <DataTable<Person>
        tableOptions={{
          data: data,
          columns: columns,
          filter: true,
          globalFilter: {
            show: true,
          },
        }}
      />

      {securityLogs.length > 0 && (
        <div className="bg-gray-50 border rounded p-4">
          <h4 className="font-semibold mb-2">Security Logs:</h4>
          <div className="space-y-1 text-sm font-mono">
            {securityLogs.map((log, index) => (
              <div key={index} className="text-gray-700">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          Security Features Demonstrated:
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✅ XSS prevention in cell content</li>
          <li>✅ SQL injection prevention in filters</li>
          <li>✅ Number validation and bounds checking</li>
          <li>✅ Input sanitization in search</li>
          <li>✅ Rate limiting for requests</li>
          <li>✅ Content length validation</li>
        </ul>
      </div>
    </div>
  );
};

export const I18nDemo = () => {
  const [data, setData] = useState<Person[]>(defaultData);
  const [currentLanguage, setCurrentLanguage] =
    useState<SupportedLanguage>("en");
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // Extended data for better demonstration
  const extendedData: Person[] = [
    ...defaultData,
    {
      firstName: "alice",
      lastName: "johnson",
      age: 28,
      visits: 75,
      status: {
        label: "Single",
        id: "single",
      },
      progress: 65,
      isActive: true,
    },
    {
      firstName: "bob",
      lastName: "smith",
      age: 35,
      visits: 120,
      status: {
        label: "In Relationship",
        id: "in-relationship",
      },
      progress: 90,
      isActive: false,
    },
    {
      firstName: "charlie",
      lastName: "brown",
      age: 42,
      visits: 200,
      status: {
        label: "Complicated",
        id: "complicated",
      },
      progress: 30,
      isActive: true,
    },
  ];

  const currentTranslations = availableLanguages[currentLanguage].translations;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <h3 className="font-semibold text-blue-800 mb-2">
          🌍 Internationalization Demo
        </h3>
        <p className="text-sm text-blue-700 mb-4">
          This demo showcases the table's internationalization features. Switch
          between languages to see how all text elements are translated,
          including pagination, filters, buttons, and accessibility labels.
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-blue-800">
            Select Language:
          </span>
          {Object.entries(availableLanguages).map(([code, { name }]) => (
            <button
              key={code}
              onClick={() => setCurrentLanguage(code as SupportedLanguage)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentLanguage === code
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border border-blue-300 hover:bg-blue-50"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <DataTable<Person>
        tableOptions={{
          data: extendedData,
          columns: columns,
          translations: currentTranslations,
          filter: true,
          globalFilter: {
            show: true,
          },
          rowSelection,
          onRowSelectionChange: setRowSelection,
          reorderable: true,
          enableColumnResizing: true,
          pagination: {
            pageSize: 3, // Small page size to show pagination
            totalRecords: extendedData.length,
            pageSizeOptions: [3, 5, 10],
            mode: "advanced",
            layout: ["total", "pageSize", "goto", "buttons"],
          },
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 border rounded p-4">
          <h4 className="font-semibold mb-2">🎯 Features Demonstrated:</h4>
          <ul className="text-sm space-y-1">
            <li>✅ Pagination controls (Previous, Next, First, Last)</li>
            <li>✅ Page size selector</li>
            <li>✅ Go to page input</li>
            <li>✅ Filter labels (All, True, False, Min, Max)</li>
            <li>✅ Global search placeholder</li>
            <li>✅ Show/Hide filter buttons</li>
            <li>✅ Row selection labels</li>
            <li>✅ Accessibility aria-labels</li>
          </ul>
        </div>

        <div className="bg-gray-50 border rounded p-4">
          <h4 className="font-semibold mb-2">🌐 Supported Languages:</h4>
          <ul className="text-sm space-y-1">
            <li>
              <strong>English (en):</strong> Default language
            </li>
            <li>
              <strong>Türkçe (tr):</strong> Turkish translations
            </li>
            <li>
              <strong>Español (es):</strong> Spanish translations
            </li>
            <li>
              <strong>Français (fr):</strong> French translations
            </li>
            <li>
              <strong>Deutsch (de):</strong> German translations
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded p-4">
        <h4 className="font-semibold text-green-800 mb-2">💡 Usage Example:</h4>
        <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
          {`import { DataTable, turkishTranslations } from "tanstack-shadcn-table";

<DataTable
  tableOptions={{
    data,
    columns,
    translations: turkishTranslations, // Use Turkish translations
    // ... other options
  }}
/>`}
        </pre>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">
          🔧 Custom Translations:
        </h4>
        <p className="text-sm text-yellow-700 mb-2">
          You can also create custom translations by implementing the
          TableTranslations interface:
        </p>
        <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
          {`import { TableTranslations } from "tanstack-shadcn-table";

const customTranslations: TableTranslations = {
  pagination: {
    previous: "Geri",
    next: "İleri",
    // ... other translations
  },
  filters: {
    search: "Arama",
    all: "Hepsi",
    // ... other translations
  },
  // ... other sections
};`}
        </pre>
      </div>

      {Object.keys(rowSelection).length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded p-4">
          <h4 className="font-semibold text-purple-800 mb-2">
            📊 Selection Status (
            {currentTranslations.selection.selectedCount.replace(
              "{count}",
              String(Object.keys(rowSelection).length)
            )}
            ):
          </h4>
          <p className="text-sm text-purple-700">
            Selected rows: {Object.keys(rowSelection).join(", ")}
          </p>
          <button
            onClick={() => setRowSelection({})}
            className="mt-2 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
          >
            {currentTranslations.selection.deselectAll}
          </button>
        </div>
      )}
    </div>
  );
};

export const ColumnVisibility = () => {
  const [data, setData] = useState<Person[]>(defaultData);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({
    firstName: true,
    lastName: true,
    age: true,
    visits: true,
    status: true,
    progress: true,
    isActive: true,
  });

  return (
    <DataTable<Person>
      tableOptions={{
        data,
        columns,
        columnVisibility,
        onColumnVisibilityChange: setColumnVisibility,
      }}
    />
  );
};

export const AllFeatures = () => {
  // Extended data for better demonstration
  const extendedData: Person[] = [
    ...defaultData,
    {
      firstName: "alice",
      lastName: "johnson",
      age: 28,
      visits: 75,
      status: {
        label: "Single",
        id: "single",
      },
      progress: 65,
      isActive: true,
    },
    {
      firstName: "bob",
      lastName: "smith",
      age: 35,
      visits: 120,
      status: {
        label: "In Relationship",
        id: "in-relationship",
      },
      progress: 90,
      isActive: false,
    },
    {
      firstName: "charlie",
      lastName: "brown",
      age: 42,
      visits: 200,
      status: {
        label: "Complicated",
        id: "complicated",
      },
      progress: 30,
      isActive: true,
    },
    {
      firstName: "diana",
      lastName: "prince",
      age: 30,
      visits: 150,
      status: {
        label: "Single",
        id: "single",
      },
      progress: 85,
      isActive: true,
    },
    {
      firstName: "edward",
      lastName: "norton",
      age: 38,
      visits: 90,
      status: {
        label: "Complicated",
        id: "complicated",
      },
      progress: 45,
      isActive: false,
    },
  ];

  // All state management for controlled components
  const [data, setData] = useState<Person[]>(extendedData);
  const [currentLanguage, setCurrentLanguage] =
    useState<SupportedLanguage>("en");
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({
    firstName: true,
    lastName: true,
    fullName: true,
    age: true,
    visits: true,
    status: true,
    progress: true,
    isActive: true,
  });
  const [columnOrder, setColumnOrder] = useState<string[]>([
    "firstName",
    "lastName",
    "fullName",
    "age",
    "visits",
    "status",
    "progress",
    "isActive",
  ]);
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});
  const [showFilter, setShowFilter] = useState(true);
  const [isLazyMode, setIsLazyMode] = useState(false);

  // Enhanced columns with all filter types and features
  const enhancedColumns: ColumnDef<Person>[] = [
    {
      header: "Name",
      id: "firstName",
      accessorKey: "firstName",
      cell: (info) => (
        <div className="font-medium text-blue-600">
          {String(info.getValue()).charAt(0).toUpperCase() +
            String(info.getValue()).slice(1)}
        </div>
      ),
      size: 150,
      minSize: 100,
      maxSize: 300,
      filter: {
        type: "text",
        field: "firstName",
        placeholder: "Search first name",
        className: "w-32",
        showList: true,
        showTotal: true,
      },
      headerClassName: "bg-blue-50 font-bold",
      className: "text-center",
    },
    {
      accessorFn: (row) => row.lastName,
      id: "lastName",
      cell: (info) => (
        <div className="font-medium text-green-600">
          {String(info.getValue()).charAt(0).toUpperCase() +
            String(info.getValue()).slice(1)}
        </div>
      ),
      header: () => <span className="text-green-700">Last Name</span>,
      size: 150,
      minSize: 100,
      maxSize: 300,
      filter: {
        type: "text",
        field: "lastName",
        placeholder: "Search last name",
        showList: true,
      },
      headerClassName: "bg-green-50",
    },
    {
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      id: "fullName",
      header: "Full Name",
      cell: (info) => (
        <div className="font-semibold text-purple-600">
          {String(info.getValue())}
        </div>
      ),
      size: 200,
      minSize: 150,
      maxSize: 350,
      filter: {
        type: "custom",
        component: ({ column }) => (
          <div className="flex flex-col gap-1">
            <input
              className="px-2 py-1 border rounded text-sm"
              onChange={(e) => column.setFilterValue(e.target.value)}
              value={(column.getFilterValue() as string) || ""}
              placeholder="Custom full name search..."
            />
            <span className="text-xs text-gray-500">
              Custom filter component
            </span>
          </div>
        ),
        field: "fullName",
      },
      sortingFn: "fuzzy",
      filterFn: "fuzzy",
      headerClassName: "bg-purple-50",
    },
    {
      id: "age",
      accessorKey: "age",
      header: () => <span className="text-orange-700">Age</span>,
      cell: (info) => (
        <div className="text-center">
          <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
            {info.getValue() as number} years
          </span>
        </div>
      ),
      size: 100,
      minSize: 80,
      maxSize: 150,
      filter: {
        type: "range",
        field: "age",
        showLimit: true,
        minLimit: "faceted",
        maxLimit: "faceted",
        minPlaceholder: "Min age",
        maxPlaceholder: "Max age",
      },
      headerClassName: "bg-orange-50",
    },
    {
      id: "visits",
      accessorKey: "visits",
      header: () => <span className="text-indigo-700">Visits</span>,
      cell: (info) => (
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-indigo-600 font-medium">
              {info.getValue() as number}
            </span>
            <span className="text-xs text-gray-500">visits</span>
          </div>
        </div>
      ),
      size: 120,
      minSize: 100,
      maxSize: 180,
      filter: {
        type: "range",
        field: "visits",
        showLimit: true,
        minLimit: 0,
        maxLimit: 500,
      },
      headerClassName: "bg-indigo-50",
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Relationship Status",
      cell: (info) => {
        const status = info.getValue() as any;
        const colorMap = {
          "in-relationship": "bg-green-100 text-green-800",
          single: "bg-blue-100 text-blue-800",
          complicated: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${colorMap[status.id] || "bg-gray-100 text-gray-800"}`}
          >
            {status.label}
          </span>
        );
      },
      size: 180,
      minSize: 150,
      maxSize: 250,
      filter: {
        type: "select",
        field: "status.id",
        optionLabel: "label",
        optionValue: "id",
        allLabel: "All Statuses",
        options: [
          { label: "In Relationship", id: "in-relationship" },
          { label: "Single", id: "single" },
          { label: "Complicated", id: "complicated" },
        ],
      },
      headerClassName: "bg-pink-50",
    },
    {
      id: "progress",
      accessorKey: "progress",
      header: "Profile Progress",
      cell: (info) => {
        const progress = info.getValue() as number;
        return (
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-700 min-w-[40px]">
              {progress}%
            </span>
          </div>
        );
      },
      size: 200,
      minSize: 150,
      maxSize: 300,
      filter: {
        type: "range",
        field: "progress",
        showLimit: true,
        minLimit: 0,
        maxLimit: 100,
        minPlaceholder: "Min %",
        maxPlaceholder: "Max %",
      },
      enableSorting: true,
      headerClassName: "bg-teal-50",
    },
    {
      id: "isActive",
      accessorKey: "isActive",
      header: "Account Status",
      cell: (info) => {
        const isActive = info.getValue() as boolean;
        return (
          <div className="flex items-center justify-center">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isActive
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {isActive ? "🟢 Active" : "🔴 Inactive"}
            </span>
          </div>
        );
      },
      size: 140,
      minSize: 120,
      maxSize: 200,
      filter: {
        type: "boolean",
        field: "isActive",
        trueLabel: "Active Users",
        falseLabel: "Inactive Users",
        allLabel: "All Users",
      },
      headerClassName: "bg-gray-50",
    },
  ];

  const currentTranslations = availableLanguages[currentLanguage].translations;

  // Lazy load function for demonstration
  const handleLazyLoad = (event: LazyLoadEvent) => {
    // Simulate server-side processing
    let lazyData = [...extendedData];

    // Apply filters
    if (event.filters?.length > 0) {
      event.filters.forEach((filter) => {
        const { value, id } = filter;
        const filterType = enhancedColumns.find((col) => col.id === id)?.filter
          ?.type;

        if (value) {
          switch (filterType) {
            case "select":
              lazyData = lazyData.filter((item) => {
                const itemValue = item[filter.id as keyof Person];
                return (itemValue as any)?.id === value;
              });
              break;
            case "boolean":
              lazyData = lazyData.filter((item) => {
                const itemValue = item[filter.id as keyof Person];
                return itemValue === value;
              });
              break;
            case "range":
              lazyData = lazyData.filter((item) => {
                const itemValue = item[filter.id as keyof Person] as number;
                return itemValue >= value[0] && itemValue <= value[1];
              });
              break;
            case "text":
            default:
              lazyData = lazyData.filter((item) => {
                const itemValue = item[filter.id as keyof Person];
                return String(itemValue)
                  .toLowerCase()
                  .includes((value as string).toLowerCase());
              });
          }
        }
      });
    }

    // Apply sorting
    if (event.sorting?.length > 0) {
      event.sorting.forEach((sort) => {
        const { id, desc } = sort;
        lazyData = lazyData.sort((a, b) => {
          const aValue = a[id as keyof Person];
          const bValue = b[id as keyof Person];
          if (aValue < bValue) return desc ? 1 : -1;
          if (aValue > bValue) return desc ? -1 : 1;
          return 0;
        });
      });
    }

    // Apply pagination
    const { first, rows } = event;
    const paginatedData = lazyData.slice(first, first + rows);

    setData(paginatedData);
    console.log("Lazy load event:", event, "Returned data:", paginatedData);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🚀 DataTable - All Features Demo
        </h2>
        <p className="text-gray-600 mb-6">
          This comprehensive demo showcases every feature of the DataTable
          component including all filter types, pagination modes, column
          management, internationalization, and more.
        </p>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Language
            </label>
            <select
              value={currentLanguage}
              onChange={(e) =>
                setCurrentLanguage(e.target.value as SupportedLanguage)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {Object.entries(availableLanguages).map(([code, { name }]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsLazyMode(false);
                  setData(extendedData);
                }}
                className={`px-3 py-2 text-sm rounded ${
                  !isLazyMode
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Client
              </button>
              <button
                onClick={() => {
                  setIsLazyMode(true);
                  setData(extendedData.slice(0, 3));
                }}
                className={`px-3 py-2 text-sm rounded ${
                  isLazyMode
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Lazy
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Actions</label>
            <div className="flex gap-2">
              <button
                onClick={() => setRowSelection({})}
                className="px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Clear Selection
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Reset</label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setColumnSizing({});
                  setColumnOrder([
                    "firstName",
                    "lastName",
                    "fullName",
                    "age",
                    "visits",
                    "status",
                    "progress",
                    "isActive",
                  ]);
                  setColumnVisibility({
                    firstName: true,
                    lastName: true,
                    fullName: true,
                    age: true,
                    visits: true,
                    status: true,
                    progress: true,
                    isActive: true,
                  });
                }}
                className="px-3 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>

        {/* Feature Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <div className="text-green-800 font-medium text-sm">
              Selected Rows
            </div>
            <div className="text-green-600 text-lg font-bold">
              {Object.keys(rowSelection).length}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <div className="text-blue-800 font-medium text-sm">
              Visible Columns
            </div>
            <div className="text-blue-600 text-lg font-bold">
              {Object.values(columnVisibility).filter(Boolean).length}
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded p-3">
            <div className="text-purple-800 font-medium text-sm">
              Total Records
            </div>
            <div className="text-purple-600 text-lg font-bold">
              {isLazyMode ? extendedData.length : data.length}
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded p-3">
            <div className="text-orange-800 font-medium text-sm">Language</div>
            <div className="text-orange-600 text-lg font-bold">
              {availableLanguages[currentLanguage].name}
            </div>
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded p-3">
            <div className="text-teal-800 font-medium text-sm">Mode</div>
            <div className="text-teal-600 text-lg font-bold">
              {isLazyMode ? "Lazy" : "Client"}
            </div>
          </div>
          <div className="bg-pink-50 border border-pink-200 rounded p-3">
            <div className="text-pink-800 font-medium text-sm">Filters</div>
            <div className="text-pink-600 text-lg font-bold">
              {showFilter ? "Shown" : "Hidden"}
            </div>
          </div>
        </div>
      </div>

      {/* DataTable with all features */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <DataTable<Person>
          className="w-full"
          tableOptions={{
            data: data,
            columns: enhancedColumns,

            // Internationalization
            translations: currentTranslations,

            // Filtering
            filter: true,
            showFilterButton: true,
            showFilter,
            onShowFilterChange: setShowFilter,
            globalFilter: {
              show: true,
            },

            // Row selection
            rowSelection,
            onRowSelectionChange: setRowSelection,
            enableRowSelectionFn: (row) => {
              // Example: Only allow selection of active users
              return row.original.isActive;
            },

            // Column management
            columnVisibility,
            onColumnVisibilityChange: setColumnVisibility,
            columnOrder,
            onColumnOrderChange: setColumnOrder,
            reorderable: true,

            // Column sizing
            enableColumnResizing: true,
            columnResizeMode: "onChange",
            columnResizeDirection: "ltr",
            columnSizing,
            onColumnSizingChange: setColumnSizing,
            defaultColumn: {
              size: 150,
              minSize: 50,
              maxSize: 500,
            },

            // Pagination
            pagination: {
              pageSize: 4,
              totalRecords: isLazyMode ? extendedData.length : data.length,
              pageSizeOptions: [2, 4, 6, 10],
              mode: "advanced",
              layout: ["total", "pageSize", "goto", "buttons"],
              pageSizeLabel: currentTranslations.pagination.rowsPerPage,
              goToPageLabel: currentTranslations.pagination.goToPage,
              maxVisiblePages: 5,
            },

            // Lazy loading
            ...(isLazyMode
              ? { lazy: true, onLazyLoad: handleLazyLoad }
              : { lazy: false }),

            // Styling
            filterRowClassName: "bg-gray-50",
            rowClassName: "hover:bg-blue-50 transition-colors",
            colClassName: "border-r border-gray-100",
          }}
        />
      </div>

      {/* Feature Documentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-lg mb-3 text-blue-600">
            🔍 Filter Types
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              ✅ <strong>Text:</strong> First Name, Last Name
            </li>
            <li>
              ✅ <strong>Range:</strong> Age, Visits, Progress
            </li>
            <li>
              ✅ <strong>Select:</strong> Relationship Status
            </li>
            <li>
              ✅ <strong>Boolean:</strong> Account Status
            </li>
            <li>
              ✅ <strong>Custom:</strong> Full Name (custom component)
            </li>
            <li>
              ✅ <strong>Global:</strong> Search all columns
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-lg mb-3 text-green-600">
            📊 Column Features
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              ✅ <strong>Resizing:</strong> Drag column borders
            </li>
            <li>
              ✅ <strong>Reordering:</strong> Drag & drop columns
            </li>
            <li>
              ✅ <strong>Visibility:</strong> Show/hide columns
            </li>
            <li>
              ✅ <strong>Sorting:</strong> Click headers to sort
            </li>
            <li>
              ✅ <strong>Custom Cells:</strong> Rich content rendering
            </li>
            <li>
              ✅ <strong>Size Constraints:</strong> Min/max widths
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-lg mb-3 text-purple-600">
            ⚡ Advanced Features
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              ✅ <strong>Row Selection:</strong> Multi-select with conditions
            </li>
            <li>
              ✅ <strong>Lazy Loading:</strong> Server-side processing
            </li>
            <li>
              ✅ <strong>Pagination:</strong> Advanced mode with all controls
            </li>
            <li>
              ✅ <strong>i18n:</strong> Multi-language support
            </li>
            <li>
              ✅ <strong>State Management:</strong> Controlled components
            </li>
            <li>
              ✅ <strong>Performance:</strong> Optimized rendering
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-lg mb-3 text-orange-600">
            🎨 UI/UX Features
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              ✅ <strong>Responsive:</strong> Mobile-friendly design
            </li>
            <li>
              ✅ <strong>Theming:</strong> Custom styling support
            </li>
            <li>
              ✅ <strong>Animations:</strong> Smooth transitions
            </li>
            <li>
              ✅ <strong>Accessibility:</strong> ARIA labels & keyboard nav
            </li>
            <li>
              ✅ <strong>Loading States:</strong> Visual feedback
            </li>
            <li>
              ✅ <strong>Error Handling:</strong> Graceful degradation
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-lg mb-3 text-red-600">
            🔒 Security Features
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              ✅ <strong>Input Sanitization:</strong> XSS prevention
            </li>
            <li>
              ✅ <strong>Rate Limiting:</strong> Request throttling
            </li>
            <li>
              ✅ <strong>Validation:</strong> Data type checking
            </li>
            <li>
              ✅ <strong>Content Length:</strong> Input size limits
            </li>
            <li>
              ✅ <strong>SQL Injection:</strong> Filter protection
            </li>
            <li>
              ✅ <strong>CSRF Protection:</strong> Token validation
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-lg mb-3 text-teal-600">
            🌍 Internationalization
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              ✅ <strong>English:</strong> Default language
            </li>
            <li>
              ✅ <strong>Turkish:</strong> Türkçe desteği
            </li>
            <li>
              ✅ <strong>Spanish:</strong> Soporte en español
            </li>
            <li>
              ✅ <strong>French:</strong> Support français
            </li>
            <li>
              ✅ <strong>German:</strong> Deutsche Unterstützung
            </li>
            <li>
              ✅ <strong>Custom:</strong> Add your own translations
            </li>
          </ul>
        </div>
      </div>

      {/* Current State Display */}
      {Object.keys(rowSelection).length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-bold text-lg mb-3 text-indigo-600">
            📋 Current Selection
          </h3>
          <div className="bg-indigo-50 border border-indigo-200 rounded p-4">
            <p className="text-indigo-800 mb-2">
              {currentTranslations.selection.selectedCount.replace(
                "{count}",
                String(Object.keys(rowSelection).length)
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(rowSelection).map((rowId) => {
                const person = data[parseInt(rowId)];
                return person ? (
                  <span
                    key={rowId}
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {person.firstName} {person.lastName}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
