'use client';
import CustomProvider  from '@/redux/provider';
import { RequireAuth } from "@/components/utils";
// import './globals.css';

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
    
    
        <CustomProvider>{children}</CustomProvider>
     
      
    
    </RequireAuth>
  );
}





