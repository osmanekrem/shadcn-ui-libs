# Tanstack Shadcn Table

A powerful, feature-rich React table component built on top of TanStack Table v8 with shadcn/ui styling. This library provides a complete data table solution with advanced features like filtering, sorting, pagination, column reordering, row selection, and lazy loading.

## 📑 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
  - [API Reference & Examples](./EXAMPLES.md)
  - [Security Guide](./SECURITY.md)
  - [Internationalization (i18n)](./I18N.md)
- [Styling](#-styling)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

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
- **🔒 Security**: Built-in XSS protection and input sanitization
- **📱 Responsive**: Mobile-friendly design
- **🎯 TypeScript**: Full TypeScript support
- **🧩 Customizable**: Highly customizable components and styling
- **⚡ Optimized Bundle**: 55% smaller bundle size with peer dependencies
- **🌍 i18n Support**: Built-in internationalization for 5 languages

## 📦 Installation

### Option 1: NPM Package (Recommended)

```bash
npm install tanstack-shadcn-table
```

### Option 2: Shadcn Registry

You can also install components via shadcn CLI using the custom registry:

1. Add the registry to your `components.json`:

```json
{
  "registries": {
    "@tanstack-shadcn-table": "https://raw.githubusercontent.com/osmanekrem/tanstack-shadcn-table/main/packages/ui-libs/registry/{name}.json"
  }
}
```

2. Install components using shadcn CLI:

```bash
npx shadcn@latest add datatable --registry @tanstack-shadcn-table
npx shadcn@latest add multi-select --registry @tanstack-shadcn-table
```

### 📎 Styles

This library ships its own compiled CSS so Tailwind utilities used internally (e.g., `h-9`) always work, even if your app doesn't use Tailwind or purges different class sets.

Import the CSS once in your app entry:

```ts
import "tanstack-shadcn-table/dist/styles.css";
```

### 📊 Bundle Size

- **Main Bundle**: ~14.2KB (gzipped) - `index.esm.js`
- **CSS**: 7.4KB (gzipped) - `styles.css`
- **Total Production Bundle**: ~21.6KB (gzipped)
- **With Dependencies**: ~150KB (when peer dependencies are shared)
- **Optimization**: 55% smaller than traditional bundling approach

**i18n Bundle Sizes (tree-shakeable):**

- English: 0.8KB (gzipped)
- Turkish: 1.0KB (gzipped)
- Spanish: 1.0KB (gzipped)
- French: 1.0KB (gzipped)
- German: 1.0KB (gzipped)

**💡 Tip:** Use tree-shakeable imports to reduce bundle size. Only the imported language/utility will be included in your bundle.

### Peer Dependencies

This library is designed to be lightweight and efficient. Dependencies are split into **required** and **optional** peer dependencies to avoid bundle duplication.

#### ⚠️ Required Peer Dependencies

These dependencies are **always required** and must be installed before using the library:

```bash
npm install @radix-ui/react-checkbox @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-slot @tanstack/react-table @tanstack/match-sorter-utils class-variance-authority clsx lucide-react react react-dom tailwind-merge
```

**When to Install:**

- ✅ **Before first use**: Install immediately after installing `tanstack-shadcn-table`
- ✅ **During initial setup**: As part of your project setup process
- ✅ **If you see missing dependency errors**: When you encounter runtime errors about missing modules

Most modern package managers (npm 7+, yarn 2+, pnpm) will automatically install peer dependencies when you install the main package. However, if you're using an older version or see warnings, install them manually.

#### 🔀 Optional Peer Dependencies (DnD Kit)

The `@dnd-kit` packages are **optional** and only needed if you want to use **column reordering** functionality:

```bash
npm install @dnd-kit/core @dnd-kit/modifiers @dnd-kit/sortable @dnd-kit/utilities
```

**When to Install:**

- ✅ **Only if using column reordering**: Install when you set `reorderable: true` in your table options
- ✅ **Lazy loading**: The library uses dynamic imports, so DnD Kit is only loaded when needed
- ❌ **Not needed**: If you don't use column reordering, you can skip these packages entirely

**Example:**

```tsx
// Without column reordering - DnD Kit NOT needed
<DataTable
  tableOptions={{
    data,
    columns,
    // reorderable is false or not set
  }}
/>

// With column reordering - DnD Kit REQUIRED
<DataTable
  tableOptions={{
    data,
    columns,
    reorderable: true, // ← Requires @dnd-kit packages
    columnOrder,
    onColumnOrderChange: setColumnOrder,
  }}
/>
```

**Why Peer Dependencies?**

- **Bundle Size Optimization**: Reduces final bundle size by ~55%
- **Version Flexibility**: Allows you to use your preferred versions
- **Tree Shaking**: Better optimization when dependencies are external
- **Conflict Prevention**: Avoids version conflicts in your application
- **Optional Features**: DnD Kit is only loaded when column reordering is enabled

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

## 📚 Documentation

For detailed documentation, please refer to the following guides:

- **[API Reference & Examples](./EXAMPLES.md)** - Complete API documentation with code examples
  - DataTable props and configuration
  - Column definitions and filter types
  - Advanced usage patterns
  - Server-side operations
  - Custom components

- **[Security Guide](./SECURITY.md)** - Security features and best practices
  - XSS protection
  - Rate limiting
  - Input validation
  - Security utilities
  - Content Security Policy

- **[Internationalization (i18n)](./I18N.md)** - Multi-language support
  - Supported languages
  - Translation setup
  - Custom translations
  - Dynamic language switching

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
