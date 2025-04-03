"use client";

import { useGetLeaderboardQuery } from "@/redux/features/quizApiSlice";
import { useRetrieveUserQuery } from "@/redux/features/authApiSlice"; // Assuming this can fetch by username
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Medal, Crown, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface LeaderboardEntry {
  username: string;
  total_points: number;
  last_updated: string;
  profilePicture?: string; // Optional, if included in leaderboard data
  first_name?: string; // Optional
}

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
        <div className="absolute -left-1 -top-1 flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-md">
          <Medal className="w-4 h-4 text-white" />
        </div>
      );
    case 3:
      return (
        <div className="absolute -left-1 -top-1 flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-orange-300 to-orange-600 shadow-md">
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

const getProgressColor = (points: number, maxPoints: number) => {
  const progress = (points / maxPoints) * 100;
  if (progress >= 90) return "bg-gradient-to-r from-emerald-400 to-green-500";
  if (progress >= 80) return "bg-gradient-to-r from-cyan-400 to-blue-500";
  if (progress >= 70) return "bg-gradient-to-r from-indigo-400 to-purple-500";
  return "bg-gradient-to-r from-red-400 to-orange-500";
};

// Component to fetch user details by username
const UserAvatar = ({ username }: { username: string }) => {
  // Assuming useRetrieveUserQuery can fetch by username; adjust if needed
  const { data: user, isLoading } = useRetrieveUserQuery(username); // Modify this if your API requires a different query

  if (isLoading) {
    return <Skeleton className="h-12 w-12 rounded-full" />;
  }

  const profilePicSrc = user?.profilePicture || "/default-avatar.png";
  const displayName = user?.first_name || username;

  return (
    <Avatar className="w-12 h-12 border-2 border-background shadow-md">
      <Image
        src={profilePicSrc}
        alt={displayName}
        height={96}
        width={96}
        onError={(e) =>
          console.error(
            `Failed to load image for ${username}: ${profilePicSrc}`
          )
        }
      />
      <AvatarFallback className="font-bold bg-primary/10">
        {displayName}
      </AvatarFallback>
    </Avatar>
  );
};

export function TopUsers() {
  const { data: leaderboard = [], isLoading } = useGetLeaderboardQuery({});
  const topUsers = leaderboard.slice(0, 5);
  const maxPoints = Math.max(
    ...leaderboard.map((entry) => entry.total_points),
    1
  );

  console.log("Leaderboard Data:", leaderboard);

  if (isLoading) {
    return (
      <Card className="w-full shadow-lg border border-border/50 bg-gradient-to-b from-background to-muted/30">
        <CardHeader className="pb-2 border-b border-border/10">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🏆</span> Top Users
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
              >
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-2 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="w-full shadow-xl border border-border/50 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
        <CardHeader className="pb-2 border-b border-border/10">
          <Link href="/leaderboard" className="group">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <span className="text-2xl">🏆</span> Top Users
              </CardTitle>
              <Badge
                variant="secondary"
                className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 flex items-center gap-1"
              >
                View Leaderboard{" "}
                <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
              </Badge>
            </div>
          </Link>
        </CardHeader>
        <ScrollArea className="h-[320px]">
          <CardContent className="p-4 space-y-3">
            {topUsers.map((entry: LeaderboardEntry, index: number) => {
              const rank = index + 1;
              const progress = (entry.total_points / maxPoints) * 100;
              const displayName = entry.first_name || entry.username;

              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "relative flex items-center gap-3 p-4 rounded-xl transition-all duration-300",
                        "hover:scale-[1.02] hover:shadow-md cursor-pointer",
                        rank === 1 &&
                          "bg-gradient-to-r from-yellow-50/80 to-transparent dark:from-yellow-950/30 dark:to-transparent border border-yellow-200/30 dark:border-yellow-800/30",
                        rank === 2 &&
                          "bg-gradient-to-r from-gray-50/80 to-transparent dark:from-gray-950/30 dark:to-transparent border border-gray-200/30 dark:border-gray-800/30",
                        rank === 3 &&
                          "bg-gradient-to-r from-orange-50/80 to-transparent dark:from-orange-950/30 dark:to-transparent border border-orange-200/30 dark:border-orange-800/30",
                        rank > 3 &&
                          "bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border/20"
                      )}
                    >
                      {getRankBadge(rank)}

                      <div
                        className={cn(
                          "relative",
                          rank === 1 &&
                            "ring-2 ring-yellow-400 ring-offset-2 ring-offset-background",
                          rank === 2 &&
                            "ring-2 ring-gray-400 ring-offset-2 ring-offset-background",
                          rank === 3 &&
                            "ring-2 ring-orange-400 ring-offset-2 ring-offset-background"
                        )}
                      >
                        {/* Use UserAvatar component to fetch and display profile pic */}
                        <UserAvatar username={entry.username} />
                        {rank === 1 && (
                          <span className="absolute -bottom-1 -right-1 text-lg">
                            👑
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">
                          {entry.username}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          @{entry.username.toLowerCase()}
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold">
                          <span
                            className={cn(
                              "text-primary",
                              rank === 1 &&
                                "text-yellow-600 dark:text-yellow-400",
                              rank === 2 && "text-gray-600 dark:text-gray-400",
                              rank === 3 &&
                                "text-orange-600 dark:text-orange-400"
                            )}
                          >
                            {entry.total_points.toLocaleString()}
                          </span>{" "}
                          <span className="text-xs text-muted-foreground">
                            pts
                          </span>
                        </p>
                        <div className="w-24 mt-1.5 relative h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn(
                              "absolute top-0 left-0 h-full rounded-full",
                              getProgressColor(entry.total_points, maxPoints)
                            )}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="p-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg max-w-xs"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar username={entry.username} />
                        <div>
                          <p className="font-medium dark:text-white text-black">
                            {entry.username}
                          </p>
                          <p className="text-xs dark:text-white text-black">
                            @{entry.username.toLowerCase()}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-muted/40 p-2 rounded-md">
                          <p className="text-xs text-muted-foreground">Rank</p>
                          <p className="font-medium dark:text-white text-black">
                            #{rank}
                          </p>
                        </div>
                        <div className="bg-muted/40 p-2 rounded-md">
                          <p className="text-xs dark:text-white text-black">
                            Points
                          </p>
                          <p className="font-medium dark:text-white text-black">
                            {entry.total_points.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-muted/40 p-2 rounded-md dark:text-white text-black">
                          <p className="text-xs text-muted-foreground">
                            Progress
                          </p>
                          <p className="font-medium">{Math.round(progress)}%</p>
                        </div>
                        <div className="bg-muted/40 p-2 rounded-md">
                          <p className="text-xs text-muted-foreground">
                            Last Updated
                          </p>
                          <p className="font-medium dark:text-white text-black">
                            {new Date(entry.last_updated).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </CardContent>
        </ScrollArea>
      </Card>
    </TooltipProvider>
  );
}
