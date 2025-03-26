"use client";
import { useState } from "react";
import { useGetCategory1Query } from "@/redux/features/quizApiSlice";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GraduationCap, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import Loading from "@/loading/Loading";
import { Input } from "@/components/ui/input";

// Define props interface for subcategory card
interface SubcategoryCardProps {
  title: string;
  variant: "purple" | "beige" | "green";
}

export default function Category1Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const { category0 } = useParams() as { category0: string };
  const {
    data: categories,
    isLoading,
    error,
  } = useGetCategory1Query(category0);

  // Variant styles for light and dark modes
  const variantStyles = {
    purple:
      "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30",
    beige:
      "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/30",
    green:
      "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30",
  };

  // Modern SVG icon
  const playIcon = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-600 dark:text-gray-300"
    >
      <path
        d="M5 5.5V18.5C5 19.3284 5.89543 19.8294 6.5 19.397L18.5 11.897C19.1046 11.4646 19.1046 10.5354 18.5 10.103L6.5 2.60304C5.89543 2.17061 5 2.67157 5 3.5V5.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );

  const SubcategoryCard = ({ title, variant }: SubcategoryCardProps) => (
    <Link href={`/quiz-app/category/${category0}/${title}`}>
      <Card
        className={`group relative overflow-hidden rounded-2xl p-6 border ${variantStyles[variant]} 
          hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-opacity-80`}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
          <div
            className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] 
            from-gray-200/20 via-transparent to-transparent"
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl bg-white/70 dark:bg-gray-800/70 flex items-center justify-center 
            shadow-sm mb-4 transform group-hover:scale-105 transition-transform duration-300"
          >
            <GraduationCap
              className="text-gray-800 dark:text-gray-200"
              size={24}
            />
          </div>

          {/* Title */}
          <h2
            className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 line-clamp-1 
            group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300"
          >
            {title}
          </h2>

          {/* Action */}
          <div
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 
            group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300"
          >
            {playIcon}
            <span>Explore Now</span>
          </div>
        </div>

        {/* Hover border effect */}
        <div
          className="absolute inset-0 rounded-2xl border border-transparent 
          group-hover:border-purple-200 dark:group-hover:border-purple-800/50 transition-colors duration-300"
        />
      </Card>
    </Link>
  );

  if (isLoading) return <Loading />;

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg font-medium bg-red-50 dark:bg-red-900/20 px-6 py-3 rounded-lg">
          Error:{" "}
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </div>
      </div>
    );

  // Assign variants to categories (cycling through 3 colors)
  const displayedCategories = categories?.slice(0, 3).map((cat, index) => ({
    title: cat.name,
    variant: ["purple", "beige", "green"][index % 3] as
      | "purple"
      | "beige"
      | "green",
  }));
  const filteredCategories = displayedCategories?.filter((cat) =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center">
        <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          {category0}
        </span>
        <span className="block text-xl md:text-2xl font-medium text-gray-600 dark:text-gray-400 mt-2">
          Choose Your Subcategory
        </span>
      </h1>
      <div className="relative max-w-lg mx-auto mb-12">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <Input
          type="text"
          spellCheck="true"
          placeholder="Search Sub-categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2.5 w-full rounded-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
        />
      </div>
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredCategories?.map((cat) => (
          <SubcategoryCard
            key={cat.title}
            title={cat.title}
            variant={cat.variant}
          />
        ))}
      </div>
    </div>
  );
}
