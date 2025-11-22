import type { Meta, StoryObj } from "@storybook/react";
import { FacetedFilter } from "../../src/table-elements/faceted-filter";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import { DataTable } from "../../src/datatable";
import { ColumnDef } from "../../src/types/types";
import React, { useMemo } from "react";
import {
  availableLanguages,
  SupportedLanguage,
  turkishTranslations,
  spanishTranslations,
  frenchTranslations,
  germanTranslations,
} from "../../src/lib/i18n";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import {
  fuzzyFilter,
  fuzzySort,
} from "../../src/datatable/actions";

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

const statusOptions = [
  {
    label: "Active",
    value: "active",
    icon: CheckCircle2,
  },
  {
    label: "Inactive",
    value: "inactive",
    icon: XCircle,
  },
  {
    label: "Pending",
    value: "pending",
    icon: Clock,
  },
];

const categoryOptions = [
  {
    label: "Electronics",
    value: "Electronics",
  },
  {
    label: "Clothing",
    value: "Clothing",
  },
  {
    label: "Food",
    value: "Food",
  },
];

const priorityOptions = [
  {
    label: "Low",
    value: "low",
    icon: AlertCircle,
  },
  {
    label: "Medium",
    value: "medium",
    icon: AlertCircle,
  },
  {
    label: "High",
    value: "high",
    icon: AlertCircle,
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
    title: {
      control: "text",
      description: "Title of the filter",
    },
  },
} satisfies Meta<typeof FacetedFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to create a column for stories
const createMockColumn = (accessorKey: keyof Product) => {
  const table = useReactTable<Product>({
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
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    sortingFns: {
      fuzzy: fuzzySort,
    },
  });
  return table.getColumn(accessorKey as string)!;
};

// @ts-expect-error - Storybook type issue with render functions
export const Default: Story = {
  render: () => {
    const column = createMockColumn("status");
    return (
      <FacetedFilter column={column} title="Status" options={statusOptions} />
    );
  },
};

// @ts-expect-error - Storybook type issue with render functions
export const CategoryFilter: Story = {
  render: () => {
    const column = createMockColumn("category");
    return (
      <FacetedFilter
        column={column}
        title="Category"
        options={categoryOptions}
      />
    );
  },
};

// @ts-expect-error - Storybook type issue with render functions
export const PriorityFilter: Story = {
  render: () => {
    const column = createMockColumn("priority");
    return (
      <FacetedFilter
        column={column}
        title="Priority"
        options={priorityOptions}
      />
    );
  },
};

// @ts-expect-error - Storybook type issue with render functions
export const WithIcons: Story = {
  render: () => {
    const column = createMockColumn("status");
    return (
      <FacetedFilter column={column} title="Status" options={statusOptions} />
    );
  },
};

// @ts-expect-error - Storybook type issue with render functions
export const Turkish: Story = {
  render: () => {
    const column = createMockColumn("status");
    return (
      <FacetedFilter
        column={column}
        title="Durum"
        options={statusOptions}
        translations={turkishTranslations}
      />
    );
  },
};

// @ts-expect-error - Storybook type issue with render functions
export const Spanish: Story = {
  render: () => {
    const column = createMockColumn("status");
    return (
      <FacetedFilter
        column={column}
        title="Estado"
        options={statusOptions}
        translations={spanishTranslations}
      />
    );
  },
};

// @ts-expect-error - Storybook type issue with render functions
export const French: Story = {
  render: () => {
    const column = createMockColumn("status");
    return (
      <FacetedFilter
        column={column}
        title="Statut"
        options={statusOptions}
        translations={frenchTranslations}
      />
    );
  },
};

// @ts-expect-error - Storybook type issue with render functions
export const German: Story = {
  render: () => {
    const column = createMockColumn("status");
    return (
      <FacetedFilter
        column={column}
        title="Status"
        options={statusOptions}
        translations={germanTranslations}
      />
    );
  },
};

// @ts-expect-error - Storybook type issue with render functions
export const LanguageSwitcher: Story = {
  render: () => {
    const [language, setLanguage] = React.useState<SupportedLanguage>("en");
    const column = createMockColumn("status");

    const translations = useMemo(
      () => availableLanguages[language].translations,
      [language]
    );

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          {Object.entries(availableLanguages).map(([code, { name }]) => (
            <button
              key={code}
              onClick={() => setLanguage(code as SupportedLanguage)}
              className={`px-3 py-1 rounded text-sm ${
                language === code
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <FacetedFilter
          column={column}
          title="Status"
          options={statusOptions}
          translations={translations}
        />
      </div>
    );
  },
};

// @ts-expect-error - Storybook type issue with render functions
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
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "priority",
        header: "Priority",
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

// @ts-expect-error - Storybook type issue with render functions
export const MultipleFilters: Story = {
  render: () => {
    const statusColumn = createMockColumn("status");
    const categoryColumn = createMockColumn("category");
    const priorityColumn = createMockColumn("priority");

    return (
      <div className="flex gap-2 flex-wrap">
        <FacetedFilter
          column={statusColumn}
          title="Status"
          options={statusOptions}
        />
        <FacetedFilter
          column={categoryColumn}
          title="Category"
          options={categoryOptions}
        />
        <FacetedFilter
          column={priorityColumn}
          title="Priority"
          options={priorityOptions}
        />
      </div>
    );
  },
};
