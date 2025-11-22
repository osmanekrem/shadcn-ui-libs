import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Preview } from "@/components/ui/preview";
import { Download, ArrowRight } from "lucide-react";
import Link from "next/link";
import { readFile } from "fs/promises";
import { join } from "path";
import { DataTable } from "@/components/custom/datatable";
import {
  BasicExample,
  FilteringExample,
  SelectionExample,
  ReorderingExample,
} from "@/components/custom/datatable-examples";

const components = {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Preview,
  DataTable,
  BasicExample,
  FilteringExample,
  SelectionExample,
  ReorderingExample,
  Download,
  ArrowRight,
  Link,
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="text-4xl font-bold tracking-tight mb-6 mt-8 first:mt-0"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-3xl font-semibold tracking-tight mb-4 mt-8 first:mt-0"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="text-2xl font-semibold tracking-tight mb-3 mt-6 first:mt-0"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-muted-foreground mb-4 leading-7" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc list-inside mb-4 space-y-2 text-muted-foreground"
      {...props}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal list-inside mb-4 space-y-2 text-muted-foreground"
      {...props}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="ml-4" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4"
      {...props}
    />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table
        className="w-full border-collapse border border-border"
        {...props}
      />
    </div>
  ),
  thead: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-muted" {...props} />
  ),
  tbody: (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody {...props} />
  ),
  tr: (props: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="border-b border-border" {...props} />
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border-r border-border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right last:border-r-0"
      {...props}
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="border-r border-border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right last:border-r-0"
      {...props}
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      {...props}
    />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mt-6 border-l-2 pl-6 italic text-muted-foreground"
      {...props}
    />
  ),
};

async function getMDXContent(slug: string) {
  try {
    const filePath = join(process.cwd(), "app/docs/components", `${slug}.mdx`);
    const content = await readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    return null;
  }
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getMDXContent(slug);

  if (!content) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
      <div className="mb-6 flex items-center justify-end">
        <Link
          href={`/docs/components/${slug}/api`}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          View API Reference →
        </Link>
      </div>
      <article className="max-w-none">
        <MDXRemote
          source={content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [[remarkGfm, {}]],
            },
          }}
        />
      </article>
    </div>
  );
}
