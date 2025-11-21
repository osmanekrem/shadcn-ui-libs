"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewProps {
  children: React.ReactNode;
  code?: string;
  className?: string;
}

export function Preview({ children, code, className }: PreviewProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className={cn("my-6 w-full", className)}>
      <Tabs defaultValue="preview" className="w-full">
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          {code && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 gap-2"
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Copy
                </>
              )}
            </Button>
          )}
        </div>
        <TabsContent value="preview" className="mt-0">
          <div className="rounded-lg border bg-card p-6">{children}</div>
        </TabsContent>
        <TabsContent value="code" className="mt-0">
          <div className="relative">
            <pre className="overflow-x-auto rounded-lg border bg-muted p-4 text-sm">
              <code className="font-mono text-foreground whitespace-pre">
                {code}
              </code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
