"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Trophy, Medal } from "lucide-react"

const topUsers = [
  {
    id: 1,
    rank: 1,
    name: "Alex Johnson",
    username: "alexj",
    score: 9875,
    progress: 95,
    isFriend: true,
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    rank: 2,
    name: "Samantha Lee",
    username: "samlee",
    score: 9432,
    progress: 88,
    isFriend: false,
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    rank: 3,
    name: "Marcus Chen",
    username: "mchen",
    score: 8954,
    progress: 82,
    isFriend: true,
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    rank: 4,
    name: "Priya Patel",
    username: "ppatel",
    score: 8721,
    progress: 79,
    isFriend: false,
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    rank: 5,
    name: "Jordan Smith",
    username: "jsmith",
    score: 8532,
    progress: 76,
    isFriend: false,
    avatar: "/placeholder.svg?height=80&width=80",
  },
]

// Function to get rank badge based on position
const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return (
        <div className="absolute -left-1 -top-1 flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-md">
          <Trophy className="w-4 h-4 text-white" />
        </div>
      )
    case 2:
      return (
        <div className="absolute -left-1 -top-1 flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 shadow-md">
          <Medal className="w-4 h-4 text-white" />
        </div>
      )
    case 3:
      return (
        <div className="absolute -left-1 -top-1 flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 shadow-md">
          <Medal className="w-4 h-4 text-white" />
        </div>
      )
    default:
      return (
        <div className="absolute -left-1 -top-1 flex items-center justify-center w-7 h-7 rounded-full bg-muted shadow-sm">
          <span className="text-xs font-bold">{rank}</span>
        </div>
      )
  }
}

// Function to get progress color based on value
const getProgressColor = (progress: number) => {
  if (progress >= 90) return "bg-gradient-to-r from-green-400 to-emerald-500"
  if (progress >= 80) return "bg-gradient-to-r from-blue-400 to-cyan-500"
  if (progress >= 70) return "bg-gradient-to-r from-purple-400 to-indigo-500"
  return "bg-gradient-to-r from-orange-400 to-red-500"
}

export function TopUsers() {
  return (
    <TooltipProvider>
      <Card className="w-full shadow-xl border border-border/50 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
        <CardHeader className="pb-2 border-b border-border/10">
          <Link href={"/leaderboard"} className="group">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <span className="text-2xl">🏆</span> Top Users
              </CardTitle>
              <Badge
                variant="secondary"
                className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
              >
                View Leaderboard
              </Badge>
            </div>
          </Link>
        </CardHeader>
        <ScrollArea className="h-[320px]">
          <CardContent className="p-4 space-y-3">
            {topUsers.map((user) => (
              <Tooltip key={user.id}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "relative flex items-center gap-3 p-4 rounded-xl transition-all duration-300",
                      "hover:scale-[1.02] hover:shadow-md cursor-pointer",
                      user.rank === 1 &&
                        "bg-gradient-to-r  rounded-full from-yellow-50 to-transparent dark:from-yellow-950/20 dark:to-transparent",
                      user.rank === 2 &&
                        "bg-gradient-to-r rounded-full from-gray-50 to-transparent dark:from-gray-950/20 dark:to-transparent",
                      user.rank === 3 &&
                        "bg-gradient-to-r rounded-full from-orange-50 to-transparent dark:from-orange-950/20 dark:to-transparent",
                      user.rank > 3 && "bg-muted/30 hover:bg-muted/50",
                    )}
                  >
                    {getRankBadge(user.rank)}

                    {/* Avatar with glow effect for top 3 */}
                    <div
                      className={cn(
                        "relative",
                        user.rank === 1 && "ring-2 ring-yellow-400 ring-offset-2 ring-offset-background",
                        user.rank === 2 && "ring-2 ring-gray-400 ring-offset-2 ring-offset-background",
                        user.rank === 3 && "ring-2 ring-orange-400 ring-offset-2 ring-offset-background",
                      )}
                    >
                      <Avatar className="w-12 h-12 border-2 border-background shadow-md">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="font-bold bg-primary/10">{user.name[0]}</AvatarFallback>
                      </Avatar>
                      {user.isFriend && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                          <span className="sr-only">Friend</span>
                          <span className="text-[10px] text-white">✓</span>
                        </div>
                      )}
                    </div>

                    {/* User info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold truncate">{user.name}</p>
                        {user.isFriend && (
                          <Badge
                            variant="outline"
                            className="h-5 px-1 text-[10px] bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800/50"
                          >
                            Friend
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                    </div>

                    {/* Score & Progress */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold">
                        <span className="text-primary">{user.score.toLocaleString()}</span>{" "}
                        <span className="text-xs text-muted-foreground">pts</span>
                      </p>
                      <div className="w-24 mt-1.5 relative h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn("absolute top-0 left-0 h-full rounded-full", getProgressColor(user.progress))}
                          style={{ width: `${user.progress}%` }}
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
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Rank</p>
                        <p className="font-medium">#{user.rank}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Points</p>
                        <p className="font-medium">{user.score.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Progress</p>
                        <p className="font-medium">{user.progress}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className="font-medium">{user.isFriend ? "Friend" : "Not Friend"}</p>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>
    </TooltipProvider>
  )
}

