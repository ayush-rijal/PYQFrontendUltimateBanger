'use client';
import { useGetQuizFilesQuery } from '@/redux/features/quizApiSlice';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function QuizFilesPage() {
  const { category0, category1 } = useParams() as { category0: string; category1: string };
  const { data: quizFiles, isLoading, error } = useGetQuizFilesQuery({ category0, category1 });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any).message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Quizzes for {category1}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quizFiles?.map((quiz) => (
          <Link key={quiz.title} href={`/quiz-app/category/${category0}/${category1}/${quiz.title}`}>
            <div className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200">
              <h2 className="text-xl font-semibold">{quiz.title}</h2>
              <p className="text-sm text-gray-600">Created: {new Date(quiz.created_at).toLocaleDateString()}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}