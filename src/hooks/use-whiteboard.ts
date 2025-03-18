"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import type { Socket } from "socket.io-client"

interface DrawingPoint {
  x: number
  y: number
  color?: string
  size?: number
  tool?: "pen" | "eraser"
}

interface UseWhiteboardProps {
  socket: Socket | null
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

export function useWhiteboard({ socket, canvasRef }: UseWhiteboardProps) {
  const [isDrawing, setIsDrawing] = useState(false)
  const pointsRef = useRef<DrawingPoint[]>([])
  const [currentTool, setCurrentTool] = useState<"pen" | "eraser">("pen")
  const [penColor, setPenColor] = useState("#000000")
  const [penSize, setPenSize] = useState(3)
  const [eraserSize, setEraserSize] = useState(20)

  // Clear the canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Send clear command to server
    if (socket) {
      socket.emit("clear")
    }
  }, [canvasRef, socket])

  // Save the canvas as an image
  const saveCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = `whiteboard-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  }, [canvasRef])

  // Start drawing
  const startDrawing = useCallback(
    (x: number, y: number) => {
      setIsDrawing(true)
      pointsRef.current = [
        { x, y, color: penColor, size: currentTool === "pen" ? penSize : eraserSize, tool: currentTool },
      ]

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.beginPath()
      ctx.moveTo(x, y)

      // Send drawing start to server
      if (socket) {
        socket.emit("startDrawing", {
          x,
          y,
          color: penColor,
          size: currentTool === "pen" ? penSize : eraserSize,
          tool: currentTool,
        })
      }
    },
    [canvasRef, currentTool, eraserSize, penColor, penSize, socket],
  )

  // Continue drawing
  const draw = useCallback(
    (x: number, y: number) => {
      if (!isDrawing) return

      pointsRef.current.push({ x, y })

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.lineTo(x, y)

      if (currentTool === "pen") {
        ctx.strokeStyle = penColor
        ctx.lineWidth = penSize
      } else {
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = eraserSize
      }

      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.stroke()

      // Send drawing data to server
      if (socket) {
        socket.emit("draw", {
          x,
          y,
          color: penColor,
          size: currentTool === "pen" ? penSize : eraserSize,
          tool: currentTool,
        })
      }
    },
    [canvasRef, currentTool, eraserSize, isDrawing, penColor, penSize, socket],
  )

  // End drawing
  const endDrawing = useCallback(() => {
    if (!isDrawing) return

    setIsDrawing(false)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.closePath()

    // Send drawing end and points to server
    if (socket && pointsRef.current.length > 1) {
      socket.emit("endDrawing", {
        points: pointsRef.current,
        tool: currentTool,
      })
    }

    pointsRef.current = []
  }, [canvasRef, currentTool, isDrawing, socket])

  return {
    isDrawing,
    currentTool,
    setCurrentTool,
    penColor,
    setPenColor,
    penSize,
    setPenSize,
    eraserSize,
    setEraserSize,
    startDrawing,
    draw,
    endDrawing,
    clearCanvas,
    saveCanvas,
  }
}

