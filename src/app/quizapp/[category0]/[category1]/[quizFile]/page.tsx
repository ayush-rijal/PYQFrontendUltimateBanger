"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useQuestions, useChoices } from "@/hooks/use-api"
import { ErrorMessage } from "@/components/ui/error-message"
import { Skeleton } from "@/components/ui/skeleton"
import type { Question } from "@/lib/api"

export default function QuizPage({
  params,
}: {
  params: { category0: string; category1: string; quizFile: string }
}) {
  const { category0, category1, quizFile } = params
  const decodedQuizFile = decodeURIComponent(quizFile)

  const {
    data: questionsData,
    isLoading: questionsLoading,
    error: questionsError,
    refetch: refetchQuestions,
  } = useQuestions(category0, category1, decodedQuizFile)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedChoices, setSelectedChoices] = useState<Record<number, number>>({})
  const [subjectCategories, setSubjectCategories] = useState<string[]>([])
  const [activeSubject, setActiveSubject] = useState<string>("all")

  const currentQuestion = questions[currentQuestionIndex]

  const {
    data: choices,
    isLoading: choicesLoading,
    error: choicesError,
    refetch: refetchChoices,
  } = useChoices(category0, category1, decodedQuizFile, currentQuestion?.id || 0)

  // Process questions data when it arrives
  useEffect(() => {
    if (questionsData?.results) {
      setQuestions(questionsData.results)

      // Extract unique subject categories
      const subjects = [...new Set(questionsData.results.map((q) => q.subject_category_name))]
      setSubjectCategories(subjects)
    }
  }, [questionsData])

  const handleQuestionChange = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  const handleChoiceSelect = (choiceId: number) => {
    setSelectedChoices({
      ...selectedChoices,
      [questions[currentQuestionIndex].id]: choiceId,
    })
  }

  const handleSubjectChange = (subject: string) => {
    setActiveSubject(subject)

    // If filtering by subject, set current question to first question of that subject
    if (subject !== "all") {
      const firstQuestionIndex = questions.findIndex((q) => q.subject_category_name === subject)

      if (firstQuestionIndex !== -1) {
        handleQuestionChange(firstQuestionIndex)
      }
    } else {
      // If showing all, stay on current question
      handleQuestionChange(currentQuestionIndex)
    }
  }

  const filteredQuestions =
    activeSubject === "all" ? questions : questions.filter((q) => q.subject_category_name === activeSubject)

  if (questionsLoading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <div className="bg-card rounded-lg p-4 shadow">
              <div className="mb-4">
                <Link href={`/category/${category0}/${category1}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    ← Back to Quiz Files
                  </Button>
                </Link>
              </div>
              <h3 className="text-lg font-medium mb-2">Subject Categories</h3>
              <Skeleton className="h-10 w-full mb-6" />
              <h3 className="text-lg font-medium mb-2">Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 15 }).map((_, i) => (
                  <Skeleton key={i} className="w-10 h-10 rounded-full" />
                ))}
              </div>
            </div>
          </div>
          <div className="w-full md:w-3/4">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-3/4 mt-2" />
              </CardHeader>
              <CardContent>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2 mb-4 p-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (questionsError) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="mb-6">
          <Link href={`/category/${category0}/${category1}`}>
            <Button variant="outline">← Back to Quiz Files</Button>
          </Link>
        </div>
        <ErrorMessage
          message={`Failed to load questions for this quiz. Please try again.`}
          onRetry={refetchQuestions}
        />
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <p>No questions found for this quiz.</p>
        <Link href={`/category/${category0}/${category1}`}>
          <Button className="mt-4">Back to Quiz Files</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Navigation sidebar */}
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <div className="bg-card rounded-lg p-4 shadow">
            <div className="mb-4">
              <Link href={`/category/${category0}/${category1}`}>
                <Button variant="outline" size="sm" className="w-full">
                  ← Back to Quiz Files
                </Button>
              </Link>
            </div>

            <h3 className="text-lg font-medium mb-2">Subject Categories</h3>
            <Tabs value={activeSubject} onValueChange={handleSubjectChange} className="mb-6">
              <TabsList className="w-full flex flex-wrap">
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
                {subjectCategories.map((subject) => (
                  <TabsTrigger key={subject} value={subject} className="flex-1">
                    {subject}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <h3 className="text-lg font-medium mb-2">Questions</h3>
            <div className="grid grid-cols-5 gap-2">
              {filteredQuestions.map((question, index) => {
                const questionIndex = questions.findIndex((q) => q.id === question.id)
                const isActive = currentQuestionIndex === questionIndex
                const isAnswered = selectedChoices[question.id] !== undefined

                return (
                  <button
                    key={question.id}
                    onClick={() => handleQuestionChange(questionIndex)}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isAnswered
                          ? "bg-green-100 text-green-800 border border-green-500"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    )}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Question and choices */}
        <div className="w-full md:w-3/4">
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <Badge variant="outline">{currentQuestion.subject_category_name}</Badge>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
            </CardHeader>

            <CardContent>
              {choicesLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-2 mb-4 p-3">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))
              ) : choicesError ? (
                <ErrorMessage message="Failed to load choices for this question." onRetry={refetchChoices} />
              ) : (
                <RadioGroup
                  value={selectedChoices[currentQuestion.id]?.toString()}
                  onValueChange={(value) => handleChoiceSelect(Number.parseInt(value))}
                >
                  {choices?.map((choice) => (
                    <div
                      key={choice.id}
                      className="flex items-center space-x-2 mb-4 p-3 rounded-md hover:bg-secondary/50"
                    >
                      <RadioGroupItem value={choice.id.toString()} id={`choice-${choice.id}`} />
                      <Label htmlFor={`choice-${choice.id}`} className="flex-1 cursor-pointer">
                        {choice.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => handleQuestionChange(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                onClick={() => handleQuestionChange(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

