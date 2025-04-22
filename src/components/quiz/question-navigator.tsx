"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { List, CheckCircle, XCircle } from "lucide-react"
import { useGetChoicesQuery } from "@/redux/features/quizApiSlice"
import type { Question, Choice } from "@/components/types/quiz"
import { cn } from "@/lib/utils"

interface QuestionNavigatorProps {
  allQuestions: Question[]
  responsesMap: Record<number, number>
  categoryPath: string
  quizFile: string
  selectedQuestionId: number | null
  onQuestionClick: (questionId: number) => void
}

export function QuestionNavigator({
  allQuestions,
  responsesMap,
  categoryPath,
  quizFile,
  selectedQuestionId,
  onQuestionClick,
}: QuestionNavigatorProps) {
  // Get choices for all questions
  const choicesQueries = allQuestions.map((question) =>
    useGetChoicesQuery({
      categoryPath,
      questionsFile: quizFile,
      questionId: question.id,
    }),
  )

  // Create a map of choices for each question
  const choicesMap = useMemo(() => {
    const map: Record<number, Choice[]> = {}
    allQuestions.forEach((question, index) => {
      const { data: choices = [] } = choicesQueries[index] || {}
      map[question.id] = choices || []
    })
    return map
  }, [allQuestions, choicesQueries])

  // Group questions by subject
  const groupedQuestions = useMemo(() => {
    const grouped: Record<string, Question[]> = {}
    allQuestions.forEach((question) => {
      const subject = question.subject_category_name
      if (!grouped[subject]) {
        grouped[subject] = []
      }
      grouped[subject].push(question)
    })
    return grouped
  }, [allQuestions])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <List className="mr-2 h-5 w-5 text-primary" />
          Question Navigator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[100vh] pr-4">
          {Object.entries(groupedQuestions).map(([subject, questions]) => (
            <div key={subject} className="mb-6">
              <h4 className="mb-3 font-medium flex items-center">
                <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                {subject} <span className="text-muted-foreground ml-1">({questions.length})</span>
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {questions.map((question) => {
                  const selectedChoiceId = responsesMap[question.id]
                  const choices = choicesMap[question.id] || []
                  const correctChoice = choices.find((c) => c.is_correct)
                  const isCorrect = selectedChoiceId === correctChoice?.id
                  const isSelected = question.id === selectedQuestionId
                  const isAnswered = selectedChoiceId !== undefined

                  return (
                    <Button
                      key={question.id}
                      variant={isSelected ? "default" : isAnswered ? "outline" : "secondary"}
                      size="sm"
                      className={cn(
                        "h-10 w-10 p-0 rounded-full transition-all",
                        isSelected && "shadow-md",
                        isCorrect && "border-green-500",
                        selectedChoiceId && !isCorrect && "border-red-500",
                      )}
                      onClick={() => onQuestionClick(question.id)}
                    >
                      {allQuestions.indexOf(question) + 1}
                      {isCorrect ? (
                        <CheckCircle className="ml-1 h-3 w-3 text-green-500" />
                      ) : selectedChoiceId && !isCorrect ? (
                        <XCircle className="ml-1 h-3 w-3 text-red-500" />
                      ) : null}
                    </Button>
                  )
                })}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
