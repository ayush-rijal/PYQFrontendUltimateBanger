// "use client";

// import { useRouter, useParams, useSearchParams } from "next/navigation";
// import { useGetAllQuestionsQuery } from "@/redux/features/quizApiSlice";
// import {
//   useRetrieveUserQuery,
//   useSaveQuizScoreMutation,
// } from "@/redux/features/authApiSlice";
// // import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// // import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   BarChart,
//   CheckCircle,
//   RotateCcw,
//   Share2,
//   AlertCircle,
//   Info,
// } from "lucide-react";
// import { useState, useEffect } from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import {
//   BarChart as RechartsBarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast, Toaster } from "sonner";
// import Link from "next/link";

// interface Question {
//   id: number;
//   text: string;
//   questions_file_title: string;
//   subject_category_name: string;
//   correct_choice_id?: number;
//   choices?: Choice[];
// }

// interface Choice {
//   id: number;
//   text: string;
//   is_correct: boolean;
//   question: number;
// }

// interface LeaderboardEntry {
//   user_id: string;
//   user_name: string;
//   score: number;
// }

// // Custom hook to fetch choices for all questions
// const useFetchChoices = (
//   questions: Question[],
//   category0: string,
//   category1: string,
//   quizFile: string
// ) => {
//   const [choicesMap, setChoicesMap] = useState<Record<number, Choice[]>>({});
//   const [questionIds, setQuestionIds] = useState<number[]>([]);

//   useEffect(() => {
//     if (questions.length > 0) {
//       setQuestionIds(questions.map((q) => q.id));
//     }
//   }, [questions]);

//   useEffect(() => {
//     if (questionIds.length === 0) return;

//     const fetchChoices = async () => {
//       for (const questionId of questionIds) {
//         try {
//           const response = await fetch(
//             `/api/${category0}/${category1}/${quizFile}/${questionId}/choices/`
//           );
//           if (response.ok) {
//             const choices: Choice[] = await response.json();
//             setChoicesMap((prev) => ({
//               ...prev,
//               [questionId]: choices,
//             }));
//           } else {
//             console.error(`Failed to fetch choices for question ${questionId}`);
//           }
//         } catch (error) {
//           console.error(
//             `Error fetching choices for question ${questionId}:`,
//             error
//           );
//         }
//       }
//     };

//     fetchChoices();
//   }, [questionIds, category0, category1, quizFile]);

//   return choicesMap;
// };

// export default function ResultsPage() {
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
//   const searchParams = useSearchParams();
//   const quizFile = decodeURIComponent(rawQuizFile);

//   const selectedChoices = JSON.parse(
//     decodeURIComponent(searchParams.get("choices") || "{}")
//   ) as Record<number, number>;

//   const {
//     data: allQuestions = [],
//     isLoading,
//     error,
//   } = useGetAllQuestionsQuery({ category0, category1, quizFile });

//   const choicesMap = useFetchChoices(
//     allQuestions,
//     category0,
//     category1,
//     quizFile
//   );

//   const { data: currentUser } = useRetrieveUserQuery();
//   const [saveQuizScore] = useSaveQuizScoreMutation();

//   const handleRestart = () => {
//     toast.success("Quiz Restarted", {
//       description: "You're ready to take the quiz again! Good luck!",
//     });
//     router.push(`/quiz/${category0}/${category1}/${rawQuizFile}`);
//   };

//   const handleShare = () => {
//     const shareUrl = window.location.href;
//     navigator.clipboard.writeText(shareUrl).then(() => {
//       toast.success("Results Shared", {
//         description: "The results URL has been copied to your clipboard!",
//       });
//     });
//   };

//   // Calculate performance metrics
//   const answeredCount = Object.keys(selectedChoices).length;
//   const totalQuestions = allQuestions.length;
//   const completionPercentage = (answeredCount / totalQuestions) * 100;

//   let correctCount = 0;
//   allQuestions.forEach((question) => {
//     const choices = choicesMap[question.id] || [];
//     const selectedChoice = choices.find(
//       (choice) => choice.id === selectedChoices[question.id]
//     );
//     if (selectedChoice && selectedChoice.is_correct) {
//       correctCount++;
//     }
//   });
//   const scorePercentage = (correctCount / totalQuestions) * 100;

//   // Save the user's score to the leaderboard
//   useEffect(() => {
//     const saveScore = async () => {
//       if (!currentUser) {
//         console.error("User not authenticated");
//         return;
//       }

//       const userId = currentUser.id || currentUser.email; // Use email as fallback if id is not available
//       const userName = `${currentUser.first_name} ${currentUser.last_name}`;

//       try {
//         await saveQuizScore({
//           user_id: userId,
//           user_name: userName,
//           category0,
//           category1,
//           quiz_file: quizFile,
//           quiz_id: quizId,
//           score: correctCount,
//         }).unwrap();
//         toast.success("Score Saved", {
//           description: "Your score has been added to the leaderboard!",
//         });
//       } catch (error) {
//         console.error("Error saving score to leaderboard:", error);
//         toast.error("Error", {
//           description: "Failed to save your score to the leaderboard.",
//         });
//       }
//     };

//     if (correctCount > 0 && totalQuestions > 0 && currentUser) {
//       saveScore();
//     }
//   }, [
//     correctCount,
//     totalQuestions,
//     category0,
//     category1,
//     quizFile,
//     quizId,
//     currentUser,
//     saveQuizScore,
//   ]);

//   // Group questions by subject for category-wise performance
//   const performanceBySubject = allQuestions.reduce((acc, question) => {
//     const subject = question.subject_category_name;
//     if (!acc[subject]) {
//       acc[subject] = { total: 0, correct: 0 };
//     }
//     acc[subject].total += 1;
//     const choices = choicesMap[question.id] || [];
//     const selectedChoice = choices.find(
//       (choice) => choice.id === selectedChoices[question.id]
//     );
//     if (selectedChoice && selectedChoice.is_correct) {
//       acc[subject].correct += 1;
//     }
//     return acc;
//   }, {} as Record<string, { total: number; correct: number }>);

//   const barChartData = Object.entries(performanceBySubject).map(
//     ([subject, { correct, total }]) => ({
//       name: subject,
//       correct,
//       incorrect: total - correct,
//       total,
//     })
//   );

//   if (isLoading) {
//     return (
//       <div className="container mx-auto p-4 lg:p-8">
//         <div className="max-w-5xl mx-auto space-y-6">
//           <Skeleton className="h-32 w-full rounded-lg" />
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             <Skeleton className="h-40 w-full rounded-lg" />
//             <Skeleton className="h-40 w-full rounded-lg" />
//             <Skeleton className="h-40 w-full rounded-lg" />
//           </div>
//           <Skeleton className="h-64 w-full rounded-lg" />
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 text-center text-destructive">
//         Error: {(error as Error).message}
//       </div>
//     );
//   }

//   return (
//     <div className="container ">
//       <Toaster />
//       <div className="max-w-5xl ">
//         <Card className="shadow-lg">
//           <CardHeader className="dark:text-white rounded-t-lg">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div>
//                 <CardTitle className="text-3xl font-bold">
//                   Quiz Results
//                 </CardTitle>
//                 <p className="text-blue-100 mt-2 dark:text-white">
//                   {category0} / {category1}
//                 </p>
//               </div>
//               <div className="flex flex-col items-start sm:items-end gap-2">
//                 <Badge variant="secondary" className="text-lg ">
//                   {quizFile}
//                 </Badge>
//                 <Badge
//                   variant="outline"
//                   className="text-sm bg-transparent text-white border-white"
//                 >
//                   Your Quiz ID: {quizId}
//                 </Badge>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent className="pt-6">
//             <Tabs defaultValue="summary" className="w-full">
//               <TabsList className="grid w-full grid-cols-4">
//                 <TabsTrigger value="summary">Summary</TabsTrigger>
//                 <TabsTrigger value="analytics">Analytics</TabsTrigger>
//                 <TabsTrigger value="answers">Answers</TabsTrigger>
//                 <TabsTrigger value="leaderboard">
//                   <Link href="/leaderboard">Leaderboard</Link>
//                 </TabsTrigger>
//               </TabsList>

//               {/* Summary Tab */}
//               <TabsContent value="summary">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
//                   <div className="text-center p-6 bg-gray-50  dark:bg-gray-700  rounded-lg shadow-sm">
//                     <BarChart className="h-10 w-10 mx-auto mb-3 text-blue-600" />
//                     <p className="text-sm text-gray-500 dark:text-white">
//                       Total Questions
//                     </p>
//                     <p className="text-3xl font-bold text-gray-800 dark:text-white">
//                       {totalQuestions}
//                     </p>
//                   </div>
//                   <div className="text-center p-6 dark:bg-gray-700  bg-gray-50 rounded-lg shadow-sm">
//                     <CheckCircle className="h-10 w-10 mx-auto mb-3 text-green-500" />
//                     <p className="text-sm text-gray-500 dark:text-white">
//                       Correct Answers
//                     </p>
//                     <p className="text-3xl font-bold text-gray-800 dark:text-white">
//                       {correctCount}
//                     </p>
//                   </div>
//                   <div className=" dark:bg-gray-700 text-center p-6 bg-gray-50 rounded-lg shadow-sm">
//                     <div className="relative w-24 h-24 mx-auto mb-3">
//                       <svg className="w-full h-full" viewBox="0 0 36 36">
//                         <path
//                           d="M18 2.0845
//                             a 15.9155 15.9155 0 0 1 0 31.831
//                             a 15.9155 15.9155 0 0 1 0 -31.831"
//                           fill="none"
//                           stroke="#E5E7EB"
//                           strokeWidth="3"
//                         />
//                         <path
//                           d="M18 2.0845
//                             a 15.9155 15.9155 0 0 1 0 31.831
//                             a 15.9155 15.9155 0 0 1 0 -31.831"
//                           fill="none"
//                           stroke="#3B82F6"
//                           strokeWidth="3"
//                           strokeDasharray={`${scorePercentage}, 100`}
//                         />
//                         <text
//                           x="18"
//                           y="23.35"
//                           className="text-sm text-gray-800"
//                           textAnchor="middle"
//                         >
//                           {Math.round(scorePercentage)}%
//                         </text>
//                       </svg>
//                     </div>
//                     <p className="text-sm text-gray-500 dark:text-white">
//                       Score
//                     </p>
//                   </div>
//                 </div>
//               </TabsContent>

//               {/* Analytics Tab */}
//               <TabsContent value="analytics">
//                 <div className="mt-6">
//                   <div className="flex items-center gap-2 mb-4">
//                     <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
//                       Performance by Subject
//                     </h3>
//                     <TooltipProvider>
//                       <Tooltip>
//                         <TooltipTrigger>
//                           <Info className="h-5 w-5 text-gray-500" />
//                         </TooltipTrigger>
//                         <TooltipContent>
//                           <p>
//                             Shows the number of correct and incorrect answers
//                             per subject.
//                           </p>
//                         </TooltipContent>
//                       </Tooltip>
//                     </TooltipProvider>
//                   </div>
//                   <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                       <RechartsBarChart data={barChartData}>
//                         <XAxis dataKey="name" />
//                         <YAxis />
//                         <Legend />
//                         <Bar
//                           dataKey="correct"
//                           stackId="a"
//                           fill="#10B981"
//                           name="Correct"
//                           radius={[8, 8, 0, 0]}
//                         />
//                         <Bar
//                           dataKey="incorrect"
//                           stackId="a"
//                           fill="#EF4444"
//                           name="Incorrect"
//                           radius={[8, 8, 0, 0]}
//                         />
//                       </RechartsBarChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>
//               </TabsContent>

//               {/* Answers Tab */}
//               <TabsContent value="answers">
//                 <div className="mt-6">
//                   <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
//                     Your Answers
//                   </h3>
//                   <ScrollArea className="h-[50vh] rounded-md border">
//                     <Accordion type="multiple" className="p-4 space-y-4">
//                       {allQuestions.map((question, index) => {
//                         const choices = choicesMap[question.id] || [];
//                         const selectedChoice = choices.find(
//                           (choice) => choice.id === selectedChoices[question.id]
//                         );
//                         const correctChoice = choices.find(
//                           (choice) => choice.is_correct
//                         );
//                         const isCorrect = selectedChoice?.is_correct || false;

//                         return (
//                           <AccordionItem
//                             key={question.id}
//                             value={`item-${question.id}`}
//                           >
//                             <AccordionTrigger className="text-left p-2 rounded-md">
//                               <div className="flex items-center justify-between w-full">
//                                 <span className="text-lg font-medium">
//                                   {index + 1}. {question.text}
//                                 </span>
//                                 <div className="flex items-center gap-2">
//                                   {selectedChoices[question.id] ? (
//                                     isCorrect ? (
//                                       <CheckCircle className="h-5 w-5 text-green-500" />
//                                     ) : (
//                                       <AlertCircle className="h-5 w-5 text-red-500" />
//                                     )
//                                   ) : (
//                                     <span className="text-gray-500 text-sm">
//                                       Not answered
//                                     </span>
//                                   )}
//                                 </div>
//                               </div>
//                             </AccordionTrigger>
//                             <AccordionContent className="pl-6">
//                               <div className="space-y-2">
//                                 <p className="text-sm text-gray-600">
//                                   <span className="font-medium text-xl">
//                                     Your Answer:
//                                   </span>{" "}
//                                   {selectedChoice ? (
//                                     isCorrect ? (
//                                       <span className="text-green-600">
//                                         {selectedChoice.text}
//                                       </span>
//                                     ) : (
//                                       <span className="text-red-600">
//                                         {selectedChoice.text}
//                                       </span>
//                                     )
//                                   ) : (
//                                     <span className="text-gray-500 font-bold">
//                                       Not answered
//                                     </span>
//                                   )}
//                                 </p>
//                                 {correctChoice && (
//                                   <p className="text-sm text-gray-600">
//                                     <span className="font-medium">
//                                       Correct Answer:
//                                     </span>{" "}
//                                     <span className="text-green-600">
//                                       {correctChoice.text}
//                                     </span>
//                                   </p>
//                                 )}
//                                 <p className="text-sm text-gray-500">
//                                   Subject: {question.subject_category_name}
//                                 </p>
//                               </div>
//                             </AccordionContent>
//                           </AccordionItem>
//                         );
//                       })}
//                     </Accordion>
//                   </ScrollArea>
//                 </div>
//               </TabsContent>

//               {/* Leaderboard Tab (Now a Link) */}
//               <TabsContent value="leaderboard">
//                 <div className="mt-6 text-center">
//                   <p className="text-gray-600 dark:text-white">
//                     View the global leaderboard to see how you rank among all
//                     users!
//                   </p>
//                   <Button asChild className="mt-4">
//                     <Link href="/leaderboard">Go to Leaderboard</Link>
//                   </Button>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//           <CardFooter className="flex flex-col sm:flex-row justify-between p-6  rounded-b-lg gap-4">
//             <Button
//               variant="outline"
//               onClick={handleShare}
//               className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
//             >
//               <Share2 className="h-4 w-4" />
//               Share Results
//             </Button>
//             <Button
//               variant="default"
//               onClick={handleRestart}
//               className="flex items-center gap-2  bg-amber-800"
//             >
//               <RotateCcw className="h-4 w-4" />
//               Take Quiz Again
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }



"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useGetAllQuestionsQuery } from "@/redux/features/quizApiSlice";
import { useRetrieveUserQuery, useSaveQuizScoreMutation } from "@/redux/features/authApiSlice";
// import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart,
  CheckCircle,
  RotateCcw,
  Share2,
  AlertCircle,
  Info,
  
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { toast, Toaster } from "sonner";
import Link from "next/link";

interface Question {
  id: number;
  text: string;
  questions_file_title: string;
  subject_category_name: string;
  correct_choice_id?: number;
  choices?: Choice[];
}

interface Choice {
  id: number;
  text: string;
  is_correct: boolean;
  question: number;
}

interface LeaderboardEntry {
  user_id: string;
  user_name: string;
  score: number;
}

// Custom hook to fetch choices for all questions
// const useFetchChoices = (
//   questions: Question[],
//   category0: string,
//   category1: string,
//   quizFile: string
// ) => {
//   const [choicesMap, setChoicesMap] = useState<Record<number, Choice[]>>({});
//   const [questionIds, setQuestionIds] = useState<number[]>([]);
//   const [isLoadingChoices, setIsLoadingChoices] = useState(false);
//   const [errorChoices, setErrorChoices] = useState<string | null>(null);

//   useEffect(() => {
//     if (questions.length > 0) {
//       setQuestionIds(questions.map((q) => q.id));
//     }
//   }, [questions]);

//   useEffect(() => {
//     if (questionIds.length === 0) return;

//     const fetchChoices = async () => {
//       setIsLoadingChoices(true);
//       setErrorChoices(null);
//       try {
//         for (const questionId of questionIds) {
//           const response = await fetch(
//             `/api/${category0}/${category1}/${quizFile}/${questionId}/choices/`
//           );
//           console.log(" Fetching choice for response:", response);
//           console.log("Parameters:",{ category0, category1, quizFile, questionId})
//           if (response.ok) {
//             const choices: Choice[] = await response.json();
//             setChoicesMap((prev) => ({
//               ...prev,
//               [questionId]: choices,
//             }));
//           } else {
//             throw new Error(`Failed to fetch choices for question ${questionId}:${response.status} ${response.statusText}`);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching choices:", error);
//         setErrorChoices("Failed to load answer choices. Please try again.");
//       } finally {
//         setIsLoadingChoices(false);
//       }
//     };

//     fetchChoices();
//   }, [questionIds, category0, category1, quizFile]);

//   return { choicesMap, isLoadingChoices, errorChoices };
// };

// src/app/quiz-app/category/[category0]/[category1]/[quizFile]/results/[quizId]/page.tsx
const useFetchChoices = (
  questions: Question[],
  category0: string,
  category1: string,
  quizFile: string
) => {
  const [choicesMap, setChoicesMap] = useState<Record<number, Choice[]>>({});
  const [isLoadingChoices, setIsLoadingChoices] = useState(false);
  const [errorChoices, setErrorChoices] = useState<string | null>(null);

  useEffect(() => {
    if (questions.length > 0) {
      const fetchChoices = async () => {
        setIsLoadingChoices(true);
        setErrorChoices(null);
        try {
          for (const question of questions) {
            const { data: choices, error, isLoading } = useGetChoicesForQuestionQuery({
              category0,
              category1,
              quizFile,
              questionId: question.id,
            });
            if (isLoading) continue; // Skip if still loading
            if (error) {
              console.warn(`No choices found for question ${question.id}: ${error}`);
              setChoicesMap((prev) => ({
                ...prev,
                [question.id]: [],
              }));
            } else if (choices) {
              setChoicesMap((prev) => ({
                ...prev,
                [question.id]: choices,
              }));
            }
          }
        } catch (error) {
          console.error("Error fetching choices:", error);
          setErrorChoices("Failed to load some answer choices. Some answers may be missing.");
        } finally {
          setIsLoadingChoices(false);
        }
      };

      fetchChoices();
    }
  }, [questions, category0, category1, quizFile]);

  return { choicesMap, isLoadingChoices, errorChoices };
};
export default function ResultsPage() {
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
  const searchParams = useSearchParams();
  const quizFile = decodeURIComponent(rawQuizFile);

  // Parse selected choices with error handling
  const selectedChoices = useMemo(() => {
    let choices: Record<number, number> = {};
    try {
      const choicesParam = searchParams.get("choices");
      if (choicesParam) {
        choices = JSON.parse(decodeURIComponent(choicesParam)) as Record<number, number>;
        console.log("Parsed selectedChoices:", choices);
      } else {
        console.warn("No choices found in URL query parameter.");
      }
    } catch (error) {
      console.error("Error parsing selectedChoices:", error);
      toast.error("Error", {
        description: "Failed to load your selected answers.",
      });
    }
    return choices;
  }, [searchParams]);

  const {
    data: allQuestions = [],
    isLoading: isLoadingQuestions,
    error: questionsError,
  } = useGetAllQuestionsQuery({ category0, category1, quizFile });

  const { choicesMap, isLoadingChoices, errorChoices } = useFetchChoices(
    allQuestions,
    category0,
    category1,
    quizFile
  );

  const { data: currentUser, error: userError } = useRetrieveUserQuery();
  const [saveQuizScore] = useSaveQuizScoreMutation();

  const [correctCount, setCorrectCount] = useState(0);
  const [scorePercentage, setScorePercentage] = useState(0);

  const handleRestart = () => {
    toast.success("Quiz Restarted", {
      description: "You're ready to take the quiz again! Good luck!",
    });
    router.push(`/quiz/${category0}/${category1}/${rawQuizFile}`);
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast.success("Results Shared", {
        description: "The results URL has been copied to your clipboard!",
      });
    });
  };

  // Calculate performance metrics
  const answeredCount = Object.keys(selectedChoices).length;
  const totalQuestions = allQuestions.length;

  useEffect(() => {
    if (isLoadingQuestions || isLoadingChoices || !allQuestions.length) return;

    let newCorrectCount = 0;
    allQuestions.forEach((question) => {
      const choices = choicesMap[question.id] || [];
      const selectedChoice = choices.find(
        (choice) => choice.id === selectedChoices[question.id]
      );
      if (selectedChoice && selectedChoice.is_correct) {
        newCorrectCount++;
      }
    });
    setCorrectCount(newCorrectCount);
    setScorePercentage(totalQuestions > 0 ? (newCorrectCount / totalQuestions) * 100 : 0);
  }, [allQuestions, choicesMap, selectedChoices, isLoadingQuestions, isLoadingChoices, totalQuestions]);

  // Save the user's score to the leaderboard
  useEffect(() => {
    const saveScore = async () => {
      if (!currentUser) {
        console.error("User not authenticated");
        toast.error("Authentication Required", {
          description: "Please log in to save your score.",
        });
        return;
      }

      const userId = currentUser.id || currentUser.email;
      const userName = `${currentUser.first_name} ${currentUser.last_name}`;

      try {
        await saveQuizScore({
          user_id: userId,
          user_name: userName,
          category0,
          category1,
          quiz_file: quizFile,
          quiz_id: quizId,
          score: correctCount,
        }).unwrap();
        toast.success("Score Saved", {
          description: "Your score has been added to the leaderboard!",
        });
      } catch (error) {
        console.error("Error saving score to leaderboard:", error);
        toast.error("Error", {
          description: "Failed to save your score to the leaderboard.",
        });
      }
    };

    if (correctCount > 0 && totalQuestions > 0 && currentUser && !isLoadingChoices) {
      saveScore();
    }
  }, [correctCount, totalQuestions, category0, category1, quizFile, quizId, currentUser, saveQuizScore, isLoadingChoices]);

  // Group questions by subject for category-wise performance
  const performanceBySubject = allQuestions.reduce((acc, question) => {
    const subject = question.subject_category_name;
    if (!acc[subject]) {
      acc[subject] = { total: 0, correct: 0 };
    }
    acc[subject].total += 1;
    const choices = choicesMap[question.id] || [];
    const selectedChoice = choices.find(
      (choice) => choice.id === selectedChoices[question.id]
    );
    if (selectedChoice && selectedChoice.is_correct) {
      acc[subject].correct += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; correct: number }>);

  const barChartData = Object.entries(performanceBySubject).map(
    ([subject, { correct, total }]) => ({
      name: subject,
      correct,
      incorrect: total - correct,
      total,
    })
  );

  if (isLoadingQuestions) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="p-8 text-center text-destructive">
        Error: {(questionsError as Error).message}
      </div>
    );
  }

  if (userError) {
    return (
      <div className="p-8 text-center text-destructive">
        Error: Please log in to view your results.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <Toaster />
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-bold">Quiz Results</CardTitle>
                <p className="text-blue-100 mt-2">
                  {category0} / {category1}
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2">
                <Badge variant="secondary" className="text-lg bg-white text-blue-600">
                  {quizFile}
                </Badge>
                <Badge variant="outline" className="text-sm bg-transparent text-white border-white">
                  ID: {quizId}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="answers">Answers</TabsTrigger>
                <TabsTrigger value="leaderboard">
                  <Link href="/leaderboard">Leaderboard</Link>
                </TabsTrigger>
              </TabsList>

              {/* Summary Tab */}
              <TabsContent value="summary">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                  <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
                    <BarChart className="h-10 w-10 mx-auto mb-3 text-blue-600" />
                    <p className="text-sm text-gray-500">Total Questions</p>
                    <p className="text-3xl font-bold text-gray-800">{totalQuestions}</p>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
                    <CheckCircle className="h-10 w-10 mx-auto mb-3 text-green-500" />
                    <p className="text-sm text-gray-500">Correct Answers</p>
                    {isLoadingChoices ? (
                      <Skeleton className="h-8 w-16 mx-auto" />
                    ) : (
                      <p className="text-3xl font-bold text-gray-800">{correctCount}</p>
                    )}
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-lg shadow-sm">
                    <div className="relative w-24 h-24 mx-auto mb-3">
                      {isLoadingChoices ? (
                        <Skeleton className="h-24 w-24 rounded-full" />
                      ) : (
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            strokeDasharray={`${scorePercentage}, 100`}
                          />
                          <text
                            x="18"
                            y="20.35"
                            className="text-lg font-bold text-gray-800"
                            textAnchor="middle"
                          >
                            {Math.round(scorePercentage)}%
                          </text>
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Score</p>
                  </div>
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                      Performance by Subject
                    </h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-5 w-5 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Shows the number of correct and incorrect answers per subject.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="h-64">
                    {isLoadingChoices ? (
                      <Skeleton className="h-64 w-full rounded-lg" />
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={barChartData}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Legend />
                          <Bar
                            dataKey="correct"
                            stackId="a"
                            fill="#10B981"
                            name="Correct"
                            radius={[8, 8, 0, 0]}
                          />
                          <Bar
                            dataKey="incorrect"
                            stackId="a"
                            fill="#EF4444"
                            name="Incorrect"
                            radius={[8, 8, 0, 0]}
                          />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Answers Tab */}
              <TabsContent value="answers">
                <div className="mt-6">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                    Your Answers
                  </h3>
                  {isLoadingChoices ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full rounded-lg" />
                      ))}
                    </div>
                  ) : errorChoices ? (
                    <div className="p-6 text-center text-destructive">
                      {errorChoices}
                    </div>
                  ) : (
                    <ScrollArea className="h-[50vh] rounded-md border">
                      <Accordion type="multiple" className="p-4 space-y-4">
                        {allQuestions.map((question, index) => {
                          const choices = choicesMap[question.id] || [];
                          const selectedChoice = choices.find(
                            (choice) => choice.id === selectedChoices[question.id]
                          );
                          const correctChoice = choices.find((choice) => choice.is_correct);
                          const isCorrect = selectedChoice?.is_correct || false;

                          return (
                            <AccordionItem key={question.id} value={`item-${question.id}`}>
                              <AccordionTrigger className="text-left hover:bg-gray-50 p-2 rounded-md">
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-lg font-medium">
                                    {index + 1}. {question.text}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {selectedChoices[question.id] ? (
                                      isCorrect ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                      ) : (
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                      )
                                    ) : (
                                      <span className="text-gray-500 text-sm">Not answered</span>
                                    )}
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pl-6">
                                <div className="space-y-2">
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Your Answer:</span>{" "}
                                    {selectedChoice ? (
                                      isCorrect ? (
                                        <span className="text-green-600">{selectedChoice.text}</span>
                                      ) : (
                                        <span className="text-red-600">{selectedChoice.text}</span>
                                      )
                                    ) : (
                                      <span className="text-gray-500">Not answered</span>
                                    )}
                                  </p>
                                  {correctChoice ? (
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Correct Answer:</span>{" "}
                                      <span className="text-green-600">{correctChoice.text}</span>
                                    </p>
                                  ) : (
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">Correct Answer:</span>{" "}
                                      <span className="text-gray-500">Not available</span>
                                    </p>
                                  )}
                                  <p className="text-sm text-gray-500">
                                    Subject: {question.subject_category_name}
                                  </p>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </ScrollArea>
                  )}
                </div>
              </TabsContent>

              {/* Leaderboard Tab (Now a Link) */}
              <TabsContent value="leaderboard">
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    View the global leaderboard to see how you rank among all users!
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/leaderboard">Go to Leaderboard</Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between p-6 bg-gray-50 rounded-b-lg gap-4">
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Share Results
            </Button>
            <Button
              variant="default"
              onClick={handleRestart}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Take Quiz Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function useGetChoicesForQuestionQuery(arg0: { category0: string; category1: string; quizFile: string; questionId: number; }): { data: any; error: any; isLoading: any; } {
  throw new Error("Function not implemented.");
}
