'use client';
import CustomProvider  from '@/redux/provider';
import { RequireAuth } from "@/components/utils";
import { AppSidebar } from "@/dashboard/components/app-sidebar";
import { SidebarProvider} from "@/components/ui/sidebar";
// import './globals.css';

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
    
      
      <SidebarProvider>

        <AppSidebar />
        <CustomProvider>{children}</CustomProvider>
      </SidebarProvider>
      
    
    </RequireAuth>
  );
}





