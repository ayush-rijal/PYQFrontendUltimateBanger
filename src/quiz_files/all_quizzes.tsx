"use client"
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Clock, PlayCircle, Tag } from "lucide-react";
import axios from "axios";
import Loading from "../loading/Loading";
interface Quiz {
  title: string;
  file: string;
  id: number;
  description?: string;
  questionCount?: number;
  estimatedTime?: number;
}

// quizzes means quiz files dude

const QuizzesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, quizzesResponse] = await Promise.all([
          axios.get("http://127.0.0.1:8000/quiz/category0/"),
          axios.get("http://127.0.0.1:8000/quiz/category0/All/"),
        ]);

        const categoryNames = categoriesResponse.data.map(
          (cat: { name: string }) => cat.name
        );
        setCategories(["All", ...categoryNames]);

        setAllQuizzes(quizzesResponse.data);
        setQuizzes(quizzesResponse.data);
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
      setQuizzes(category === "All" ? allQuizzes : response.data);
    } catch (error) {
      console.error(`Error fetching quizzes for category ${category}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // title means the title of quizfile like IOM 2019 which gives followup questions in my api

  const handleQuizClick = (category: string, title: string) => {
    navigate(`/quiz/${category}/${title}`);
  };

  return (
    <div className="w-full bg-gradient-to-b from-white to-amber-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 ">
        <motion.h1
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Explore Quizzes
        </motion.h1>

        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center mb-6">
            {categories.map((category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={
                    category === selectedCategory ? "default " : "outline"
                  }
                  onClick={() => handleCategoryChange(category)}
                  className="rounded-full px-6 py-2 shadow-sm "
                >
                  {category == "All" && <Tag className="w-4 h-4 mr-2" />}
                  {category}
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="relative max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full"
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                  className="h-full flex flex-col text-white bg-[#353535] rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden"
                  onClick={() => handleQuizClick(selectedCategory, quiz.title)}
                >
                  <div className="absolute top-0 right-0 m-4">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    >
                      {selectedCategory}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl mb-2">{quiz.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white dark:text-gray-300 mb-4">
                      {quiz.description ||
                        "Explore this exciting quiz to test your knowledge!"}
                    </p>
                    <div className="flex justify-between text-sm text-white dark:text-white-400">
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        <span>{quiz.questionCount || 10} questions</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{quiz.estimatedTime || 15} mins</span>
                      </div>
                    </div>
                    <motion.div
                      className="mt-4 flex justify-center w-full"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() =>
                          handleQuizClick(selectedCategory, quiz.title)
                        }
                        className="w-full group bg-amber-400 hover:bg-amber-500 dark:bg-amber-500 dark:hover:bg-amber-600 
                         text-gray-900"
                      >
                        <PlayCircle className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
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
