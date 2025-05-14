import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import type { User } from "@/lib/types"

interface UserAvatarProps {
  user: User
  size?: "sm" | "md" | "lg"
  showName?: boolean
  linkToProfile?: boolean
}

export function UserAvatar({ user, size = "md", showName = false, linkToProfile = false }: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const fallbackSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  const avatar = (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={user.profilePicture ?? ''} alt={user.firstName} />
      <AvatarFallback className={fallbackSizes[size]}>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
    </Avatar>
  )

  const content = showName ? (
    <div className="flex items-center gap-2">
      {avatar}
      <span className="font-medium">
        {user.firstName} {user.lastName}
      </span>
    </div>
  ) : (
    avatar
  )

  if (linkToProfile) {
    return (
      <Link href="/profile" className="flex items-center hover:opacity-80 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}

