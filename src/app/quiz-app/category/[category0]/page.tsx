'use client';
import { useGetCategory1Query } from '@/redux/features/quizApiSlice';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Category1Page() {
  const { category0 } = useParams() as { category0: string };
  const { data: categories, isLoading, error } = useGetCategory1Query(category0);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any).message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Subcategories for {category0}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories?.map((cat) => (
          <Link key={cat.name} href={`/quiz-app/category/${category0}/${cat.name}`}>
            <div className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200">
              <h2 className="text-xl font-semibold">{cat.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}