// "use client";
// import { Link } from "lucide-react";
// import { useState, useEffect } from "react";
// import {
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Eye,
//   ChevronRight,
//   ChevronLeft,
//   Lock,
//   User,
//   LogIn,
//   Menu,
//   X,
// } from "lucide-react";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Separator } from "@/components/ui/separator";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { useToast } from "@/components/ui/use-toast";
// import { cn } from "@/lib/utils";

// import LoginForm from "@/components/login-form";

// // Mock data for the quiz
// const MOCK_QUESTIONS = [
//   {
//     id: 1,
//     question: "What is the capital of France?",
//     imageUrl: "/placeholder.svg?height=300&width=500&text=Paris",
//     options: [
//       { id: "a", text: "London" },
//       { id: "b", text: "Berlin" },
//       { id: "c", text: "Paris" },
//       { id: "d", text: "Madrid" },
//     ],
//     answer: "c",
//   },
//   {
//     id: 2,
//     question: "Which planet is known as the Red Planet?",
//     imageUrl: "/placeholder.svg?height=300&width=500&text=Mars",
//     options: [
//       { id: "a", text: "Venus" },
//       { id: "b", text: "Mars" },
//       { id: "c", text: "Jupiter" },
//       { id: "d", text: "Saturn" },
//     ],
//     answer: "b",
//   },
//   {
//     id: 3,
//     question: "What is the largest mammal on Earth?",
//     imageUrl: "/placeholder.svg?height=300&width=500&text=Blue+Whale",
//     options: [
//       { id: "a", text: "Elephant" },
//       { id: "b", text: "Giraffe" },
//       { id: "c", text: "Blue Whale" },
//       { id: "d", text: "Polar Bear" },
//     ],
//     answer: "c",
//   },
//   {
//     id: 4,
//     question: "Which of these elements has the chemical symbol 'O'?",
//     imageUrl: "/placeholder.svg?height=300&width=500&text=Oxygen",
//     options: [
//       { id: "a", text: "Gold" },
//       { id: "b", text: "Silver" },
//       { id: "c", text: "Oxygen" },
//       { id: "d", text: "Iron" },
//     ],
//     answer: "c",
//   },
//   {
//     id: 5,
//     question: "What is the largest organ in the human body?",
//     imageUrl: "/placeholder.svg?height=300&width=500&text=Skin",
//     options: [
//       { id: "a", text: "Skin" },
//       { id: "b", text: "Liver" },
//       { id: "c", text: "Heart" },
//       { id: "d", text: "Brain" },
//     ],
//     answer: "a",
//   },
//   {
//     id: 6,
//     question: "Which country is known as the Land of the Rising Sun?",
//     imageUrl: "/placeholder.svg?height=300&width=500&text=Japan",
//     options: [
//       { id: "a", text: "China" },
//       { id: "b", text: "South Korea" },
//       { id: "c", text: "Japan" },
//       { id: "d", text: "Thailand" },
//     ],
//     answer: "c",
//   },
//   {
//     id: 7,
//     question: "What is the hardest natural substance on Earth?",
//     imageUrl: "/placeholder.svg?height=300&width=500&text=Diamond",
//     options: [
//       { id: "a", text: "Titanium" },
//       { id: "b", text: "Diamond" },
//       { id: "c", text: "Platinum" },
//       { id: "d", text: "Gold" },
//     ],
//     answer: "b",
//   },
// ];

// // Number of tokens for free trial
// const FREE_TRIAL_TOKENS = 3;

// export default function QuizPage() {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState<Record<number, string>>({});
//   const [timeElapsed, setTimeElapsed] = useState(0);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [availableTokens] = useState(FREE_TRIAL_TOKENS);
//   const [showPreview, setShowPreview] = useState(false);
//   const [showAuthDialog, setShowAuthDialog] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { toast } = useToast();

//   // Format time as MM:SS
//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   // Update timer every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeElapsed((prev) => prev + 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   // Calculate progress percentage
//   const progress =
//     (Object.keys(answers).length /
//       (isAuthenticated ? MOCK_QUESTIONS.length : availableTokens)) *
//     100;

//   // Handle question selection
//   const handleSelectQuestion = (index: number) => {
//     // If user is not authenticated and trying to access a question beyond available tokens
//     if (!isAuthenticated && index >= availableTokens) {
//       setShowAuthDialog(true);
//       return;
//     }

//     setCurrentQuestion(index);
//   };

//   // Handle answer selection
//   const handleSelectAnswer = (questionId: number, answerId: string) => {
//     setAnswers((prev) => ({
//       ...prev,
//       [questionId]: answerId,
//     }));

//     // If user selects answer for the last available token question, show auth dialog
//     if (
//       !isAuthenticated &&
//       questionId === availableTokens - 1 &&
//       currentQuestion === availableTokens - 1
//     ) {
//       // Small delay to allow the answer to be registered visually
//       setTimeout(() => {
//         setShowAuthDialog(true);
//       }, 500);
//     }
//   };

//   // Handle login
//   const handleLogin = () => {
//     setIsAuthenticated(true);
//     setShowAuthDialog(false);

//     toast({
//       title: "Successfully logged in",
//       description: "You now have access to all quiz questions",
//     });
//   };

//   // Handle quiz submission
//   const handleSubmit = () => {
//     const totalQuestions = isAuthenticated
//       ? MOCK_QUESTIONS.length
//       : availableTokens;
//     const answeredQuestions = Object.keys(answers).length;

//     if (answeredQuestions < totalQuestions) {
//       toast({
//         title: "Cannot submit quiz",
//         description: `Please answer all ${totalQuestions} questions before submitting.`,
//         variant: "destructive",
//       });
//       return;
//     }

//     toast({
//       title: "Quiz submitted!",
//       description: "Your answers have been recorded.",
//     });

//     // Show results (in a real app, this would navigate to results page)
//     setShowPreview(true);
//   };

//   // Determine if question is accessible
//   const isQuestionAccessible = (index: number) => {
//     return isAuthenticated || index < availableTokens;
//   };

//   // Generate token indicators
//   const renderTokens = () => {
//     return Array(FREE_TRIAL_TOKENS)
//       .fill(null)
//       .map((_, i) => (
//         <div
//           key={i}
//           className={cn(
//             "w-3 h-3 rounded-full",
//             i < availableTokens ? "bg-primary" : "bg-muted"
//           )}
//         />
//       ));
//   };

//   // Calculate score
//   const calculateScore = () => {
//     let correct = 0;
//     const questionsToCheck = isAuthenticated
//       ? MOCK_QUESTIONS
//       : MOCK_QUESTIONS.slice(0, availableTokens);

//     questionsToCheck.forEach((question) => {
//       if (answers[question.id] === question.answer) {
//         correct++;
//       }
//     });

//     const total = questionsToCheck.length;
//     return {
//       score: correct,
//       total,
//       percentage: Math.round((correct / total) * 100),
//     };
//   };

//   return (
//     <div className="flex flex-col h-screen bg-background">
//       {/* Header */}
//       <header className="sticky top-0 border-b px-4 py-3 bg-background/95 backdrop-blur-sm z-20">
//         <div className="container flex items-center justify-between">
//           <div className="flex items-center gap-2">

//             <Button
//               variant="ghost"
//               size="icon"
//               className="md:hidden"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               aria-label="Toggle sidebar"
//             >
//               {sidebarOpen ? (
//                 <X className="h-5 w-5" />
//               ) : (
//                 <Menu className="h-5 w-5" />
//               )}
//             </Button>
//             <Link href="/" className="flex items-center gap-2">

//             <h1 className="text-xl font-semibold">Quiz App</h1>
//             </Link>

//           </div>

//           <div className="flex items-center gap-3">
//             {!isAuthenticated && (
//               <div className="hidden sm:flex items-center gap-1 mr-2">
//                 {renderTokens()}
//               </div>
//             )}

//             <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-md text-sm">
//               <Clock className="h-4 w-4" />
//               <span>{formatTime(timeElapsed)}</span>
//             </div>

//             {isAuthenticated ? (
//               <Badge variant="outline" className="hidden sm:flex gap-1.5">
//                 <User className="h-3 w-3" />
//                 <span>Authenticated</span>
//               </Badge>
//             ) : (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setShowAuthDialog(true)}
//                 className="hidden sm:flex"
//               >
//                 <LogIn className="h-4 w-4 mr-2" />
//                 Log In
//               </Button>
//             )}
//           </div>
//         </div>
//       </header>

//       <div className="flex flex-1 overflow-hidden relative">
//         {/* Sidebar - Desktop (permanent) */}
//         <aside className="hidden md:block border-r bg-background w-64 h-full overflow-hidden transition-all duration-300 z-10">
//           <ScrollArea className="h-full">
//             <div className="p-4">
//               <h2 className="font-medium mb-4">Quiz Questions</h2>

//               <div className="space-y-1">
//                 {MOCK_QUESTIONS.map((q, i) => (
//                   <Button
//                     key={q.id}
//                     variant={currentQuestion === i ? "default" : "ghost"}
//                     className={cn(
//                       "w-full justify-start",
//                       !isQuestionAccessible(i) && "opacity-60",
//                       answers[q.id] && "border-l-4 border-green-500"
//                     )}
//                     onClick={() => handleSelectQuestion(i)}
//                     disabled={!isQuestionAccessible(i)}
//                   >
//                     <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted mr-2">
//                       {i + 1}
//                     </div>
//                     <span className="truncate flex-1">
//                       {q.question.substring(0, 20)}
//                       {q.question.length > 20 && "..."}
//                     </span>
//                     {!isQuestionAccessible(i) && (
//                       <Lock className="ml-2 h-3 w-3" />
//                     )}
//                     {answers[q.id] && (
//                       <CheckCircle className="ml-2 h-3 w-3 text-green-500" />
//                     )}
//                   </Button>
//                 ))}
//               </div>

//               {!isAuthenticated && (
//                 <div className="mt-6 p-3 bg-primary/10 rounded-md text-sm">
//                   <p>You have access to {availableTokens} free questions.</p>
//                   <Button
//                     variant="link"
//                     className="p-0 h-auto mt-1"
//                     onClick={() => setShowAuthDialog(true)}
//                   >
//                     Log in for full access
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </ScrollArea>
//         </aside>

//         {/* Mobile sidebar (drawer) */}
//         {sidebarOpen && (
//           <div
//             className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
//             onClick={() => setSidebarOpen(false)}
//           >
//             <div
//               className="absolute left-0 top-0 h-full w-72 bg-background border-r p-4 transition-transform transform-gpu animate-in slide-in-from-left"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="font-medium">Quiz Questions</h2>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setSidebarOpen(false)}
//                   aria-label="Close sidebar"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>

//               <ScrollArea className="h-[calc(100vh-8rem)]">
//                 <div className="space-y-1">
//                   {MOCK_QUESTIONS.map((q, i) => (
//                     <Button
//                       key={q.id}
//                       variant={currentQuestion === i ? "default" : "ghost"}
//                       className={cn(
//                         "w-full justify-start",
//                         !isQuestionAccessible(i) && "opacity-60",
//                         answers[q.id] && "border-l-4 border-green-500"
//                       )}
//                       onClick={() => {
//                         handleSelectQuestion(i);
//                         setSidebarOpen(false);
//                       }}
//                       disabled={!isQuestionAccessible(i)}
//                     >
//                       <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted mr-2">
//                         {i + 1}
//                       </div>
//                       <span className="truncate flex-1">
//                         {q.question.substring(0, 20)}
//                         {q.question.length > 20 && "..."}
//                       </span>
//                       {!isQuestionAccessible(i) && (
//                         <Lock className="ml-2 h-3 w-3" />
//                       )}
//                       {answers[q.id] && (
//                         <CheckCircle className="ml-2 h-3 w-3 text-green-500" />
//                       )}
//                     </Button>
//                   ))}
//                 </div>
//               </ScrollArea>

//               {!isAuthenticated && (
//                 <div className="mt-6 p-3 bg-primary/10 rounded-md text-sm">
//                   <p>You have access to {availableTokens} free questions.</p>
//                   <p className="mt-1 text-xs text-muted-foreground">
//                     {FREE_TRIAL_TOKENS - Object.keys(answers).length} questions
//                     remaining
//                   </p>
//                   <Button
//                     variant="link"
//                     className="p-0 h-auto mt-2"
//                     onClick={() => {
//                       setSidebarOpen(false);
//                       setShowAuthDialog(true);
//                     }}
//                   >
//                     Log in for full access
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Main content */}
//         <main className="flex-1 overflow-auto px-4">
//           <div className="container py-6 max-w-4xl mx-auto">
//             {showPreview ? (
//               // Results/Preview mode
//               <div className="space-y-6">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                   <h2 className="text-2xl font-bold">Quiz Results</h2>
//                   <Button onClick={() => setShowPreview(false)}>
//                     Return to Quiz
//                   </Button>
//                 </div>

//                 {/* Score summary card */}
//                 <Card className="overflow-hidden bg-primary/5">
//                   <CardContent className="p-6">
//                     <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                       <div>
//                         <h3 className="text-lg font-semibold">Your Score</h3>
//                         <p className="text-muted-foreground">
//                           Quiz completed in {formatTime(timeElapsed)}
//                         </p>
//                       </div>

//                       <div className="flex items-center gap-4">
//                         <div className="text-center">
//                           <div className="text-4xl font-bold">
//                             {calculateScore().score}
//                           </div>
//                           <div className="text-sm text-muted-foreground">
//                             Correct
//                           </div>
//                         </div>
//                         <div className="text-3xl font-light text-muted-foreground">
//                           /
//                         </div>
//                         <div className="text-center">
//                           <div className="text-4xl font-bold">
//                             {calculateScore().total}
//                           </div>
//                           <div className="text-sm text-muted-foreground">
//                             Total
//                           </div>
//                         </div>
//                         <div className="hidden sm:block h-12 w-px bg-border mx-2"></div>
//                         <div className="text-center">
//                           <div className="text-4xl font-bold">
//                             {calculateScore().percentage}%
//                           </div>
//                           <div className="text-sm text-muted-foreground">
//                             Score
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Questions review */}
//                 <h3 className="text-xl font-semibold mt-8 mb-4">
//                   Review Your Answers
//                 </h3>

//                 {MOCK_QUESTIONS.slice(
//                   0,
//                   isAuthenticated ? undefined : availableTokens
//                 ).map((question, index) => (
//                   <Card key={question.id} className="overflow-hidden mb-6">
//                     <CardContent className="p-6">
//                       <div className="flex items-center gap-2 mb-4">
//                         <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-sm font-medium">
//                           {index + 1}
//                         </div>
//                         <h3 className="font-medium">{question.question}</h3>
//                         {answers[question.id] === question.answer ? (
//                           <Badge
//                             variant="outline"
//                             className="ml-auto bg-green-500/10 text-green-700 dark:text-green-400 border-green-500"
//                           >
//                             Correct
//                           </Badge>
//                         ) : (
//                           <Badge
//                             variant="outline"
//                             className="ml-auto bg-red-500/10 text-red-700 dark:text-red-400 border-red-500"
//                           >
//                             Incorrect
//                           </Badge>
//                         )}
//                       </div>

//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         <div className="relative aspect-[5/3] overflow-hidden rounded-md">
//                           <Image
//                             src={question.imageUrl || "/placeholder.svg"}
//                             alt={`Question ${index + 1}`}
//                             className="object-cover"
//                             fill
//                           />
//                         </div>

//                         <div className="space-y-3">
//                           {question.options.map((option) => (
//                             <div
//                               key={option.id}
//                               className={cn(
//                                 "flex items-center p-3 border rounded-md",
//                                 option.id === question.answer &&
//                                   "border-green-500",
//                                 answers[question.id] === option.id &&
//                                   option.id !== question.answer &&
//                                   "border-red-500",
//                                 answers[question.id] === option.id &&
//                                   option.id === question.answer
//                                   ? "bg-green-50 dark:bg-green-900/20"
//                                   : answers[question.id] === option.id
//                                   ? "bg-red-50 dark:bg-red-900/20"
//                                   : option.id === question.answer
//                                   ? "bg-green-50/30 dark:bg-green-900/10"
//                                   : ""
//                               )}
//                             >
//                               <div
//                                 className={cn(
//                                   "flex items-center justify-center w-6 h-6 rounded-full border mr-3 text-sm",
//                                   answers[question.id] === option.id
//                                     ? "bg-primary text-primary-foreground border-primary"
//                                     : option.id === question.answer
//                                     ? "border-green-500"
//                                     : ""
//                                 )}
//                               >
//                                 {option.id.toUpperCase()}
//                               </div>
//                               <span>{option.text}</span>

//                               {answers[question.id] === option.id &&
//                                 question.answer === option.id && (
//                                   <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
//                                 )}

//                               {answers[question.id] === option.id &&
//                                 question.answer !== option.id && (
//                                   <AlertCircle className="ml-auto h-5 w-5 text-red-500" />
//                                 )}

//                               {option.id === question.answer &&
//                                 answers[question.id] !== option.id && (
//                                   <CheckCircle className="ml-auto h-5 w-5 text-green-500 opacity-50" />
//                                 )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}

//                 {!isAuthenticated && (
//                   <Card className="bg-primary/5 border-dashed">
//                     <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
//                       <div>
//                         <h3 className="text-lg font-semibold">
//                           Want to access all questions?
//                         </h3>
//                         <p className="text-muted-foreground">
//                           Log in to view all 7 questions and track your
//                           progress.
//                         </p>
//                       </div>
//                       <Button onClick={() => setShowAuthDialog(true)}>
//                         <LogIn className="h-4 w-4 mr-2" />
//                         Log In Now
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 )}
//               </div>
//             ) : (
//               // Question display
//               <>
//                 <div className="mb-8">
//                   <Progress value={progress} className="h-2" />
//                   <div className="flex justify-between text-sm text-muted-foreground mt-2">
//                     <span>
//                       {Object.keys(answers).length} of{" "}
//                       {isAuthenticated
//                         ? MOCK_QUESTIONS.length
//                         : availableTokens}{" "}
//                       questions answered
//                     </span>
//                     <span>{Math.round(progress)}% complete</span>
//                   </div>
//                 </div>

//                 {currentQuestion < MOCK_QUESTIONS.length && (
//                   <div>
//                     <div className="flex items-center gap-2 mb-6">
//                       <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-medium">
//                         {currentQuestion + 1}
//                       </div>
//                       <h2 className="text-xl font-semibold">
//                         {MOCK_QUESTIONS[currentQuestion].question}
//                       </h2>
//                     </div>

//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                       <div className="flex flex-col">
//                         <div className="relative aspect-[5/3] rounded-lg overflow-hidden mb-4">
//                           <Image
//                             src={
//                               MOCK_QUESTIONS[currentQuestion].imageUrl ||
//                               "/placeholder.svg"
//                             }
//                             alt={`Question ${currentQuestion + 1}`}
//                             fill
//                             className="object-cover"
//                           />
//                         </div>

//                         <div className="flex gap-3 mt-auto">
//                           {currentQuestion > 0 && (
//                             <Button
//                               variant="outline"
//                               onClick={() =>
//                                 handleSelectQuestion(currentQuestion - 1)
//                               }
//                               className="flex items-center"
//                             >
//                               <ChevronLeft className="h-4 w-4 mr-1" />
//                               Previous
//                             </Button>
//                           )}

//                           {currentQuestion <
//                             (isAuthenticated
//                               ? MOCK_QUESTIONS.length - 1
//                               : availableTokens - 1) && (
//                             <Button
//                               onClick={() =>
//                                 handleSelectQuestion(currentQuestion + 1)
//                               }
//                               className="flex items-center ml-auto"
//                             >
//                               Next
//                               <ChevronRight className="h-4 w-4 ml-1" />
//                             </Button>
//                           )}
//                         </div>
//                       </div>

//                       <div className="space-y-3">
//                         {MOCK_QUESTIONS[currentQuestion].options.map(
//                           (option) => (
//                             <div
//                               key={option.id}
//                               className={cn(
//                                 "flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors",
//                                 answers[MOCK_QUESTIONS[currentQuestion].id] ===
//                                   option.id &&
//                                   "border-2 border-primary bg-primary/5"
//                               )}
//                               onClick={() =>
//                                 handleSelectAnswer(
//                                   MOCK_QUESTIONS[currentQuestion].id,
//                                   option.id
//                                 )
//                               }
//                             >
//                               <div
//                                 className={cn(
//                                   "flex items-center justify-center w-8 h-8 rounded-full border mr-3",
//                                   answers[
//                                     MOCK_QUESTIONS[currentQuestion].id
//                                   ] === option.id &&
//                                     "bg-primary text-primary-foreground border-primary"
//                                 )}
//                               >
//                                 {option.id.toUpperCase()}
//                               </div>
//                               <span>{option.text}</span>

//                               {answers[MOCK_QUESTIONS[currentQuestion].id] ===
//                                 option.id && (
//                                 <CheckCircle className="ml-auto h-5 w-5 text-primary" />
//                               )}
//                             </div>
//                           )
//                         )}

//                         {!isAuthenticated &&
//                           currentQuestion === availableTokens - 1 && (
//                             <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-dashed">
//                               <p className="text-sm font-medium">
//                                 This is your last free question
//                               </p>
//                               <p className="text-sm text-muted-foreground mt-1">
//                                 Log in to access all {MOCK_QUESTIONS.length}{" "}
//                                 questions
//                               </p>
//                               <Button
//                                 className="mt-3"
//                                 size="sm"
//                                 onClick={() => setShowAuthDialog(true)}
//                               >
//                                 <LogIn className="h-4 w-4 mr-2" />
//                                 Log In Now
//                               </Button>
//                             </div>
//                           )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 <Separator className="my-8" />

//                 <div className="flex flex-col sm:flex-row gap-4 justify-between">
//                   <Button
//                     variant="outline"
//                     onClick={() => setShowPreview(true)}
//                     className="gap-2"
//                   >
//                     <Eye className="h-4 w-4" />
//                     Review Answers
//                   </Button>

//                   <Button onClick={handleSubmit} className="gap-2">
//                     Submit Quiz
//                     <ChevronRight className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </>
//             )}
//           </div>
//         </main>
//       </div>

//       {/* Auth Dialog */}
//       <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Log in to continue</DialogTitle>
//             <DialogDescription>
//               {!isAuthenticated &&
//               Object.keys(answers).length >= availableTokens
//                 ? "You've used all your free trial tokens. Log in or create an account to access all quiz questions."
//                 : "Log in to unlock all quiz questions and save your progress."}
//             </DialogDescription>
//           </DialogHeader>

//           <LoginForm onLogin={handleLogin} />

//           <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
//             <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
//               Continue with Limited Access
//             </Button>
//             <Button
//               variant="default"
//               onClick={handleLogin}
//               className="sm:ml-auto"
//             >
//               <LogIn className="h-4 w-4 mr-2" />
//               Log In
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  ChevronRight,
  ChevronLeft,
  Lock,
  User,
  LogIn,
  Menu,
  X,
  Home,
  Moon,
  Sun,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import LoginForm from "@/components/login-form";
// import { ModeToggle } from "@/components/mode-toggle"

// Mock data for the quiz
const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "What is the capital of France?",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Paris",
    options: [
      { id: "a", text: "London" },
      { id: "b", text: "Berlin" },
      { id: "c", text: "Paris" },
      { id: "d", text: "Madrid" },
    ],
    answer: "c",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Mars",
    options: [
      { id: "a", text: "Venus" },
      { id: "b", text: "Mars" },
      { id: "c", text: "Jupiter" },
      { id: "d", text: "Saturn" },
    ],
    answer: "b",
  },
  {
    id: 3,
    question: "What is the largest mammal on Earth?",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Blue+Whale",
    options: [
      { id: "a", text: "Elephant" },
      { id: "b", text: "Giraffe" },
      { id: "c", text: "Blue Whale" },
      { id: "d", text: "Polar Bear" },
    ],
    answer: "c",
  },
  {
    id: 4,
    question: "Which of these elements has the chemical symbol 'O'?",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Oxygen",
    options: [
      { id: "a", text: "Gold" },
      { id: "b", text: "Silver" },
      { id: "c", text: "Oxygen" },
      { id: "d", text: "Iron" },
    ],
    answer: "c",
  },
  {
    id: 5,
    question: "What is the largest organ in the human body?",
    imageUrl: null, // Example of a question without an image
    options: [
      { id: "a", text: "Skin" },
      { id: "b", text: "Liver" },
      { id: "c", text: "Heart" },
      { id: "d", text: "Brain" },
    ],
    answer: "a",
  },
  {
    id: 6,
    question: "Which country is known as the Land of the Rising Sun?",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Japan",
    options: [
      { id: "a", text: "China" },
      { id: "b", text: "South Korea" },
      { id: "c", text: "Japan" },
      { id: "d", text: "Thailand" },
    ],
    answer: "c",
  },
  {
    id: 7,
    question: "What is the hardest natural substance on Earth?",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Diamond",
    options: [
      { id: "a", text: "Titanium" },
      { id: "b", text: "Diamond" },
      { id: "c", text: "Platinum" },
      { id: "d", text: "Gold" },
    ],
    answer: "b",
  },
];

// Number of tokens for free trial
const FREE_TRIAL_TOKENS = 6;

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  // const [isMounted, setIsMounted] = useState(false);
  const [availableTokens] = useState(FREE_TRIAL_TOKENS);
  const [showPreview, setShowPreview] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  // handle theme toggle
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate progress percentage
  const progress =
    (Object.keys(answers).length /
      (isAuthenticated ? MOCK_QUESTIONS.length : availableTokens)) *
    100;

  // Handle question selection
  const handleSelectQuestion = (index: number) => {
    // If user is not authenticated and trying to access a question beyond available tokens
    if (!isAuthenticated && index >= availableTokens) {
      setShowAuthDialog(true);
      return;
    }

    setCurrentQuestion(index);
  };

  // Handle answer selection
  const handleSelectAnswer = (questionId: number, answerId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));

    // If user selects answer for the last available token question, show auth dialog
    if (
      !isAuthenticated &&
      questionId === availableTokens - 1 &&
      currentQuestion === availableTokens - 1
    ) {
      // Small delay to allow the answer to be registered visually
      setTimeout(() => {
        setShowAuthDialog(true);
      }, 500);
    }
  };

  // Handle login
  const handleLogin = () => {
    setIsAuthenticated(true);
    setShowAuthDialog(false);

    toast({
      title: "Successfully logged in",
      description: "You now have access to all quiz questions",
    });
  };

  // Handle quiz submission
  const handleSubmit = () => {
    const totalQuestions = isAuthenticated
      ? MOCK_QUESTIONS.length
      : availableTokens;
    const answeredQuestions = Object.keys(answers).length;

    if (answeredQuestions < totalQuestions) {
      toast({
        title: "Cannot submit quiz",
        description: `Please answer all ${totalQuestions} questions before submitting.`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Quiz submitted!",
      description: "Your answers have been recorded.",
    });

    // Show results (in a real app, this would navigate to results page)
    setShowPreview(true);
  };

  // Determine if question is accessible
  const isQuestionAccessible = (index: number) => {
    return isAuthenticated || index < availableTokens;
  };

  // Generate token indicators
  const renderTokens = () => {
    return Array(FREE_TRIAL_TOKENS)
      .fill(null)
      .map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-3 h-3 rounded-full",
            i < availableTokens ? "bg-primary" : "bg-muted"
          )}
        />
      ));
  };

  // Calculate score
  const calculateScore = () => {
    let correct = 0;
    const questionsToCheck = isAuthenticated
      ? MOCK_QUESTIONS
      : MOCK_QUESTIONS.slice(0, availableTokens);

    questionsToCheck.forEach((question) => {
      if (answers[question.id] === question.answer) {
        correct++;
      }
    });

    const total = questionsToCheck.length;
    return {
      score: correct,
      total,
      percentage: Math.round((correct / total) * 100),
    };
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 border-b px-4 py-3 bg-background/95 backdrop-blur-sm z-20">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <Link href="/">
              <h1 className="text-xl font-semibold">Quiz App</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-xl hover:bg-muted"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            {!isAuthenticated && (
              <div className="hidden sm:flex items-center gap-1 mr-2">
                {renderTokens()}
              </div>
            )}

            <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-md text-sm">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeElapsed)}</span>
            </div>

            <Link href="/">
              <Button variant="outline" size="sm" className="mr-2">
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
              </Button>
            </Link>

            {isAuthenticated ? (
              <Badge variant="outline" className="hidden sm:flex gap-1.5">
                <User className="h-3 w-3" />
                <span>Authenticated</span>
              </Badge>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuthDialog(true)}
                className="hidden sm:flex"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Log In
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - Desktop (permanent) */}
        <aside className="hidden md:block border-r bg-background w-64 h-full overflow-hidden transition-all duration-300 z-10 ms-2 mr-2">
          <ScrollArea className="h-full">
            <div className="p-4 ms-2 ">
              <h2 className="font-medium mb-4">Quiz Questions</h2>

              <div className="space-y-1">
                {MOCK_QUESTIONS.map((q, i) => (
                  <Button
                    key={q.id}
                    variant={currentQuestion === i ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      !isQuestionAccessible(i) && "opacity-60",
                      answers[q.id] && "border-l-4 border-green-500"
                    )}
                    onClick={() => handleSelectQuestion(i)}
                    disabled={!isQuestionAccessible(i)}
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted mr-2">
                      {i + 1}
                    </div>
                    <span className="truncate flex-1">
                      {q.question.substring(0, 20)}
                      {q.question.length > 20 && "..."}
                    </span>
                    {!isQuestionAccessible(i) && (
                      <Lock className="ml-2 h-3 w-3" />
                    )}
                    {answers[q.id] && (
                      <CheckCircle className="ml-2 h-3 w-3 text-green-500" />
                    )}
                  </Button>
                ))}
              </div>

              {!isAuthenticated && (
                <div className="mt-6 p-3 dark:bg-amber-900 bg-amber-400 rounded-md text-sm">
                  <p>You have access to {availableTokens} free questions.</p>
                  <Button
                    variant="link"
                    className="p-1 h-auto mt-1 hover:bg-blue-600 flex "
                    onClick={() => setShowAuthDialog(true)}
                  >
                    Log in for full access
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </aside>

        {/* Mobile sidebar (drawer) */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="absolute left-0 top-0 h-full w-72 bg-background border-r p-4 transition-transform transform-gpu animate-in slide-in-from-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium">Quiz Questions</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="h-[calc(100vh-8rem)] ">
                <div className="space-y-1">
                  {MOCK_QUESTIONS.map((q, i) => (
                    <Button
                      key={q.id}
                      variant={currentQuestion === i ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start",
                        !isQuestionAccessible(i) && "opacity-60",
                        answers[q.id] && "border-l-4 border-green-500"
                      )}
                      onClick={() => {
                        handleSelectQuestion(i);
                        setSidebarOpen(false);
                      }}
                      disabled={!isQuestionAccessible(i)}
                    >
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted mr-2">
                        {i + 1}
                      </div>
                      <span className="truncate flex-1">
                        {q.question.substring(0, 20)}
                        {q.question.length > 20 && "..."}
                      </span>
                      {!isQuestionAccessible(i) && (
                        <Lock className="ml-2 h-3 w-3" />
                      )}
                      {answers[q.id] && (
                        <CheckCircle className="ml-2 h-3 w-3 text-green-500" />
                      )}
                    </Button>
                  ))}
                </div>
              </ScrollArea>

              {!isAuthenticated && (
                <div className="mt-6 p-3 bg-primary/10 rounded-md text-sm">
                  <p>You have access to {availableTokens} free questions.</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {FREE_TRIAL_TOKENS - Object.keys(answers).length} questions
                    remaining
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto mt-2"
                    onClick={() => {
                      setSidebarOpen(false);
                      setShowAuthDialog(true);
                    }}
                  >
                    Log in for full access
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main content */}
        <ScrollArea className="flex-1 overflow-auto px-4">
          <main className="flex-1 overflow-auto px-4">
            <div className="container py-6 max-w-4xl mx-auto">
              {showPreview ? (
                // Results/Preview mode
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-2xl font-bold">Quiz Results</h2>
                    <Button onClick={() => setShowPreview(false)}>
                      Return to Quiz
                    </Button>
                  </div>

                  {/* Score summary card */}
                  <Card className="overflow-hidden bg-primary/5">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">Your Score</h3>
                          <p className="text-muted-foreground">
                            Quiz completed in {formatTime(timeElapsed)}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-4xl font-bold">
                              {calculateScore().score}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Correct
                            </div>
                          </div>
                          <div className="text-3xl font-light text-muted-foreground">
                            /
                          </div>
                          <div className="text-center">
                            <div className="text-4xl font-bold">
                              {calculateScore().total}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Total
                            </div>
                          </div>
                          <div className="hidden sm:block h-12 w-px bg-border mx-2"></div>
                          <div className="text-center">
                            <div className="text-4xl font-bold">
                              {calculateScore().percentage}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Score
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Questions review */}
                  <h3 className="text-xl font-semibold mt-8 mb-4">
                    Review Your Answers
                  </h3>

                  {MOCK_QUESTIONS.slice(
                    0,
                    isAuthenticated ? undefined : availableTokens
                  ).map((question, index) => (
                    <Card key={question.id} className="overflow-hidden mb-6">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-sm font-medium">
                            {index + 1}
                          </div>
                          <h3 className="font-medium">{question.question}</h3>
                          {answers[question.id] === question.answer ? (
                            <Badge
                              variant="outline"
                              className="ml-auto bg-green-500/10 text-green-700 dark:text-green-400 border-green-500"
                            >
                              Correct
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="ml-auto bg-red-500/10 text-red-700 dark:text-red-400 border-red-500"
                            >
                              Incorrect
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {question.imageUrl && (
                            <div className="relative aspect-[5/3] overflow-hidden rounded-md">
                              <Image
                                src={question.imageUrl || "/placeholder.svg"}
                                alt={`Question ${index + 1}`}
                                className="object-cover"
                                fill
                              />
                            </div>
                          )}

                          <div
                            className={cn(
                              "space-y-3 ",
                              !question.imageUrl && "lg:col-span-2"
                            )}
                          >
                            {question.options.map((option) => (
                              <div
                                key={option.id}
                                className={cn(
                                  "flex items-center p-3 border rounded-md",
                                  option.id === question.answer &&
                                    "border-green-500",
                                  answers[question.id] === option.id &&
                                    option.id !== question.answer &&
                                    "border-red-500",
                                  answers[question.id] === option.id &&
                                    option.id === question.answer
                                    ? "bg-green-50 dark:bg-green-900/20"
                                    : answers[question.id] === option.id
                                    ? "bg-red-50 dark:bg-red-900/20"
                                    : option.id === question.answer
                                    ? "bg-green-50/30 dark:bg-green-900/10"
                                    : ""
                                )}
                              >
                                <div
                                  className={cn(
                                    "flex items-center justify-center w-6 h-6 rounded-full border mr-3 text-sm",
                                    answers[question.id] === option.id
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : option.id === question.answer
                                      ? "border-green-500"
                                      : ""
                                  )}
                                >
                                  {option.id.toUpperCase()}
                                </div>
                                <span>{option.text}</span>

                                {answers[question.id] === option.id &&
                                  question.answer === option.id && (
                                    <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                                  )}

                                {answers[question.id] === option.id &&
                                  question.answer !== option.id && (
                                    <AlertCircle className="ml-auto h-5 w-5 text-red-500" />
                                  )}

                                {option.id === question.answer &&
                                  answers[question.id] !== option.id && (
                                    <CheckCircle className="ml-auto h-5 w-5 text-green-500 opacity-50" />
                                  )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {!isAuthenticated && (
                    <Card className="bg-primary/5 border-dashed">
                      <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">
                            Want to access all questions?
                          </h3>
                          <p className="text-muted-foreground">
                            Log in to view all 7 questions and track your
                            progress.
                          </p>
                        </div>
                        <Button onClick={() => setShowAuthDialog(true)}>
                          <LogIn className="h-4 w-4 mr-2" />
                          Log In Now
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                // Question display
                <>
                  <ScrollArea className="h-full">
                    <div className="mb-8">
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>
                          {Object.keys(answers).length} of{" "}
                          {isAuthenticated
                            ? MOCK_QUESTIONS.length
                            : availableTokens}{" "}
                          questions answered
                        </span>
                        <span>{Math.round(progress)}% complete</span>
                      </div>
                    </div>

                    {currentQuestion < MOCK_QUESTIONS.length && (
                      <div>
                        <div className="flex items-center gap-2 mb-6">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-medium">
                            {currentQuestion + 1}
                          </div>
                          <h2 className="text-xl font-semibold">
                            {MOCK_QUESTIONS[currentQuestion].question}
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {MOCK_QUESTIONS[currentQuestion].imageUrl ? (
                            <div className="flex flex-col">
                              <div className="relative aspect-[5/3] rounded-lg overflow-hidden mb-4">
                                <Image
                                  src={
                                    MOCK_QUESTIONS[currentQuestion].imageUrl ||
                                    "/placeholder.svg"
                                  }
                                  alt={`Question ${currentQuestion + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>

                              <div className="flex gap-3 mt-auto">
                                {currentQuestion > 0 && (
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      handleSelectQuestion(currentQuestion - 1)
                                    }
                                    className="flex items-center"
                                  >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                  </Button>
                                )}

                                {currentQuestion <
                                  (isAuthenticated
                                    ? MOCK_QUESTIONS.length - 1
                                    : availableTokens - 1) && (
                                  <Button
                                    onClick={() =>
                                      handleSelectQuestion(currentQuestion + 1)
                                    }
                                    className="flex items-center ml-auto"
                                  >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col lg:col-span-2 mb-4">
                              <div className="flex gap-3 mb-4">
                                {currentQuestion > 0 && (
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      handleSelectQuestion(currentQuestion - 1)
                                    }
                                    className="flex items-center"
                                  >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                  </Button>
                                )}

                                {currentQuestion <
                                  (isAuthenticated
                                    ? MOCK_QUESTIONS.length - 1
                                    : availableTokens - 1) && (
                                  <Button
                                    onClick={() =>
                                      handleSelectQuestion(currentQuestion + 1)
                                    }
                                    className="flex items-center ml-auto"
                                  >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}

                          <div
                            className={cn(
                              "space-y-3",
                              !MOCK_QUESTIONS[currentQuestion].imageUrl &&
                                "lg:col-span-2"
                            )}
                          >
                            {MOCK_QUESTIONS[currentQuestion].options.map(
                              (option) => (
                                <div
                                  key={option.id}
                                  className={cn(
                                    "flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors",
                                    answers[
                                      MOCK_QUESTIONS[currentQuestion].id
                                    ] === option.id &&
                                      "border-2 border-primary bg-primary/5"
                                  )}
                                  onClick={() =>
                                    handleSelectAnswer(
                                      MOCK_QUESTIONS[currentQuestion].id,
                                      option.id
                                    )
                                  }
                                >
                                  <div
                                    className={cn(
                                      "flex items-center justify-center w-8 h-8 rounded-full border mr-3",
                                      answers[
                                        MOCK_QUESTIONS[currentQuestion].id
                                      ] === option.id &&
                                        "bg-primary text-primary-foreground border-primary"
                                    )}
                                  >
                                    {option.id.toUpperCase()}
                                  </div>
                                  <span>{option.text}</span>

                                  {answers[
                                    MOCK_QUESTIONS[currentQuestion].id
                                  ] === option.id && (
                                    <CheckCircle className="ml-auto h-5 w-5 text-primary" />
                                  )}
                                </div>
                              )
                            )}

                            {!isAuthenticated &&
                              currentQuestion === availableTokens - 1 && (
                                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-dashed">
                                  <p className="text-sm font-medium">
                                    This is your last free question
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Log in to access all {MOCK_QUESTIONS.length}{" "}
                                    questions
                                  </p>
                                  <Button
                                    className="mt-3"
                                    size="sm"
                                    onClick={() => setShowAuthDialog(true)}
                                  >
                                    <LogIn className="h-4 w-4 mr-2" />
                                    Log In Now
                                  </Button>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                  </ScrollArea>

                  <Separator className="my-8" />

                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setShowPreview(true)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Review Answers
                    </Button>

                    <Button onClick={handleSubmit} className="gap-2">
                      Submit Quiz
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </main>
        </ScrollArea>
      </div>

      {/* Auth Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log in to continue</DialogTitle>
            <DialogDescription>
              {!isAuthenticated &&
              Object.keys(answers).length >= availableTokens
                ? "You've used all your free trial tokens. Log in or create an account to access all quiz questions."
                : "Log in to unlock all quiz questions and save your progress."}
            </DialogDescription>
          </DialogHeader>

          <LoginForm onLogin={handleLogin} />

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
              Continue with Limited Access
            </Button>
            <Button
              variant="default"
              onClick={handleLogin}
              className="sm:ml-auto"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Log In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
