import type { Meta, StoryObj } from "@storybook/react";
import { FacetedFilter } from "../../src/table-elements/faceted-filter";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getFacetedRowModel, getFacetedUniqueValues } from "@tanstack/react-table";
import { DataTable } from "../../src/components/custom/datatable";
import { ColumnDef } from "../../src/types/types";
import React from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  status: "active" | "inactive" | "pending";
  priority: "low" | "medium" | "high";
  tags: string[];
};

const sampleData: Product[] = [
  {
    id: 1,
    name: "Product A",
    category: "Electronics",
    status: "active",
    priority: "high",
    tags: ["new", "featured"],
  },
  {
    id: 2,
    name: "Product B",
    category: "Clothing",
    status: "active",
    priority: "medium",
    tags: ["sale"],
  },
  {
    id: 3,
    name: "Product C",
    category: "Electronics",
    status: "pending",
    priority: "low",
    tags: ["new"],
  },
  {
    id: 4,
    name: "Product D",
    category: "Food",
    status: "inactive",
    priority: "high",
    tags: ["featured"],
  },
  {
    id: 5,
    name: "Product E",
    category: "Clothing",
    status: "active",
    priority: "medium",
    tags: ["new", "sale"],
  },
  {
    id: 6,
    name: "Product F",
    category: "Electronics",
    status: "active",
    priority: "high",
    tags: ["featured"],
  },
  {
    id: 7,
    name: "Product G",
    category: "Food",
    status: "pending",
    priority: "low",
    tags: ["new"],
  },
  {
    id: 8,
    name: "Product H",
    category: "Clothing",
    status: "inactive",
    priority: "medium",
    tags: ["sale"],
  },
];

const meta = {
  title: "Table Elements/FacetedFilter",
  component: FacetedFilter,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Alignment of the dropdown menu",
    },
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
      description: "Side of the trigger to show the dropdown",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "Size of the trigger button",
    },
    showCount: {
      control: "boolean",
      description: "Whether to show the count badge on the trigger",
    },
    maxOptions: {
      control: "number",
      description: "Maximum number of options to display",
    },
  },
} satisfies Meta<typeof FacetedFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to create a column for stories
const createMockColumn = (accessorKey: keyof Product) => {
  const table = useReactTable({
    data: sampleData,
    columns: [
      {
        accessorKey,
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });
  return table.getColumn(accessorKey as string)!;
};

export const Default: Story = {
  render: () => {
    const column = createMockColumn("status");
    return (
      <FacetedFilter
        column={column}
        title="Status"
        showCount
      />
    );
  },
};

export const CategoryFilter: Story = {
  render: () => {
    const column = createMockColumn("category");
    return (
      <FacetedFilter
        column={column}
        title="Category"
        showCount
      />
    );
  },
};

export const PriorityFilter: Story = {
  render: () => {
    const column = createMockColumn("priority");
    return (
      <FacetedFilter
        column={column}
        title="Priority"
        showCount
      />
    );
  },
};

export const WithoutCount: Story = {
  render: () => {
    const column = createMockColumn("status");
    return (
      <FacetedFilter
        column={column}
        title="Status"
        showCount={false}
      />
    );
  },
};

export const CustomTrigger: Story = {
  render: () => {
    const column = createMockColumn("status");
    const filterValue = column.getFilterValue() as string[] | undefined;
    const selectedCount = filterValue?.length || 0;
    
    return (
      <FacetedFilter
        column={column}
        title="Status"
        trigger={
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2">
            Filter Status
            {selectedCount > 0 && (
              <span className="bg-white text-blue-500 rounded-full px-2 py-0.5 text-xs">
                {selectedCount}
              </span>
            )}
          </button>
        }
      />
    );
  },
};

export const InTable: Story = {
  render: () => {
    const columns: ColumnDef<Product>[] = [
      {
        accessorKey: "name",
        header: "Product Name",
      },
      {
        accessorKey: "category",
        header: "Category",
        filter: {
          type: "multi-select",
          field: "category",
          options: [],
          optionLabel: "label",
          optionValue: "value",
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        filter: {
          type: "multi-select",
          field: "status",
          options: [],
          optionLabel: "label",
          optionValue: "value",
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        filter: {
          type: "multi-select",
          field: "priority",
          options: [],
          optionLabel: "label",
          optionValue: "value",
        },
      },
    ];

    return (
      <div className="w-full max-w-4xl">
        <DataTable
          tableOptions={{
            data: sampleData,
            columns,
            filter: true,
          }}
        />
      </div>
    );
  },
};

export const WithCustomFormatting: Story = {
  render: () => {
    const column = createMockColumn("status");
    return (
      <FacetedFilter
        column={column}
        title="Status"
        showCount
        formatOptionLabel={(value) => {
          const status = String(value);
          return status.charAt(0).toUpperCase() + status.slice(1);
        }}
      />
    );
  },
};

export const LimitedOptions: Story = {
  render: () => {
    const column = createMockColumn("category");
    return (
      <FacetedFilter
        column={column}
        title="Category"
        showCount
        maxOptions={2}
      />
    );
  },
};

export const DifferentAlignments: Story = {
  render: () => {
    const column = createMockColumn("status");
    return (
      <div className="space-y-8 p-8">
        <div>
          <p className="mb-2 text-sm font-medium">Align: start</p>
          <FacetedFilter
            column={column}
            title="Status"
            align="start"
            showCount
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Align: center</p>
          <FacetedFilter
            column={column}
            title="Status"
            align="center"
            showCount
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Align: end</p>
          <FacetedFilter
            column={column}
            title="Status"
            align="end"
            showCount
          />
        </div>
      </div>
    );
  },
};

