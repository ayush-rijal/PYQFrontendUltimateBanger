'use client';
import { useGetCategory0Query } from '@/redux/features/quizApiSlice';
import Link from 'next/link';

export default function Home() {
  const { data: categories, isLoading, error } = useGetCategory0Query();

  if (isLoading) return <div>LoadingHI...</div>;
  if (error) return <div>Error: {(error as any).message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Select a Category</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories?.map((cat) => (
          <Link key={cat.name} href={`/quiz-app/category/${cat.name}`}>
            <div className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200">
              <h2 className="text-xl font-semibold">{cat.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}