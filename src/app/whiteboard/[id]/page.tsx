"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { type Socket, io } from "socket.io-client"
import { Whiteboard } from "@/components/whiteboard/whiteboard"
import { Toolbar } from "@/components/whiteboard/toolbar"
import { ShareDialog } from "@/components/whiteboard/share-dialog"
import { UserPresence } from "@/components/whiteboard/user-presence"
import { StickyNote } from "@/components/whiteboard/sticky-note"
import { Button } from "@/components/ui/button"
import { Share2, StickyNoteIcon, Image, Plus } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface StickyNoteData {
  id: string
  text: string
  position: { x: number; y: number }
  color: string
  
}

export default function WhiteboardPage() {
  const params = useParams()
  const id = params.id as string
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [activeUsers, setActiveUsers] = useState<{ id: string; name: string; color: string }[]>([])
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [stickyNotes, setStickyNotes] = useState<StickyNoteData[]>([])
  const [showElementMenu, setShowElementMenu] = useState(false)

  // Tool state
  const [currentTool, setCurrentTool] = useState<"pen" | "eraser">("pen")
  const [penColor, setPenColor] = useState("#000000")
  const [penSize, setPenSize] = useState(3)
  const [eraserSize, setEraserSize] = useState(20)

  useEffect(() => {
    // In a real implementation, this would connect to your actual WebSocket server
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      query: { roomId: id },
    })

    newSocket.on("connect", () => {
      setIsConnected(true)
      console.log("Connected to WebSocket server")
    })

    newSocket.on("disconnect", () => {
      setIsConnected(false)
      console.log("Disconnected from WebSocket server")
    })

    newSocket.on("users", (users) => {
      setActiveUsers(users)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [id])

  const shareWhiteboard = () => {
    setShareDialogOpen(true)
  }

  const addStickyNote = () => {
    const newNote: StickyNoteData = {
      id: uuidv4(),
      text: "",
      position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
      color: ["#FFEB3B", "#FFC107", "#FF9800", "#4CAF50", "#2196F3"][Math.floor(Math.random() * 5)],
    }

    setStickyNotes([...stickyNotes, newNote])
    setShowElementMenu(false)
  }

  const removeStickyNote = (id: string) => {
    setStickyNotes(stickyNotes.filter((note) => note.id !== id))
  }

  const updateStickyNoteText = (id: string, text: string) => {
    setStickyNotes(stickyNotes.map((note) => (note.id === id ? { ...note, text } : note)))
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b bg-background z-10">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2 font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M2 3h20" />
              <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
              <path d="m7 21 5-5 5 5" />
            </svg>
            <span>Whiteboard: {id === "new" ? "New Whiteboard" : `Board ${id.substring(0, 8)}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowElementMenu(!showElementMenu)}
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Element
              </Button>

              {showElementMenu && (
                <div className="absolute top-full right-0 mt-1 bg-background border rounded-md shadow-md p-2 z-10">
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={addStickyNote}>
                    <StickyNoteIcon className="h-4 w-4" />
                    Sticky Note
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2" disabled>
                    <Image className="h-4 w-4" alt="Image icon" />
                    Image (Coming Soon)
                  </Button>
                </div>
              )}
            </div>
            <UserPresence users={activeUsers} />
            <Button variant="outline" size="sm" onClick={shareWhiteboard} className="gap-1">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Toolbar
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
          penColor={penColor}
          setPenColor={setPenColor}
          penSize={penSize}
          setPenSize={setPenSize}
          eraserSize={eraserSize}
          setEraserSize={setEraserSize}
        />

        <main className="flex-1 overflow-hidden bg-muted/20 relative">
          <Whiteboard
            socket={socket}
            currentTool={currentTool}
            penColor={penColor}
            penSize={penSize}
            eraserSize={eraserSize}
          />

          {/* Sticky Notes */}
          {stickyNotes.map((note) => (
            <StickyNote
              key={note.id}
              id={note.id}
              initialText={note.text}
              initialPosition={note.position}
              initialColor={note.color}
              onRemove={removeStickyNote}
              onTextChange={updateStickyNoteText}
            />
          ))}
        </main>
      </div>

      <ShareDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen} whiteboardId={id} />
    </div>
  )
}

