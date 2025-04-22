"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useGetChoicesQuery } from "@/redux/features/quizApiSlice"
import type { Question, ChartData, Choice } from "@/components/types/quiz"
import { chartConfig } from "@/components/types/quiz"

interface PerformanceAnalysisProps {
  allQuestions: Question[]
  responsesMap: Record<number, number>
  categoryPath: string
  quizFile: string
}

export function PerformanceAnalysis({ allQuestions, responsesMap, categoryPath, quizFile }: PerformanceAnalysisProps) {
  const [viewMode, setViewMode] = useState("all")

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
      map[question.id] = choices
    })
    return map
  }, [allQuestions, choicesQueries])

  // Generate chart data
  const chartData: ChartData[] = useMemo(() => {
    if (!allQuestions.length || !Object.keys(responsesMap).length) return []

    const subjectStats = allQuestions.reduce(
      (acc, question) => {
        const subject = question.subject_category_name
        if (!acc[subject]) {
          acc[subject] = { correct: 0, incorrect: 0, total: 0 }
        }

        acc[subject].total += 1
        const selectedChoiceId = responsesMap[question.id]
        const choices = choicesMap[question.id] || []
        const correctChoice = choices.find((c) => c.is_correct)

        const isCorrect = selectedChoiceId && correctChoice && selectedChoiceId === correctChoice.id

        if (isCorrect) {
          acc[subject].correct += 1
        } else if (selectedChoiceId) {
          acc[subject].incorrect += 1
        }

        return acc
      },
      {} as Record<string, { correct: number; incorrect: number; total: number }>,
    )

    return Object.entries(subjectStats).map(([subject, stats]) => ({
      subject,
      correct: stats.correct,
      incorrect: stats.incorrect,
    }))
  }, [allQuestions, responsesMap, choicesMap])

  // Filter data based on selected view mode
  const filteredData = chartData.filter((item) => (viewMode === "all" ? true : item.subject === viewMode))

  if (!chartData.length) {
    return <div>No quiz data available to display.</div>
  }

  // Get unique subjects for the select dropdown
  const subjects = Array.from(new Set(chartData.map((item) => item.subject)))

  return (
    <Card className="mb-6">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Quiz Performance Analysis</CardTitle>
        </div>
        <Select value={viewMode} onValueChange={setViewMode}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCorrect" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillIncorrect" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="subject"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => (value.length > 10 ? `${value.slice(0, 10)}...` : value)}
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area dataKey="correct" type="natural" fill="url(#fillCorrect)" stroke="#10B981" stackId="a" />
            <Area dataKey="incorrect" type="natural" fill="url(#fillIncorrect)" stroke="#EF4444" stackId="a" />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
