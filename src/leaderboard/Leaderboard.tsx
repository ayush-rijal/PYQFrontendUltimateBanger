"use client"
import { useState } from "react"
import { UserRow } from "@/leaderboard/user-row"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

// Sample data for the leaderboard
const initialUsers = [
  {
    id: 1,
    rank: 1,
    name: "Alex Johnson",
    username: "alexj",
    score: 9875,
    progress: 95,
    isFriend: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    rank: 2,
    name: "Samantha Lee",
    username: "samlee",
    score: 9432,
    progress: 88,
    isFriend: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    rank: 3,
    name: "Marcus Chen",
    username: "mchen",
    score: 8954,
    progress: 82,
    isFriend: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    rank: 4,
    name: "Priya Patel",
    username: "ppatel",
    score: 8721,
    progress: 79,
    isFriend: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    rank: 5,
    name: "Jordan Smith",
    username: "jsmith",
    score: 8532,
    progress: 76,
    isFriend: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    rank: 6,
    name: "Taylor Wong",
    username: "twong",
    score: 8210,
    progress: 72,
    isFriend: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    rank: 7,
    name: "Morgan Davis",
    username: "mdavis",
    score: 7943,
    progress: 68,
    isFriend: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    rank: 8,
    name: "Jamie Rodriguez",
    username: "jrod",
    score: 7689,
    progress: 65,
    isFriend: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 9,
    rank: 9,
    name: "Casey Kim",
    username: "ckim",
    score: 7421,
    progress: 61,
    isFriend: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 10,
    rank: 10,
    name: "Riley Thompson",
    username: "rthompson",
    score: 7198,
    progress: 58,
    isFriend: false,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function Leaderboard() {
  const [users, setUsers] = useState(initialUsers)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Toggle friend status
  const toggleFriend = (userId: number) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, isFriend: !user.isFriend } : user)))
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-4 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
        </div>

        <div className="rounded-md border">
          <div className="hidden sm:grid grid-cols-12 gap-2 p-4 text-sm font-medium text-muted-foreground bg-muted/50">
            <div className="col-span-1 text-center">Rank</div>
            <div className="col-span-5">User</div>
            <div className="col-span-2 text-right">Score</div>
            <div className="col-span-3">Progress</div>
            <div className="col-span-1"></div>
          </div>

          <div className="divide-y">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <UserRow key={user.id} user={user} onToggleFriend={() => toggleFriend(user.id)} />
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">No users found matching your search.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

