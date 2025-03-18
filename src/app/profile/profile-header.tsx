import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import type { User } from "@/lib/types"

interface ProfileHeaderProps {
  user: User
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between mb-8 gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user.profilePicture ?? ''} alt={user.firstName} />
          <AvatarFallback className="text-xl">{getInitials(user.firstName, user.lastName)}</AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Member since {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:items-end">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">{user.role}</div>
          {user.isVerified && (
            <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full px-3 py-1 text-sm font-medium">
              Verified
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">Last login: {new Date(user.lastLogin).toLocaleString()}</p>
      </div>
    </div>
  )
}

