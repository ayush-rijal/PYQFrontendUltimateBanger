"use client";
import "@/loading/QuizResults.css";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetQuizResultQuery,
  useGetAllQuestionsQuery,
  useGetChoicesQuery,
} from "@/redux/features/quizApiSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Share2,
  AlertCircle,
  HelpCircle,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Loading from "@/loading/Loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { json } from "stream/consumers";

// Interfaces
interface Question {
  id: number;
  text: string;
  questions_file_title: string;
  subject_category_name: string;
  correct_choice_id?: number;
  choices?: Choice[];
  image_url?: string;
}

interface Choice {
  id: number;
  text: string;
  is_correct: boolean;
  question: number | undefined;
}

interface QuizResult {
  questions_file: string;
  points: number;
  completed_at: string | null;
}

export default function QuizResultsPage() {
  const {
    category0,
    category1,
    quizFile: rawQuizFile,
  } = useParams() as {
    category0: string;
    category1: string;
    quizFile: string;
  };
  const router = useRouter();
  const quizFile = decodeURIComponent(rawQuizFile);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
  const [questions, setQuestions] = useState<Record<number, Question>>({});
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  const [derivedResults, setDerivedResults] = useState<
    {
      question_id: number;
      selected_choice_id: number | null;
      is_correct: boolean;
    }[]
  >([]);
  const [showAllQuestions, setShowAllQuestions] = useState<boolean>(false);

  const {
    data: resultsData,
    isLoading: resultsLoading,
    error: resultsError,
  } = useGetQuizResultQuery({ category0, category1, quizFile });

  const {
    data: allQuestionsData = [],
    isLoading: questionsLoading,
    error: questionsError,
  } = useGetAllQuestionsQuery({ category0, category1, quizFile });

  const isLoading = resultsLoading || questionsLoading;
  const hasError = resultsError || questionsError;

  useEffect(() => {
    if (!resultsData || !allQuestionsData) {
      console.log("Data not ready:", { resultsData, allQuestionsData });
      return;
    }

    try {
      if (!Array.isArray(resultsData) && typeof resultsData !== "object") {
        console.error("Invalid results data:", resultsData);
        return;
      }
      console.log("Backend Response from getQuizResult:", resultsData);
      const quizResult: QuizResult = Array.isArray(resultsData)
        ? resultsData[0]
        : resultsData;
      if (!quizResult || typeof quizResult.points !== "number") {
        console.error("Invalid quiz result data:", quizResult);
      }
      setQuizResults(quizResult);

      const questionsMap = allQuestionsData.reduce((acc, question) => {
        if (!question || typeof question.id !== "number" || !question.text) {
          console.warn("Skipping invalid question:", question);
          return acc;
        }
        acc[question.id] = question;
        return acc;
      }, {} as Record<number, Question>);
      setQuestions(questionsMap);
      console.warn(
        "Simulating result based on points; actual sealrctions Unavailable."
      );
      const derived = allQuestionsData.map((q, index) => {
        const isCorrect = index < quizResult.points;
        return {
          question_id: q.id,
          selected_choice_id: isCorrect ? q.correct_choice_id || null : null,
          is_correct: isCorrect,
        };
      });
      setDerivedResults(derived);
      console.log("Simulated Results:", derived);

      if (derived.length > 0 && !showAllQuestions) {
        setSelectedQuestionId(derived[0].question_id);
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
  }, [resultsData, allQuestionsData, showAllQuestions]);

  const formatPoints = (points: number) => `${points}`;

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: `Quiz Results: ${quizFile}`,
          text: `I scored ${formatPoints(
            quizResults?.points || 0
          )} points on the ${quizFile} quiz!`,
          url: shareUrl,
        })
        .catch((err) => console.error("Error sharing:", err));
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() =>
          toast.success("URL Copied! Share link has been copied to clipboard")
        );
    }
  };

  const filterQuestions = (tab: string) => {
    switch (tab) {
      case "all":
        return derivedResults;
      case "correct":
        return derivedResults.filter((q) => q.is_correct);
      case "incorrect":
        return derivedResults.filter((q) => !q.is_correct);
      default:
        return [];
    }
  };

  const handleQuestionClick = (questionId: number) => {
    setSelectedQuestionId(questionId);
    setShowAllQuestions(false);
    setActiveTab("all");
  };

  const handleBackToAll = () => {
    setShowAllQuestions(true);
    setSelectedQuestionId(null);
    setActiveTab("all");
  };

  const handleNextQuestion = () => {
    if (!selectedQuestionId) return;
    const currentIndex = derivedResults.findIndex(
      (q) => q.question_id === selectedQuestionId
    );
    if (currentIndex < derivedResults.length - 1) {
      setSelectedQuestionId(derivedResults[currentIndex + 1].question_id);
    }
  };

  const handlePrevQuestion = () => {
    if (!selectedQuestionId) return;
    const currentIndex = derivedResults.findIndex(
      (q) => q.question_id === selectedQuestionId
    );
    if (currentIndex > 0) {
      setSelectedQuestionId(derivedResults[currentIndex - 1].question_id);
    }
  };

  const groupQuestionsBySubject = () => {
    const grouped: Record<string, Question[]> = {};
    derivedResults.forEach((result) => {
      const question = questions[result.question_id];
      if (!question) return;
      const subject = question.subject_category_name;
      if (!grouped[subject]) {
        grouped[subject] = [];
      }
      grouped[subject].push(question);
    });
    return grouped;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="flex flex-col items-center gap-4">
          <Loading />
          <p className="text-muted-foreground">Loading your quiz results...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="max-w-md mx-auto bg-card rounded-lg shadow-lg p-8 border">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Results</h2>
          <p className="mb-6 text-muted-foreground">
            We couldn&apos;t load your quiz results. Please try again later.
          </p>
          <Button
            onClick={() =>
              router.push(`/quiz-app/category/${category0}/${category1}`)
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  if (!quizResults || !Object.keys(questions).length) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="max-w-md mx-auto bg-card rounded-lg shadow-lg p-8 border">
          <HelpCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">No Results Found</h2>
          <p className="mb-6 text-muted-foreground">
            We couldn&apos;t find any results or questions for this quiz.
          </p>
          <Button
            onClick={() =>
              router.push(`/quiz-app/category/${category0}/${category1}`)
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  const totalQuestions = derivedResults.length;
  const correctCount = derivedResults.filter((q) => q.is_correct).length;
  const incorrectCount = totalQuestions - correctCount;
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
  const groupedQuestions = groupQuestionsBySubject();

  const renderQuestionList = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center">
          <List className="mr-2 h-5 w-5 text-primary" />
          Question List
        </h3>
        {selectedQuestionId && !showAllQuestions && (
          <Button variant="outline" size="sm" onClick={handleBackToAll}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            All Questions
          </Button>
        )}
      </div>
      <ScrollArea className="h-[60vh]">
        {Object.entries(groupedQuestions).map(([subject, qs]) => (
          <div key={subject} className="mb-6">
            <h4 className="mb-2 font-medium flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
              {subject}{" "}
              <span className="text-muted-foreground ml-1">({qs.length})</span>
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {qs.map((q) => {
                const result = derivedResults.find(
                  (r) => r.question_id === q.id
                );
                const isSelected = q.id === selectedQuestionId;
                const isAnswered = result && result.selected_choice_id !== null;
                return (
                  <Button
                    key={q.id}
                    variant={
                      isSelected
                        ? "default"
                        : isAnswered
                        ? "outline"
                        : "secondary"
                    }
                    size="sm"
                    className={cn(
                      "h-10 w-10 p-0 rounded-full",
                      isSelected && "shadow-md",
                      result?.is_correct && "border-green-500",
                      result?.selected_choice_id &&
                        !result.is_correct &&
                        "border-red-500"
                    )}
                    onClick={() => handleQuestionClick(q.id)}
                  >
                    {allQuestionsData.indexOf(q) + 1}
                    {result?.is_correct ? (
                      <CheckCircle className="ml-1 h-3 w-3 text-green-500" />
                    ) : result?.selected_choice_id ? (
                      <XCircle className="ml-1 h-3 w-3 text-red-500" />
                    ) : null}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-12">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="mb-2 -ml-2 text-muted-foreground"
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to quizzes
              </Button>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Quiz Results
              </h1>
              <div className="flex items-center mt-1 text-muted-foreground">
                <span className="text-sm">{category0}</span>
                <span className="mx-2">›</span>
                <span className="text-sm">{category1}</span>
                <span className="mx-2">›</span>
                <span className="text-sm font-medium">{quizFile}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="group"
              >
                <Share2 className="mr-1 h-4 w-4 group-hover:text-primary transition-colors" />
                Share Results
              </Button>
            </div>
          </div>
        </header>

        {/* Summary Card */}
        <Card className="mb-8 overflow-hidden border shadow-md">
          <CardHeader className="bg-muted/30 pb-2">
            <CardTitle className="text-lg">Quiz Performance</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Enhanced Overall Score Section */}
            <div className="flex flex-col items-center justify-center space-y-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative flex h-28 w-28 items-center justify-center">
                      <svg className="h-full w-full absolute -rotate-90">
                        <circle
                          cx="56"
                          cy="56"
                          r="50"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-muted/20 dark:text-gray-700"
                        />
                      </svg>
                      <svg className="h-full w-full absolute -rotate-90">
                        <defs>
                          <linearGradient
                            id="progressGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="100%"
                          >
                            <stop
                              offset="0%"
                              className="stop-color-1"
                              stopColor="#3b82f6"
                            />
                            <stop
                              offset="100%"
                              className="stop-color-2"
                              stopColor="#10b981"
                            />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="56"
                          cy="56"
                          r="50"
                          stroke="url(#progressGradient)"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={50 * 2 * Math.PI}
                          strokeDashoffset={
                            50 * 2 * Math.PI * (1 - scorePercentage / 100)
                          }
                          className="transition-all duration-1000 ease-out"
                          style={{
                            filter:
                              "drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))",
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-primary dark:text-blue-300">
                          
                          {scorePercentage}%
                        </span>
                      </div>
                      <div className="absolute inset-0 rounded-full bg-primary/10 dark:bg-blue-500/10 animate-pulse" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="dark:bg-gray-800 dark:text-gray-200">
                    <p>Your overall quiz performance</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-sm font-medium text-muted-foreground dark:text-gray-400">
                Overall Score
              </span>
            </div>

            {/* Other Metrics */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="text-5xl font-bold text-primary">
                {formatPoints(quizResults.points)}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Total Points
              </span>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
                <span className="text-3xl font-semibold">
                  {correctCount}/{totalQuestions}
                </span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Correct Answers
              </span>
              <Progress
                value={(correctCount / totalQuestions) * 100}
                className="h-2 w-full max-w-[120px]"
              />
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="flex items-center">
                <XCircle className="mr-2 h-6 w-6 text-red-500" />
                <span className="text-3xl font-semibold">
                  {incorrectCount}/{totalQuestions}
                </span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Incorrect Answers
              </span>
              <Progress
                value={(incorrectCount / totalQuestions) * 100}
                className="h-2 w-full max-w-[120px] bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Content with Tabs */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
              className="bg-background rounded-lg shadow-sm border p-1"
            >
              <TabsList className="mb-4 w-full grid grid-cols-3 bg-muted/50">
                <TabsTrigger value="all" className="flex-1">
                  All Questions
                </TabsTrigger>
                <TabsTrigger value="correct" className="flex-1">
                  <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                  Correct
                </TabsTrigger>
                <TabsTrigger value="incorrect" className="flex-1">
                  <XCircle className="mr-1 h-4 w-4 text-red-500" />
                  Incorrect
                </TabsTrigger>
              </TabsList>

              <div className="px-4 pb-4">
                <TabsContent value="all" className="mt-0">
                  {showAllQuestions ? (
                    <div className="space-y-6">
                      {filterQuestions("all").map((result) => (
                        <QuestionDetail
                          key={result.question_id}
                          category0={category0}
                          category1={category1}
                          quizFile={quizFile}
                          questionId={result.question_id}
                          result={result}
                          question={questions[result.question_id]}
                        />
                      ))}
                    </div>
                  ) : selectedQuestionId ? (
                    <>
                      <QuestionDetail
                        category0={category0}
                        category1={category1}
                        quizFile={quizFile}
                        questionId={selectedQuestionId}
                        result={derivedResults.find(
                          (q) => q.question_id === selectedQuestionId
                        )}
                        question={questions[selectedQuestionId]}
                      />
                      <div className="flex justify-between mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevQuestion}
                          disabled={
                            derivedResults.findIndex(
                              (q) => q.question_id === selectedQuestionId
                            ) === 0
                          }
                        >
                          <ChevronLeft className="mr-1 h-4 w-4" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNextQuestion}
                          disabled={
                            derivedResults.findIndex(
                              (q) => q.question_id === selectedQuestionId
                            ) ===
                            derivedResults.length - 1
                          }
                        >
                          Next
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : null}
                </TabsContent>

                <TabsContent value="correct" className="mt-0">
                  {selectedQuestionId &&
                    filterQuestions("correct").some(
                      (q) => q.question_id === selectedQuestionId
                    ) && (
                      <QuestionDetail
                        category0={category0}
                        category1={category1}
                        quizFile={quizFile}
                        questionId={selectedQuestionId}
                        result={derivedResults.find(
                          (q) => q.question_id === selectedQuestionId
                        )}
                        question={questions[selectedQuestionId]}
                      />
                    )}
                </TabsContent>

                <TabsContent value="incorrect" className="mt-0">
                  {selectedQuestionId &&
                    filterQuestions("incorrect").some(
                      (q) => q.question_id === selectedQuestionId
                    ) && (
                      <QuestionDetail
                        category0={category0}
                        category1={category1}
                        quizFile={quizFile}
                        questionId={selectedQuestionId}
                        result={derivedResults.find(
                          (q) => q.question_id === selectedQuestionId
                        )}
                        question={questions[selectedQuestionId]}
                      />
                    )}
                </TabsContent>
              </div>
            </Tabs>

            {/* Mobile Question List */}
            <Card className="mt-6 lg:hidden">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <List className="mr-2 h-5 w-5 text-primary" />
                  Question Navigator
                </CardTitle>
              </CardHeader>
              <CardContent>{renderQuestionList()}</CardContent>
            </Card>
          </div>

          {/* Sidebar for Larger Screens */}
          <div className="hidden lg:block lg:w-1/3">
            <Card className="sticky top-4 shadow-md border">
              <CardHeader className="bg-muted/30 pb-2">
                <CardTitle className="text-lg flex items-center">
                  <List className="mr-2 h-5 w-5 text-primary" />
                  Question Navigator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[60vh] pr-4">
                  {Object.entries(groupedQuestions).map(([subject, qs]) => (
                    <div key={subject} className="mb-6">
                      <h4 className="mb-3 font-medium flex items-center">
                        <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                        {subject}{" "}
                        <span className="text-muted-foreground ml-1">
                          ({qs.length})
                        </span>
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {qs.map((q) => {
                          const result = derivedResults.find(
                            (r) => r.question_id === q.id
                          );
                          const isSelected = q.id === selectedQuestionId;
                          const isAnswered =
                            result && result.selected_choice_id !== null;
                          return (
                            <TooltipProvider key={q.id}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={
                                      isSelected
                                        ? "default"
                                        : isAnswered
                                        ? "outline"
                                        : "secondary"
                                    }
                                    size="sm"
                                    className={cn(
                                      "h-10 w-10 p-0 rounded-full transition-all",
                                      isSelected &&
                                        "shadow-md ring-2 ring-primary/20",
                                      result?.is_correct && "border-green-500",
                                      result?.selected_choice_id &&
                                        !result.is_correct &&
                                        "border-red-500"
                                    )}
                                    onClick={() => handleQuestionClick(q.id)}
                                  >
                                    {allQuestionsData.indexOf(q) + 1}
                                    {result?.is_correct ? (
                                      <CheckCircle className="ml-1 h-3 w-3 text-green-500" />
                                    ) : result?.selected_choice_id ? (
                                      <XCircle className="ml-1 h-3 w-3 text-red-500" />
                                    ) : null}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-[200px] truncate">
                                    {q.text}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
              <CardFooter className="bg-muted/20 pt-2 flex justify-center border-t">
                <div className="text-xs text-muted-foreground flex items-center gap-4">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                    Correct
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                    Incorrect
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-muted-foreground mr-1"></span>
                    Unanswered
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionDetail({
  category0,
  category1,
  quizFile,
  questionId,
  result,
  question,
}: {
  category0: string;
  category1: string;
  quizFile: string;
  questionId: number;
  result?: {
    question_id: number;
    selected_choice_id: number | null;
    is_correct: boolean;
  };
  question?: Question;
}) {
  if (!question || !result) {
    return (
      <div className="text-muted-foreground">Question data not available.</div>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader
        className={cn(
          "pb-2",
          result.is_correct
            ? "bg-green-50 dark:bg-green-950/20"
            : "bg-red-50 dark:bg-red-950/20"
        )}
      >
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="font-normal">
            Question {questionId}
          </Badge>
          <Badge
            variant={result.is_correct ? "outline" : "outline"}
            className={cn(
              "font-normal",
              result.is_correct
                ? "border-green-500 text-green-700 dark:text-green-400"
                : "border-red-500 text-red-700 dark:text-red-400"
            )}
          >
            {result.is_correct ? (
              <CheckCircle className="mr-1 h-3 w-3" />
            ) : (
              <XCircle className="mr-1 h-3 w-3" />
            )}
            {result.is_correct ? "Correct" : "Incorrect"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div
          className={cn(
            "rounded-lg p-4",
            result.is_correct
              ? "bg-green-50/50 dark:bg-green-950/10"
              : "bg-red-50/50 dark:bg-red-950/10"
          )}
        >
          <h3 className="mb-4 text-lg font-medium">{question.text}</h3>
          {question.image_url && (
            <div className="mb-4 flex justify-center">
              <Image
                src={question.image_url || "/placeholder.svg"}
                alt="Question Image"
                width={400}
                height={300}
                className="max-w-full rounded-md shadow-sm object-cover"
              />
            </div>
          )}
          <p className="text-sm text-muted-foreground mb-2">
            Note: Your actual selected option isn’t available; showing simulated
            choice based on score.
          </p>
          <QuestionChoicesReview
            category0={category0}
            category1={category1}
            quizFile={quizFile}
            questionId={questionId}
            selectedChoiceId={result.selected_choice_id}
            correctChoiceId={question.correct_choice_id}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function QuestionChoicesReview({
  category0,
  category1,
  quizFile,
  questionId,
  selectedChoiceId,
}: {
  category0: string;
  category1: string;
  quizFile: string;
  questionId: number;
  selectedChoiceId: number | null;
}) {
  const {
    data: choices = [],
    isLoading,
    error,
  } = useGetChoicesQuery({ category0, category1, quizFile, questionId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    console.warn(`Failed to load choices for question ${questionId}:`, error);
    return (
      <div className="text-red-500 text-sm p-3 bg-red-50/50 rounded-md">
        Unable to load answer choices for this question.
      </div>
    );
  }

  return (
    <CardContent>
      <div className="space-y-2">
        {choices.map((choice: Choice) => {
          const isSelected = choice.id === selectedChoiceId;
          const isCorrectChoice = choice.is_correct;
          const textClass = isSelected
            ? isCorrectChoice
              ? "text-green-700 dark:text-green-300 font-medium"
              : "text-red-700 dark:text-red-300 font-medium"
            : isCorrectChoice
            ? "text-green-600 dark:text-green-400"
            : "text-foreground";

          return (
            <div
              key={choice.id}
              className="flex items-start gap-2 rounded-md p-2 hover:bg-muted/50"
            >
              <span
                className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                  isSelected
                    ? isCorrectChoice
                      ? "border-green-500 bg-green-200 dark:bg-green-700"
                      : "border-red-500 bg-red-200 dark:bg-red-700"
                    : "border-muted"
                }`}
              >
                {isSelected && (
                  <span
                    className={
                      isCorrectChoice
                        ? "h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"
                        : "h-2 w-2 rounded-full bg-red-600 dark:bg-red-400"
                    }
                  />
                )}
              </span>
              <p className={textClass}>
                {choice.text}
                {isCorrectChoice && !isSelected && " (Correct)"}
              </p>
            </div>
          );
        })}
      </div>
    </CardContent>
  );
}
