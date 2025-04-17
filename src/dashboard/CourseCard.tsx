"use client";
import { useGetRootCategoriesQuery } from "@/redux/features/quizApiSlice";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";

// Define props interface for category card
interface CategoryCardProps {
  title: string;
  variant: "purple" | "beige" | "green";
}

export default function CourseCardDemo() {
  const { data: categories, isLoading, error } = useGetRootCategoriesQuery();

  // Variant styles for light and dark modes
  const variantStyles = {
    purple:
      "bg-purple-100 dark:bg-purple-900/50 border-purple-200 dark:border-purple-800",
    beige:
      "bg-amber-100 dark:bg-amber-900/50 border-amber-200 dark:border-amber-800",
    green:
      "bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-800",
  };

  // SVG icons (using same as example)
  const icons = {
    quiz: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-700 dark:text-gray-300"
      >
        <path
          d="M12 21.5C16.9706 21.5 21 17.4706 21 12.5C21 7.52944 16.9706 3.5 12 3.5C7.02944 3.5 3 7.52944 3 12.5C3 17.4706 7.02944 21.5 12 21.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M12 7.5V12.5L15 15.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  };

  const CategoryCard = ({ title, variant }: CategoryCardProps) => (
    <Link href={`/quiz-app/category/${title}`}>
      <Card
        className={`rounded-xl p-5 flex flex-col gap-4 border ${variantStyles[variant]} hover:shadow-lg transition-all duration-300`}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-lg bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-sm">
          <GraduationCap
            className="text-gray-800 dark:text-gray-200"
            size={24}
          />
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1">
          {title}
        </h3>

        {/* Stats - Using placeholder values since we don't have this data */}
        <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
          {icons.quiz}
          <span>Start Quiz</span>
        </div>
      </Card>
    </Link>
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: { 'status' in error ? error.status : error.message }
      </div>
    );

  // Limit to maximum 3 categories and assign variants
  const displayedCategories = categories?.slice(0, 3).map((cat, index) => ({
    title: cat.name,
    variant: ["purple", "beige", "green"][index] as
      | "purple"
      | "beige"
      | "green",
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {displayedCategories?.map((cat) => (
          <CategoryCard
            key={cat.title}
            title={cat.title}
            variant={cat.variant}
          />
        ))}
      </div>
    </div>
  );
}
