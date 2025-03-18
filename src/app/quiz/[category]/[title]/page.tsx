"use client"; // Required for client-side interactivity

import type React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation"; // Updated imports
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Timer from "./QuizTimer";
import ResultPage from "./ResultPage";
import Loading from "@/loading/Loading";
import Image from "next/image";

interface Question {
  id: number;
  text: string;
  questions_file_title: string;
  subject_category_name: string;
  image_url?: string;
}

interface Choice {
  id: number;
  text: string;
  is_correct: boolean;
  question: number;
}

interface QuestionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Question[];
}

const QUESTIONS_PER_PAGE = 5;
const QUIZ_DURATION = 30 * 60; // 30 minutes in seconds

const QuizPage: React.FC = () => {
  const { category, title } = useParams<{ category: string; title: string }>(); // Next.js params
  const router = useRouter(); // Replace useNavigate

  const [questions, setQuestions] = useState<Question[]>([]);
  const [choices, setChoices] = useState<Record<number, Choice[]>>({});
  const [selectedChoices, setSelectedChoices] = useState<Record<number, number>>({});
  const [attemptedQuestions, setAttemptedQuestions] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [subjectCategories, setSubjectCategories] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_DURATION);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  interface QuizResult {
    questionId: number;
    selectedChoice: number | undefined;
    isCorrect: boolean;
  }

  const [quizResults, setQuizResults] = useState<QuizResult[] | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const fetchAllQuestions = useCallback(async () => {
    try {
      setLoading(true);
      let allQuestions: Question[] = [];
      let nextUrl = `http://127.0.0.1:8000/quiz/category0/${category}/${title}/`;

      while (nextUrl) {
        const response = await axios.get<QuestionResponse>(nextUrl);
        allQuestions = [...allQuestions, ...response.data.results];
        nextUrl = response.data.next ?? "";
      }

      setQuestions(allQuestions);
      setSubjectCategories([...new Set(allQuestions.map((q) => q.subject_category_name))]);
      await Promise.all(allQuestions.map((q) => loadChoices(q.id)));
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [category, title]);

  const loadChoices = async (questionId: number) => {
    try {
      const response = await axios.get<Choice[]>(
        `http://127.0.0.1:8000/quiz/category0/${category}/${title}/${questionId}/choices/`
      );
      setChoices((prev) => ({ ...prev, [questionId]: response.data }));
    } catch (error) {
      console.error("Error fetching choices for question", questionId, ":", error);
      setError("Failed to load choices. Please try again.");
    }
  };

  useEffect(() => {
    if (category && title) {
      fetchAllQuestions();
    }
  }, [category, title, fetchAllQuestions]);

  const handleChoiceSelect = (questionId: number, choiceId: number) => {
    setSelectedChoices((prev) => ({ ...prev, [questionId]: choiceId }));
    setAttemptedQuestions((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleQuestionNavigation = (questionIndex: number) => {
    const pageIndex = Math.floor(questionIndex / QUESTIONS_PER_PAGE);
    if (currentPage !== pageIndex) {
      setCurrentPage(pageIndex);
      setTimeout(() => {
        const questionElement = questionRefs.current[questions[questionIndex].id];
        if (questionElement) {
          questionElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } else {
      const questionElement = questionRefs.current[questions[questionIndex].id];
      if (questionElement) {
        questionElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    setCurrentQuestionIndex(questionIndex);
  };

  const handlePageChange = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    setCurrentQuestionIndex(pageIndex * QUESTIONS_PER_PAGE);
  };

  const handleQuitQuiz = () => {
    router.push("/"); // Navigate to home
  };

  const isAnswerCorrect = (questionId: number) => {
    const selectedChoice = selectedChoices[questionId];
    const correctChoice = choices[questionId]?.find((choice) => choice.is_correct);
    return correctChoice && selectedChoice === correctChoice.id;
  };

  const handleSubmitQuiz = () => {
    const results = questions.map((question) => ({
      questionId: question.id,
      selectedChoice: selectedChoices[question.id],
      isCorrect: isAnswerCorrect(question.id) ?? false,
    }));
    setQuizResults(results);
    setQuizSubmitted(true);
  };

  useEffect(() => {
    if (timeRemaining === 0) {
      handleSubmitQuiz();
    }
  }, [timeRemaining]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (quizSubmitted) {
    return <ResultPage results={quizResults?.map(result => ({ ...result, selectedChoice: result.selectedChoice ?? -1 })) || []} questions={questions} choices={choices} />;
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <AlertCircle className="mx-auto text-red-500 w-16 h-16 mb-4" />
        <p className="text-xl text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const currentQuestions = questions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  return (
    <div className="flex flex-col h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sidebarOpen}
                onChange={toggleSidebar}
                className="sr-only peer"
              />
              <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                {sidebarOpen ? "Questions is Open" : "Questions is Closed"}
              </span>
            </label>
            <Timer timeRemaining={timeRemaining} setTimeRemaining={setTimeRemaining} />
          </div>
        </div>
        <Progress value={((QUIZ_DURATION - timeRemaining) / QUIZ_DURATION) * 100} className="h-2" />
      </div>

      <div className="flex flex-1 mx-4 gap-4 overflow-hidden">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-72 bg-card rounded-lg shadow-lg"
            >
              <Card className="h-full border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Questions</CardTitle>
                </CardHeader>
                <ScrollArea className="h-[calc(100vh-280px)] px-4">
                  {subjectCategories.map((category, idx) => (
                    <div key={category} className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          Section {idx + 1}
                        </Badge>
                        <h3 className="font-semibold">{category}</h3>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {questions
                          .filter((q) => q.subject_category_name === category)
                          .map((q) => {
                            const questionIndex = questions.findIndex(
                              (question) => question.id === q.id
                            );
                            return (
                              <Button
                                key={q.id}
                                variant={questionIndex === currentQuestionIndex ? "default" : "outline"}
                                size="icon"
                                className={`w-8 h-8 p-0 relative ${
                                  attemptedQuestions[q.id]
                                    ? isAnswerCorrect(q.id)
                                      ? "border-blue-500"
                                      : "border-blue-500"
                                    : ""
                                }`}
                                onClick={() => handleQuestionNavigation(questionIndex)}
                              >
                                <span className="text-xs">{questionIndex + 1}</span>
                              </Button>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`flex-1 ${sidebarOpen ? "" : ""} transition-all duration-300`}>
          <ScrollArea className="h-[calc(100vh-180px)]">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 p-4"
            >
              {currentQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="mb-8 p-4 border rounded-lg"
                  ref={(el) => {
                    questionRefs.current[question.id] = el;
                  }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">
                      Question {currentPage * QUESTIONS_PER_PAGE + index + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {question.subject_category_name}
                    </span>
                  </div>
                  {question.image_url && (
                    <Image
                      src={question.image_url || "/placeholder.svg"}
                      alt="Question"
                      className="w-full h-auto object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="text-lg font-medium mb-4">{question.text}</p>
                  <div className="space-y-2">
                    {choices[question.id]?.map((choice) => (
                      <div
                        key={choice.id}
                        onClick={() => handleChoiceSelect(question.id, choice.id)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer
                          ${
                            selectedChoices[question.id] === choice.id
                              ? "border-primary bg-primary/10"
                              : "border-input hover:border-primary"
                          }`}
                      >
                        <Label className="flex items-center cursor-pointer">
                          <span className="flex-grow">{choice.text}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </ScrollArea>

          <div className="flex justify-between items-center p-2 border-t">
            <Button
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground mb-3">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t p-2 flex justify-end items-center gap-4">
        <Button onClick={handleQuitQuiz} variant="outline" size="sm">
          Quit Quiz
        </Button>
        <Button onClick={handleSubmitQuiz} size="sm">
          Submit Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizPage;