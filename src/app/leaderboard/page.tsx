"use client";

import { useGetLeaderboardQuery } from "@/redux/features/quizApiSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Trophy, Medal, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

// Interface for leaderboard data
interface LeaderboardEntry {
  username: string;
  total_points: number;
  last_updated: string;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const { data: leaderboard = [], isLoading, error } = useGetLeaderboardQuery();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button
        onClick={() => router.push("/quiz-app")}
        className="mb-6 flex items-center gap-2"
        variant="outline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>

      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Global Leaderboard
          </CardTitle>
          <CardDescription className="text-lg">
            Top performers across all quizzes
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {isLoading ? (
            <LeaderboardSkeleton />
          ) : error ? (
            <div className="bg-red-50 text-red-500 p-4 rounded-md text-center">
              Error:{" "}
              {(error as { data?: { detail?: string } })?.data?.detail ||
                "Failed to load leaderboard"}
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold border-b pb-2">Rankings</h3>

              {leaderboard.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No leaderboard data available yet. Be the first to complete a
                  quiz!
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((entry: LeaderboardEntry, index: number) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        index === 0
                          ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                          : index === 1
                          ? "bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-700"
                          : index === 2
                          ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                          : "bg-card hover:bg-accent/50 transition-colors"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                          {index + 1}
                        </div>

                        {index === 0 && (
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        )}
                        {index === 1 && (
                          <Medal className="h-5 w-5 text-slate-400" />
                        )}
                        {index === 2 && (
                          <Medal className="h-5 w-5 text-amber-600" />
                        )}

                        <span className="font-medium">{entry.username}</span>
                      </div>

                      <div className="font-bold text-primary">
                        {entry.total_points.toLocaleString()} points
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
