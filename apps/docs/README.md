# Docs - Shadcn UI Components Documentation

This is a [Next.js](https://nextjs.org) documentation site for shadcn/ui components and custom components.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding Components from Registry

This project includes a custom registry for `@tanstack-shadcn-table` components. You can add components using shadcn CLI:

### Adding DataTable Component

```bash
# First, install required dependencies
npm install @tanstack/react-table @tanstack/match-sorter-utils
npm install @dnd-kit/core @dnd-kit/modifiers @dnd-kit/sortable @dnd-kit/utilities

# Then add the component
npx shadcn@latest add datatable --registry @tanstack-shadcn-table
```

### Adding Multi-Select Component

```bash
npx shadcn@latest add multi-select --registry @tanstack-shadcn-table
```

## Registry Configuration

The registry is configured in `components.json`:

```json
{
  "registries": {
    "@tanstack-shadcn-table": "../../packages/ui-libs/registry/{name}.json"
  }
}
```

This points to the local registry in the monorepo, so make sure to build the registry first:

```bash
cd ../../packages/ui-libs
npm run build:registry
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
