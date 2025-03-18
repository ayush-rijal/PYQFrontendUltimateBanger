"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface MovableElementProps {
  children: React.ReactNode
  initialPosition?: { x: number; y: number }
  initialSize?: { width: number; height: number }
  minWidth?: number
  minHeight?: number
  className?: string
}

export function MovableElement({
  children,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 200, height: 200 },
  minWidth = 100,
  minHeight = 100,
  className,
}: MovableElementProps) {
  const [position, setPosition] = useState(initialPosition)
  const [size, setSize] = useState(initialSize)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const resizeStartPos = useRef({ x: 0, y: 0 })
  const resizeStartSize = useRef({ width: 0, height: 0 })

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === elementRef.current) {
      setIsDragging(true)
      dragStartPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }
    }
  }

  // Handle mouse down for resizing
  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeDirection(direction)
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
    }
    resizeStartSize.current = {
      width: size.width,
      height: size.height,
    }
  }

  // Handle mouse move for both dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStartPos.current.x,
          y: e.clientY - dragStartPos.current.y,
        })
      } else if (isResizing && resizeDirection) {
        let deltaX = e.clientX - resizeStartPos.current.x
        let deltaY = e.clientY - resizeStartPos.current.y

        let newWidth = resizeStartSize.current.width
        let newHeight = resizeStartSize.current.height

        if (resizeDirection.includes("e")) {
          newWidth = Math.max(resizeStartSize.current.width + deltaX, minWidth)
        } else if (resizeDirection.includes("w")) {
          newWidth = Math.max(resizeStartSize.current.width - deltaX, minWidth)
          if (newWidth !== resizeStartSize.current.width - deltaX) {
            const deltaXVal = resizeStartSize.current.width - newWidth
            deltaX = deltaXVal
          }
          setPosition((prev) => ({
            ...prev,
            x: position.x + deltaX,
          }))
        }

        if (resizeDirection.includes("s")) {
          newHeight = Math.max(resizeStartSize.current.height + deltaY, minHeight)
        } else if (resizeDirection.includes("n")) {
          newHeight = Math.max(resizeStartSize.current.height - deltaY, minHeight)
          if (newHeight !== resizeStartSize.current.height - deltaY) {
            const deltaYVal = resizeStartSize.current.height - newHeight
            deltaY = deltaYVal
          }
          setPosition((prev) => ({
            ...prev,
            y: position.y + deltaY,
          }))
        }

        setSize({ width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeDirection(null)
    }

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isResizing, minHeight, minWidth, position, resizeDirection])

  return (
    <div
      ref={elementRef}
      className={cn(
        "absolute border border-gray-300 bg-white rounded-md shadow-md",
        isDragging && "cursor-grabbing",
        !isDragging && !isResizing && "cursor-grab",
        className,
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      {children}

      {/* Resize handles */}
      <div
        className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, "nw")}
      />
      <div
        className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, "ne")}
      />
      <div
        className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, "sw")}
      />
      <div
        className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize"
        onMouseDown={(e) => handleResizeMouseDown(e, "se")}
      />
      <div
        className="absolute top-0 w-full h-3 cursor-ns-resize"
        style={{ left: "3px", right: "3px", width: "calc(100% - 6px)" }}
        onMouseDown={(e) => handleResizeMouseDown(e, "n")}
      />
      <div
        className="absolute bottom-0 w-full h-3 cursor-ns-resize"
        style={{ left: "3px", right: "3px", width: "calc(100% - 6px)" }}
        onMouseDown={(e) => handleResizeMouseDown(e, "s")}
      />
      <div
        className="absolute left-0 h-full w-3 cursor-ew-resize"
        style={{ top: "3px", bottom: "3px", height: "calc(100% - 6px)" }}
        onMouseDown={(e) => handleResizeMouseDown(e, "w")}
      />
      <div
        className="absolute right-0 h-full w-3 cursor-ew-resize"
        style={{ top: "3px", bottom: "3px", height: "calc(100% - 6px)" }}
        onMouseDown={(e) => handleResizeMouseDown(e, "e")}
      />
    </div>
  )
}

