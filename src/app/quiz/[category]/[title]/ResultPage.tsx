"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface ResultPageProps {
  results: { questionId: number; selectedChoice: number; isCorrect: boolean }[];
  questions: { id: number; text: string }[];
  choices: Record<number, { id: number; text: string }[]>;
}

const ResultPage: React.FC<ResultPageProps> = ({ results, questions, choices }) => {
  const router = useRouter();
  const score = results.filter((r) => r.isCorrect).length;
  const total = results.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl mb-4">
            Your Score: {score} / {total} ({((score / total) * 100).toFixed(2)}%)
          </p>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <p>{questions[index].text}</p>
                <p>
                  Your Answer: {choices[result.questionId]?.find(c => c.id === result.selectedChoice)?.text || "Not answered"}
                </p>
                <p className={result.isCorrect ? "text-green-500" : "text-red-500"}>
                  {result.isCorrect ? "Correct" : "Incorrect"}
                </p>
              </div>
            ))}
          </div>
          <Button onClick={() => router.push("/")} className="mt-4">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultPage;