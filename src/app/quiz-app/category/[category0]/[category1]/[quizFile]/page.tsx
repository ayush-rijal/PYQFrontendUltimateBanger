"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetAllQuestionsQuery,
  useGetQuestionsQuery,
  useGetChoicesQuery,
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

interface Question {
  id: number;
  text: string;
  questions_file_title: string;
  subject_category_name: string;
}

interface Choice {
  id: number;
  text: string;
}

export default function QuizPage() {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChoices, setSelectedChoices] = useState<
    Record<number, number>
  >({});
  const [activeTab, setActiveTab] = useState<string>("questions");

  const {
    data: allQuestions = [],
    isLoading: allLoading,
    error: allError,
  } = useGetAllQuestionsQuery({
    category0,
    category1,
    quizFile,
  });

  const {
    data: questionsData,
    isLoading: qLoading,
    error: qError,
  } = useGetQuestionsQuery({
    category0,
    category1,
    quizFile,
    page: currentPage,
  });

  const questions = questionsData?.results || [];
  const totalCount = questionsData?.count || 0;
  const pageSize = 5;
  const totalPages = Math.ceil(totalCount / pageSize);

  const answeredCount = Object.keys(selectedChoices).length;
  const progressPercentage =
    totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  const groupedQuestions = allQuestions.reduce((acc, q) => {
    const subject = q.subject_category_name;
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  const handleQuestionClick = (questionId: number) => {
    const questionIndex = allQuestions.findIndex((q) => q.id === questionId);
    const page = Math.floor(questionIndex / pageSize) + 1;
    setCurrentPage(page);
    setActiveTab("questions");
  };

  const handleChoiceSelect = (questionId: number, choiceId: number) => {
    setSelectedChoices((prev) => ({
      ...prev,
      [questionId]: choiceId,
    }));
  };

  const handleSubmitQuiz = () => {
    const quizId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    router.push(
      `/quiz-app/category/${category0}/${category1}/${quizFile}/results/${quizId}?choices=${encodeURIComponent(
        JSON.stringify(selectedChoices)
      )}`
    );
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

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <header className="mb-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {quizFile}
            </h1>
            <p className="text-muted-foreground">
              {category0} / {category1}
            </p>
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
                  <ScrollArea className="h-[60vh]">
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
                                questions.some((pq) => pq.id === q.id)
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
                questions={questions}
                category0={category0}
                category1={category1}
                quizFile={quizFile}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                selectedChoices={selectedChoices}
                handleChoiceSelect={handleChoiceSelect}
                onSubmit={handleSubmitQuiz}
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
              <ScrollArea className="">
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
                            questions.some((pq) => pq.id === q.id)
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
            questions={questions}
            category0={category0}
            category1={category1}
            quizFile={quizFile}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            selectedChoices={selectedChoices}
            handleChoiceSelect={handleChoiceSelect}
            onSubmit={handleSubmitQuiz}
          />
        </div>
      </div>
    </div>
  );
}

function QuestionsContent({
  questions,
  category0,
  category1,
  quizFile,
  currentPage,
  totalPages,
  setCurrentPage,
  selectedChoices,
  handleChoiceSelect,
  onSubmit,
}: {
  questions: Question[];
  category0: string;
  category1: string;
  quizFile: string;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  selectedChoices: Record<number, number>;
  handleChoiceSelect: (questionId: number, choiceId: number) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-6 ">
      {questions.map((question, index) => (
        <Card key={question.id} className="transition-all hover:shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="mb-2">
                Question {index + 1}
              </Badge>
              <Badge variant="outline" className="mb-2">
                {question.subject_category_name}
              </Badge>
            </div>
            <CardTitle className="text-xl">{question.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <Choices
              category0={category0}
              category1={category1}
              quizFile={quizFile}
              questionId={question.id}
              selectedChoice={selectedChoices[question.id]}
              onChoiceSelect={handleChoiceSelect}
            />
          </CardContent>
          <Separator />
        </Card>
      ))}

      <Card>
        <CardFooter className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
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
              disabled={currentPage === totalPages}
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
          >
            <Send className="mr-2 h-4 w-4" />
            Submit Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function Choices({
  category0,
  category1,
  quizFile,
  questionId,
  selectedChoice,
  onChoiceSelect,
}: {
  category0: string;
  category1: string;
  quizFile: string;
  questionId: number;
  selectedChoice?: number;
  onChoiceSelect: (questionId: number, choiceId: number) => void;
}) {
  const {
    data: choices = [],
    isLoading,
    error,
  } = useGetChoicesQuery({ category0, category1, quizFile, questionId });

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
