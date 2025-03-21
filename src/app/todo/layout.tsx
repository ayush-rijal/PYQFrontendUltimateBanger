"use client"; // Required for SidebarProvider


import CustomProvider from "@/redux/provider";
import { RequireAuth } from "@/components/utils";
import { SidebarProvider} from "@/components/ui/sidebar";
import { AppSidebar } from "@/dashboard/components/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 w-full gap-3 mt-3 mr-3">
          
          <CustomProvider>{children}</CustomProvider>
        </main>
      </div>
    </SidebarProvider>
    </RequireAuth>
  );
}