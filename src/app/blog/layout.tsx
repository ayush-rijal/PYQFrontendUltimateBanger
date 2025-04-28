"use client";
import { Provider } from 'react-redux';
import { store } from '@/store';
// import '../styles/globals.css';
// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Blog App',
//   description: 'A blog application with Django and Next.js',
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}