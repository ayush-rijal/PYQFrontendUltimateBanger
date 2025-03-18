"use client"

import type React from "react"

import { useState } from "react"
import { MovableElement } from "./movable-element"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

interface StickyNoteProps {
  id: string
  initialText?: string
  initialPosition?: { x: number; y: number }
  initialColor?: string
  onRemove?: (id: string) => void
  onTextChange?: (id: string, text: string) => void
}

export function StickyNote({
  id,
  initialText = "",
  initialPosition,
  initialColor = "#FFEB3B",
  onRemove,
  onTextChange,
}: StickyNoteProps) {
  const [text, setText] = useState(initialText)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    if (onTextChange) {
      onTextChange(id, newText)
    }
  }

  return (
    <MovableElement
      initialPosition={initialPosition}
      initialSize={{ width: 200, height: 200 }}
      className="p-0 overflow-hidden"
    >
      <div className="w-full h-full flex flex-col" style={{ backgroundColor: initialColor }}>
        <div className="flex justify-between items-center p-2 bg-black/10">
          <div className="text-sm font-medium">Note</div>
          {onRemove && (
            <button className="text-gray-700 hover:text-gray-900" onClick={() => onRemove(id)}>
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Textarea
          value={text}
          onChange={handleTextChange}
          className="flex-1 resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
          placeholder="Type your note here..."
        />
      </div>
    </MovableElement>
  )
}

