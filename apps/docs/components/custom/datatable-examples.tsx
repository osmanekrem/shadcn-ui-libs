"use client";

import { DataTable } from "@/components/custom/datatable";
import type { ColumnDef } from "@/types/types";
import { useState } from "react";

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email?: string;
  status?: "active" | "inactive";
};

// Basic Example
const basicColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];

const basicData: Person[] = [
  { id: 1, firstName: "John", lastName: "Doe", age: 30, email: "john@example.com" },
  { id: 2, firstName: "Jane", lastName: "Smith", age: 25, email: "jane@example.com" },
  { id: 3, firstName: "Bob", lastName: "Johnson", age: 35, email: "bob@example.com" },
  { id: 4, firstName: "Alice", lastName: "Williams", age: 28, email: "alice@example.com" },
  { id: 5, firstName: "Charlie", lastName: "Brown", age: 32, email: "charlie@example.com" },
];

export function BasicExample() {
  return (
    <DataTable
      tableOptions={{
        data: basicData,
        columns: basicColumns,
        pagination: {
          pageSize: 10,
          totalRecords: basicData.length,
        },
      }}
    />
  );
}

// Filtering Example
const filteringColumns: ColumnDef<Person>[] = [
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

const filteringData: Person[] = [
  { id: 1, firstName: "John", lastName: "Doe", age: 30, status: "active" },
  { id: 2, firstName: "Jane", lastName: "Smith", age: 25, status: "inactive" },
  { id: 3, firstName: "Bob", lastName: "Johnson", age: 35, status: "active" },
  { id: 4, firstName: "Alice", lastName: "Williams", age: 28, status: "active" },
];

export function FilteringExample() {
  return (
    <DataTable
      tableOptions={{
        data: filteringData,
        columns: filteringColumns,
        filter: true,
        showFilterButton: true,
        globalFilter: {
          show: true,
        },
        pagination: {
          pageSize: 10,
          totalRecords: filteringData.length,
        },
      }}
    />
  );
}

// Selection Example
const selectionColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
];

const selectionData: Person[] = [
  { id: 1, firstName: "John", lastName: "Doe", age: 30 },
  { id: 2, firstName: "Jane", lastName: "Smith", age: 25 },
  { id: 3, firstName: "Bob", lastName: "Johnson", age: 35 },
  { id: 4, firstName: "Alice", lastName: "Williams", age: 28 },
];

export function SelectionExample() {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  return (
    <DataTable
      tableOptions={{
        data: selectionData,
        columns: selectionColumns,
        rowSelection: selectedRows,
        onRowSelectionChange: setSelectedRows,
        pagination: {
          pageSize: 10,
          totalRecords: selectionData.length,
        },
      }}
    />
  );
}

// Reordering Example
const reorderingColumns: ColumnDef<Person>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
];

const reorderingData: Person[] = [
  { id: 1, firstName: "John", lastName: "Doe", age: 30 },
  { id: 2, firstName: "Jane", lastName: "Smith", age: 25 },
  { id: 3, firstName: "Bob", lastName: "Johnson", age: 35 },
];

export function ReorderingExample() {
  return (
    <DataTable
      tableOptions={{
        data: reorderingData,
        columns: reorderingColumns,
        reorderable: true,
        pagination: {
          pageSize: 10,
          totalRecords: reorderingData.length,
        },
      }}
    />
  );
}

