"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { Loader } from "@/components/ui/loader"
import React from "react"

interface QuizHeaderProps {
  categoryPath: string
  quizFile: string
  score: number
  totalQuestions: number
  percentage: number
  resultTimer: number
  onRetryQuiz: () => void
  onGetAiFeedback: () => void
  loadingAiFeedback: boolean
  aiFeedback: string | null
}

export function QuizHeader({
  categoryPath,
  quizFile,
  score,
  totalQuestions,
  percentage,
  resultTimer,
  onRetryQuiz,
  onGetAiFeedback,
  loadingAiFeedback,
  aiFeedback,
}: QuizHeaderProps) {
  const categorySegments = categoryPath.split("/")

  // Format timer as MM:SS
  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <header className="mb-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/quiz-app">Quiz App</BreadcrumbLink>
          </BreadcrumbItem>
          {categorySegments.map((segment, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/quiz-app/category/${categorySegments.slice(0, index + 1).join("/")}`}>
                  {segment}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{quizFile}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Button variant="outline" onClick={onRetryQuiz} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Quiz
      </Button>

      <div className="text-center">
        <div className="mt-4 flex flex-col items-center gap-4">
          <Badge variant="secondary" className="text-lg py-2 px-4">
            Your Total Score: {score}/{totalQuestions} ({Math.round(percentage)}%)
          </Badge>

          <div className="text-sm text-muted-foreground">Completed on {new Date().toLocaleDateString()}</div>

          <div className="text-sm text-muted-foreground">Time Remaining: {formatTimer(resultTimer)}</div>

          <Button onClick={onGetAiFeedback} disabled={loadingAiFeedback} variant="outline" className="mt-4">
            {loadingAiFeedback ? <Loader size="sm" /> : "Get AI Feedback"}
          </Button>

          {aiFeedback && <AiFeedback feedback={aiFeedback} />}
        </div>
      </div>
    </header>
  )
}

// AI Feedback Component
interface AiFeedbackProps {
  feedback: string
}

function AiFeedback({ feedback }: AiFeedbackProps) {
  return (
    <Card className="mt-4 w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">AI Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{feedback}</p>
      </CardContent>
    </Card>
  )
}
