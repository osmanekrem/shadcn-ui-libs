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
