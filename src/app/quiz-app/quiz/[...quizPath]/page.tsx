
"use client";

import type React from "react";

import { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
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
  CardDescription,
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
  MessageCircleQuestion,
  Home,
  Clock,
  AlertTriangle,
  Shield,
  HelpCircle,
} from "lucide-react";
import Loading from "@/loading/Loading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { explainQuestion } from "@/ai/flows/expline-questions";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExplanationPanel } from "@/components/explanation/explanation-panel";

// DRM Service
const DRMService = {
  triggerBlur: (
    reason: string,
    setIsBlurActive: React.Dispatch<React.SetStateAction<boolean>>,
    setWatermarkText: React.Dispatch<React.SetStateAction<string>>,
    blurTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
  ) => {
    console.log(`[DRM] Blur triggered: ${reason}`);
    setIsBlurActive(true);
    setWatermarkText(
      `🔒 Confidential — Screenshot Blocked (${new Date().toISOString()})`
    );
    toast.error("Security alert: Screenshot or copy attempt detected", {
      icon: "🔒",
      duration: 4000,
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    blurTimeoutRef.current = setTimeout(() => {
      setIsBlurActive(false);
      setWatermarkText("Confidential — Do Not Share");
      console.log("[DRM] Blur removed");
    }, 5000);
  },
};


interface QuestionImage {
  id: number;
  image: string;
  image_url: string | null;
}

interface Question {
  id: number;
  text: string;
  questions_file_title: string;
  subject_category_name: string;
  images?: QuestionImage[];
}

interface Choice {
  id: number;
  text: string;
}

export default function QuizPage() {
  const [isBlurActive, setIsBlurActive] = useState(false);
  const [watermarkText, setWatermarkText] = useState(
    "Confidential — Do Not Share"
  );
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Explanation state
  const [explanationContent, setExplanationContent] = useState<string | null>(
    null
  );
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);
  const [currentQuestionForExplanation, setCurrentQuestionForExplanation] =
    useState<Question | null>(null);
  const [explanationOpen, setExplanationOpen] = useState(false);

  // DRM logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isScreenshotAttempt =
        e.key === "PrintScreen" ||
        (e.metaKey && e.key === "PrintScreen") ||
        (e.altKey && e.key === "PrintScreen") ||
        (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4")) ||
        (e.metaKey && e.shiftKey && e.key === "s") ||
        (e.ctrlKey && e.key === "p") ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") ||
        e.key === "F12";

      if (isScreenshotAttempt) {
        e.preventDefault();
        DRMService.triggerBlur(
          "Screenshot shortcut",
          setIsBlurActive,
          setWatermarkText,
          blurTimeoutRef
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.types.includes("image/png")) {
        e.preventDefault();
        DRMService.triggerBlur(
          "Clipboard image",
          setIsBlurActive,
          setWatermarkText,
          blurTimeoutRef
        );
        if (navigator.clipboard) {
          navigator.clipboard
            .writeText("Screenshots are disabled.")
            .catch((err) => {
              console.error("[DRM] Clipboard write failed:", err);
            });
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  useEffect(() => {
    const checkDevTools = () => {
      const threshold = 160;
      const devtoolsOpen =
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold;
      if (devtoolsOpen) {
        DRMService.triggerBlur(
          "DevTools",
          setIsBlurActive,
          setWatermarkText,
          blurTimeoutRef
        );
      }
    };

    const interval = setInterval(checkDevTools, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const preventContextMenu = (e: Event) => e.preventDefault();
    const preventDrag = (e: Event) => e.preventDefault();

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("dragstart", preventDrag);
    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("dragstart", preventDrag);
    };
  }, []);

  const { quizPath } = useParams() as { quizPath: string[] };
  const router = useRouter();

  const quizFile = quizPath[quizPath.length - 1];
  const categoryPath = quizPath.slice(0, -1).join("/");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState<
    Record<number, number>
  >({});
  const [activeTab, setActiveTab] = useState<string>("questions");
  const [highlightedQuestionId, setHighlightedQuestionId] = useState<
    number | null
  >(null);

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
  const totalPages = Math.ceil(totalCount / pageSize);
  const answeredCount = Object.keys(selectedChoices).length;
  const progressPercentage =
    totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

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

    // Add a toast notification when navigating to a question
    toast.success(`Navigated to question ${questionIndex + 1}`, {
      duration: 2000,
      position: "bottom-center",
      icon: "🔍",
    });
  };

  const handleChoiceSelect = (questionId: number, choiceId: number) => {
    setSelectedChoices((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));

    // Show a subtle toast when an answer is selected
    toast.success("Answer saved", {
      duration: 1500,
      position: "bottom-right",
      icon: "✓",
      style: {
        background: "#10b981",
        color: "#fff",
        borderRadius: "8px",
      },
    });
  };

  // Handle AI explanation request
  const handleExplainRequest = async (question: Question) => {
    if (!question) return;

    setCurrentQuestionForExplanation(question);
    setExplanationOpen(true);
    setIsExplanationLoading(true);
    setExplanationContent(null);

    const loadingToast = toast.loading("Generating explanation...", {
      position: "bottom-center",
    });

    try {
      const result = await explainQuestion({ question: question.text });
      setExplanationContent(result.explanation);
      toast.success("Explanation ready!", {
        id: loadingToast,
        duration: 2000,
        icon: "🧠",
      });
    } catch (error: any) {
      setExplanationContent(
        "Sorry, I couldn't get an explanation for this question."
      );
      toast.error("Failed to get explanation", {
        id: loadingToast,
        duration: 3000,
      });
      console.error("Error explaining question:", error);
    } finally {
      setIsExplanationLoading(false);
    }
  };

  const [submitQuiz, { isLoading: submitLoading }] = useSubmitQuizMutation();

  const handleSubmitQuiz = async () => {
    if (Object.keys(selectedChoices).length === 0) {
      toast.error("Please answer at least one question before submitting", {
        duration: 3000,
        icon: "⚠️",
      });
      return;
    }

    const choices = Object.fromEntries(Object.entries(selectedChoices));
    const payload = {
      categoryPath,
      questionsFile: quizFile,
      choices,
      is_submitted: true,
    };

    const loadingToast = toast.loading("Submitting your quiz...", {
      position: "bottom-center",
    });

    try {
      const result = await submitQuiz(payload).unwrap();
      const quizId = uuidv4();

      toast.success(`Quiz submitted! You scored ${result.points} points.`, {
        id: loadingToast,
        duration: 4000,
        icon: "🎉",
      });

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

      router.push(`/quiz-app/results/${quizId}/${categoryPath}/${quizFile}`);
    } catch (err) {
      console.error("[Quiz] Submission failed:", err);
      toast.error("Submission failed. Please try again.", {
        id: loadingToast,
        duration: 3000,
      });
    }
  };

  if (allLoading || qLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (allError || qError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 p-8">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Error Loading Quiz</h2>
        <p className="text-center text-muted-foreground">
          {(allError as Error)?.message ||
            (qError as Error)?.message ||
            "Failed to load quiz data"}
        </p>
        <Button onClick={() => router.push("/quiz-app")} className="mt-4">
          <Home className="mr-2 h-4 w-4" /> Return to Quiz Home
        </Button>
      </div>
    );
  }

  const ExplanationContainer = isDesktop ? Sheet : Drawer;
  const ExplanationContainerContent = isDesktop ? SheetContent : DrawerContent;
 

  return (
    <div
      className="relative min-h-screen bg-gradient-to-b from-background to-background/95 pb-20"
      style={{
        filter: isBlurActive ? "blur(10px)" : "none",
        pointerEvents: isBlurActive ? "none" : "auto",
        userSelect: isBlurActive ? "none" : "auto",
      }}
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          className: "shadow-lg",
          style: {
            borderRadius: "8px",
            background: "#fff",
            color: "#333",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: "12px 16px",
          },
        }}
      />

      <style jsx>{`
        .watermark {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          font-size: 36px;
          font-weight: bold;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
          z-index: 1000;
          pointer-events: none;
        }

        .quiz-container {
          background-image: radial-gradient(
            circle at 1px 1px,
            rgba(0, 0, 0, 0.05) 1px,
            transparent 0
          );
          background-size: 40px 40px;
        }
      `}</style>

      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/quiz-app"
                  className="flex items-center gap-1 text-primary hover:text-primary/80"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Quizzes</span>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {quizPath.slice(0, -1).map((segment, index) => (
                <div key={index} className="flex items-center">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={`/quiz-app/category/${quizPath
                        .slice(0, index + 1)
                        .join("/")}`}
                      className="max-w-[100px] truncate sm:max-w-none hover:text-primary"
                    >
                      {segment}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </div>
              ))}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-[120px] truncate font-medium sm:max-w-none">
                  {quizFile}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="hidden gap-1 md:flex">
                    <Shield className="h-3.5 w-3.5" />
                    <span className="text-xs">Protected</span>
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    This content is protected against copying and screenshots
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="default"
              size="sm"
              onClick={handleSubmitQuiz}
              disabled={
                submitLoading || Object.keys(selectedChoices).length === 0
              }
              className="gap-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-200 hover:shadow-md"
            >
              {submitLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">Submit Quiz</span>
              <span className="inline sm:hidden">Submit</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-6 quiz-container">
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <h1 className="text-2xl font-bold sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {quizFile}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-1.5 bg-secondary/50 hover:bg-secondary/70 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                {totalCount} Questions
              </Badge>
              <Badge
                variant="secondary"
                className="flex items-center gap-1.5 bg-secondary/50 hover:bg-secondary/70 transition-colors"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {answeredCount} Answered
              </Badge>
              <Badge
                variant="secondary"
                className="flex items-center gap-1.5 bg-secondary/50 hover:bg-secondary/70 transition-colors"
              >
                <Clock className="h-3.5 w-3.5" />
                No time limit
              </Badge>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2.5 rounded-full overflow-hidden"
              indicatorClassName="bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:hidden">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 p-1 rounded-xl bg-muted/80">
                <TabsTrigger
                  value="questions"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <MessageCircleQuestion className="h-4 w-4" />
                  Questions
                </TabsTrigger>
                <TabsTrigger
                  value="navigation"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <BookOpen className="h-4 w-4" />
                  Navigator
                </TabsTrigger>
              </TabsList>

              <TabsContent value="navigation" className="mt-4">
                <QuestionNavigator
                  groupedQuestions={groupedQuestions}
                  selectedChoices={selectedChoices}
                  highlightedQuestionId={highlightedQuestionId}
                  allQuestions={allQuestions}
                  handleQuestionClick={handleQuestionClick}
                />
              </TabsContent>

              <TabsContent value="questions" className="mt-4">
                <QuestionsContent
                  questions={questions}
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
                  onExplainRequest={handleExplainRequest}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-[5.5rem]">
              <QuestionNavigator
                groupedQuestions={groupedQuestions}
                selectedChoices={selectedChoices}
                highlightedQuestionId={highlightedQuestionId}
                allQuestions={allQuestions}
                handleQuestionClick={handleQuestionClick}
              />
            </div>
          </div>

          <div className="hidden lg:col-span-3 lg:block select-none">
            <QuestionsContent
              questions={questions}
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
              onExplainRequest={handleExplainRequest}
            />
          </div>
        </div>
      </div>

      {isBlurActive && <div className="watermark">{watermarkText}</div>}

      <ExplanationContainer
        open={explanationOpen}
        onOpenChange={setExplanationOpen}
      >
        <ExplanationContainerContent
          side={isDesktop ? "right" : undefined}
          className="sm:max-w-md"
        >
          <ExplanationPanel
            content={explanationContent}
            isLoading={isExplanationLoading}
            questionTitle={currentQuestionForExplanation?.text ?? ""}
            onClose={() => setExplanationOpen(false)}
            questionId={currentQuestionForExplanation?.id}
          />
        </ExplanationContainerContent>
      </ExplanationContainer>
    </div>
  );
}

interface QuestionNavigatorProps {
  groupedQuestions: Record<string, Question[]>;
  selectedChoices: Record<number, number>;
  highlightedQuestionId: number | null;
  allQuestions: Question[];
  handleQuestionClick: (questionId: number) => void;
}

function QuestionNavigator({
  groupedQuestions,
  selectedChoices,
  highlightedQuestionId,
  allQuestions,
  handleQuestionClick,
}: QuestionNavigatorProps) {
  return (
    <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3 bg-muted/30">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Question Navigator
        </CardTitle>
        <CardDescription>
          Jump to any question or track your progress
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4">
        <ScrollArea className="h-[calc(100vh-20rem)]">
          {Object.entries(groupedQuestions).map(([subject, qs]) => (
            <div key={subject} className="mb-6 px-2">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-medium text-sm">{subject}</h4>
                <Badge variant="outline" className="text-xs bg-background">
                  {qs.filter((q) => q.id in selectedChoices).length}/{qs.length}
                </Badge>
              </div>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
                {qs.map((q) => {
                  const questionIndex = allQuestions.indexOf(q);
                  const isAnswered = q.id in selectedChoices;
                  const isHighlighted = q.id === highlightedQuestionId;

                  return (
                    <TooltipProvider key={q.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={
                              isHighlighted
                                ? "default"
                                : isAnswered
                                ? "outline"
                                : "secondary"
                            }
                            size="sm"
                            className={`h-9 w-9 p-0 rounded-lg transition-all duration-200 ${
                              isAnswered && !isHighlighted
                                ? "border-primary"
                                : ""
                            } ${
                              isHighlighted
                                ? "ring-2 ring-primary ring-offset-2"
                                : ""
                            }`}
                            onClick={() => handleQuestionClick(q.id)}
                          >
                            {questionIndex + 1}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          align="center"
                          className="text-xs"
                        >
                          <p>
                            Question {questionIndex + 1}
                            {isAnswered ? " (Answered)" : " (Unanswered)"}
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
    </Card>
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
  onExplainRequest: (question: Question) => void;
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
  onExplainRequest,
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

  useEffect(() => {
    const allImageWrappers = document.querySelectorAll(".image-wrapper");
    allImageWrappers.forEach((wrapper) => {
      wrapper.oncontextmenu = (e) => e.preventDefault();
      wrapper.ondragstart = (e) => e.preventDefault();
    });
  }, [questions]);

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {questions.map((question, index) => {
          const questionNumber = (currentPage - 1) * 5 + index + 1;
          const isHighlighted = question.id === highlightedQuestionId;
          const isAnswered = question.id in selectedChoices;

          return (
            <Card
              key={question.id}
              ref={(el) => (questionRefs.current[index] = el)}
              className={`transition-all duration-300 hover:shadow-md ${
                isHighlighted
                  ? "border-primary/70 bg-primary/5 shadow-md"
                  : isAnswered
                  ? "border-primary/20 bg-muted/20"
                  : "hover:border-muted-foreground/20"
              }`}
              id={`question-${question.id}`}
            >
              <CardHeader className="pb-3 relative">
                <div className="absolute -left-1 top-4 h-8 w-2 bg-primary rounded-r-full opacity-70"></div>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1.5 pl-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="font-medium bg-background"
                      >
                        Question {questionNumber}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="font-normal bg-secondary/50"
                      >
                        {question.subject_category_name}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl leading-tight">
                      {question.text}
                    </CardTitle>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onExplainRequest(question)}
                          aria-label="Explain question with AI"
                          className="select-none h-8 w-8 rounded-full flex-shrink-0 text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                        >
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="text-xs">
                          Get AI explanation for this question
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {question.images && question.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-4">
                    {question.images.map((image, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <div className="image-wrapper overflow-hidden rounded-md border shadow-sm hover:shadow-md transition-all duration-200">
                          <Image
                            src={image.image || "/placeholder.svg"}
                            alt={`Image ${
                              imgIndex + 1
                            } for question ${questionNumber}`}
                            width={400}
                            height={300}
                            className="object-contain select-none pointer-events-none"
                            loading="lazy"
                            onError={(e) => {
                              console.error(
                                `Failed to load image ${
                                  imgIndex + 1
                                } for question ${question.id}`
                              );
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

              <Separator className="bg-muted/50" />
            </Card>
          );
        })}
      </div>

      <Card className="border shadow-sm hover:shadow-md transition-all duration-300">
        <CardFooter className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || submitLoading}
              className="gap-1 hover:bg-muted/50 transition-colors"
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
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages || submitLoading}
              className="gap-1 hover:bg-muted/50 transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="default"
            onClick={onSubmit}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all duration-200 hover:shadow-md"
            disabled={
              submitLoading || Object.keys(selectedChoices).length === 0
            }
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
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading choices...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-center">
        <p className="mb-2 text-sm text-destructive">Error loading choices</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="text-xs"
        >
          Try Again
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
          className={`flex items-start space-x-2 rounded-md border p-3 transition-all hover:bg-accent ${
            selectedChoice === choice.id ? "border-primary bg-primary/5" : ""
          }`}
        >
          <RadioGroupItem
            value={choice.id.toString()}
            id={`choice-${questionId}-${choice.id}`}
            className="mt-0.5"
          />
          <Label
            htmlFor={`choice-${questionId}-${choice.id}`}
            className="w-full cursor-pointer leading-normal"
          >
            {choice.text}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
