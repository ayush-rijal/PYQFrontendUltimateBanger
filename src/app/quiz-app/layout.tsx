'use client';
import CustomProvider  from '@/redux/provider';
import { RequireAuth } from "@/components/utils";

// import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
    <html lang="en">
      <body>
        <CustomProvider>{children}</CustomProvider>
      </body>
    </html>
    </RequireAuth>
  );
}





