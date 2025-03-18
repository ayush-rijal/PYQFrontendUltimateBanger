"use client"
import Image from "next-image"
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Trophy, Check, X, Home, RefreshCw, Share2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ResultPageProps {
  results: { isCorrect: boolean; selectedChoice: number }[];
  questions: { id: number; text: string; image_url?: string }[];
  choices: Record<number, { id: number; text: string; is_correct: boolean }[]>;
}

const ResultPage: React.FC<ResultPageProps> = ({
  results,
  questions,
  choices,
}) => {
  const navigate = useNavigate();
  const correctAnswers = results.filter((r) => r.isCorrect).length;
  const totalQuestions = questions.length;
  const score = (correctAnswers / totalQuestions) * 100;

  const getGradeColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const chartData = results.map((result, index) => ({
    question: `Q${index + 1}`,
    score: result.isCorrect ? 1 : 0,
  }));

  return (
    <div className="container mx-auto p-4 space-y-8 w-full">
      {/* Score Overview Card */}
      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center pt-4">
            <Trophy className="w-16 h-16 mb-4 text-yellow-500" />
            <h2 className={`text-5xl font-bold ${getGradeColor(score)}`}>
              {score.toFixed(1)}%
            </h2>
            <p className="text-xl mt-2 text-muted-foreground">
              {correctAnswers} out of {totalQuestions} correct
            </p>
          </div>

          {/* Performance Graph */}
          <div className="mt-8 bg-card rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Question Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#666"
                  opacity={0.1}
                />
                <XAxis dataKey="question" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "8px",
                    padding: "10px",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ stroke: "#8884d8", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Question Review Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Question Review</h3>
        {questions.map((question, index) => (
          <Card
            key={question.id}
            className="overflow-hidden transition-shadow hover:shadow-md"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-secondary-foreground font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold mb-4">
                    {question.text}
                  </h4>
                  {question.image_url && (
                    <Image
                      src={question.image_url || "/placeholder.svg"}
                      alt="Question Image"
                      className="mb-4 rounded-lg max-w-full h-auto shadow-sm"
                    />
                  )}
                  <div className="space-y-3">
                    {choices[question.id]?.map((choice) => {
                      const isSelected =
                        choice.id === results[index].selectedChoice;
                      const isCorrect = choice.is_correct;

                      return (
                        <div
                          key={choice.id}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            isSelected
                              ? isCorrect
                                ? "bg-emerald-500 dark:bg-emerald-800 border-emerald-600"
                                : "bg-rose-500 dark:bg-rose-800 border-rose-600"
                              : isCorrect
                              ? "bg-emerald-100 dark:bg-emerald-900/20"
                              : "bg-gray-200 dark:bg-gray-700"
                          } ${isSelected || isCorrect ? "border" : ""}`}
                        >
                          {isSelected &&
                            (isCorrect ? (
                              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <X className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                            ))}
                          <span
                            className={`flex-1 ${
                              isSelected || isCorrect
                                ? "font-medium text-gray-800 dark:text-gray-100"
                                : ""
                            }`}
                          >
                            {choice.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 py-8">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="gap-2"
        >
          <Home className="w-4 h-4" />
          Home
        </Button>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
        <Button
          onClick={() => {
            // Implement share functionality
            navigator.clipboard.writeText(
              `I scored ${score.toFixed(1)}% on the quiz!`
            );
          }}
          variant="outline"
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default ResultPage;
