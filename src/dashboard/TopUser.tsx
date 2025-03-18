"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils"; // Utility for conditional styling
import Link from "next/link";

const topUsers = [
  {
    id: 1,
    rank: 1,
    name: "Alex Johnson",
    username: "alexj",
    score: 9875,
    progress: 95,
    isFriend: true,
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    rank: 2,
    name: "Samantha Lee",
    username: "samlee",
    score: 9432,
    progress: 88,
    isFriend: false,
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    rank: 3,
    name: "Marcus Chen",
    username: "mchen",
    score: 8954,
    progress: 82,
    isFriend: true,
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    rank: 4,
    name: "Priya Patel",
    username: "ppatel",
    score: 8721,
    progress: 79,
    isFriend: false,
    avatar: "/placeholder.svg",
  },
  {
    id: 5,
    rank: 5,
    name: "Jordan Smith",
    username: "jsmith",
    score: 8532,
    progress: 76,
    isFriend: false,
    avatar: "/placeholder.svg",
  },
];

export function TopUsers() {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border border-border bg-gradient-to-b from-background to-muted/50">
      <CardHeader className="pb-4">
        <Link href={"/leaderboard"}>
          <CardTitle className="text-lg font-semibold flex justify-between items-center">
            🏆 Top 5 Users
            <Badge variant="secondary">Leaderboard</Badge>
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {topUsers.map((user, index) => (
          <div
            key={user.id}
            className={cn(
              "flex items-center justify-between bg-muted/20 p-3 rounded-lg transition-all hover:scale-[1.02] hover:bg-muted",
              index === 0 ? "border-l-4 border-yellow-500" : "",
              index === 1 ? "border-l-4 border-gray-400" : "",
              index === 2 ? "border-l-4 border-orange-400" : ""
            )}
          >
            {/* User Avatar & Name */}
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </div>

            {/* Score & Progress */}
            <div className="text-right">
              <p className="text-sm font-semibold text-primary">
                {user.score} pts
              </p>
              <Progress value={user.progress} className="w-20 h-2 mt-1" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
