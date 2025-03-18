"use client";
import { useGetQuizFilesQuery } from "@/redux/features/quizApiSlice";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon, ReloadIcon } from "lucide-react";

interface QuizCardProps {
  title: string;
  created_at: string;
  url: string;
  className: string;
}

const QuizCard = ({ title, created_at, url }: QuizCardProps) => (
  <Link
    href={url}
    className="group block transition-transform hover:scale-[1.02] focus:scale-[1.02]"
    aria-label={`Open ${title} quiz`}
  >
    <div className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out border border-border">
      <h2 className="text-xl font-semibold mb-2 text-primary">{title}</h2>
      <p className="text-sm text-muted-foreground">
        Created:{" "}
        {new Date(created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  </Link>
);

export default function QuizFilesPage() {
  const { category0, category1 } = useParams() as {
    category0: string;
    category1: string;
  };
  const {
    data: quizFiles,
    isLoading,
    error,
    refetch,
  } = useGetQuizFilesQuery({
    category0,
    category1,
  });

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error loading quizzes</AlertTitle>
          <AlertDescription>
            {"data" in error
              ? (error.data as { message: string })?.message
              : "Failed to load quizzes. Please try again."}
          </AlertDescription>
          <button
            onClick={refetch}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium"
          >
            <ReloadIcon className="h-4 w-4" />
            Retry
          </button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mt-2 ">
      <header className="mb-8 text-2xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-primary">
          {category1.replace(/-/g, " ")} Quizzes
        </h1>
        <p className="text-muted-foreground mt-2">
          Select a quiz to start testing your knowledge
        </p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  ">
          {quizFiles?.length ? (
            quizFiles.map((quiz) => (
              <QuizCard
                className=" border border-r-4 border-amber-500 hover:bg-amber-900 "
                key={quiz.title}
                title={quiz.title}
                created_at={quiz.created_at}
                url={`/quiz-app/category/${category0}/${category1}/${quiz.title}`}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                No quizzes available in this category
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
