"use client";



export default function TodoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Mobile Header with Toggle Button */}

      {/* Main Content */}
      <main className="flex-3 w-full p-4 md:p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
