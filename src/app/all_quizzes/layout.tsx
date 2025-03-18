"use client"; // Required for SidebarProvider

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/dashboard/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 w-full gap-3 mt-3 mr-3">{children}</main>
      </div>
    </SidebarProvider>
  );
}
