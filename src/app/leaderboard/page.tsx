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
import {
  Trophy,
  Medal,
  ArrowLeft,
  Loader2,
  Crown,
  Award,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice";
import Image from "next/image";
import { Spinner } from "@/components/common";

// Interface for leaderboard data
interface LeaderboardEntry {
  username: string;
  total_points: number;
  last_updated: string;
}

// Function to get rank badge based on position
const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return (
        <div className="absolute -left-1 -top-1 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-lg">
          <Crown className="w-4 h-4 text-white" />
        </div>
      );
    case 2:
      return (
        <div className="absolute -left-1 -top-1 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-600 shadow-lg">
          <Trophy className="w-4 h-4 text-white" />
        </div>
      );
    case 3:
      return (
        <div className="absolute -left-1 -top-1 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-orange-600 shadow-lg">
          <Medal className="w-4 h-4 text-white" />
        </div>
      );
    default:
      return (
        <div className="absolute -left-1 -top-1 flex items-center justify-center w-7 h-7 rounded-full bg-muted shadow-sm">
          <span className="text-xs font-bold">{rank}</span>
        </div>
      );
  }
};

// Function to get progress color
const getProgressColor = (points: number, maxPoints: number) => {
  const progress = (points / maxPoints) * 100;
  if (progress >= 90) return "bg-gradient-to-r from-emerald-400 to-green-500";
  if (progress >= 70) return "bg-gradient-to-r from-cyan-400 to-teal-500";
  if (progress >= 50) return "bg-gradient-to-r from-violet-400 to-purple-500";
  return "bg-gradient-to-r from-amber-400 to-orange-500";
};

export default function LeaderboardPage() {
  const { data: user, isFetching } = useRetrieveUserQuery();

  const router = useRouter();
  const {
    data: leaderboard = [],
    isLoading,
    error,
  } = useGetLeaderboardQuery({});

   if (isLoading || isFetching) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Spinner  />
        </div>
      );
    }

  // Get the top users and the max points for progress calculation
  const maxPoints = Math.max(
    ...leaderboard.map((entry) => entry.total_points),
    1
  ); // Avoid division by zero

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button
        onClick={() => router.push("/quiz-app")}
        className="mb-6 flex items-center gap-2 group transition-all"
        variant="outline"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        
        Take a Points
      </Button>

      <div className="grid gap-6">
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="bg-gradient-to-r from-amber-200 to-yellow-400 p-3 rounded-full">
            <Trophy className="h-8 w-8 text-yellow-800" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Quiz Champions</h1>
          <p className="text-muted-foreground max-w-md">
            See who&apos;s leading the pack in our quiz challenges. Can you make
            it to the top?
          </p>
        </div>

        {isLoading ? (
          <LeaderboardSkeleton />
        ) : error ? (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                  <Trophy className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                  Failed to Load Leaderboard
                </h3>
                <p className="text-sm text-red-500">
                  {(error as { data?: { detail?: string } })?.data?.detail ||
                    "Unable to retrieve leaderboard data. Please try again later."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : leaderboard.length === 0 ? (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-full bg-primary/10 p-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">No Champions Yet</h3>
                <p className="text-muted-foreground max-w-md">
                  The leaderboard is waiting for its first champions. Complete a
                  quiz to claim your spot at the top!
                </p>
                <Button
                  onClick={() => router.push("/quiz-app")}
                  className="mt-2"
                >
                  Take a Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="top" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
              <TabsTrigger value="top" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Top Champions</span>
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>All Rankings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="top" className="mt-0">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Top 3 Podium */}
                {leaderboard
                  .slice(0, 3)
                  .map((entry: LeaderboardEntry, index: number) => {
                    const rank = index + 1;
                    const progress = (entry.total_points / maxPoints) * 100;

                    // Determine podium position styling
                    const podiumOrder = [2, 1, 3]; // Silver, Gold, Bronze
                    const podiumIndex = podiumOrder.indexOf(rank);
                    const podiumClass = [
                      "order-1 md:mt-8", // Silver (2nd)
                      "order-2 md:mt-0", // Gold (1st)
                      "order-3 md:mt-12", // Bronze (3rd)
                    ][podiumIndex];

                    // Determine background gradient
                    const bgGradient = [
                      "from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900", // Silver
                      "from-amber-50 to-yellow-100 dark:from-amber-950/40 dark:to-yellow-900/30", // Gold
                      "from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/30", // Bronze
                    ][podiumIndex];

                    return (
                      <Card
                        key={index}
                        className={cn(
                          "overflow-hidden transition-all duration-300 hover:shadow-lg",
                          `bg-gradient-to-b ${bgGradient}`,
                          podiumClass
                        )}
                      >
                        <CardHeader className="pb-2 text-center relative">
                          <div className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center">
                            {rank === 1 && (
                              <Crown className="h-8 w-8 text-yellow-500" />
                            )}
                            {rank === 2 && (
                              <Trophy className="h-7 w-7 text-gray-500" />
                            )}
                            {rank === 3 && (
                              <Medal className="h-7 w-7 text-orange-500" />
                            )}
                          </div>

                          <div className="flex flex-col items-center">
                            <div
                              className={cn(
                                "rounded-full p-1 mb-2",
                                rank === 1 &&
                                  "ring-4 ring-yellow-300 bg-gradient-to-r from-yellow-200 to-yellow-400",
                                rank === 2 &&
                                  "ring-4 ring-gray-300 bg-gradient-to-r from-gray-200 to-gray-400",
                                rank === 3 &&
                                  "ring-4 ring-orange-300 bg-gradient-to-r from-orange-200 to-orange-400"
                              )}
                            >
                              <Avatar className="w-20 h-20 border-4 border-background">
                                <Image
                                  src={user?.profilePicture ?? ""}
                                  alt={user?.first_name || "User"}
                                  height={96}
                                  width={96}
                                />
                                <AvatarFallback className="text-2xl font-bold bg-primary/10">
                                  {entry.username[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <CardTitle className="text-xl">
                              {entry.username}
                            </CardTitle>
                            <CardDescription>
                              Last active:{" "}
                              {new Date(
                                entry.last_updated
                              ).toLocaleDateString()}
                            </CardDescription>
                          </div>
                        </CardHeader>

                        <CardContent className="text-center pb-6">
                          <div className="flex flex-col items-center gap-2">
                            <div className="text-3xl font-bold text-primary">
                              {entry.total_points.toLocaleString()}
                              <span className="text-sm ml-1 text-muted-foreground">
                                points
                              </span>
                            </div>

                            <div className="w-full mt-2 relative h-3 rounded-full bg-muted overflow-hidden">
                              <div
                                className={cn(
                                  "absolute top-0 left-0 h-full rounded-full",
                                  getProgressColor(
                                    entry.total_points,
                                    maxPoints
                                  )
                                )}
                                style={{ width: `${progress}%` }}
                              />
                            </div>

                            <div
                              className={cn(
                                "mt-4 text-sm font-medium px-4 py-1 rounded-full",
                                rank === 1 &&
                                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
                                rank === 2 &&
                                  "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
                                rank === 3 &&
                                  "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                              )}
                            >
                              {rank === 1
                                ? "Gold Champion"
                                : rank === 2
                                ? "Silver Champion"
                                : "Bronze Champion"}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>

              {/* Runners Up (4th and 5th) */}
              {leaderboard.length > 3 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Runners Up
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TooltipProvider>
                      <div className="space-y-3">
                        {leaderboard
                          .slice(3, 5)
                          .map((entry: LeaderboardEntry, index: number) => {
                            const rank = index + 4;
                            const progress =
                              (entry.total_points / maxPoints) * 100;

                            return (
                              <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                  <div
                                    className="relative flex items-center gap-4 p-4 rounded-xl transition-all duration-300
                                    bg-accent/30 hover:bg-accent/50 hover:scale-[1.01] hover:shadow-md cursor-pointer"
                                  >
                                    {getRankBadge(rank)}

                                    <Avatar className="w-12 h-12 border-2 border-background shadow-md">
                                      <AvatarImage
                                        src={`/placeholder.svg?height=80&width=80`}
                                        alt={entry.username}
                                      />
                                      <AvatarFallback className="font-bold bg-primary/10 text-black dark:text-white">
                                        {entry.username[0].toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-bold truncate text-black dark:text-white">
                                        {entry.username}
                                      </p>
                                      <p className="text-xs text-muted-foreground truncate text-black dark:text-white">
                                        Last updated:{" "}
                                        {new Date(
                                          entry.last_updated
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>

                                    <div className="text-right flex-shrink-0">
                                      <p className="text-sm font-bold">
                                        <span className="text-primary">
                                          {entry.total_points.toLocaleString()}
                                        </span>{" "}
                                        <span className="text-xs text-muted-foreground">
                                          pts
                                        </span>
                                      </p>
                                      <div className="w-24 mt-1.5 relative h-2 rounded-full bg-muted overflow-hidden">
                                        <div
                                          className={cn(
                                            "absolute top-0 left-0 h-full rounded-full text-black dark:text-white",
                                            getProgressColor(
                                              entry.total_points,
                                              maxPoints
                                            )
                                          )}
                                          style={{ width: `${progress}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  className="p-3 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg"
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage
                                          src={`/placeholder.svg?height=80&width=80`}
                                          alt={entry.username}
                                        />
                                        <AvatarFallback>
                                          {entry.username[0].toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <p className="font-medium text-black dark:text-white">
                                          {entry.username}
                                        </p>
                                        <p className="text-xs text-muted-foreground ">
                                          @{entry.username}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div>
                                        <p className="text-xs text-muted-foreground">
                                          Rank
                                        </p>
                                        <p className="font-medium text-black dark:text-white">#{rank}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">
                                          Points
                                        </p>
                                        <p className="font-medium text-black dark:text-white">
                                          {entry.total_points.toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground">
                                          Progress
                                        </p>
                                        <p className="font-medium text-black dark:text-white">
                                          {Math.round(progress)}%
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground ">
                                          Last Updated
                                        </p>
                                        <p className="font-medium text-black dark:text-white" >
                                          {new Date(
                                            entry.last_updated
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                      </div>
                    </TooltipProvider>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="all" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Complete Rankings
                  </CardTitle>
                  <CardDescription>
                    All participants ranked by total points earned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-2">
                      {leaderboard.map(
                        (entry: LeaderboardEntry, index: number) => {
                          const rank = index + 1;
                          const progress =
                            (entry.total_points / maxPoints) * 100;

                          return (
                            <div
                              key={index}
                              className={cn(
                                "flex items-center gap-4 p-3 rounded-lg transition-colors",
                                "hover:bg-accent/50",
                                rank <= 3 && "bg-accent/30",
                                rank > 3 && "bg-card hover:bg-accent/30"
                              )}
                            >
                              <div
                                className={cn(
                                  "flex items-center justify-center min-w-[2.5rem] h-10 rounded-full font-bold",
                                  rank === 1 &&
                                    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
                                  rank === 2 &&
                                    "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
                                  rank === 3 &&
                                    "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300",
                                  rank > 3 && "bg-primary/10 text-primary"
                                )}
                              >
                                {rank}
                              </div>

                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={`/placeholder.svg?height=80&width=80`}
                                  alt={entry.username}
                                />
                                <AvatarFallback className="font-bold bg-primary/10">
                                  {entry.username[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                  {entry.username}
                                </p>
                                <div className="w-full mt-1 relative h-1.5 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className={cn(
                                      "absolute top-0 left-0 h-full rounded-full",
                                      getProgressColor(
                                        entry.total_points,
                                        maxPoints
                                      )
                                    )}
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                              </div>

                              <div className="text-right font-bold text-primary">
                                {entry.total_points.toLocaleString()}
                                <span className="text-xs ml-1 text-muted-foreground">
                                  pts
                                </span>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center">
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <Skeleton className="h-6 w-48 mx-auto mt-2" />
        <Skeleton className="h-4 w-64 mx-auto mt-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-20 mt-2" />
                <Skeleton className="h-3 w-full mt-1" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 mt-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
