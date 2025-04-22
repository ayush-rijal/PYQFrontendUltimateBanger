import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGetChoicesQuery } from "@/redux/features/quizApiSlice"
import { Loader } from "@/components/ui/loader"
import type { Question, Choice } from "@/components/types/quiz"

interface QuestionResultViewProps {
  allQuestions: Question[]
  responsesMap: Record<number, number>
  categoryPath: string
  quizFile: string
  showAllQuestions: boolean
  selectedQuestionId: number | null
}

export function QuestionResultView({
  allQuestions,
  responsesMap,
  categoryPath,
  quizFile,
  showAllQuestions,
  selectedQuestionId,
}: QuestionResultViewProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Your Answers</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[100vh] pr-4">
          <div className="space-y-6">
            {showAllQuestions ? (
              allQuestions.map((question: Question) => (
                <QuestionResult
                  key={question.id}
                  question={question}
                  selectedChoiceId={responsesMap[question.id]}
                  categoryPath={categoryPath}
                  quizFile={quizFile}
                />
              ))
            ) : selectedQuestionId ? (
              <QuestionResult
                question={allQuestions.find((q) => q.id === selectedQuestionId)!}
                selectedChoiceId={responsesMap[selectedQuestionId]}
                categoryPath={categoryPath}
                quizFile={quizFile}
              />
            ) : null}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Individual Question Result Component
interface QuestionResultProps {
  question: Question
  selectedChoiceId?: number
  categoryPath: string
  quizFile: string
}

function QuestionResult({ question, selectedChoiceId, categoryPath, quizFile }: QuestionResultProps) {
  const {
    data: choices = [],
    isLoading,
    error,
  } = useGetChoicesQuery({
    categoryPath,
    questionsFile: quizFile,
    questionId: question.id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader />
      </div>
    )
  }

  if (error) {
    return <div className="rounded-md bg-destructive/10 p-4 text-center text-destructive">Error loading choices</div>
  }

  const selectedChoice = choices.find((c: Choice) => c.id === selectedChoiceId)
  const correctChoice = choices.find((c: Choice) => c.is_correct)
  const isCorrect = selectedChoiceId === correctChoice?.id

  const cardClass = isCorrect
    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
    : selectedChoiceId
      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
      : "border-muted"

  return (
    <Card className={`transition-all ${cardClass}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{question.subject_category_name}</Badge>
          {isCorrect ? (
            <span className="text-green-600 dark:text-green-400">Correct</span>
          ) : selectedChoiceId ? (
            <span className="text-red-600 dark:text-red-400">Incorrect</span>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              <span className="text-muted-foreground text-sm">Not Answered</span>
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">{question.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Your Answer:</strong> {selectedChoice?.text || "Not answered"}
          </p>
          <p>
            <strong>Correct Answer:</strong> {correctChoice?.text || "N/A"}
          </p>
          {!isCorrect && selectedChoiceId && (
            <p className="text-sm text-muted-foreground">You selected an incorrect option.</p>
          )}
        </div>
      </CardContent>
      <Separator />
    </Card>
  )
}
