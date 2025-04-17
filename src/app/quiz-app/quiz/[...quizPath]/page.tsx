// // // "use client";

// // // import { useState, useMemo, useRef, useEffect } from "react";
// // // import toast from "react-hot-toast";
// // // import { useParams, useRouter } from "next/navigation";
// // // import { v4 as uuidv4 } from "uuid";
// // // import {
// // //   useGetAllQuestionsQuery,
// // //   useGetQuestionsQuery,
// // //   useGetChoicesQuery,
// // //   useSubmitQuizMutation,
// // // } from "@/redux/features/quizApiSlice";
// // // import { Progress } from "@/components/ui/progress";
// // // import { Button } from "@/components/ui/button";
// // // import {
// // //   Card,
// // //   CardContent,
// // //   CardHeader,
// // //   CardTitle,
// // //   CardFooter,
// // // } from "@/components/ui/card";
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // // import { Badge } from "@/components/ui/badge";
// // // import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// // // import { Label } from "@/components/ui/label";
// // // import { Separator } from "@/components/ui/separator";
// // // import { ScrollArea } from "@/components/ui/scroll-area";
// // // import {
// // //   ChevronLeft,
// // //   ChevronRight,
// // //   Loader2,
// // //   BookOpen,
// // //   CheckCircle,
// // //   Send,
// // // } from "lucide-react";
// // // import Loading from "@/loading/Loading";
// // // import Image from "next/image";
// // // import {
// // //   Breadcrumb,
// // //   BreadcrumbItem,
// // //   BreadcrumbLink,
// // //   BreadcrumbList,
// // //   BreadcrumbPage,
// // //   BreadcrumbSeparator,
// // // } from "@/components/ui/breadcrumb";


// // // interface Image {
// // //   id:number;
// // //   image:string;
// // //   image_url:string | null;
// // // }


// // // interface Question {
// // //   id: number;
// // //   text: string;
// // //   questions_file_title: string;
// // //   subject_category_name: string;
// // //   images?: Image[] ; //updated to an array of Image Objects
// // // }

// // // interface Choice {
// // //   id: number;
// // //   text: string;
// // // }

// // // export default function QuizPage() {
// // //   const { quizPath } = useParams() as { quizPath: string[] };
// // //   const router = useRouter();

// // //   // Extract category0, category1, and quizFile from quizPath
// // // //   const category0 = quizPath[0]; // e.g., "Medical"
// // // //   const category1 = quizPath[1]; // e.g., "IOM"


// // //   const quizFile = quizPath[quizPath.length - 1]; // e.g., "IOM 2019"
// // //   const categoryPath = quizPath.slice(0, -1).join("/"); // e.g., "Medical/IOM"

// // //   const [currentPage, setCurrentPage] = useState(1);
// // //   const [selectedChoices, setSelectedChoices] = useState<Record<number, number>>({});
// // //   const [activeTab, setActiveTab] = useState<string>("questions");
// // //   const [highlightedQuestionId, setHighlightedQuestionId] = useState<number | null>(null);

// // //   const {
// // //     data: allQuestions = [],
// // //     isLoading: allLoading,
// // //     error: allError,
// // //   } = useGetAllQuestionsQuery({ categoryPath, questionsFile: quizFile });

// // //   const {
// // //     data: questionsData,
// // //     isLoading: qLoading,
// // //     error: qError,
// // //   } = useGetQuestionsQuery({
// // //     categoryPath,
// // //     questionsFile: quizFile,
// // //     page: currentPage,
// // //   });

// // //   const questions = questionsData?.results || [];
// // //   const totalCount = questionsData?.count || 0;
// // //   const pageSize = 5;

// // //   if (questions.length > pageSize) {
// // //     console.warn(
// // //       `Expected ${pageSize} questions, but got ${questions.length}. This might be due to pagination.`
// // //     );
// // //   }

// // //   const totalPages = Math.ceil(totalCount / pageSize);
// // //   const answeredCount = Object.keys(selectedChoices).length;
// // //   const progressPercentage = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

// // //   const groupedQuestions = useMemo(() => {
// // //     return allQuestions.reduce((acc, q) => {
// // //       const subject = q.subject_category_name;
// // //       if (!acc[subject]) acc[subject] = [];
// // //       acc[subject].push(q);
// // //       return acc;
// // //     }, {} as Record<string, Question[]>);
// // //   }, [allQuestions]);

// // //   const handleQuestionClick = (questionId: number) => {
// // //     const questionIndex = allQuestions.findIndex((q) => q.id === questionId);
// // //     const newPage = Math.floor(questionIndex / pageSize) + 1;
// // //     setCurrentPage(newPage);
// // //     setHighlightedQuestionId(questionId);
// // //     setActiveTab("questions");
// // //   };

// // //   const handleChoiceSelect = (questionId: number, choiceId: number) => {
// // //     setSelectedChoices((prev) => ({
// // //       ...prev,
// // //       [questionId]: choiceId,
// // //     }));
// // //   };

// // //   const [submitQuiz, { isLoading: submitLoading }] = useSubmitQuizMutation();

// // //   const handleSubmitQuiz = async () => {
// // //     const choices = Object.fromEntries(Object.entries(selectedChoices));
// // //     const payload = {
// // //       categoryPath,
// // //       questionsFile: quizFile,
// // //       choices,
// // //       is_submitted: true,
// // //     };
// // //     try {
// // //       const result = await submitQuiz(payload).unwrap();
// // //       const quizId = uuidv4();
// // //       toast.success("Quiz submitted successfully!");
// // //       localStorage.setItem(
// // //         `quizResult_${quizId}`,
// // //         JSON.stringify({
// // //           status: "quiz submitted",
// // //           points: result.points,
// // //           total_questions: allQuestions.length,
// // //           responses: Object.entries(choices).map(([qId, cId]) => ({
// // //             question: Number(qId),
// // //             selected_choice: cId,
// // //             is_submitted: true,
// // //           })),
// // //         })
// // //       );
// // //       router.push(
// // //         `/quiz-app/results/${quizId}/${categoryPath}/${quizFile}`
// // //       );
// // //     } catch (err) {
// // //       console.error(
// // //         "Failed to submit quiz. Please select an option before proceeding.",
// // //         err
// // //       );
// // //       toast.error(
// // //         "Failed to submit quiz. Please select an option before proceeding."
// // //       );
// // //     }
// // //   };

// // //   if (allLoading || qLoading) {
// // //     return (
// // //       <div className="flex h-screen w-full items-center justify-center">
// // //         <div className="flex flex-col items-center gap-4">
// // //           <Loading />
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (allError || qError) {
// // //     return (
// // //       <div className="p-8 text-center text-destructive">
// // //         Error: {(allError as Error)?.message || (qError as Error)?.message}
// // //       </div>
// // //     );
// // //   }

// // //   const displayedQuestions = questions;

// // //   return (
// // //     <div className="container mx-auto p-4 lg:p-8">
// // //       <header className="mb-8">
// // //         <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
// // //           <div className="text-center md:text-left">
// // //             <Breadcrumb className="mb-4">
// // //               <BreadcrumbList>
// // //                 <BreadcrumbItem>
// // //                   <BreadcrumbLink href="/quiz-app">All Quizzes</BreadcrumbLink>
// // //                 </BreadcrumbItem>
// // //                 {quizPath.slice(0, -1).map((segment, index) => (
// // //                   <div key={index} className="flex items-center">
// // //                     <BreadcrumbSeparator />
// // //                     <BreadcrumbItem>
// // //                       <BreadcrumbLink
// // //                         href={`/quiz-app/category/${quizPath.slice(0, index + 1).join("/")}`}
// // //                       >
// // //                         {segment}
// // //                       </BreadcrumbLink>
// // //                     </BreadcrumbItem>
// // //                   </div>
// // //                 ))}
// // //                 <BreadcrumbSeparator />
// // //                 <BreadcrumbItem>
// // //                   <BreadcrumbPage>{quizFile}</BreadcrumbPage>
// // //                 </BreadcrumbItem>
// // //               </BreadcrumbList>
// // //             </Breadcrumb>
// // //           </div>
// // //           <div className="flex items-center gap-2">
// // //             <Badge variant="outline" className="px-3 py-1">
// // //               <BookOpen className="mr-1 h-3 w-3" />
// // //               {totalCount} Questions
// // //             </Badge>
// // //             <Badge variant="outline" className="px-3 py-1">
// // //               <CheckCircle className="mr-1 h-3 w-3" />
// // //               {answeredCount} Answered
// // //             </Badge>
// // //           </div>
// // //         </div>
// // //         <div className="mt-4">
// // //           <div className="flex items-center gap-2">
// // //             <Progress value={progressPercentage} className="h-2" />
// // //             <span className="text-sm font-medium">
// // //               {Math.round(progressPercentage)}%
// // //             </span>
// // //           </div>
// // //         </div>
// // //       </header>

// // //       <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 relative">
// // //         <div className="lg:hidden">
// // //           <Tabs value={activeTab} onValueChange={setActiveTab}>
// // //             <TabsList className="w-full">
// // //               <TabsTrigger value="questions" className="flex-1">
// // //                 Questions
// // //               </TabsTrigger>
// // //               <TabsTrigger value="navigation" className="flex-1">
// // //                 Navigation
// // //               </TabsTrigger>
// // //             </TabsList>
// // //             <TabsContent value="navigation" className="mt-4">
// // //               <Card>
// // //                 <CardHeader>
// // //                   <CardTitle className="text-lg">Question Navigator</CardTitle>
// // //                 </CardHeader>
// // //                 <CardContent>
// // //                   <ScrollArea className="h-[100vh]">
// // //                     {Object.entries(groupedQuestions).map(([subject, qs]) => (
// // //                       <div key={subject} className="mb-6">
// // //                         <h4 className="mb-2 font-medium">
// // //                           {subject}{" "}
// // //                           <span className="text-muted-foreground">
// // //                             ({qs.length})
// // //                           </span>
// // //                         </h4>
// // //                         <div className="grid grid-cols-5 gap-2">
// // //                           {qs.map((q) => (
// // //                             <Button
// // //                               key={q.id}
// // //                               variant={
// // //                                 q.id === highlightedQuestionId
// // //                                   ? "default"
// // //                                   : q.id in selectedChoices
// // //                                   ? "outline"
// // //                                   : "secondary"
// // //                               }
// // //                               size="sm"
// // //                               className={`h-10 w-10 p-0 rounded-full ${
// // //                                 q.id in selectedChoices ? "border-primary" : ""
// // //                               }`}
// // //                               onClick={() => handleQuestionClick(q.id)}
// // //                             >
// // //                               {allQuestions.indexOf(q) + 1}
// // //                             </Button>
// // //                           ))}
// // //                         </div>
// // //                       </div>
// // //                     ))}
// // //                   </ScrollArea>
// // //                 </CardContent>
// // //               </Card>
// // //             </TabsContent>
// // //             <TabsContent value="questions" className="mt-4">
// // //               <QuestionsContent
// // //                 questions={displayedQuestions}
// // //                 categoryPath={categoryPath}
// // //                 questionsFile={quizFile}
// // //                 currentPage={currentPage}
// // //                 totalPages={totalPages}
// // //                 setCurrentPage={setCurrentPage}
// // //                 selectedChoices={selectedChoices}
// // //                 handleChoiceSelect={handleChoiceSelect}
// // //                 onSubmit={handleSubmitQuiz}
// // //                 submitLoading={submitLoading}
// // //                 highlightedQuestionId={highlightedQuestionId}
// // //                 allQuestions={allQuestions}
// // //               />
// // //             </TabsContent>
// // //           </Tabs>
// // //         </div>

// // //         <div className="hidden lg:block lg:col-span-1">
// // //           <Card>
// // //             <CardHeader>
// // //               <CardTitle className="text-lg">Question Navigator</CardTitle>
// // //             </CardHeader>
// // //             <CardContent>
// // //               <ScrollArea className="h-[100vh]">
// // //                 {Object.entries(groupedQuestions).map(([subject, qs]) => (
// // //                   <div key={subject} className="mb-4">
// // //                     <h4 className="mb-2 font-medium">
// // //                       {subject}{" "}
// // //                       <span className="text-muted-foreground">
// // //                         ({qs.length})
// // //                       </span>
// // //                     </h4>
// // //                     <div className="grid grid-cols-4 gap-3 p-3">
// // //                       {qs.map((q) => (
// // //                         <Button
// // //                           key={q.id}
// // //                           variant={
// // //                             q.id === highlightedQuestionId
// // //                               ? "default"
// // //                               : q.id in selectedChoices
// // //                               ? "outline"
// // //                               : "secondary"
// // //                           }
// // //                           size="sm"
// // //                           className={`h-8 w-8 p-0 rounded-full ${
// // //                             q.id in selectedChoices ? "border-primary" : ""
// // //                           }`}
// // //                           onClick={() => handleQuestionClick(q.id)}
// // //                         >
// // //                           {allQuestions.indexOf(q) + 1}
// // //                         </Button>
// // //                       ))}
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </ScrollArea>
// // //             </CardContent>
// // //           </Card>
// // //         </div>

// // //         <div className="hidden lg:block lg:col-span-3">
// // //           <QuestionsContent
// // //             questions={displayedQuestions}
// // //             categoryPath={categoryPath}
// // //             questionsFile={quizFile}
// // //             currentPage={currentPage}
// // //             totalPages={totalPages}
// // //             setCurrentPage={setCurrentPage}
// // //             selectedChoices={selectedChoices}
// // //             handleChoiceSelect={handleChoiceSelect}
// // //             onSubmit={handleSubmitQuiz}
// // //             highlightedQuestionId={highlightedQuestionId}
// // //             allQuestions={allQuestions}
// // //           />
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // interface QuestionsContentProps {
// // //   questions: Question[];
// // //   categoryPath: string;
// // //   questionsFile: string;
// // //   currentPage: number;
// // //   totalPages: number;
// // //   setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
// // //   selectedChoices: Record<number, number>;
// // //   handleChoiceSelect: (questionId: number, choiceId: number) => void;
// // //   onSubmit: () => void;
// // //   submitLoading: boolean;
// // //   highlightedQuestionId: number | null;
// // //   allQuestions: Question[];
// // // }

// // // function QuestionsContent({
// // //   questions,
// // //   categoryPath,
// // //   questionsFile,
// // //   currentPage,
// // //   totalPages,
// // //   setCurrentPage,
// // //   selectedChoices,
// // //   handleChoiceSelect,
// // //   highlightedQuestionId,
// // //   allQuestions,
// // //   onSubmit,
// // //   submitLoading,
// // // }: QuestionsContentProps) {
// // //   const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

// // //   useEffect(() => {
// // //     if (highlightedQuestionId) {
// // //       const index = questions.findIndex((q) => q.id === highlightedQuestionId);
// // //       if (index !== -1 && questionRefs.current[index]) {
// // //         questionRefs.current[index]?.scrollIntoView({
// // //           behavior: "smooth",
// // //           block: "start",
// // //         });
// // //       }
// // //     }
// // //   }, [highlightedQuestionId, questions]);

// // //   return (
// // //     <div className="flex flex-col gap-6">
// // //       <ScrollArea className="h-[calc(100vh)]">
// // //         <div className="space-y-6 p-2">
// // //           {questions.map((question, index) => {
// // //             const questionNumber = (currentPage - 1) * 5 + index + 1;
// // //             return (
// // //               <Card
// // //                 key={question.id}
// // //                 ref={(el) => (questionRefs.current[index] = el)}
// // //                 className={`transition-all hover:shadow-md ${
// // //                   question.id === highlightedQuestionId
// // //                     ? "border-2 border-primary bg-primary/5"
// // //                     : ""
// // //                 }`}
// // //               >
// // //                 <CardHeader>
// // //                   <div className="flex items-center justify-between">
// // //                     <Badge variant="outline" className="mb-2">
// // //                       Question {questionNumber}
// // //                     </Badge>
// // //                     <Badge variant="outline" className="mb-2">
// // //                       {question.subject_category_name}
// // //                     </Badge>
// // //                   </div>
// // //                   <CardTitle className="text-xl">{question.text}</CardTitle>
// // //                   <div
// // //                     className={`mt-2 transition-all duration-300 ${
// // //                       question.image ? "h-auto" : "h-0 overflow-hidden"
// // //                     }`}
// // //                   >
// // //                     {question.image ? (
// // //                       <div className="relative w-full max-w-md mx-auto">
// // //                         <Image
// // //                           src={question.image}
// // //                           alt={`Image for question ${questionNumber}`}
// // //                           width={400}
// // //                           height={300}
// // //                           className="rounded-md object-contain"
// // //                           loading="lazy"
// // //                         />
// // //                       </div>
// // //                     ) : null}
// // //                   </div>
// // //                 </CardHeader>
// // //                 <CardContent>
// // //                   <Choices
// // //                     categoryPath={categoryPath}
// // //                     questionsFile={questionsFile}
// // //                     questionId={question.id}
// // //                     selectedChoice={selectedChoices[question.id]}
// // //                     onChoiceSelect={handleChoiceSelect}
// // //                   />
// // //                 </CardContent>
// // //                 <Separator />
// // //               </Card>
// // //             );
// // //           })}
// // //         </div>
// // //       </ScrollArea>

// // //       <Card>
// // //         <CardFooter className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:justify-between">
// // //           <div className="flex items-center gap-2">
// // //             <Button
// // //               variant="outline"
// // //               size="sm"
// // //               onClick={() => setCurrentPage((prev) => prev - 1)}
// // //               disabled={currentPage === 1 || submitLoading}
// // //               className="gap-1"
// // //             >
// // //               <ChevronLeft className="h-4 w-4" />
// // //               Previous
// // //             </Button>
// // //             <span className="text-sm text-muted-foreground">
// // //               Page {currentPage} of {totalPages}
// // //             </span>
// // //             <Button
// // //               variant="outline"
// // //               size="sm"
// // //               onClick={() => setCurrentPage((prev) => prev + 1)}
// // //               disabled={currentPage === totalPages || submitLoading}
// // //               className="gap-1"
// // //             >
// // //               Next
// // //               <ChevronRight className="h-4 w-4" />
// // //             </Button>
// // //           </div>
// // //           <Button
// // //             variant="default"
// // //             onClick={onSubmit}
// // //             className="w-full sm:w-auto"
// // //             disabled={submitLoading}
// // //           >
// // //             {submitLoading ? (
// // //               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// // //             ) : (
// // //               <Send className="mr-2 h-4 w-4" />
// // //             )}
// // //             {submitLoading ? "Submitting..." : "Submit Quiz"}
// // //           </Button>
// // //         </CardFooter>
// // //       </Card>
// // //     </div>
// // //   );
// // // }

// // // function Choices({
// // //   categoryPath,
// // //   questionsFile,
// // //   questionId,
// // //   selectedChoice,
// // //   onChoiceSelect,
// // // }: {
// // //   categoryPath: string;
// // //   questionsFile: string;
// // //   questionId: number;
// // //   selectedChoice?: number;
// // //   onChoiceSelect: (questionId: number, choiceId: number) => void;
// // // }) {
// // //   const {
// // //     data: choices = [],
// // //     isLoading,
// // //     error,
// // //     refetch,
// // //   } = useGetChoicesQuery({ categoryPath, questionsFile, questionId });

// // //   if (isLoading) {
// // //     return (
// // //       <div className="flex items-center justify-center py-6">
// // //         <Loader2 className="h-6 w-6 animate-spin text-primary" />
// // //       </div>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <div className="rounded-md bg-destructive/10 p-4 text-center text-destructive">
// // //         Error loading choices
// // //         <Button variant="ghost" size="sm" onClick={refetch} className="ml-2">
// // //           Retry
// // //         </Button>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <RadioGroup
// // //       value={selectedChoice?.toString()}
// // //       onValueChange={(value) =>
// // //         onChoiceSelect(questionId, Number.parseInt(value))
// // //       }
// // //       className="space-y-3"
// // //     >
// // //       {choices.map((choice: Choice) => (
// // //         <div
// // //           key={choice.id}
// // //           className="flex items-start space-x-2 rounded-md border p-3 transition-all hover:bg-accent"
// // //         >
// // //           <RadioGroupItem
// // //             value={choice.id.toString()}
// // //             id={`choice-${questionId}-${choice.id}`}
// // //           />
// // //           <Label
// // //             htmlFor={`choice-${questionId}-${choice.id}`}
// // //             className="w-full cursor-pointer"
// // //           >
// // //             {choice.text}
// // //           </Label>
// // //         </div>
// // //       ))}
// // //     </RadioGroup>
// // //   );
// // // }



// // "use client";

// // import { useState, useMemo, useRef, useEffect } from "react";
// // import toast from "react-hot-toast";
// // import { useParams, useRouter } from "next/navigation";
// // import { v4 as uuidv4 } from "uuid";
// // import {
// //   useGetAllQuestionsQuery,
// //   useGetQuestionsQuery,
// //   useGetChoicesQuery,
// //   useSubmitQuizMutation,
// // } from "@/redux/features/quizApiSlice";
// // import { Progress } from "@/components/ui/progress";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardHeader,
// //   CardTitle,
// //   CardFooter,
// // } from "@/components/ui/card";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { Badge } from "@/components/ui/badge";
// // import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// // import { Label } from "@/components/ui/label";
// // import { Separator } from "@/components/ui/separator";
// // import { ScrollArea } from "@/components/ui/scroll-area";
// // import {
// //   ChevronLeft,
// //   ChevronRight,
// //   Loader2,
// //   BookOpen,
// //   CheckCircle,
// //   Send,
// // } from "lucide-react";
// // import Loading from "@/loading/Loading";
// // import Image from "next/image";
// // import {
// //   Breadcrumb,
// //   BreadcrumbItem,
// //   BreadcrumbLink,
// //   BreadcrumbList,
// //   BreadcrumbPage,
// //   BreadcrumbSeparator,
// // } from "@/components/ui/breadcrumb";

// // interface Image {
// //   id: number;
// //   image: string;
// //   image_url: string | null;
// // }

// // interface Question {
// //   id: number;
// //   text: string;
// //   questions_file_title: string;
// //   subject_category_name: string;
// //   images?: Image[];
// // }

// // interface Choice {
// //   id: number;
// //   text: string;
// // }

// // export default function QuizPage() {
// //   const { quizPath } = useParams() as { quizPath: string[] };
// //   const router = useRouter();

// //   const quizFile = quizPath[quizPath.length - 1]; // e.g., "IOM 2019"
// //   const categoryPath = quizPath.slice(0, -1).join("/"); // e.g., "Medical/IOM"

// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [selectedChoices, setSelectedChoices] = useState<Record<number, number>>({});
// //   const [activeTab, setActiveTab] = useState<string>("questions");
// //   const [highlightedQuestionId, setHighlightedQuestionId] = useState<number | null>(null);

// //   const {
// //     data: allQuestions = [],
// //     isLoading: allLoading,
// //     error: allError,
// //   } = useGetAllQuestionsQuery({ categoryPath, questionsFile: quizFile });

// //   const {
// //     data: questionsData,
// //     isLoading: qLoading,
// //     error: qError,
// //   } = useGetQuestionsQuery({
// //     categoryPath,
// //     questionsFile: quizFile,
// //     page: currentPage,
// //   });

// //   const questions = questionsData?.results || [];
// //   const totalCount = questionsData?.count || 0;
// //   const pageSize = 5;

// //   if (questions.length > pageSize) {
// //     console.warn(
// //       `Expected ${pageSize} questions, but got ${questions.length}. This might be due to pagination.`
// //     );
// //   }

// //   const totalPages = Math.ceil(totalCount / pageSize);
// //   const answeredCount = Object.keys(selectedChoices).length;
// //   const progressPercentage = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

// //   const groupedQuestions = useMemo(() => {
// //     return allQuestions.reduce((acc, q) => {
// //       const subject = q.subject_category_name;
// //       if (!acc[subject]) acc[subject] = [];
// //       acc[subject].push(q);
// //       return acc;
// //     }, {} as Record<string, Question[]>);
// //   }, [allQuestions]);

// //   const handleQuestionClick = (questionId: number) => {
// //     const questionIndex = allQuestions.findIndex((q) => q.id === questionId);
// //     const newPage = Math.floor(questionIndex / pageSize) + 1;
// //     setCurrentPage(newPage);
// //     setHighlightedQuestionId(questionId);
// //     setActiveTab("questions");
// //   };

// //   const handleChoiceSelect = (questionId: number, choiceId: number) => {
// //     setSelectedChoices((prev) => ({
// //       ...prev,
// //       [questionId]: choiceId,
// //     }));
// //   };

// //   const [submitQuiz, { isLoading: submitLoading }] = useSubmitQuizMutation();

// //   const handleSubmitQuiz = async () => {
// //     const choices = Object.fromEntries(Object.entries(selectedChoices));
// //     const payload = {
// //       categoryPath,
// //       questionsFile: quizFile,
// //       choices,
// //       is_submitted: true,
// //     };
// //     try {
// //       const result = await submitQuiz(payload).unwrap();
// //       const quizId = uuidv4();
// //       toast.success("Quiz submitted successfully!");
// //       localStorage.setItem(
// //         `quizResult_${quizId}`,
// //         JSON.stringify({
// //           status: "quiz submitted",
// //           points: result.points,
// //           total_questions: allQuestions.length,
// //           responses: Object.entries(choices).map(([qId, cId]) => ({
// //             question: Number(qId),
// //             selected_choice: cId,
// //             is_submitted: true,
// //           })),
// //         })
// //       );
// //       router.push(
// //         `/quiz-app/results/${quizId}/${categoryPath}/${quizFile}`
// //       );
// //     } catch (err) {
// //       console.error(
// //         "Failed to submit quiz. Please select an option before proceeding.",
// //         err
// //       );
// //       toast.error(
// //         "Failed to submit quiz. Please select an option before proceeding."
// //       );
// //     }
// //   };

// //   if (allLoading || qLoading) {
// //     return (
// //       <div className="flex h-screen w-full items-center justify-center">
// //         <div className="flex flex-col items-center gap-4">
// //           <Loading />
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (allError || qError) {
// //     return (
// //       <div className="p-8 text-center text-destructive">
// //         Error: {(allError as Error)?.message || (qError as Error)?.message}
// //       </div>
// //     );
// //   }

// //   const displayedQuestions = questions;

// //   return (
// //     <div className="container mx-auto p-4 lg:p-8">
// //       <header className="mb-8">
// //         <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
// //           <div className="text-center md:text-left">
// //             <Breadcrumb className="mb-4">
// //               <BreadcrumbList>
// //                 <BreadcrumbItem>
// //                   <BreadcrumbLink href="/quiz-app">All Quizzes</BreadcrumbLink>
// //                 </BreadcrumbItem>
// //                 {quizPath.slice(0, -1).map((segment, index) => (
// //                   <div key={index} className="flex items-center">
// //                     <BreadcrumbSeparator />
// //                     <BreadcrumbItem>
// //                       <BreadcrumbLink
// //                         href={`/quiz-app/category/${quizPath.slice(0, index + 1).join("/")}`}
// //                       >
// //                         {segment}
// //                       </BreadcrumbLink>
// //                     </BreadcrumbItem>
// //                   </div>
// //                 ))}
// //                 <BreadcrumbSeparator />
// //                 <BreadcrumbItem>
// //                   <BreadcrumbPage>{quizFile}</BreadcrumbPage>
// //                 </BreadcrumbItem>
// //               </BreadcrumbList>
// //             </Breadcrumb>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <Badge variant="outline" className="px-3 py-1">
// //               <BookOpen className="mr-1 h-3 w-3" />
// //               {totalCount} Questions
// //             </Badge>
// //             <Badge variant="outline" className="px-3 py-1">
// //               <CheckCircle className="mr-1 h-3 w-3" />
// //               {answeredCount} Answered
// //             </Badge>
// //           </div>
// //         </div>
// //         <div className="mt-4">
// //           <div className="flex items-center gap-2">
// //             <Progress value={progressPercentage} className="h-2" />
// //             <span className="text-sm font-medium">
// //               {Math.round(progressPercentage)}%
// //             </span>
// //           </div>
// //         </div>
// //       </header>

// //       <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 relative">
// //         <div className="lg:hidden">
// //           <Tabs value={activeTab} onValueChange={setActiveTab}>
// //             <TabsList className="w-full">
// //               <TabsTrigger value="questions" className="flex-1">
// //                 Questions
// //               </TabsTrigger>
// //               <TabsTrigger value="navigation" className="flex-1">
// //                 Navigation
// //               </TabsTrigger>
// //             </TabsList>
// //             <TabsContent value="navigation" className="mt-4">
// //               <Card>
// //                 <CardHeader>
// //                   <CardTitle className="text-lg">Question Navigator</CardTitle>
// //                 </CardHeader>
// //                 <CardContent>
// //                   <ScrollArea className="h-[100vh]">
// //                     {Object.entries(groupedQuestions).map(([subject, qs]) => (
// //                       <div key={subject} className="mb-6">
// //                         <h4 className="mb-2 font-medium">
// //                           {subject}{" "}
// //                           <span className="text-muted-foreground">
// //                             ({qs.length})
// //                           </span>
// //                         </h4>
// //                         <div className="grid grid-cols-5 gap-2">
// //                           {qs.map((q) => (
// //                             <Button
// //                               key={q.id}
// //                               variant={
// //                                 q.id === highlightedQuestionId
// //                                   ? "default"
// //                                   : q.id in selectedChoices
// //                                   ? "outline"
// //                                   : "secondary"
// //                               }
// //                               size="sm"
// //                               className={`h-10 w-10 p-0 rounded-full ${
// //                                 q.id in selectedChoices ? "border-primary" : ""
// //                               }`}
// //                               onClick={() => handleQuestionClick(q.id)}
// //                             >
// //                               {allQuestions.indexOf(q) + 1}
// //                             </Button>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </ScrollArea>
// //                 </CardContent>
// //               </Card>
// //             </TabsContent>
// //             <TabsContent value="questions" className="mt-4">
// //               <QuestionsContent
// //                 questions={displayedQuestions}
// //                 categoryPath={categoryPath}
// //                 questionsFile={quizFile}
// //                 currentPage={currentPage}
// //                 totalPages={totalPages}
// //                 setCurrentPage={setCurrentPage}
// //                 selectedChoices={selectedChoices}
// //                 handleChoiceSelect={handleChoiceSelect}
// //                 onSubmit={handleSubmitQuiz}
// //                 submitLoading={submitLoading}
// //                 highlightedQuestionId={highlightedQuestionId}
// //                 allQuestions={allQuestions}
// //               />
// //             </TabsContent>
// //           </Tabs>
// //         </div>

// //         <div className="hidden lg:block lg:col-span-1">
// //           <Card>
// //             <CardHeader>
// //               <CardTitle className="text-lg">Question Navigator</CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <ScrollArea className="h-[100vh]">
// //                 {Object.entries(groupedQuestions).map(([subject, qs]) => (
// //                   <div key={subject} className="mb-4">
// //                     <h4 className="mb-2 font-medium">
// //                       {subject}{" "}
// //                       <span className="text-muted-foreground">
// //                         ({qs.length})
// //                       </span>
// //                     </h4>
// //                     <div className="grid grid-cols-4 gap-3 p-3">
// //                       {qs.map((q) => (
// //                         <Button
// //                           key={q.id}
// //                           variant={
// //                             q.id === highlightedQuestionId
// //                               ? "default"
// //                               : q.id in selectedChoices
// //                               ? "outline"
// //                               : "secondary"
// //                           }
// //                           size="sm"
// //                           className={`h-8 w-8 p-0 rounded-full ${
// //                             q.id in selectedChoices ? "border-primary" : ""
// //                           }`}
// //                           onClick={() => handleQuestionClick(q.id)}
// //                         >
// //                           {allQuestions.indexOf(q) + 1}
// //                         </Button>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </ScrollArea>
// //             </CardContent>
// //           </Card>
// //         </div>

// //         <div className="hidden lg:block lg:col-span-3">
// //           <QuestionsContent
// //             questions={displayedQuestions}
// //             categoryPath={categoryPath}
// //             questionsFile={quizFile}
// //             currentPage={currentPage}
// //             totalPages={totalPages}
// //             setCurrentPage={setCurrentPage}
// //             selectedChoices={selectedChoices}
// //             handleChoiceSelect={handleChoiceSelect}
// //             onSubmit={handleSubmitQuiz}
// //             highlightedQuestionId={highlightedQuestionId}
// //             allQuestions={allQuestions}
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // interface QuestionsContentProps {
// //   questions: Question[];
// //   categoryPath: string;
// //   questionsFile: string;
// //   currentPage: number;
// //   totalPages: number;
// //   setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
// //   selectedChoices: Record<number, number>;
// //   handleChoiceSelect: (questionId: number, choiceId: number) => void;
// //   onSubmit: () => void;
// //   submitLoading: boolean;
// //   highlightedQuestionId: number | null;
// //   allQuestions: Question[];
// // }

// // function QuestionsContent({
// //   questions,
// //   categoryPath,
// //   questionsFile,
// //   currentPage,
// //   totalPages,
// //   setCurrentPage,
// //   selectedChoices,
// //   handleChoiceSelect,
// //   highlightedQuestionId,
// //   allQuestions,
// //   onSubmit,
// //   submitLoading,
// // }: QuestionsContentProps) {
// //   const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

// //   useEffect(() => {
// //     if (highlightedQuestionId) {
// //       const index = questions.findIndex((q) => q.id === highlightedQuestionId);
// //       if (index !== -1 && questionRefs.current[index]) {
// //         questionRefs.current[index]?.scrollIntoView({
// //           behavior: "smooth",
// //           block: "start",
// //         });
// //       }
// //     }
// //   }, [highlightedQuestionId, questions]);

// //   // Base URL for your backend (adjust based on your environment)
// //   const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// //   return (
// //     <div className="flex flex-col gap-6">
// //       <ScrollArea className="h-[calc(100vh)]">
// //         <div className="space-y-6 p-2">
// //           {questions.map((question, index) => {
// //             const questionNumber = (currentPage - 1) * 5 + index + 1;
// //             // Get the first image from the images array, if it exists
// //             const firstImage = question.images && question.images.length > 0 ? question.images[0] : null;
// //             const imageUrl = firstImage ? `${BASE_URL}${firstImage.image}` : null;

// //             return (
// //               <Card
// //                 key={question.id}
// //                 ref={(el) => (questionRefs.current[index] = el)}
// //                 className={`transition-all hover:shadow-md ${
// //                   question.id === highlightedQuestionId
// //                     ? "border-2 border-primary bg-primary/5"
// //                     : ""
// //                 }`}
// //               >
// //                 <CardHeader>
// //                   <div className="flex items-center justify-between">
// //                     <Badge variant="outline" className="mb-2">
// //                       Question {questionNumber}
// //                     </Badge>
// //                     <Badge variant="outline" className="mb-2">
// //                       {question.subject_category_name}
// //                     </Badge>
// //                   </div>
// //                   <CardTitle className="text-xl">{question.text}</CardTitle>
// //                   <div
// //                     className={`mt-2 transition-all duration-300 ${
// //                       imageUrl ? "h-auto" : "h-0 overflow-hidden"
// //                     }`}
// //                   >
// //                     {imageUrl ? (
// //                       <div className="relative w-full max-w-md mx-auto">
// //                         <Image
// //                           src={imageUrl}
// //                           alt={`Image for question ${questionNumber}`}
// //                           width={400}
// //                           height={300}
// //                           className="rounded-md object-contain"
// //                           loading="lazy"
// //                         />
// //                       </div>
// //                     ) : null}
// //                   </div>
// //                 </CardHeader>
// //                 <CardContent>
// //                   <Choices
// //                     categoryPath={categoryPath}
// //                     questionsFile={questionsFile}
// //                     questionId={question.id}
// //                     selectedChoice={selectedChoices[question.id]}
// //                     onChoiceSelect={handleChoiceSelect}
// //                   />
// //                 </CardContent>
// //                 <Separator />
// //               </Card>
// //             );
// //           })}
// //         </div>
// //       </ScrollArea>

// //       <Card>
// //         <CardFooter className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:justify-between">
// //           <div className="flex items-center gap-2">
// //             <Button
// //               variant="outline"
// //               size="sm"
// //               onClick={() => setCurrentPage((prev) => prev - 1)}
// //               disabled={currentPage === 1 || submitLoading}
// //               className="gap-1"
// //             >
// //               <ChevronLeft className="h-4 w-4" />
// //               Previous
// //             </Button>
// //             <span className="text-sm text-muted-foreground">
// //               Page {currentPage} of {totalPages}
// //             </span>
// //             <Button
// //               variant="outline"
// //               size="sm"
// //               onClick={() => setCurrentPage((prev) => prev + 1)}
// //               disabled={currentPage === totalPages || submitLoading}
// //               className="gap-1"
// //             >
// //               Next
// //               <ChevronRight className="h-4 w-4" />
// //             </Button>
// //           </div>
// //           <Button
// //             variant="default"
// //             onClick={onSubmit}
// //             className="w-full sm:w-auto"
// //             disabled={submitLoading}
// //           >
// //             {submitLoading ? (
// //               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //             ) : (
// //               <Send className="mr-2 h-4 w-4" />
// //             )}
// //             {submitLoading ? "Submitting..." : "Submit Quiz"}
// //           </Button>
// //         </CardFooter>
// //       </Card>
// //     </div>
// //   );
// // }

// // function Choices({
// //   categoryPath,
// //   questionsFile,
// //   questionId,
// //   selectedChoice,
// //   onChoiceSelect,
// // }: {
// //   categoryPath: string;
// //   questionsFile: string;
// //   questionId: number;
// //   selectedChoice?: number;
// //   onChoiceSelect: (questionId: number, choiceId: number) => void;
// // }) {
// //   const {
// //     data: choices = [],
// //     isLoading,
// //     error,
// //     refetch,
// //   } = useGetChoicesQuery({ categoryPath, questionsFile, questionId });

// //   if (isLoading) {
// //     return (
// //       <div className="flex items-center justify-center py-6">
// //         <Loader2 className="h-6 w-6 animate-spin text-primary" />
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="rounded-md bg-destructive/10 p-4 text-center text-destructive">
// //         Error loading choices
// //         <Button variant="ghost" size="sm" onClick={refetch} className="ml-2">
// //           Retry
// //         </Button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <RadioGroup
// //       value={selectedChoice?.toString()}
// //       onValueChange={(value) =>
// //         onChoiceSelect(questionId, Number.parseInt(value))
// //       }
// //       className="space-y-3"
// //     >
// //       {choices.map((choice: Choice) => (
// //         <div
// //           key={choice.id}
// //           className="flex items-start space-x-2 rounded-md border p-3 transition-all hover:bg-accent"
// //         >
// //           <RadioGroupItem
// //             value={choice.id.toString()}
// //             id={`choice-${questionId}-${choice.id}`}
// //           />
// //           <Label
// //             htmlFor={`choice-${questionId}-${choice.id}`}
// //             className="w-full cursor-pointer"
// //           >
// //             {choice.text}
// //           </Label>
// //         </div>
// //       ))}
// //     </RadioGroup>
// //   );
// // }


// "use client";

// import { useState, useMemo, useRef, useEffect } from "react";
// import toast from "react-hot-toast";
// import { useParams, useRouter } from "next/navigation";
// import { v4 as uuidv4 } from "uuid";
// import {
//   useGetAllQuestionsQuery,
//   useGetQuestionsQuery,
//   useGetChoicesQuery,
//   useSubmitQuizMutation,
// } from "@/redux/features/quizApiSlice";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Loader2,
//   BookOpen,
//   CheckCircle,
//   Send,
// } from "lucide-react";
// import Loading from "@/loading/Loading";
// import Image from "next/image";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";

// interface Image {
//   id: number;
//   image: string;
//   image_url: string | null;
// }

// interface Question {
//   id: number;
//   text: string;
//   questions_file_title: string;
//   subject_category_name: string;
//   images?: Image[];
// }

// interface Choice {
//   id: number;
//   text: string;
// }

// export default function QuizPage() {
//   const { quizPath } = useParams() as { quizPath: string[] };
//   const router = useRouter();

//   const quizFile = quizPath[quizPath.length - 1]; // e.g., "IOM 2019"
//   const categoryPath = quizPath.slice(0, -1).join("/"); // e.g., "Medical/IOM"

//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedChoices, setSelectedChoices] = useState<Record<number, number>>({});
//   const [activeTab, setActiveTab] = useState<string>("questions");
//   const [highlightedQuestionId, setHighlightedQuestionId] = useState<number | null>(null);

//   const {
//     data: allQuestions = [],
//     isLoading: allLoading,
//     error: allError,
//   } = useGetAllQuestionsQuery({ categoryPath, questionsFile: quizFile });

//   const {
//     data: questionsData,
//     isLoading: qLoading,
//     error: qError,
//   } = useGetQuestionsQuery({
//     categoryPath,
//     questionsFile: quizFile,
//     page: currentPage,
//   });

//   const questions = questionsData?.results || [];
//   const totalCount = questionsData?.count || 0;
//   const pageSize = 5;

//   if (questions.length > pageSize) {
//     console.warn(
//       `Expected ${pageSize} questions, but got ${questions.length}. This might be due to pagination.`
//     );
//   }

//   const totalPages = Math.ceil(totalCount / pageSize);
//   const answeredCount = Object.keys(selectedChoices).length;
//   const progressPercentage = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

//   const groupedQuestions = useMemo(() => {
//     return allQuestions.reduce((acc, q) => {
//       const subject = q.subject_category_name;
//       if (!acc[subject]) acc[subject] = [];
//       acc[subject].push(q);
//       return acc;
//     }, {} as Record<string, Question[]>);
//   }, [allQuestions]);

//   const handleQuestionClick = (questionId: number) => {
//     const questionIndex = allQuestions.findIndex((q) => q.id === questionId);
//     const newPage = Math.floor(questionIndex / pageSize) + 1;
//     setCurrentPage(newPage);
//     setHighlightedQuestionId(questionId);
//     setActiveTab("questions");
//   };

//   const handleChoiceSelect = (questionId: number, choiceId: number) => {
//     setSelectedChoices((prev) => ({
//       ...prev,
//       [questionId]: choiceId,
//     }));
//   };

//   const [submitQuiz, { isLoading: submitLoading }] = useSubmitQuizMutation();

//   const handleSubmitQuiz = async () => {
//     const choices = Object.fromEntries(Object.entries(selectedChoices));
//     const payload = {
//       categoryPath,
//       questionsFile: quizFile,
//       choices,
//       is_submitted: true,
//     };
//     try {
//       const result = await submitQuiz(payload).unwrap();
//       const quizId = uuidv4();
//       toast.success("Quiz submitted successfully!");
//       localStorage.setItem(
//         `quizResult_${quizId}`,
//         JSON.stringify({
//           status: "quiz submitted",
//           points: result.points,
//           total_questions: allQuestions.length,
//           responses: Object.entries(choices).map(([qId, cId]) => ({
//             question: Number(qId),
//             selected_choice: cId,
//             is_submitted: true,
//           })),
//         })
//       );
//       router.push(
//         `/quiz-app/results/${quizId}/${categoryPath}/${quizFile}`
//       );
//     } catch (err) {
//       console.error(
//         "Failed to submit quiz. Please select an option before proceeding.",
//         err
//       );
//       toast.error(
//         "Failed to submit quiz. Please select an option before proceeding."
//       );
//     }
//   };

//   if (allLoading || qLoading) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center">
//         <div className="flex flex-col items-center gap-4">
//           <Loading />
//         </div>
//       </div>
//     );
//   }

//   if (allError || qError) {
//     return (
//       <div className="p-8 text-center text-destructive">
//         Error: {(allError as Error)?.message || (qError as Error)?.message}
//       </div>
//     );
//   }

//   const displayedQuestions = questions;

//   return (
//     <div className="container mx-auto p-4 lg:p-8">
//       <header className="mb-8">
//         <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//           <div className="text-center md:text-left">
//             <Breadcrumb className="mb-4">
//               <BreadcrumbList>
//                 <BreadcrumbItem>
//                   <BreadcrumbLink href="/quiz-app">All Quizzes</BreadcrumbLink>
//                 </BreadcrumbItem>
//                 {quizPath.slice(0, -1).map((segment, index) => (
//                   <div key={index} className="flex items-center">
//                     <BreadcrumbSeparator />
//                     <BreadcrumbItem>
//                       <BreadcrumbLink
//                         href={`/quiz-app/category/${quizPath.slice(0, index + 1).join("/")}`}
//                       >
//                         {segment}
//                       </BreadcrumbLink>
//                     </BreadcrumbItem>
//                   </div>
//                 ))}
//                 <BreadcrumbSeparator />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage>{quizFile}</BreadcrumbPage>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb>
//           </div>
//           <div className="flex items-center gap-2">
//             <Badge variant="outline" className="px-3 py-1">
//               <BookOpen className="mr-1 h-3 w-3" />
//               {totalCount} Questions
//             </Badge>
//             <Badge variant="outline" className="px-3 py-1">
//               <CheckCircle className="mr-1 h-3 w-3" />
//               {answeredCount} Answered
//             </Badge>
//           </div>
//         </div>
//         <div className="mt-4">
//           <div className="flex items-center gap-2">
//             <Progress value={progressPercentage} className="h-2" />
//             <span className="text-sm font-medium">
//               {Math.round(progressPercentage)}%
//             </span>
//           </div>
//         </div>
//       </header>

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 relative">
//         <div className="lg:hidden">
//           <Tabs value={activeTab} onValueChange={setActiveTab}>
//             <TabsList className="w-full">
//               <TabsTrigger value="questions" className="flex-1">
//                 Questions
//               </TabsTrigger>
//               <TabsTrigger value="navigation" className="flex-1">
//                 Navigation
//               </TabsTrigger>
//             </TabsList>
//             <TabsContent value="navigation" className="mt-4">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="text-lg">Question Navigator</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <ScrollArea className="h-[100vh]">
//                     {Object.entries(groupedQuestions).map(([subject, qs]) => (
//                       <div key={subject} className="mb-6">
//                         <h4 className="mb-2 font-medium">
//                           {subject}{" "}
//                           <span className="text-muted-foreground">
//                             ({qs.length})
//                           </span>
//                         </h4>
//                         <div className="grid grid-cols-5 gap-2">
//                           {qs.map((q) => (
//                             <Button
//                               key={q.id}
//                               variant={
//                                 q.id === highlightedQuestionId
//                                   ? "default"
//                                   : q.id in selectedChoices
//                                   ? "outline"
//                                   : "secondary"
//                               }
//                               size="sm"
//                               className={`h-10 w-10 p-0 rounded-full ${
//                                 q.id in selectedChoices ? "border-primary" : ""
//                               }`}
//                               onClick={() => handleQuestionClick(q.id)}
//                             >
//                               {allQuestions.indexOf(q) + 1}
//                             </Button>
//                           ))}
//                         </div>
//                       </div>
//                     ))}
//                   </ScrollArea>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//             <TabsContent value="questions" className="mt-4">
//               <QuestionsContent
//                 questions={displayedQuestions}
//                 categoryPath={categoryPath}
//                 questionsFile={quizFile}
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 setCurrentPage={setCurrentPage}
//                 selectedChoices={selectedChoices}
//                 handleChoiceSelect={handleChoiceSelect}
//                 onSubmit={handleSubmitQuiz}
//                 submitLoading={submitLoading}
//                 highlightedQuestionId={highlightedQuestionId}
//                 allQuestions={allQuestions}
//               />
//             </TabsContent>
//           </Tabs>
//         </div>

//         <div className="hidden lg:block lg:col-span-1">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Question Navigator</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <ScrollArea className="h-[100vh]">
//                 {Object.entries(groupedQuestions).map(([subject, qs]) => (
//                   <div key={subject} className="mb-4">
//                     <h4 className="mb-2 font-medium">
//                       {subject}{" "}
//                       <span className="text-muted-foreground">
//                         ({qs.length})
//                       </span>
//                     </h4>
//                     <div className="grid grid-cols-4 gap-3 p-3">
//                       {qs.map((q) => (
//                         <Button
//                           key={q.id}
//                           variant={
//                             q.id === highlightedQuestionId
//                               ? "default"
//                               : q.id in selectedChoices
//                               ? "outline"
//                               : "secondary"
//                           }
//                           size="sm"
//                           className={`h-8 w-8 p-0 rounded-full ${
//                             q.id in selectedChoices ? "border-primary" : ""
//                           }`}
//                           onClick={() => handleQuestionClick(q.id)}
//                         >
//                           {allQuestions.indexOf(q) + 1}
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 ))}
//               </ScrollArea>
//             </CardContent>
//           </Card>
//         </div>

//         <div className="hidden lg:block lg:col-span-3">
//           <QuestionsContent
//             questions={displayedQuestions}
//             categoryPath={categoryPath}
//             questionsFile={quizFile}
//             currentPage={currentPage}
//             totalPages={totalPages}
//             setCurrentPage={setCurrentPage}
//             selectedChoices={selectedChoices}
//             handleChoiceSelect={handleChoiceSelect}
//             onSubmit={handleSubmitQuiz}
//             highlightedQuestionId={highlightedQuestionId}
//             allQuestions={allQuestions}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// interface QuestionsContentProps {
//   questions: Question[];
//   categoryPath: string;
//   questionsFile: string;
//   currentPage: number;
//   totalPages: number;
//   setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
//   selectedChoices: Record<number, number>;
//   handleChoiceSelect: (questionId: number, choiceId: number) => void;
//   onSubmit: () => void;
//   submitLoading: boolean;
//   highlightedQuestionId: number | null;
//   allQuestions: Question[];
// }

// function QuestionsContent({
//   questions,
//   categoryPath,
//   questionsFile,
//   currentPage,
//   totalPages,
//   setCurrentPage,
//   selectedChoices,
//   handleChoiceSelect,
//   highlightedQuestionId,
//   allQuestions,
//   onSubmit,
//   submitLoading,
// }: QuestionsContentProps) {
//   const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

//   useEffect(() => {
//     if (highlightedQuestionId) {
//       const index = questions.findIndex((q) => q.id === highlightedQuestionId);
//       if (index !== -1 && questionRefs.current[index]) {
//         questionRefs.current[index]?.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//         });
//       }
//     }
//   }, [highlightedQuestionId, questions]);

//   return (
//     <div className="flex flex-col gap-6">
//       <ScrollArea className="h-[calc(100vh)]">
//         <div className="space-y-6 p-2">
//           {questions.map((question, index) => {
//             const questionNumber = (currentPage - 1) * 5 + index + 1;
//             // Get the first image from the images array, if it exists
//             const firstImage = question.images && question.images.length > 0 ? question.images[0] : null;
//             const imageUrl = firstImage ? firstImage.image : null; // Use the relative path directly

//             return (
//               <Card
//                 key={question.id}
//                 ref={(el) => (questionRefs.current[index] = el)}
//                 className={`transition-all hover:shadow-md ${
//                   question.id === highlightedQuestionId
//                     ? "border-2 border-primary bg-primary/5"
//                     : ""
//                 }`}
//               >
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <Badge variant="outline" className="mb-2">
//                       Question {questionNumber}
//                     </Badge>
//                     <Badge variant="outline" className="mb-2">
//                       {question.subject_category_name}
//                     </Badge>
//                   </div>
//                   <CardTitle className="text-xl">{question.text}</CardTitle>
//                   <div
//                     className={`mt-2 transition-all duration-300 ${
//                       imageUrl ? "h-auto" : "h-0 overflow-hidden"
//                     }`}
//                   >
//                     {imageUrl ? (
//                       <div className="relative w-full max-w-md mx-auto">
//                         <Image
//                           src={imageUrl}
//                           alt={`Image for question ${questionNumber}`}
//                           width={400}
//                           height={300}
//                           className="rounded-md object-contain"
//                           loading="lazy"
//                           onError={(e) => {
//                             console.error(`Failed to load image for question ${question.id}: ${imageUrl}`);
//                             e.currentTarget.style.display = "none"; // Hide the image on error
//                           }}
//                         />
//                       </div>
//                     ) : null}
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <Choices
//                     categoryPath={categoryPath}
//                     questionsFile={questionsFile}
//                     questionId={question.id}
//                     selectedChoice={selectedChoices[question.id]}
//                     onChoiceSelect={handleChoiceSelect}
//                   />
//                 </CardContent>
//                 <Separator />
//               </Card>
//             );
//           })}
//         </div>
//       </ScrollArea>

//       <Card>
//         <CardFooter className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:justify-between">
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage((prev) => prev - 1)}
//               disabled={currentPage === 1 || submitLoading}
//               className="gap-1"
//             >
//               <ChevronLeft className="h-4 w-4" />
//               Previous
//             </Button>
//             <span className="text-sm text-muted-foreground">
//               Page {currentPage} of {totalPages}
//             </span>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage((prev) => prev + 1)}
//               disabled={currentPage === totalPages || submitLoading}
//               className="gap-1"
//             >
//               Next
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>
//           <Button
//             variant="default"
//             onClick={onSubmit}
//             className="w-full sm:w-auto"
//             disabled={submitLoading}
//           >
//             {submitLoading ? (
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             ) : (
//               <Send className="mr-2 h-4 w-4" />
//             )}
//             {submitLoading ? "Submitting..." : "Submit Quiz"}
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }

// function Choices({
//   categoryPath,
//   questionsFile,
//   questionId,
//   selectedChoice,
//   onChoiceSelect,
// }: {
//   categoryPath: string;
//   questionsFile: string;
//   questionId: number;
//   selectedChoice?: number;
//   onChoiceSelect: (questionId: number, choiceId: number) => void;
// }) {
//   const {
//     data: choices = [],
//     isLoading,
//     error,
//     refetch,
//   } = useGetChoicesQuery({ categoryPath, questionsFile, questionId });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-6">
//         <Loader2 className="h-6 w-6 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="rounded-md bg-destructive/10 p-4 text-center text-destructive">
//         Error loading choices
//         <Button variant="ghost" size="sm" onClick={refetch} className="ml-2">
//           Retry
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <RadioGroup
//       value={selectedChoice?.toString()}
//       onValueChange={(value) =>
//         onChoiceSelect(questionId, Number.parseInt(value))
//       }
//       className="space-y-3"
//     >
//       {choices.map((choice: Choice) => (
//         <div
//           key={choice.id}
//           className="flex items-start space-x-2 rounded-md border p-3 transition-all hover:bg-accent"
//         >
//           <RadioGroupItem
//             value={choice.id.toString()}
//             id={`choice-${questionId}-${choice.id}`}
//           />
//           <Label
//             htmlFor={`choice-${questionId}-${choice.id}`}
//             className="w-full cursor-pointer"
//           >
//             {choice.text}
//           </Label>
//         </div>
//       ))}
//     </RadioGroup>
//   );
// }


"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import {
  useGetAllQuestionsQuery,
  useGetQuestionsQuery,
  useGetChoicesQuery,
  useSubmitQuizMutation,
} from "@/redux/features/quizApiSlice";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  BookOpen,
  CheckCircle,
  Send,
} from "lucide-react";
import Loading from "@/loading/Loading";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Image {
  id: number;
  image: string;
  image_url: string | null;
}

interface Question {
  id: number;
  text: string;
  questions_file_title: string;
  subject_category_name: string;
  images?: Image[];
}

interface Choice {
  id: number;
  text: string;
}

export default function QuizPage() {
  const { quizPath } = useParams() as { quizPath: string[] };
  const router = useRouter();

  const quizFile = quizPath[quizPath.length - 1]; // e.g., "IOM 2019"
  const categoryPath = quizPath.slice(0, -1).join("/"); // e.g., "Medical/IOM"

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState<Record<number, number>>({});
  const [activeTab, setActiveTab] = useState<string>("questions");
  const [highlightedQuestionId, setHighlightedQuestionId] = useState<number | null>(null);

  const {
    data: allQuestions = [],
    isLoading: allLoading,
    error: allError,
  } = useGetAllQuestionsQuery({ categoryPath, questionsFile: quizFile });

  const {
    data: questionsData,
    isLoading: qLoading,
    error: qError,
  } = useGetQuestionsQuery({
    categoryPath,
    questionsFile: quizFile,
    page: currentPage,
  });

  const questions = questionsData?.results || [];
  const totalCount = questionsData?.count || 0;
  const pageSize = 5;

  if (questions.length > pageSize) {
    console.warn(
      `Expected ${pageSize} questions, but got ${questions.length}. This might be due to pagination.`
    );
  }

  const totalPages = Math.ceil(totalCount / pageSize);
  const answeredCount = Object.keys(selectedChoices).length;
  const progressPercentage = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  const groupedQuestions = useMemo(() => {
    return allQuestions.reduce((acc, q) => {
      const subject = q.subject_category_name;
      if (!acc[subject]) acc[subject] = [];
      acc[subject].push(q);
      return acc;
    }, {} as Record<string, Question[]>);
  }, [allQuestions]);

  const handleQuestionClick = (questionId: number) => {
    const questionIndex = allQuestions.findIndex((q) => q.id === questionId);
    const newPage = Math.floor(questionIndex / pageSize) + 1;
    setCurrentPage(newPage);
    setHighlightedQuestionId(questionId);
    setActiveTab("questions");
  };

  const handleChoiceSelect = (questionId: number, choiceId: number) => {
    setSelectedChoices((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  const [submitQuiz, { isLoading: submitLoading }] = useSubmitQuizMutation();

  const handleSubmitQuiz = async () => {
    const choices = Object.fromEntries(Object.entries(selectedChoices));
    const payload = {
      categoryPath,
      questionsFile: quizFile,
      choices,
      is_submitted: true,
    };
    try {
      const result = await submitQuiz(payload).unwrap();
      const quizId = uuidv4();
      toast.success("Quiz submitted successfully!");
      localStorage.setItem(
        `quizResult_${quizId}`,
        JSON.stringify({
          status: "quiz submitted",
          points: result.points,
          total_questions: allQuestions.length,
          responses: Object.entries(choices).map(([qId, cId]) => ({
            question: Number(qId),
            selected_choice: cId,
            is_submitted: true,
          })),
        })
      );
      router.push(
        `/quiz-app/results/${quizId}/${categoryPath}/${quizFile}`
      );
    } catch (err) {
      console.error(
        "Failed to submit quiz. Please select an option before proceeding.",
        err
      );
      toast.error(
        "Failed to submit quiz. Please select an option before proceeding."
      );
    }
  };

  if (allLoading || qLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loading />
        </div>
      </div>
    );
  }

  if (allError || qError) {
    return (
      <div className="p-8 text-center text-destructive">
        Error: {(allError as Error)?.message || (qError as Error)?.message}
      </div>
    );
  }

  const displayedQuestions = questions;

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <header className="mb-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/quiz-app">All Quizzes</BreadcrumbLink>
                </BreadcrumbItem>
                {quizPath.slice(0, -1).map((segment, index) => (
                  <div key={index} className="flex items-center">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={`/quiz-app/category/${quizPath.slice(0, index + 1).join("/")}`}
                      >
                        {segment}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </div>
                ))}
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{quizFile}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1">
              <BookOpen className="mr-1 h-3 w-3" />
              {totalCount} Questions
            </Badge>
            <Badge variant="outline" className="px-3 py-1">
              <CheckCircle className="mr-1 h-3 w-3" />
              {answeredCount} Answered
            </Badge>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <Progress value={progressPercentage} className="h-2" />
            <span className="text-sm font-medium">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 relative">
        <div className="lg:hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="questions" className="flex-1">
                Questions
              </TabsTrigger>
              <TabsTrigger value="navigation" className="flex-1">
                Navigation
              </TabsTrigger>
            </TabsList>
            <TabsContent value="navigation" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Question Navigator</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[100vh]">
                    {Object.entries(groupedQuestions).map(([subject, qs]) => (
                      <div key={subject} className="mb-6">
                        <h4 className="mb-2 font-medium">
                          {subject}{" "}
                          <span className="text-muted-foreground">
                            ({qs.length})
                          </span>
                        </h4>
                        <div className="grid grid-cols-5 gap-2">
                          {qs.map((q) => (
                            <Button
                              key={q.id}
                              variant={
                                q.id === highlightedQuestionId
                                  ? "default"
                                  : q.id in selectedChoices
                                  ? "outline"
                                  : "secondary"
                              }
                              size="sm"
                              className={`h-10 w-10 p-0 rounded-full ${
                                q.id in selectedChoices ? "border-primary" : ""
                              }`}
                              onClick={() => handleQuestionClick(q.id)}
                            >
                              {allQuestions.indexOf(q) + 1}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="questions" className="mt-4">
              <QuestionsContent
                questions={displayedQuestions}
                categoryPath={categoryPath}
                questionsFile={quizFile}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                selectedChoices={selectedChoices}
                handleChoiceSelect={handleChoiceSelect}
                onSubmit={handleSubmitQuiz}
                submitLoading={submitLoading}
                highlightedQuestionId={highlightedQuestionId}
                allQuestions={allQuestions}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[100vh]">
                {Object.entries(groupedQuestions).map(([subject, qs]) => (
                  <div key={subject} className="mb-4">
                    <h4 className="mb-2 font-medium">
                      {subject}{" "}
                      <span className="text-muted-foreground">
                        ({qs.length})
                      </span>
                    </h4>
                    <div className="grid grid-cols-4 gap-3 p-3">
                      {qs.map((q) => (
                        <Button
                          key={q.id}
                          variant={
                            q.id === highlightedQuestionId
                              ? "default"
                              : q.id in selectedChoices
                              ? "outline"
                              : "secondary"
                          }
                          size="sm"
                          className={`h-8 w-8 p-0 rounded-full ${
                            q.id in selectedChoices ? "border-primary" : ""
                          }`}
                          onClick={() => handleQuestionClick(q.id)}
                        >
                          {allQuestions.indexOf(q) + 1}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="hidden lg:block lg:col-span-3">
          <QuestionsContent
            questions={displayedQuestions}
            categoryPath={categoryPath}
            questionsFile={quizFile}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            selectedChoices={selectedChoices}
            handleChoiceSelect={handleChoiceSelect}
            onSubmit={handleSubmitQuiz}
            highlightedQuestionId={highlightedQuestionId}
            allQuestions={allQuestions}
          />
        </div>
      </div>
    </div>
  );
}

interface QuestionsContentProps {
  questions: Question[];
  categoryPath: string;
  questionsFile: string;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  selectedChoices: Record<number, number>;
  handleChoiceSelect: (questionId: number, choiceId: number) => void;
  onSubmit: () => void;
  submitLoading: boolean;
  highlightedQuestionId: number | null;
  allQuestions: Question[];
}

function QuestionsContent({
  questions,
  categoryPath,
  questionsFile,
  currentPage,
  totalPages,
  setCurrentPage,
  selectedChoices,
  handleChoiceSelect,
  highlightedQuestionId,
  allQuestions,
  onSubmit,
  submitLoading,
}: QuestionsContentProps) {
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (highlightedQuestionId) {
      const index = questions.findIndex((q) => q.id === highlightedQuestionId);
      if (index !== -1 && questionRefs.current[index]) {
        questionRefs.current[index]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [highlightedQuestionId, questions]);

  return (
    <div className="flex flex-col gap-6">
      <ScrollArea className="h-[calc(100vh)]">
        <div className="space-y-6 p-2">
          {questions.map((question, index) => {
            const questionNumber = (currentPage - 1) * 5 + index + 1;

            return (
              <Card
                key={question.id}
                ref={(el) => (questionRefs.current[index] = el)}
                className={`transition-all hover:shadow-md ${
                  question.id === highlightedQuestionId
                    ? "border-2 border-primary bg-primary/5"
                    : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="mb-2">
                      Question {questionNumber}
                    </Badge>
                    <Badge variant="outline" className="mb-2">
                      {question.subject_category_name}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{question.text}</CardTitle>
                  <div
                    className={`mt-2 transition-all duration-300 ${
                      question.images && question.images.length > 0
                        ? "h-auto"
                        : "h-0 overflow-hidden"
                    }`}
                  >
                    {question.images && question.images.length > 0 ? (
                      <div className="flex flex-row gap-4">
                        {question.images.map((image, imgIndex) => (
                          <div
                            key={imgIndex}
                            // className="relative w-full max-w-md mx-auto"
                            className="relative w-fit"
                          >
                            <Image
                              src={image.image}
                              alt={`Image ${imgIndex + 1} for question ${questionNumber}`}
                              width={400}
                              height={300}
                              className="rounded-md object-contain"
                              loading="lazy"
                              onError={(e) => {
                                console.error(
                                  `Failed to load image ${imgIndex + 1} for question ${question.id}: ${image.image}`
                                );
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent>
                  <Choices
                    categoryPath={categoryPath}
                    questionsFile={questionsFile}
                    questionId={question.id}
                    selectedChoice={selectedChoices[question.id]}
                    onChoiceSelect={handleChoiceSelect}
                  />
                </CardContent>
                <Separator />
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      <Card>
        <CardFooter className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1 || submitLoading}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages || submitLoading}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="default"
            onClick={onSubmit}
            className="w-full sm:w-auto"
            disabled={submitLoading}
          >
            {submitLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {submitLoading ? "Submitting..." : "Submit Quiz"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function Choices({
  categoryPath,
  questionsFile,
  questionId,
  selectedChoice,
  onChoiceSelect,
}: {
  categoryPath: string;
  questionsFile: string;
  questionId: number;
  selectedChoice?: number;
  onChoiceSelect: (questionId: number, choiceId: number) => void;
}) {
  const {
    data: choices = [],
    isLoading,
    error,
    refetch,
  } = useGetChoicesQuery({ categoryPath, questionsFile, questionId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-center text-destructive">
        Error loading choices
        <Button variant="ghost" size="sm" onClick={refetch} className="ml-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <RadioGroup
      value={selectedChoice?.toString()}
      onValueChange={(value) =>
        onChoiceSelect(questionId, Number.parseInt(value))
      }
      className="space-y-3"
    >
      {choices.map((choice: Choice) => (
        <div
          key={choice.id}
          className="flex items-start space-x-2 rounded-md border p-3 transition-all hover:bg-accent"
        >
          <RadioGroupItem
            value={choice.id.toString()}
            id={`choice-${questionId}-${choice.id}`}
          />
          <Label
            htmlFor={`choice-${questionId}-${choice.id}`}
            className="w-full cursor-pointer"
          >
            {choice.text}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}