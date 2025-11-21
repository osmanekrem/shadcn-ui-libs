import Sidebar from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full relative">
      <SidebarProvider className="h-full w-full relative">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col">{children}</main>
      </SidebarProvider>
    </div>
  );
}
