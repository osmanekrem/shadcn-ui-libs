import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "../ui/sidebar";

const components = [
  {
    label: "DataTable",
    href: "/docs/components/datatable",
  },
];

const hooks = [
  {
    label: "useSidebar",
    href: "/docs/hooks/useSidebar",
  },
];

const sidebarItems = [
  {
    label: "General",
    href: "/docs",
    items: [
      {
        label: "Introduction",
        href: "/docs/introduction",
      },
      {
        label: "Installation",
        href: "/docs/installation",
      },
    ],
  },
  {
    label: "Components",
    href: "/docs/components",
    items: components,
  },
  {
    label: "Hooks",
    href: "/docs/hooks",
    items: hooks,
  },
];

export default function SidebarComponent() {
  return (
    <aside className="w-64 h-full bg-sidebar border-r">
      <div className="flex flex-col gap-4">
        {sidebarItems.map((item) => (
          <SidebarGroup key={item.label}>
            <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.label}>
                    <SidebarMenuButton asChild>
                      <Link href={subItem.href}>{subItem.label}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </div>
    </aside>
  );
}
