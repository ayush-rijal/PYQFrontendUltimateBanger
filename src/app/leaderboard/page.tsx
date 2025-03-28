"use client";

import { useGetLeaderboardQuery } from "@/redux/features/quizApiSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

// Interface for leaderboard data
interface LeaderboardEntry {
  username: string;
  total_points: number;
  last_updated: string;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const { data: leaderboard = [], isLoading, error } = useGetLeaderboardQuery();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Error: {(error as any)?.data?.detail || "Failed to load leaderboard"}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <header className="mb-8 text-center">
        <Button
          variant="outline"
          onClick={() => router.push("/quiz-app")}
          className="mb-4"
        >
          Back to Home
        </Button>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Global Leaderboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Top performers across all quizzes
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No leaderboard data available yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {leaderboard.map((entry: LeaderboardEntry, index: number) => (
                <li
                  key={entry.username}
                  className="flex items-center justify-between p-4 rounded-md bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">
                      {index + 1}.
                      {index === 0 && (
                        <Trophy className="inline-block ml-2 h-5 w-5 text-yellow-500" />
                      )}
                    </span>
                    <span>{entry.username}</span>
                  </div>
                  <span className="font-medium">{entry.total_points} points</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}