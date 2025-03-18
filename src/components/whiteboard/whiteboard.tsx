"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import type { Socket } from "socket.io-client"
import { cn } from "@/lib/utils"
import { useWhiteboard } from "@/hooks/use-whiteboard"

interface WhiteboardProps {
  socket: Socket | null
  currentTool: "pen" | "eraser"
  penColor: string
  penSize: number
  eraserSize: number
}

interface DrawingPoint {
  x: number
  y: number
  color?: string
  size?: number
  tool?: "pen" | "eraser"
}

export function Whiteboard({ socket, currentTool, penColor, penSize, eraserSize }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    startDrawing: startDraw,
    draw: continueDraw,
    endDrawing: endDraw,
  } = useWhiteboard({
    socket,
    canvasRef,
  })

  // Initialize canvas and set up event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateCanvasSize = () => {
      setCanvasSize({
        width: container.clientWidth,
        height: container.clientHeight,
      })
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    return () => {
      window.removeEventListener("resize", updateCanvasSize)
    }
  }, [])

  // Set up socket event listeners for real-time collaboration
  useEffect(() => {
    if (!socket) return

    socket.on("draw", (data: { points: DrawingPoint[]; tool: "pen" | "eraser" }) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      if (data.points.length < 2) return

      ctx.beginPath()
      ctx.moveTo(data.points[0].x, data.points[0].y)

      for (let i = 1; i < data.points.length; i++) {
        ctx.lineTo(data.points[i].x, data.points[i].y)
      }

      if (data.tool === "pen") {
        ctx.strokeStyle = data.points[0].color || penColor
        ctx.lineWidth = data.points[0].size || penSize
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.stroke()
      } else if (data.tool === "eraser") {
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = data.points[0].size || eraserSize
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.stroke()
      }
    })

    socket.on("clear", () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
    })

    return () => {
      socket.off("draw")
      socket.off("clear")
    }
  }, [socket, penColor, penSize, eraserSize])

  // Drawing event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    startDraw(x, y)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    continueDraw(x, y)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const y = e.touches[0].clientY - rect.top

    startDraw(x, y)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const y = e.touches[0].clientY - rect.top

    continueDraw(x, y)
  }

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className={cn(
          "absolute top-0 left-0 w-full h-full bg-white",
          currentTool === "pen" ? "cursor-pencil" : "cursor-eraser",
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={endDraw}
      />
    </div>
  )
}

