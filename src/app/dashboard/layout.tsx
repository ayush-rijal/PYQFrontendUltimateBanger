"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/dashboard/components/app-sidebar";
import { RequireAuth } from "@/components/utils";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <SidebarProvider>
        <div className="flex min-h-screen w-full flex-col md:flex-row">
          {/* Sidebar - Hidden by default on small screens */}
          <AppSidebar />

          {/* Mobile Header with Toggle Button */}
          <header className="md:hidden flex items-center justify-between p-4  rounded-4xl bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-lg font-semibold text-amber-900 dark:text-white cursor-pointer">
              Expore Sidebar
            </h1>
            <SidebarTrigger className="text-amber-700 dark:text-gray-300" />
          </header>

          {/* Main Content */}
          <main className="flex-3 w-full p-4 md:p-6 lg:p-8 overflow-auto">
            {children}
          </main>
        </div>
        {/* <Aimessage/> */}
      </SidebarProvider>
    </RequireAuth>
  );
}


