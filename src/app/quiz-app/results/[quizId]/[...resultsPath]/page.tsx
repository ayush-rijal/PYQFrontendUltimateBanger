// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   useGetAllQuestionsQuery,
//   useGetChoicesQuery,
// } from "@/redux/features/quizApiSlice";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { ArrowLeft, CheckCircle, XCircle, List } from "lucide-react";
// import Loading from "@/loading/Loading";
// import * as React from "react";
// import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import toast from "react-hot-toast";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { cn } from "@/lib/utils";

// // Interfaces
// interface Question {
//   id: number;
//   text: string;
//   subject_category_name: string;
// }

// interface Choice {
//   id: number;
//   text: string;
//   is_correct: boolean;
// }

// interface Response {
//   question: number;
//   selected_choice: number;
//   is_submitted: boolean;
// }

// interface QuizResult {
//   status: string;
//   points: number;
//   total_questions: number;
//   responses: Response[];
// }

// interface ChartData {
//   subject: string;
//   correct: number;
//   incorrect: number;
// }

// // Chart Config
// const chartConfig = {
//   performance: { label: "Performance" },
//   correct: { label: "Correct Answers", color: "#10B981" },
//   incorrect: { label: "Incorrect Answers", color: "#EF4444" },
// } satisfies ChartConfig;

// // ResultAnalysis Component
// function ResultAnalysis({
//   allQuestions,
//   responsesMap,
//   categoryPath,
//   quizFile,
// }: {
//   allQuestions: Question[];
//   responsesMap: Record<number, number>;
//   categoryPath: string;
//   quizFile: string;
// }) {
//   const [viewMode, setViewMode] = React.useState("all");

//   const choicesQueries = allQuestions.map((question) =>
//     useGetChoicesQuery({
//       categoryPath,
//       questionsFile: decodeURIComponent(quizFile),
//       questionId: question.id,
//     })
//   );

//   const choicesMap = React.useMemo(() => {
//     const map: Record<number, Choice[]> = {};
//     allQuestions.forEach((question, index) => {
//       const { data: choices = [] } = choicesQueries[index] || {};
//       map[question.id] = choices;
//     });
//     return map;
//   }, [allQuestions, choicesQueries]);

//   const chartData: ChartData[] = React.useMemo(() => {
//     if (!allQuestions.length || !Object.keys(responsesMap).length) return [];

//     const subjectStats = allQuestions.reduce((acc, question) => {
//       const subject = question.subject_category_name;
//       if (!acc[subject]) {
//         acc[subject] = { correct: 0, incorrect: 0, total: 0 };
//       }
//       acc[subject].total += 1;
//       const selectedChoiceId = responsesMap[question.id];
//       const choices = choicesMap[question.id] || [];
//       const correctChoice = choices.find((c) => c.is_correct);
//       const isCorrect =
//         selectedChoiceId &&
//         correctChoice &&
//         selectedChoiceId === correctChoice.id;
//       if (isCorrect) {
//         acc[subject].correct += 1;
//       } else if (selectedChoiceId) {
//         acc[subject].incorrect += 1;
//       }
//       return acc;
//     }, {} as Record<string, { correct: number; incorrect: number; total: number }>);

//     return Object.entries(subjectStats).map(([subject, stats]) => ({
//       subject,
//       correct: stats.correct,
//       incorrect: stats.incorrect,
//     }));
//   }, [allQuestions, responsesMap, choicesMap]);

//   const filteredData = chartData.filter((item) =>
//     viewMode === "all" ? true : item.subject === viewMode
//   );

//   if (!chartData.length) {
//     return <div>No quiz data available to display.</div>;
//   }

//   const subjects = Array.from(new Set(chartData.map((item) => item.subject)));

//   return (
//     <Card className="mb-6">
//       <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
//         <div className="grid flex-1 gap-1 text-center sm:text-left">
//           <CardTitle>Quiz Performance Analysis</CardTitle>
//         </div>
//         <Select value={viewMode} onValueChange={setViewMode}>
//           <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
//             <SelectValue placeholder="All Subjects" />
//           </SelectTrigger>
//           <SelectContent className="rounded-xl">
//             <SelectItem value="all">All Subjects</SelectItem>
//             {subjects.map((subject) => (
//               <SelectItem key={subject} value={subject}>
//                 {subject}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </CardHeader>
//       <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
//         <ChartContainer
//           config={chartConfig}
//           className="aspect-auto h-[300px] w-full"
//         >
//           <AreaChart data={filteredData}>
//             <defs>
//               <linearGradient id="fillCorrect" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
//                 <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
//               </linearGradient>
//               <linearGradient id="fillIncorrect" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
//                 <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
//               </linearGradient>
//             </defs>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="subject"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               tickFormatter={(value) =>
//                 value.slice(0, 10) + (value.length > 10 ? "..." : "")
//               }
//             />
//             <YAxis
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               label={{
//                 value: "Number of Questions",
//                 angle: -90,
//                 position: "insideLeft",
//               }}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent indicator="dot" />}
//             />
//             <Area
//               dataKey="correct"
//               type="natural"
//               fill="url(#fillCorrect)"
//               stroke="#10B981"
//               stackId="a"
//             />
//             <Area
//               dataKey="incorrect"
//               type="natural"
//               fill="url(#fillIncorrect)"
//               stroke="#EF4444"
//               stackId="a"
//             />
//             <ChartLegend content={<ChartLegendContent />} />
//           </AreaChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }

// // QuestionNavigator Component
// function QuestionNavigator({
//   allQuestions,
//   responsesMap,
//   categoryPath,
//   quizFile,
//   selectedQuestionId,
//   onQuestionClick,
// }: {
//   allQuestions: Question[];
//   responsesMap: Record<number, number>;
//   categoryPath: string; // Changed to string
//   quizFile: string;
//   selectedQuestionId: number | null;
//   onQuestionClick: (questionId: number) => void;
// }) {
//   const choicesQueries = allQuestions.map((question) =>
//     useGetChoicesQuery({
//       categoryPath,
//       questionsFile: quizFile,
//       questionId: question.id,
//     })
//   );

//   const choicesMap = React.useMemo(() => {
//     const map: Record<number, Choice[]> = {};
//     allQuestions.forEach((question, index) => {
//       const { data: choices = [] } = choicesQueries[index] || {};
//       map[question.id] = choices;
//     });
//     return map;
//   }, [allQuestions, choicesQueries]);

//   const groupQuestionsBySubject = () => {
//     const grouped: Record<string, Question[]> = {};
//     allQuestions.forEach((question) => {
//       const subject = question.subject_category_name;
//       if (!grouped[subject]) {
//         grouped[subject] = [];
//       }
//       grouped[subject].push(question);
//     });
//     return grouped;
//   };

//   return (
//     <Card className="mb-6">
//       <CardHeader>
//         <CardTitle className="text-lg flex items-center">
//           <List className="mr-2 h-5 w-5 text-primary" />
//           Question Navigator
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <ScrollArea className="h-[100vh] pr-4">
//           {Object.entries(groupQuestionsBySubject()).map(([subject, qs]) => (
//             <div key={subject} className="mb-6">
//               <h4 className="mb-3 font-medium flex items-center">
//                 <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
//                 {subject}{" "}
//                 <span className="text-muted-foreground ml-1">
//                   ({qs.length})
//                 </span>
//               </h4>
//               <div className="grid grid-cols-4 gap-2">
//                 {qs.map((q) => {
//                   const selectedChoiceId = responsesMap[q.id];
//                   const choices = choicesMap[q.id] || [];
//                   const correctChoice = choices.find((c) => c.is_correct);
//                   const isCorrect = selectedChoiceId === correctChoice?.id;
//                   const isSelected = q.id === selectedQuestionId;
//                   const isAnswered = selectedChoiceId !== undefined;
//                   return (
//                     <Button
//                       key={q.id}
//                       variant={
//                         isSelected
//                           ? "default"
//                           : isAnswered
//                           ? "outline"
//                           : "secondary"
//                       }
//                       size="sm"
//                       className={cn(
//                         "h-10 w-10 p-0 rounded-full transition-all",
//                         isSelected && "shadow-md",
//                         isCorrect && "border-green-500",
//                         selectedChoiceId && !isCorrect && "border-red-500"
//                       )}
//                       onClick={() => onQuestionClick(q.id)}
//                     >
//                       {allQuestions.indexOf(q) + 1}
//                       {isCorrect ? (
//                         <CheckCircle className="ml-1 h-3 w-3 text-green-500" />
//                       ) : selectedChoiceId && !isCorrect ? (
//                         <XCircle className="ml-1 h-3 w-3 text-red-500" />
//                       ) : null}
//                     </Button>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </ScrollArea>
//       </CardContent>
//     </Card>
//   );
// }

// // QuestionResult Component
// function QuestionResult({
//   question,
//   selectedChoiceId,
//   categoryPath,
//   quizFile,
// }: {
//   question: Question;
//   selectedChoiceId?: number;
//   categoryPath: string; // Changed to string
//   quizFile: string;
// }) {
//   const {
//     data: choices = [],
//     isLoading,
//     error,
//   } = useGetChoicesQuery({
//     categoryPath,
//     questionsFile: quizFile,
//     questionId: question.id,
//   });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-4">
//         <Loading />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="rounded-md bg-destructive/10 p-4 text-center text-destructive">
//         Error loading choices
//       </div>
//     );
//   }

//   const selectedChoice = choices.find((c: Choice) => c.id === selectedChoiceId);
//   const correctChoice = choices.find((c: Choice) => c.is_correct);
//   const isCorrect = selectedChoiceId === correctChoice?.id;
//   const cardClass = isCorrect
//     ? "border-green-500 bg-green-50 dark:bg-green-900/20"
//     : selectedChoiceId
//     ? "border-red-500 bg-red-50 dark:bg-red-900/20"
//     : "border-muted";

//   return (
//     <Card className={`transition-all ${cardClass}`}>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <Badge variant="outline">{question.subject_category_name}</Badge>
//           {isCorrect ? (
//             <span className="text-green-600 dark:text-green-400">Correct</span>
//           ) : selectedChoiceId ? (
//             <span className="text-red-600 dark:text-red-400">Incorrect</span>
//           ) : (
//             <Badge variant="outline" className="text-muted-foreground">
//               <span className="text-muted-foreground text-sm">
//                 Not Answered
//               </span>
//             </Badge>
//           )}
//         </div>
//         <CardTitle className="text-lg">{question.text}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-2">
//           <p>
//             <strong>Your Answer:</strong>{" "}
//             {selectedChoice?.text || "Not answered"}
//           </p>
//           <p>
//             <strong>Correct Answer:</strong> {correctChoice?.text || "N/A"}
//           </p>
//           {!isCorrect && selectedChoiceId && (
//             <p className="text-sm text-muted-foreground">
//               You selected an incorrect option.
//             </p>
//           )}
//         </div>
//       </CardContent>
//       <Separator />
//     </Card>
//   );
// }

// // Main Component
// export default function QuizResultsPage() {
//   const router = useRouter();
//   const { resultsPath, quizId } = useParams() as {
//     resultsPath: string[];
//     quizId: string;
//   };

//   // Derive quizFile and categoryPath from resultsPath
//   const quizFile = decodeURIComponent(resultsPath[resultsPath.length - 1]); // e.g., "IOM 2019"
//   const categoryPath = resultsPath.slice(0, -1).join("/"); // e.g., "Medical/IOM"

//   const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
//   const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
//     null
//   );
//   const [showAllQuestions, setShowAllQuestions] = useState<boolean>(true);

//   useEffect(() => {
//     const storedResult = localStorage.getItem(`quizResult_${quizId}`);
//     if (storedResult) {
//       setQuizResult(JSON.parse(storedResult));
//     } else {
//       // Redirect to the quiz page if no result is found
//       router.push(`/quiz-app/quiz/${categoryPath}/${quizFile}`);
//     }
//   }, [quizId, router, categoryPath, quizFile]);

//   const {
//     data: allQuestions = [],
//     isLoading: questionsLoading,
//     error: questionsError,
//   } = useGetAllQuestionsQuery({ categoryPath, questionsFile: quizFile });

//   if (questionsLoading || !quizResult) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center">
//         <Loading />
//       </div>
//     );
//   }

//   if (questionsError) {
//     return (
//       <div className="p-8 text-center text-destructive">
//         Error: {(questionsError as Error)?.message || "Failed to load results"}
//       </div>
//     );
//   }

//   const score = quizResult.points;
//   const totalQuestions = quizResult.total_questions;
//   const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

//   const responsesMap = quizResult.responses.reduce((acc, resp) => {
//     acc[resp.question] = resp.selected_choice;
//     return acc;
//   }, {} as Record<number, number>);

//   const handleRetryQuiz = () => {
//     toast.success("Quiz reset successfully!");
//     router.push(`/quiz-app/quiz/${categoryPath}/${quizFile}`);
//   };

//   const handleQuestionClick = (questionId: number) => {
//     setSelectedQuestionId(questionId);
//     setShowAllQuestions(false);
//   };

//   const handleBackToAll = () => {
//     setShowAllQuestions(true);
//     setSelectedQuestionId(null);
//   };

//   // Split categoryPath for breadcrumb display
//   const categorySegments = categoryPath.split("/");

//   return (
//     <div className="container mx-auto p-4 lg:p-8">
//       <header className="mb-8">
//         <Breadcrumb className="mb-4">
//           <BreadcrumbList>
//             <BreadcrumbItem>
//               <BreadcrumbLink href="/quiz-app">Quiz App</BreadcrumbLink>
//             </BreadcrumbItem>
//             {categorySegments.map((segment, index) => (
//               <React.Fragment key={index}>
//                 <BreadcrumbSeparator />
//                 <BreadcrumbItem>
//                   <BreadcrumbLink
//                     href={`/quiz-app/category/${categorySegments
//                       .slice(0, index + 1)
//                       .join("/")}`}
//                   >
//                     {segment}
//                   </BreadcrumbLink>
//                 </BreadcrumbItem>
//               </React.Fragment>
//             ))}
//             <BreadcrumbSeparator />
//             <BreadcrumbItem>
//               <BreadcrumbPage>{quizFile}</BreadcrumbPage>
//             </BreadcrumbItem>
//           </BreadcrumbList>
//         </Breadcrumb>
//         <Button variant="outline" onClick={handleRetryQuiz} className="mb-4">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Quiz
//         </Button>
//         <div className="text-center">
//           <div className="mt-4 flex flex-col items-center gap-4">
//             <Badge variant="secondary" className="text-lg py-2 px-4">
//               Your Total Score: {score}/{totalQuestions} (
//               {Math.round(percentage)}%)
//             </Badge>
//             <div className="text-sm text-muted-foreground">
//               Completed on {new Date().toLocaleDateString()}
//             </div>
//           </div>
//         </div>
//       </header>

//       <ResultAnalysis
//         allQuestions={allQuestions}
//         responsesMap={responsesMap}
//         categoryPath={categoryPath}
//         quizFile={quizFile}
//       />

//       <div className="flex flex-col lg:flex-row gap-6">
//         <div className="flex-1">
//           <Card className="mb-6">
//             <CardHeader>
//               <CardTitle>Your Answers</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ScrollArea className="h-[100vh] pr-4">
//                 <div className="space-y-6">
//                   {showAllQuestions ? (
//                     allQuestions.map((question: Question) => (
//                       <QuestionResult
//                         key={question.id}
//                         question={question}
//                         selectedChoiceId={responsesMap[question.id]}
//                         categoryPath={categoryPath}
//                         quizFile={quizFile}
//                       />
//                     ))
//                   ) : selectedQuestionId ? (
//                     <QuestionResult
//                       question={
//                         allQuestions.find((q) => q.id === selectedQuestionId)!
//                       }
//                       selectedChoiceId={responsesMap[selectedQuestionId]}
//                       categoryPath={categoryPath}
//                       quizFile={quizFile}
//                     />
//                   ) : null}
//                 </div>
//               </ScrollArea>
//             </CardContent>
//           </Card>
//           {!showAllQuestions && selectedQuestionId && (
//             <Button
//               variant="outline"
//               onClick={handleBackToAll}
//               className="mb-6"
//             >
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to All Questions
//             </Button>
//           )}
//         </div>

//         <div className="lg:w-1/3">
//           <QuestionNavigator
//             allQuestions={allQuestions}
//             responsesMap={responsesMap}
//             categoryPath={categoryPath}
//             quizFile={quizFile}
//             selectedQuestionId={selectedQuestionId}
//             onQuestionClick={handleQuestionClick}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetAllQuestionsQuery } from "@/redux/features/quizApiSlice";
import { analyzeQuizResults } from "@/ai/flows/analyze-quiz-results";
import { QuizHeader } from "@/components/quiz/quiz-header";
import { PerformanceAnalysis } from "@/components/quiz/performance-analysis";
import { QuestionNavigator } from "@/components/quiz/question-navigator";
import { QuestionResultView } from "@/components/quiz/question-result-view";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Loader } from "@/components/ui/loader";
import toast from "react-hot-toast";
import type { QuizResult, Question, Choice } from "@/components/types/quiz"

export default function QuizResultsPage() {
  const router = useRouter();
  const { resultsPath, quizId } = useParams() as {
    resultsPath: string[];
    quizId: string;
  };

  // Derive quizFile and categoryPath from resultsPath
  const quizFile = decodeURIComponent(resultsPath[resultsPath.length - 1]);
  const categoryPath = resultsPath.slice(0, -1).join("/");

  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  const [showAllQuestions, setShowAllQuestions] = useState<boolean>(true);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loadingAiFeedback, setLoadingAiFeedback] = useState(false);
  const [resultTimer, setResultTimer] = useState(1800); // 30 minutes in seconds

  // Timer for Results Page
  useEffect(() => {
    const interval = setInterval(() => {
      setResultTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load quiz result from localStorage
  useEffect(() => {
    const storedResult = localStorage.getItem(`quizResult_${quizId}`);
    if (storedResult) {
      setQuizResult(JSON.parse(storedResult));
    } else {
      router.push(`/quiz-app/quiz/${categoryPath}/${quizFile}`);
    }
  }, [quizId, router, categoryPath, quizFile]);

  const {
    data: allQuestions = [],
    isLoading: questionsLoading,
    error: questionsError,
  } = useGetAllQuestionsQuery({ categoryPath, questionsFile: quizFile });

  // Create a map of responses for easier access
  const responsesMap =
    quizResult?.responses.reduce((acc, resp) => {
      acc[resp.question] = resp.selected_choice;
      return acc;
    }, {} as Record<number, number>) || {};

  // Handle retry quiz
  const handleRetryQuiz = () => {
    toast.success("Quiz reset successfully!");
    router.push(`/quiz-app/quiz/${categoryPath}/${quizFile}`);
  };

  // Handle question selection
  const handleQuestionClick = (questionId: number) => {
    setSelectedQuestionId(questionId);
    setShowAllQuestions(false);
  };

  // Handle back to all questions
  const handleBackToAll = () => {
    setShowAllQuestions(true);
    setSelectedQuestionId(null);
  };

  // Get AI feedback
  const getAiFeedback = async () => {
    setLoadingAiFeedback(true);
    setAiFeedback(null);

    try {
      // Prepare quiz data for AI
      const choicesMap = await fetchAllChoices(
        allQuestions,
        categoryPath,
        quizFile
      );

      const quizData = prepareQuizDataForAi(
        allQuestions,
        choicesMap,
        responsesMap
      );

      const feedbackResult = await analyzeQuizResults(quizData);
      setAiFeedback(feedbackResult.feedback);
    } catch (error: any) {
      toast.error(error.message || "Error getting AI feedback");
      console.error("Error getting AI feedback:", error);
      setAiFeedback("Sorry, I couldn't generate feedback for your quiz.");
    } finally {
      setLoadingAiFeedback(false);
    }
  };

  // Loading state
  if (questionsLoading || !quizResult) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Error state
  if (questionsError) {
    return (
      <div className="p-8 text-center text-destructive">
        Error: {(questionsError as Error)?.message || "Failed to load results"}
      </div>
    );
  }

  // Calculate score and percentage
  const score = quizResult.points;
  const totalQuestions = quizResult.total_questions;
  const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <QuizHeader
        categoryPath={categoryPath}
        quizFile={quizFile}
        score={score}
        totalQuestions={totalQuestions}
        percentage={percentage}
        resultTimer={resultTimer}
        onRetryQuiz={handleRetryQuiz}
        onGetAiFeedback={getAiFeedback}
        loadingAiFeedback={loadingAiFeedback}
        aiFeedback={aiFeedback}
      />

      <PerformanceAnalysis
        allQuestions={allQuestions}
        responsesMap={responsesMap}
        categoryPath={categoryPath}
        quizFile={quizFile}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <QuestionResultView
            allQuestions={allQuestions}
            responsesMap={responsesMap}
            categoryPath={categoryPath}
            quizFile={quizFile}
            showAllQuestions={showAllQuestions}
            selectedQuestionId={selectedQuestionId}
          />

          {!showAllQuestions && selectedQuestionId && (
            <Button
              variant="outline"
              onClick={handleBackToAll}
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Questions
            </Button>
          )}
        </div>

        <div className="lg:w-1/3">
          <QuestionNavigator
            allQuestions={allQuestions}
            responsesMap={responsesMap}
            categoryPath={categoryPath}
            quizFile={quizFile}
            selectedQuestionId={selectedQuestionId}
            onQuestionClick={handleQuestionClick}
          />
        </div>
      </div>
    </div>
  );
}

// Helper function to fetch all choices for questions
async function fetchAllChoices(
  questions: Question[],
  categoryPath: string,
  quizFile: string
): Promise<Record<number, Choice[]>> {
  const choicesMap: Record<number, Choice[]> = {};

  await Promise.all(
    questions.map(async (question) => {
      try {
        const response = await fetch(
          `/api/quiz/choices?categoryPath=${categoryPath}&questionsFile=${quizFile}&questionId=${question.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch choices");
        const choices = await response.json();
        choicesMap[question.id] = choices;
      } catch (error) {
        console.error(
          `Error fetching choices for question ${question.id}:`,
          error
        );
        choicesMap[question.id] = [];
      }
    })
  );

  return choicesMap;
}

// Helper function to prepare quiz data for AI
function prepareQuizDataForAi(
  questions: Question[],
  choicesMap: Record<number, Choice[]>,
  responsesMap: Record<number, number>
) {
  const quizData = {
    quiz: questions.map((question) => {
      const choices = choicesMap[question.id] || [];
      return {
        question: question.text,
        options: choices.map((choice) => choice.text),
        answer: choices.find((choice) => choice.is_correct)?.text || "",
      };
    }),
    selectedAnswers: questions.map((question) => {
      const selectedChoiceId = responsesMap[question.id];
      const selectedChoice = choicesMap[question.id]?.find(
        (choice) => choice.id === selectedChoiceId
      );
      return selectedChoice?.text || "";
    }),
  };

  return quizData;
}










