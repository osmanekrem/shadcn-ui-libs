# Registry Kullanım Örnekleri

## 🎯 Hızlı Başlangıç

### Adım 1: Projenizi Hazırlayın

```bash
# Yeni bir Next.js projesi oluşturun (veya mevcut projenizi kullanın)
npx create-next-app@latest my-app
cd my-app
```

### Adım 2: Shadcn UI Kurulumu

```bash
# Shadcn UI'ı kurun
npx shadcn@latest init
```

### Adım 3: Gerekli Shadcn Bileşenlerini Ekleyin

```bash
npx shadcn@latest add table
npx shadcn@latest add button
npx shadcn@latest add checkbox
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add dropdown-menu
```

### Adım 4: NPM Paketlerini Kurun

```bash
npm install @tanstack/react-table @tanstack/match-sorter-utils
npm install @dnd-kit/core @dnd-kit/modifiers @dnd-kit/sortable @dnd-kit/utilities
npm install lucide-react
```

### Adım 5: Registry'yi Ekleyin

`components.json` dosyanızı açın ve `registries` bölümünü ekleyin:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  },
  "registries": {
    "@tanstack-shadcn-table": "https://raw.githubusercontent.com/osmanekrem/tanstack-shadcn-table/main/packages/ui-libs/registry/{name}.json"
  }
}
```

### Adım 6: DataTable Bileşenini Ekleyin

```bash
npx shadcn@latest add datatable --registry @tanstack-shadcn-table
```

Bu komut şunları yapacak:

- `components/custom/datatable/` klasörünü oluşturacak
- Gerekli tüm dosyaları ekleyecek
- `lib/` ve `types/` klasörlerine gerekli dosyaları ekleyecek

### Adım 7: Kullanın!

```tsx
// app/page.tsx
import { DataTable, ColumnDef } from "@/components/custom/datatable";
import type { TableOptions } from "@/types/types";

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  status: "active" | "inactive";
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

const data: Person[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    age: 30,
    email: "john@example.com",
    status: "active",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    age: 25,
    email: "jane@example.com",
    status: "inactive",
  },
  {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    age: 35,
    email: "bob@example.com",
    status: "active",
  },
];

export default function Home() {
  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">DataTable Örneği</h1>
      <DataTable
        tableOptions={{
          data,
          columns,
          pagination: {
            pageSize: 10,
            totalRecords: data.length,
          },
          globalFilter: {
            show: true,
          },
          filter: true,
          showFilterButton: true,
        }}
      />
    </main>
  );
}
```

## 🔄 Lokal Registry Kullanımı (Monorepo)

Eğer bu paketi aynı monorepo içinde kullanıyorsanız:

```json
{
  "registries": {
    "@tanstack-shadcn-table": "../../packages/ui-libs/registry/{name}.json"
  }
}
```

## 📦 Tüm Bileşenler

```bash
# DataTable (ana bileşen)
npx shadcn@latest add datatable --registry @tanstack-shadcn-table

# Multi-select
npx shadcn@latest add multi-select --registry @tanstack-shadcn-table
```

## 🐛 Sorun Giderme

### Hata: "Component not found in registry"

- Registry URL'inin doğru olduğundan emin olun
- JSON dosyasının erişilebilir olduğundan emin olun (GitHub raw URL için)

### Hata: "Module not found"

- Tüm peer dependencies'in kurulu olduğundan emin olun
- Path alias'ların `tsconfig.json`'da doğru tanımlı olduğundan emin olun

### Hata: "Type errors"

- `types/types.ts` dosyasının eklendiğinden emin olun
- TypeScript versiyonunuzun güncel olduğundan emin olun
