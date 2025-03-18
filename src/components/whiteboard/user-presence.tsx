"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface User {
  id: string
  name: string
  color: string
}

interface UserPresenceProps {
  users: User[]
}

export function UserPresence({ users }: UserPresenceProps) {
  if (users.length === 0) {
    return (
      <div className="flex items-center">
        <div className="text-sm text-muted-foreground">No active users</div>
      </div>
    )
  }

  return (
    <div className="flex -space-x-2">
      <TooltipProvider>
        {users.slice(0, 5).map((user) => (
          <Tooltip key={user.id}>
            <TooltipTrigger asChild>
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-background"
                style={{ backgroundColor: user.color }}
              >
                <span className="text-xs font-medium text-white">{user.name.substring(0, 2).toUpperCase()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{user.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {users.length > 5 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted border-2 border-background">
                <span className="text-xs font-medium">+{users.length - 5}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{users.length - 5} more users</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  )
}

