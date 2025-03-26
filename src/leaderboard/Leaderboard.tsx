"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Trophy } from "lucide-react";
import {
  useRetrieveUserQuery,
  useGetGlobalLeaderboardQuery,
} from "@/redux/features/authApiSlice";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

// Interface for leaderboard entry
interface LeaderboardEntry {
  id: string; // user_id
  name: string; // user_name
  score: number; // Total score across all quizzes
  progress: number; // Progress as a percentage
  rank: number; // Calculated rank
  avatar?: string; // Optional avatar URL
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: currentUser } = useRetrieveUserQuery();
  const { data: leaderboardData, isLoading } = useGetGlobalLeaderboardQuery();

  // Process leaderboard data
  useEffect(() => {
    if (leaderboardData) {
      // Calculate max possible score (assuming each quiz has a max score based on the highest score)
      const maxScorePerQuiz = Math.max(
        ...leaderboardData.map((entry) => entry.total_score),
        1
      );
      const estimatedQuizCount = 10; // Adjust based on your app's data

      const leaderboardEntries = leaderboardData.map((entry, index) => ({
        id: entry.user_id,
        name: entry.user_name,
        score: entry.total_score,
        progress:
          maxScorePerQuiz > 0
            ? (entry.total_score / (maxScorePerQuiz * estimatedQuizCount)) * 100
            : 0,
        rank: index + 1,
        avatar: `/profile.gif?height=40&width=40`, // Placeholder avatar
      }));

      setLeaderboard(leaderboardEntries);
    }
  }, [leaderboardData]);

  // Filter users based on search query
  const filteredLeaderboard = leaderboard.filter((entry) =>
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="w-full container">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="grid grid-cols-1 gap-6">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r py-[-6] from-blue-500 to-indigo-600 text-white rounded-t-lg ">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-300" />
            <CardTitle className="text-3xl font-bold">Leaderboard</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Leaderboard Table */}
            <ScrollArea className="h-full rounded-md border">
              <div className="divide-y">
                {/* Header Row */}
                <div className="hidden sm:grid grid-cols-12 gap-2 p-4 text-sm font-medium text-muted-foreground bg-muted/50">
                  <div className="col-span-1 text-center">Rank</div>
                  <div className="col-span-5">User</div>
                  <div className="col-span-2 text-right">Score</div>
                  <div className="col-span-4">Progress</div>
                </div>

                {/* Leaderboard Entries */}
                {filteredLeaderboard.length > 0 ? (
                  filteredLeaderboard.map((entry) => (
                    <div
                      key={entry.id}
                      className={`grid grid-cols-12 gap-2 p-4 items-center ${
                        entry.rank === 1
                          ? "bg-yellow-100 border border-yellow-300"
                          : entry.rank === 2
                          ? "bg-gray-100 border border-gray-300"
                          : entry.rank === 3
                          ? "bg-orange-100 border border-orange-300"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      {/* Rank */}
                      <div className="col-span-1 text-center text-lg font-bold text-gray-800">
                        {entry.rank}.
                      </div>

                      {/* User Info */}
                      <div className="col-span-5 flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={entry.avatar} alt={entry.name} />
                          <AvatarFallback>
                            {entry.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-lg font-medium text-gray-800">
                            {entry.name}
                          </p>
                          {currentUser &&
                            (currentUser.id === entry.id ||
                              currentUser.email === entry.id) && (
                              <p className="text-sm text-blue-600">(You)</p>
                            )}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="col-span-2 text-right text-lg font-semibold text-gray-800">
                        {entry.score}
                      </div>

                      {/* Progress */}
                      <div className="col-span-4 flex items-center gap-2">
                        <Progress value={entry.progress} className="w-full" />
                        <span className="text-sm text-gray-600">
                          {Math.round(entry.progress)}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    No users found matching your search.
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
