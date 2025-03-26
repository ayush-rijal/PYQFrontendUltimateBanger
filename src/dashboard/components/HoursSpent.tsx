"use client";

import * as React from "react";
import { useGetUserQuizResultsQuery } from "@/redux/features/quizApiSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loading from "@/loading/Loading";

interface ChartData {
  date: string;
  correct: number;
  incorrect: number;
}

const chartConfig = {
  performance: { label: "Performance" },
  correct: { label: "Correct Answers", color: "#10B981" },
  incorrect: { label: "Incorrect Answers", color: "#EF4444" },
} satisfies ChartConfig;

export default function ResultAnalysis() {
  const [timeRange, setTimeRange] = React.useState("90d");
  const {
    data: quizResults = [],
    isLoading,
    error,
  } = useGetUserQuizResultsQuery({ timeRange });

  React.useEffect(() => {
    console.log("Time Range:", timeRange);
    console.log("Quiz Results:", quizResults);
    console.log("Is Loading:", isLoading);
    console.log("Error:", error);
  }, [timeRange, quizResults, isLoading, error]);

  const chartData: ChartData[] = React.useMemo(() => {
    if (!quizResults.length) {
      console.log("No quiz results to process.");
      return [];
    }

    const dailyStats = quizResults.reduce((acc, result) => {
      const date = new Date(result.completed_at).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { correct: 0, incorrect: 0 };
      }
      acc[date].correct += Number(result.score);
      acc[date].incorrect +=
        Number(result.total_questions) - Number(result.score);
      return acc;
    }, {} as Record<string, { correct: number; incorrect: number }>);

    const result = Object.entries(dailyStats)
      .map(([date, stats]) => ({
        date,
        correct: stats.correct,
        incorrect: stats.incorrect,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    console.log("Chart Data:", result);
    return result;
  }, [quizResults]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Error loading dashboard:{" "}
        {(error as { data?: { detail?: string } })?.data?.detail || "Unknown error"}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Result Analysis</CardTitle>
            <CardDescription>
              Your performance across all quizzes
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          {chartData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[400px] w-full"
            >
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillCorrect" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient
                    id="fillIncorrect"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
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
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="correct"
                  type="natural"
                  fill="url(#fillCorrect)"
                  stroke="#10B981"
                  stackId="a"
                />
                <Area
                  dataKey="incorrect"
                  type="natural"
                  fill="url(#fillIncorrect)"
                  stroke="#EF4444"
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="text-center py-8">
              No quiz results available for the selected time range.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
