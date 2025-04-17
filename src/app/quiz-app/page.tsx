"use client";
import { useGetRootCategoriesQuery } from "@/redux/features/quizApiSlice";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Clock, PlayCircle } from "lucide-react";
import Loading from "@/loading/Loading";

// Define props interface for category card
interface CategoryCardProps {
  title: string;
  variant: "purple" | "beige" | "green";
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
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

  const CategoryCard = ({ title, variant }: CategoryCardProps) => (
    <Link href={`/quiz-app/category/${title}`}>
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Card
          className={`h-full flex flex-col bg-white dark:bg-gray-800 border ${variantStyles[variant]} rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between pt-0">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                Explore this category and test your knowledge!
              </p>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1.5" />
                  <span>10 Questions</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  <span>15 mins</span>
                </div>
              </div>
            </div>
            <motion.div className="mt-6" whileHover={{ scale: 1.03 }}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg py-2.5 transition-colors duration-200 flex items-center justify-center">
                <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-105 transition-transform" />
                Explore Category
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
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

  // Limit to maximum 3 categories and assign variants
  const displayedCategories = categories?.slice(0, 3).map((cat, index) => ({
    title: cat.name,
    variant: ["purple", "beige", "green"][index] as
      | "purple"
      | "beige"
      | "green",
  }));

  // Filter categories based on search term
  const filteredCategories = displayedCategories?.filter((cat) =>
    cat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <motion.h1
          className="text-3xl md:text-4xl font-semibold mb-10 text-center tracking-tight  bg-clip-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Discover Quiz Categories
        </motion.h1>

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto mb-12">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            spellCheck="true"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-full rounded-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
          />
        </div>

        {/* Categories Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {filteredCategories?.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <CategoryCard title={cat.title} variant={cat.variant} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
