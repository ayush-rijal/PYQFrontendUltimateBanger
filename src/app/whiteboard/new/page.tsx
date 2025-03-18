"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

export default function NewWhiteboard() {
  const router = useRouter()

  useEffect(() => {
    // Generate a unique ID for the new whiteboard
    const newWhiteboardId = uuidv4()

    // Redirect to the new whiteboard
    router.push(`/whiteboard/${newWhiteboardId}`)
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Creating your new whiteboard...</p>
      </div>
    </div>
  )
}

