import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Provider from "@/redux/provider";
import { Setup } from "@/components/utils";
import  { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PYQ-arun",
  description: "Full Auth application that provides jwt authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Provider>
          <Setup />

          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 my-8">
            {children}
            <Toaster position="top-center"/>
          </div>
        </Provider>
      </body>
    </html>
  );
}
