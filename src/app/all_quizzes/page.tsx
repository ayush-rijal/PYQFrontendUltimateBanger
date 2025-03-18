"use client"; // Required for client-side interactivity

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Clock, PlayCircle, Tag } from "lucide-react";
import axios from "axios";
import Loading from "@/loading/Loading";

interface Quiz {
  title: string;
  file: string;
  id: number;
  description?: string;
  questionCount?: number;
  estimatedTime?: number;
}

const QuizzesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, quizzesResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/quiz/category1/"),
          axios.get("http://127.0.0.1:8000/quiz/category1/All/"),
        ]);

        const categoryNames = (
          categoriesResponse.data as { name: string }[]
        ).map((cat) => cat.name);
        setCategories(["All", ...categoryNames]);
        setAllQuizzes(quizzesResponse.data as Quiz[]);
        setQuizzes(quizzesResponse.data as Quiz[]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/quiz/category0/${category}/`
      );
      setQuizzes(category === "All" ? allQuizzes : (response.data as Quiz[]));
    } catch (error) {
      console.error(`Error fetching quizzes for category ${category}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuizClick = (category: string, title: string) => {
    router.push(`/quiz/${category}/${title}`);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <motion.h1
          className="text-3xl md:text-4xl font-extrabold mb-10 text-center tracking-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Discover Your Next Quiz
        </motion.h1>

        {/* Filters Section */}
        <div className="mb-12 space-y-6">
          {/* Category Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={
                    category === selectedCategory ? "default" : "outline"
                  }
                  onClick={() => handleCategoryChange(category)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                    category === selectedCategory
                      ? "bg-blue-600 text-white dark:bg-blue-500"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  {category === "All" && <Tag className="w-4 h-4 mr-2" />}
                  {category}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full rounded-full border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* Quiz Grid */}
        {loading ? (
          <Loading />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {filteredQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className="h-full flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => handleQuizClick(selectedCategory, quiz.title)}
                >
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded-full"
                    >
                      {selectedCategory}
                    </Badge>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                      {quiz.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col justify-between pt-0">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {quiz.description ||
                          "Test your knowledge with this engaging quiz!"}
                      </p>
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1.5" />
                          <span>{quiz.questionCount || 10} Questions</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1.5" />
                          <span>{quiz.estimatedTime || 15} mins</span>
                        </div>
                      </div>
                    </div>

                    {/* Start Button */}
                    <motion.div
                      className="mt-6"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        onClick={() =>
                          handleQuizClick(selectedCategory, quiz.title)
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-lg py-2.5 transition-colors duration-200 flex items-center justify-center"
                      >
                        <PlayCircle className="w-5 h-5 mr-2 group-hover:scale-105 transition-transform" />
                        Start Quiz
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuizzesPage;
