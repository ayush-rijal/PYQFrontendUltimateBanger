"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAllQuestionsQuery,
  useGetChoicesQuery,
} from "@/redux/features/quizApiSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, ArrowLeft, Download, Send } from "lucide-react";
import Loading from "@/loading/Loading";
import jsPDF from "jspdf";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Interfaces
interface Question {
  id: number;
  text: string;
  subject_category_name: string;
  correct_choice_id?: number;
}

interface Choice {
  id: number;
  text: string;
  is_correct: boolean;
}

interface ChartData {
  subject: string;
  correct: number;
  incorrect: number;
}

// Chart Config
const chartConfig = {
  performance: {
    label: "Performance",
  },
  correct: {
    label: "Correct Answers",
    color: "#10B981",
  },
  incorrect: {
    label: "Incorrect Answers",
    color: "#EF4444",
  },
} satisfies ChartConfig;

// ResultAnalysis Component
function ResultAnalysis() {
  const [viewMode, setViewMode] = React.useState("all");
  const {
    category0,
    category1,
    quizFile: rawQuizFile,
  } = useParams() as { category0: string; category1: string; quizFile: string };
  const quizFile = decodeURIComponent(rawQuizFile);

  const [selectedChoices, setSelectedChoices] = React.useState<
    Record<number, number>
  >({});
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const choicesParam = urlParams.get("choices");
    console.log("URL Choices Param:", choicesParam); // Debug
    if (choicesParam) {
      setSelectedChoices(JSON.parse(decodeURIComponent(choicesParam)));
    }
  }, []);

  const { data: allQuestions = [], isLoading } = useGetAllQuestionsQuery({
    category0,
    category1,
    quizFile,
  });

  const chartData: ChartData[] = React.useMemo(() => {
    console.log("allQuestions:", allQuestions); // Debug
    console.log("selectedChoices:", selectedChoices); // Debug
    if (!allQuestions.length || !Object.keys(selectedChoices).length) return [];

    const subjectStats = allQuestions.reduce((acc, question) => {
      const subject = question.subject_category_name;
      if (!acc[subject]) {
        acc[subject] = { correct: 0, incorrect: 0, total: 0 };
      }
      acc[subject].total += 1;
      const selectedChoice = selectedChoices[question.id];
      const isCorrect = question.correct_choice_id
        ? selectedChoice === question.correct_choice_id
        : false;
      if (isCorrect) {
        acc[subject].correct += 1;
      } else if (selectedChoice) {
        acc[subject].incorrect += 1;
      }
      return acc;
    }, {} as Record<string, { correct: number; incorrect: number; total: number }>);

    const result = Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      correct: stats.correct,
      incorrect: stats.incorrect,
    }));
    console.log("chartData:", result); // Debug
    return result;
  }, [allQuestions, selectedChoices]);

  const filteredData = chartData.filter((item) =>
    viewMode === "all" ? true : item.subject === viewMode
  );

  if (isLoading) {
    return;
    <Loading />;
  }

  if (!chartData.length) {
    return <div>No quiz data available to display.</div>;
  }

  const subjects = Array.from(new Set(chartData.map((item) => item.subject)));

  return (
    <Card className="mb-6">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Quiz Performance Analysis</CardTitle>
          <CardDescription>
            Showing your performance by subject category
          </CardDescription>
        </div>
        <Select value={viewMode} onValueChange={setViewMode}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select view mode"
          >
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="rounded-lg">
              All Subjects
            </SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject} className="rounded-lg">
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCorrect" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-correct)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-correct)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillIncorrect" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-incorrect)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-incorrect)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="subject"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                value.slice(0, 10) + (value.length > 10 ? "..." : "")
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{
                value: "Number of Questions",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="correct"
              type="natural"
              fill="url(#fillCorrect)"
              stroke="var(--color-correct)"
              stackId="a"
            />
            <Area
              dataKey="incorrect"
              type="natural"
              fill="url(#fillIncorrect)"
              stroke="var(--color-incorrect)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Main QuizResultsPage Component
export default function QuizResultsPage() {
  const router = useRouter();
  const {
    category0,
    category1,
    quizFile: rawQuizFile,
    quizId,
  } = useParams() as {
    category0: string;
    category1: string;
    quizFile: string;
    quizId: string;
  };
  const quizFile = decodeURIComponent(rawQuizFile);

  const [selectedChoices, setSelectedChoices] = useState<
    Record<number, number>
  >({});
  const [timeTaken, setTimeTaken] = useState<string | null>(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const choicesParam = urlParams.get("choices");
    const timeParam = urlParams.get("time");
    if (choicesParam) {
      setSelectedChoices(JSON.parse(decodeURIComponent(choicesParam)));
    }
    if (timeParam) {
      setTimeTaken(decodeURIComponent(timeParam));
    }
  }, []);

  const {
    data: allQuestions = [],
    isLoading: questionsLoading,
    error: questionsError,
  } = useGetAllQuestionsQuery({ category0, category1, quizFile });

  const [score, setScore] = useState<number | null>(null);
  const [scoreBySubject, setScoreBySubject] = useState<
    Record<string, { correct: number; total: number }>
  >({});
  useEffect(() => {
    if (allQuestions.length > 0 && Object.keys(selectedChoices).length > 0) {
      const correctCount = allQuestions.reduce((acc, question) => {
        const selectedChoice = selectedChoices[question.id];
        const isCorrect = question.correct_choice_id
          ? selectedChoice === question.correct_choice_id
          : false;
        return acc + (isCorrect ? 1 : 0);
      }, 0);
      setScore(correctCount);

      const breakdown = allQuestions.reduce((acc, question) => {
        const subject = question.subject_category_name;
        if (!acc[subject]) {
          acc[subject] = { correct: 0, total: 0 };
        }
        acc[subject].total += 1;
        const isCorrect =
          selectedChoices[question.id] === question.correct_choice_id;
        if (isCorrect) acc[subject].correct += 1;
        return acc;
      }, {} as Record<string, { correct: number; total: number }>);
      setScoreBySubject(breakdown);
    }
  }, [allQuestions, selectedChoices]);

  const [feedback, setFeedback] = useState("");

  if (questionsLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="p-8 text-center text-destructive">
        Error: {(questionsError as Error)?.message}
      </div>
    );
  }

  const totalQuestions = allQuestions.length;
  const percentage = score !== null ? (score / totalQuestions) * 100 : 0;

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Quiz Results: ${quizFile}`, 20, 20);
    doc.setFontSize(12);
    doc.text(`${category0} / ${category1}`, 20, 30);
    doc.text(
      `Score: ${score}/${totalQuestions} (${Math.round(percentage)}%)`,
      20,
      40
    );
    if (timeTaken) doc.text(`Time Taken: ${timeTaken}`, 20, 50);

    let y = 60;
    doc.text("Score Breakdown by Subject:", 20, y);
    y += 10;
    Object.entries(scoreBySubject).forEach(([subject, { correct, total }]) => {
      doc.text(`${subject}: ${correct}/${total}`, 20, y);
      y += 10;
    });

    y += 10;
    doc.text("Your Answers:", 20, y);
    y += 10;
    allQuestions.forEach((q, index) => {
      const selectedChoice = choicesForQuestion(q.id)?.find(
        (c) => c.id === selectedChoices[q.id]
      );
      const correctChoice = choicesForQuestion(q.id)?.find(
        (c) => c.id === q.correct_choice_id
      );
      doc.text(`${index + 1}. ${q.text}`, 20, y, { maxWidth: 160 });
      y += 10;
      doc.text(`Your Answer: ${selectedChoice?.text || "Not answered"}`, 30, y);
      y += 10;
      doc.text(`Correct Answer: ${correctChoice?.text}`, 30, y);
      y += 10;
    });

    doc.save(`${quizFile}_results.pdf`);
  };

  const choicesForQuestion = (questionId: number) => {
    const { data: choices = [] } = useGetChoicesQuery({
      category0,
      category1,
      quizFile,
      questionId,
    });
    return choices;
  };

  const handleRetryQuiz = () => {
    router.push(`/quiz-app/category/${category0}/${category1}/${quizFile}`);
  };

  const handleFeedbackSubmit = () => {
    console.log("Feedback submitted:", feedback);
    setFeedback("");
    alert("Thank you for your feedback!");
  };

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <header className="mb-8">
        <Button
          variant="outline"
          onClick={() =>
            router.push(
              `/quiz-app/category/${category0}/${category1}/${quizFile}`
            )
          }
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quiz
        </Button>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Quiz Results: {quizFile}
          </h1>
          <p className="text-muted-foreground mt-2">
            {category0} / {category1}
          </p>
          <div className="mt-4 flex flex-col items-center gap-4">
            <Badge variant="secondary" className="text-lg py-2 px-4">
              Score: {score}/{totalQuestions} ({Math.round(percentage)}%)
            </Badge>
            {timeTaken && (
              <Badge variant="outline">Time Taken: {timeTaken}</Badge>
            )}
            <div className="text-sm text-muted-foreground">
              Completed on {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Score Breakdown by Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(scoreBySubject).map(
              ([subject, { correct, total }]) => (
                <div
                  key={subject}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <span>{subject}</span>
                  <Badge variant="outline">
                    {correct}/{total} ({Math.round((correct / total) * 100)}%)
                  </Badge>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <ResultAnalysis />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Answers</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[50vh] pr-4">
            <div className="space-y-6">
              {allQuestions.map((question: Question) => (
                <QuestionResult
                  key={question.id}
                  question={question}
                  selectedChoiceId={selectedChoices[question.id]}
                  category0={category0}
                  category1={category1}
                  quizFile={quizFile}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Button onClick={handleRetryQuiz} variant="outline" className="flex-1">
          Retry Quiz
        </Button>
        <Button onClick={exportToPDF} variant="outline" className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Export as PDF
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Provide Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Let us know your thoughts about this quiz..."
            className="mb-4"
          />
          <Button onClick={handleFeedbackSubmit} disabled={!feedback.trim()}>
            <Send className="mr-2 h-4 w-4" />
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// QuestionResult Component
function QuestionResult({
  question,
  selectedChoiceId,
  category0,
  category1,
  quizFile,
}: {
  question: Question;
  selectedChoiceId?: number;
  category0: string;
  category1: string;
  quizFile: string;
}) {
  const {
    data: choices = [],
    isLoading,
    error,
  } = useGetChoicesQuery({
    category0,
    category1,
    quizFile,
    questionId: question.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-center text-destructive">
        Error loading choices
      </div>
    );
  }

  const correctChoiceId =
    question.correct_choice_id || choices.find((c) => c.is_correct)?.id;
  const isCorrect = selectedChoiceId === correctChoiceId;
  const cardClass = isCorrect
    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
    : selectedChoiceId
    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
    : "border-muted";

  return (
    <Card className={`transition-all ${cardClass}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{question.subject_category_name}</Badge>
          {isCorrect ? (
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : selectedChoiceId ? (
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          ) : null}
        </div>
        <CardTitle className="text-lg">{question.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {choices.map((choice: Choice) => {
            const isSelected = choice.id === selectedChoiceId;
            const isCorrectChoice = choice.id === correctChoiceId;
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
      <Separator />
    </Card>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   useGetAllQuestionsQuery,
//   useGetChoicesQuery,
// } from "@/redux/features/quizApiSlice";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Textarea } from "@/components/ui/textarea";
// import { CheckCircle, XCircle, ArrowLeft, Download, Send } from "lucide-react";
// import Loading from "@/loading/Loading";
// import jsPDF from "jspdf";
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

// // Interfaces
// interface Question {
//   id: number;
//   text: string;
//   subject_category_name: string;
//   correct_choice_id?: number;
// }

// interface Choice {
//   id: number;
//   text: string;
//   is_correct: boolean;
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
//   selectedChoices,
// }: {
//   allQuestions: Question[];
//   selectedChoices: Record<number, number>;
// }) {
//   const [viewMode, setViewMode] = React.useState("all");

//   const chartData: ChartData[] = React.useMemo(() => {
//     if (!allQuestions.length || !Object.keys(selectedChoices).length) return [];

//     const subjectStats = allQuestions.reduce((acc, question) => {
//       const subject = question.subject_category_name;
//       if (!acc[subject]) {
//         acc[subject] = { correct: 0, incorrect: 0, total: 0 };
//       }
//       acc[subject].total += 1;
//       const selectedChoice = selectedChoices[question.id];
//       const isCorrect = question.correct_choice_id
//         ? selectedChoice === question.correct_choice_id
//         : false;
//       if (isCorrect) {
//         acc[subject].correct += 1;
//       } else if (selectedChoice) {
//         acc[subject].incorrect += 1;
//       }
//       return acc;
//     }, {} as Record<string, { correct: number; incorrect: number; total: number }>);

//     return Object.entries(subjectStats).map(([subject, stats]) => ({
//       subject,
//       correct: stats.correct,
//       incorrect: stats.incorrect,
//     }));
//   }, [allQuestions, selectedChoices]);

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
//           <CardDescription>
//             Your performance by subject category
//           </CardDescription>
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

// // Main QuizResultsPage Component
// export default function QuizResultsPage() {
//   const router = useRouter();
//   const {
//     category0,
//     category1,
//     quizFile: rawQuizFile,
//     quizId,
//   } = useParams() as {
//     category0: string;
//     category1: string;
//     quizFile: string;
//     quizId: string;
//   };
//   const quizFile = decodeURIComponent(rawQuizFile);

//   const [selectedChoices, setSelectedChoices] = useState<
//     Record<number, number>
//   >({});
//   const [timeTaken, setTimeTaken] = useState<string | null>(null);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   useEffect(() => {
//     if (!isInitialLoad) return;
//     const urlParams = new URLSearchParams(window.location.search);
//     const choicesParam = urlParams.get("choices");
//     const timeParam = urlParams.get("time");
//     if (choicesParam) {
//       try {
//         setSelectedChoices(JSON.parse(decodeURIComponent(choicesParam)));
//       } catch (error) {
//         console.error("Failed to parse choices:", error);
//       }
//     }
//     if (timeParam) {
//       setTimeTaken(decodeURIComponent(timeParam));
//     }
//     setIsInitialLoad(false);
//   }, [isInitialLoad]);

//   const {
//     data: allQuestions = [],
//     isLoading: questionsLoading,
//     error: questionsError,
//   } = useGetAllQuestionsQuery({ category0, category1, quizFile });

//   const [score, setScore] = useState<number | null>(null);
//   const [scoreBySubject, setScoreBySubject] = useState<
//     Record<string, { correct: number; total: number }>
//   >({});

//   useEffect(() => {
//     if (allQuestions.length > 0 && Object.keys(selectedChoices).length > 0) {
//       const correctCount = allQuestions.reduce((acc, question) => {
//         const selectedChoice = selectedChoices[question.id];
//         const isCorrect = question.correct_choice_id
//           ? selectedChoice === question.correct_choice_id
//           : false;
//         return acc + (isCorrect ? 1 : 0);
//       }, 0);
//       setScore(correctCount);

//       const breakdown = allQuestions.reduce((acc, question) => {
//         const subject = question.subject_category_name;
//         if (!acc[subject]) {
//           acc[subject] = { correct: 0, total: 0 };
//         }
//         acc[subject].total += 1;
//         const isCorrect =
//           selectedChoices[question.id] === question.correct_choice_id;
//         if (isCorrect) acc[subject].correct += 1;
//         return acc;
//       }, {} as Record<string, { correct: number; total: number }>);
//       setScoreBySubject(breakdown);
//     }
//   }, [allQuestions, selectedChoices]);

//   const [feedback, setFeedback] = useState("");

//   if (questionsLoading) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center">
//         <Loading />
//       </div>
//     );
//   }

//   if (questionsError) {
//     return (
//       <div className="p-8 text-center text-destructive">
//         Error: {(questionsError as Error)?.message}
//       </div>
//     );
//   }

//   const totalQuestions = allQuestions.length;
//   const percentage = score !== null ? (score / totalQuestions) * 100 : 0;

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text(`Quiz Results: ${quizFile}`, 20, 20);
//     doc.setFontSize(12);
//     doc.text(`${category0} / ${category1}`, 20, 30);
//     doc.text(
//       `Score: ${score}/${totalQuestions} (${Math.round(percentage)}%)`,
//       20,
//       40
//     );
//     if (timeTaken) doc.text(`Time Taken: ${timeTaken}`, 20, 50);

//     let y = 60;
//     doc.text("Score Breakdown by Subject:", 20, y);
//     y += 10;
//     Object.entries(scoreBySubject).forEach(([subject, { correct, total }]) => {
//       doc.text(`${subject}: ${correct}/${total}`, 20, y);
//       y += 10;
//     });

//     y += 10;
//     doc.text("Your Answers:", 20, y);
//     y += 10;
//     allQuestions.forEach((q, index) => {
//       const choices = choicesForQuestion(q.id);
//       const selectedChoice = choices.find(
//         (c) => c.id === selectedChoices[q.id]
//       );
//       const correctChoice = choices.find((c) => c.id === q.correct_choice_id);
//       doc.text(`${index + 1}. ${q.text}`, 20, y, { maxWidth: 160 });
//       y += 10;
//       doc.text(`Your Answer: ${selectedChoice?.text || "Not answered"}`, 30, y);
//       y += 10;
//       doc.text(`Correct Answer: ${correctChoice?.text}`, 30, y);
//       y += 10;
//     });

//     doc.save(`${quizFile}_results.pdf`);
//   };

//   const choicesForQuestion = (questionId: number) => {
//     const { data: choices = [] } = useGetChoicesQuery({
//       category0,
//       category1,
//       quizFile,
//       questionId,
//     });
//     return choices;
//   };

//   const handleRetryQuiz = () => {
//     router.push(`/quiz-app/category/${category0}/${category1}/${quizFile}`);
//   };

//   const handleFeedbackSubmit = () => {
//     console.log("Feedback submitted:", feedback);
//     setFeedback("");
//     alert("Thank you for your feedback!");
//   };

//   return (
//     <div className="container mx-auto p-4 lg:p-8">
//       <header className="mb-8">
//         <Button variant="outline" onClick={handleRetryQuiz} className="mb-4">
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Quiz
//         </Button>
//         <div className="text-center">
//           <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
//             Quiz Results: {quizFile}
//           </h1>
//           <p className="text-muted-foreground mt-2">
//             {category0} / {category1}
//           </p>
//           <div className="mt-4 flex flex-col items-center gap-4">
//             <Badge variant="secondary" className="text-lg py-2 px-4">
//               Score: {score ?? "N/A"}/{totalQuestions} ({Math.round(percentage)}
//               %)
//             </Badge>
//             {timeTaken && (
//               <Badge variant="outline">Time Taken: {timeTaken}</Badge>
//             )}
//             <div className="text-sm text-muted-foreground">
//               Completed on {new Date().toLocaleDateString()}
//             </div>
//           </div>
//         </div>
//       </header>

//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Score Breakdown by Subject</CardTitle>
//           <CardDescription>
//             Your performance across different subjects
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {Object.entries(scoreBySubject).map(
//               ([subject, { correct, total }]) => (
//                 <div
//                   key={subject}
//                   className="flex items-center justify-between p-2 border rounded-md"
//                 >
//                   <span>{subject}</span>
//                   <Badge variant="outline">
//                     {correct}/{total} ({Math.round((correct / total) * 100)}%)
//                   </Badge>
//                 </div>
//               )
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       <ResultAnalysis
//         allQuestions={allQuestions}
//         selectedChoices={selectedChoices}
//       />

//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Your Selected Answers</CardTitle>
//           <CardDescription>
//             Review your choices compared to the correct answers
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <ScrollArea className="h-[50vh] pr-4">
//             <div className="space-y-6">
//               {allQuestions.map((question) => (
//                 <QuestionResult
//                   key={question.id}
//                   question={question}
//                   selectedChoiceId={selectedChoices[question.id]}
//                   category0={category0}
//                   category1={category1}
//                   quizFile={quizFile}
//                 />
//               ))}
//             </div>
//           </ScrollArea>
//         </CardContent>
//       </Card>

//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <Button onClick={handleRetryQuiz} variant="outline" className="flex-1">
//           Retry Quiz
//         </Button>
//         <Button onClick={exportToPDF} variant="outline" className="flex-1">
//           <Download className="mr-2 h-4 w-4" />
//           Export as PDF
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Provide Feedback</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Textarea
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//             placeholder="Let us know your thoughts about this quiz..."
//             className="mb-4"
//           />
//           <Button onClick={handleFeedbackSubmit} disabled={!feedback.trim()}>
//             <Send className="mr-2 h-4 w-4" />
//             Submit Feedback
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// // QuestionResult Component
// function QuestionResult({
//   question,
//   selectedChoiceId,
//   category0,
//   category1,
//   quizFile,
// }: {
//   question: Question;
//   selectedChoiceId?: number;
//   category0: string;
//   category1: string;
//   quizFile: string;
// }) {
//   const {
//     data: choices = [],
//     isLoading,
//     error,
//   } = useGetChoicesQuery({
//     category0,
//     category1,
//     quizFile,
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

//   const correctChoiceId =
//     question.correct_choice_id || choices.find((c) => c.is_correct)?.id;
//   const isCorrect = selectedChoiceId === correctChoiceId;
//   const selectedChoice = choices.find((c) => c.id === selectedChoiceId);
//   const correctChoice = choices.find((c) => c.id === correctChoiceId);
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
//             <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
//           ) : selectedChoiceId ? (
//             <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
//           ) : null}
//         </div>
//         <CardTitle className="text-lg">{question.text}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-2">
//           <div className="flex items-start gap-2 p-2 rounded-md bg-muted/50">
//             <span className="h-4 w-4 rounded-full border border-blue-500 bg-blue-200 dark:bg-blue-700 flex items-center justify-center">
//               {selectedChoice && (
//                 <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
//               )}
//             </span>
//             <p className="text-blue-700 dark:text-blue-300 font-medium">
//               Your Answer: {selectedChoice?.text || "Not answered"}
//             </p>
//           </div>
//           <div className="flex items-start gap-2 p-2 rounded-md">
//             <span className="h-4 w-4 rounded-full border border-green-500 bg-green-200 dark:bg-green-700 flex items-center justify-center">
//               <span className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400" />
//             </span>
//             <p className="text-green-600 dark:text-green-400">
//               Correct Answer: {correctChoice?.text}
//             </p>
//           </div>
//           {!isCorrect && selectedChoiceId && (
//             <p className="text-sm text-muted-foreground">
//               Explanation: Review this question to improve next time.
//             </p>
//           )}
//         </div>
//       </CardContent>
//       <Separator />
//     </Card>
//   );
// }
