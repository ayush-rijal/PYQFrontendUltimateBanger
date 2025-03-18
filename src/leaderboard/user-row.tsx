"use client"

import { useState } from "react"
import Image from "next/image"
import { ProgressIndicator } from "@/leaderboard/progress-indicator"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus, Trophy } from "lucide-react"
import { motion } from "framer-motion"

interface User {
  id: number
  rank: number
  name: string
  username: string
  score: number
  progress: number
  isFriend: boolean
  avatar: string
}

interface UserRowProps {
  user: User
  onToggleFriend: () => void
}

export function UserRow({ user, onToggleFriend }: UserRowProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Animation for row hover
  const rowVariants = {
    initial: { backgroundColor: "transparent" },
    hover: { backgroundColor: "rgba(var(--card-foreground-rgb), 0.05)" },
  }

  // Animation for score
  const scoreVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
  }

  return (
    <motion.div
      className="grid grid-cols-12 gap-2 p-4 items-center text-sm"
      initial="initial"
      animate={isHovered ? "hover" : "initial"}
      variants={rowVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{ duration: 0.2 }}
    >
      {/* Rank */}
      <div className="col-span-1 text-center font-medium">
        {user.rank === 1 ? (
          <Trophy className="h-5 w-5 mx-auto text-yellow-500" aria-label="First place" />
        ) : user.rank === 2 ? (
          <Trophy className="h-5 w-5 mx-auto text-gray-400" aria-label="Second place" />
        ) : user.rank === 3 ? (
          <Trophy className="h-5 w-5 mx-auto text-amber-700" aria-label="Third place" />
        ) : (
          user.rank
        )}
      </div>

      {/* User info */}
      <div className="col-span-5 sm:col-span-5 flex items-center gap-3">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image src={user.avatar || "/placeholder.svg"} alt={user.name} className="object-cover" fill sizes="40px" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium line-clamp-1">{user.name}</span>
          <span className="text-xs text-muted-foreground">@{user.username}</span>
        </div>
      </div>

      {/* Score */}
      <motion.div className="col-span-2 text-right font-bold" variants={scoreVariants}>
        {user.score.toLocaleString()}
      </motion.div>

      {/* Progress */}
      <div className="col-span-3 hidden sm:block">
        <ProgressIndicator value={user.progress} />
      </div>

      {/* Add/Remove friend button */}
      <div className="col-span-4 sm:col-span-1 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFriend}
          aria-label={user.isFriend ? "Remove friend" : "Add friend"}
          className="h-8 w-8"
        >
          {user.isFriend ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
        </Button>
      </div>
    </motion.div>
  )
}

