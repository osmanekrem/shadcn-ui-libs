import type { Meta, StoryObj } from "@storybook/react";
import { RowActions } from "../../src/table-elements/row-actions";
import { Edit, Trash2, Eye, Copy, Download, Share2 } from "lucide-react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { DataTable } from "../../src/components/custom/datatable";
import { ColumnDef } from "../../src/types/types";
import React from "react";

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
};

const sampleData: Person[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    age: 30,
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    age: 25,
  },
  {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    age: 35,
  },
];

const meta = {
  title: "Table Elements/RowActions",
  component: RowActions,
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
  },
} satisfies Meta<typeof RowActions>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to create a row for stories
const createMockRow = (data: Person) => {
  const table = useReactTable({
    data: [data],
    columns: [],
    getCoreRowModel: getCoreRowModel(),
  });
  return table.getRowModel().rows[0];
};

export const Default: Story = {
  render: () => {
    const row = createMockRow(sampleData[0]);
    return (
      <RowActions
        row={row}
        actions={[
          {
            id: "view",
            label: "View",
            icon: Eye,
            onClick: (row) =>
              alert(`Viewing: ${(row.original as Person).firstName}`),
          },
          {
            id: "edit",
            label: "Edit",
            icon: Edit,
            onClick: (row) =>
              alert(`Editing: ${(row.original as Person).firstName}`),
          },
          {
            id: "delete",
            label: "Delete",
            icon: Trash2,
            destructive: true,
            onClick: (row) =>
              alert(`Deleting: ${(row.original as Person).firstName}`),
          },
        ]}
      />
    );
  },
};

export const WithSeparators: Story = {
  render: () => {
    const row = createMockRow(sampleData[0]);
    return (
      <RowActions
        row={row}
        actions={[
          {
            id: "view",
            label: "View",
            icon: Eye,
            onClick: (row) =>
              alert(`Viewing: ${(row.original as Person).firstName}`),
          },
          {
            id: "edit",
            label: "Edit",
            icon: Edit,
            onClick: (row) =>
              alert(`Editing: ${(row.original as Person).firstName}`),
          },
          {
            id: "copy",
            label: "Copy",
            icon: Copy,
            onClick: (row) =>
              alert(`Copying: ${(row.original as Person).firstName}`),
          },
          {
            id: "delete",
            label: "Delete",
            icon: Trash2,
            destructive: true,
            separator: true,
            onClick: (row) =>
              alert(`Deleting: ${(row.original as Person).firstName}`),
          },
        ]}
      />
    );
  },
};

export const WithDisabledActions: Story = {
  render: () => {
    const row = createMockRow(sampleData[0]);
    return (
      <RowActions
        row={row}
        actions={[
          {
            id: "view",
            label: "View",
            icon: Eye,
            onClick: (row) =>
              alert(`Viewing: ${(row.original as Person).firstName}`),
          },
          {
            id: "edit",
            label: "Edit",
            icon: Edit,
            disabled: true,
            onClick: (row) =>
              alert(`Editing: ${(row.original as Person).firstName}`),
          },
          {
            id: "delete",
            label: "Delete",
            icon: Trash2,
            destructive: true,
            disabled: (row) => (row.original as Person).age < 30,
            onClick: (row) =>
              alert(`Deleting: ${(row.original as Person).firstName}`),
          },
        ]}
      />
    );
  },
};

export const WithoutIcons: Story = {
  render: () => {
    const row = createMockRow(sampleData[0]);
    return (
      <RowActions
        row={row}
        actions={[
          {
            id: "view",
            label: "View Details",
            onClick: (row) =>
              alert(`Viewing: ${(row.original as Person).firstName}`),
          },
          {
            id: "edit",
            label: "Edit Record",
            onClick: (row) =>
              alert(`Editing: ${(row.original as Person).firstName}`),
          },
          {
            id: "delete",
            label: "Delete Record",
            destructive: true,
            onClick: (row) =>
              alert(`Deleting: ${(row.original as Person).firstName}`),
          },
        ]}
      />
    );
  },
};

export const InTable: Story = {
  render: () => {
    const columns: ColumnDef<Person>[] = [
      {
        accessorKey: "firstName",
        header: "First Name",
      },
      {
        accessorKey: "lastName",
        header: "Last Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "age",
        header: "Age",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <RowActions
            row={row}
            actions={[
              {
                id: "view",
                label: "View",
                icon: Eye,
                onClick: (row) => {
                  const person = row.original as Person;
                  alert(`Viewing: ${person.firstName} ${person.lastName}`);
                },
              },
              {
                id: "edit",
                label: "Edit",
                icon: Edit,
                onClick: (row) => {
                  const person = row.original as Person;
                  alert(`Editing: ${person.firstName} ${person.lastName}`);
                },
              },
              {
                id: "copy",
                label: "Copy",
                icon: Copy,
                onClick: (row) => {
                  const person = row.original as Person;
                  navigator.clipboard.writeText(person.email);
                  alert(`Copied email: ${person.email}`);
                },
              },
              {
                id: "download",
                label: "Download",
                icon: Download,
                separator: true,
                onClick: (row) => {
                  const person = row.original as Person;
                  alert(`Downloading data for: ${person.firstName}`);
                },
              },
              {
                id: "share",
                label: "Share",
                icon: Share2,
                onClick: (row) => {
                  const person = row.original as Person;
                  alert(`Sharing: ${person.firstName} ${person.lastName}`);
                },
              },
              {
                id: "delete",
                label: "Delete",
                icon: Trash2,
                destructive: true,
                separator: true,
                onClick: (row) => {
                  const person = row.original as Person;
                  if (
                    confirm(
                      `Are you sure you want to delete ${person.firstName}?`
                    )
                  ) {
                    alert(`Deleted: ${person.firstName} ${person.lastName}`);
                  }
                },
              },
            ]}
          />
        ),
      },
    ];

    return (
      <div className="w-full max-w-4xl">
        <DataTable
          tableOptions={{
            data: sampleData,
            columns,
          }}
        />
      </div>
    );
  },
};

export const CustomTrigger: Story = {
  render: () => {
    const row = createMockRow(sampleData[0]);
    return (
      <RowActions
        row={row}
        trigger={
          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Actions
          </button>
        }
        actions={[
          {
            id: "view",
            label: "View",
            icon: Eye,
            onClick: (row) =>
              alert(`Viewing: ${(row.original as Person).firstName}`),
          },
          {
            id: "edit",
            label: "Edit",
            icon: Edit,
            onClick: (row) =>
              alert(`Editing: ${(row.original as Person).firstName}`),
          },
          {
            id: "delete",
            label: "Delete",
            icon: Trash2,
            destructive: true,
            onClick: (row) =>
              alert(`Deleting: ${(row.original as Person).firstName}`),
          },
        ]}
      />
    );
  },
};

export const DifferentAlignments: Story = {
  render: () => {
    const row = createMockRow(sampleData[0]);
    const actions = [
      {
        id: "view",
        label: "View",
        icon: Eye,
        onClick: () => {},
      },
      {
        id: "edit",
        label: "Edit",
        icon: Edit,
        onClick: () => {},
      },
      {
        id: "delete",
        label: "Delete",
        icon: Trash2,
        destructive: true,
        onClick: () => {},
      },
    ];

    return (
      <div className="space-y-8 p-8">
        <div>
          <p className="mb-2 text-sm font-medium">Align: start</p>
          <RowActions row={row} actions={actions} align="start" />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Align: center</p>
          <RowActions row={row} actions={actions} align="center" />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Align: end (default)</p>
          <RowActions row={row} actions={actions} align="end" />
        </div>
      </div>
    );
  },
};
