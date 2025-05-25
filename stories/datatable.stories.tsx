import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { DataTable } from "../src/components/custom/datatable";
import { ColumnDef, LazyLoadEvent, TableOptions } from "../src/types/types";

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
