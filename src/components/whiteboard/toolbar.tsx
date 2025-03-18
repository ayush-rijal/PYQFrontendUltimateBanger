"use client"

import { Pencil, Eraser, Trash2, Download, Undo, Redo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ToolbarProps {
  currentTool: "pen" | "eraser"
  setCurrentTool: (tool: "pen" | "eraser") => void
  penColor: string
  setPenColor: (color: string) => void
  penSize: number
  setPenSize: (size: number) => void
  eraserSize: number
  setEraserSize: (size: number) => void
}

const COLORS = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#00ffff",
  "#ff00ff",
  "#ff9900",
  "#9900ff",
  "#990000",
  "#009900",
  "#000099",
  "#999900",
  "#009999",
  "#990099",
  "#ff9999",
  "#99ff99",
  "#9999ff",
  "#ffff99",
]

export function Toolbar({
  currentTool,
  setCurrentTool,
  penColor,
  setPenColor,
  penSize,
  setPenSize,
  eraserSize,
  setEraserSize,
}: ToolbarProps) {
  return (
    <div className="flex flex-col p-2 border-r bg-background w-16 items-center gap-2">
      <Button
        variant={currentTool === "pen" ? "default" : "ghost"}
        size="icon"
        onClick={() => setCurrentTool("pen")}
        title="Pen Tool"
      >
        <Pencil className="h-5 w-5" />
      </Button>

      <Button
        variant={currentTool === "eraser" ? "default" : "ghost"}
        size="icon"
        onClick={() => setCurrentTool("eraser")}
        title="Eraser Tool"
      >
        <Eraser className="h-5 w-5" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="mt-2" title="Color Picker">
            <div className="h-5 w-5 rounded-full border" style={{ backgroundColor: penColor }} />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" className="w-64 p-2">
          <div className="grid grid-cols-5 gap-2">
            {COLORS.map((color) => (
              <button
                key={color}
                className={cn("h-8 w-8 rounded-full border", penColor === color && "ring-2 ring-primary")}
                style={{ backgroundColor: color }}
                onClick={() => setPenColor(color)}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="mt-2" title="Tool Settings">
            <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.07095 0.650238C6.67391 0.650238 6.32977 0.925096 6.24198 1.31231L6.0039 2.36247C5.6249 2.47269 5.26335 2.62363 4.92436 2.8115L4.01335 2.23881C3.67748 2.02635 3.23978 2.07297 2.95903 2.35373L2.35373 2.95903C2.07297 3.23978 2.02635 3.67748 2.23881 4.01335L2.8115 4.92436C2.62363 5.26335 2.47269 5.6249 2.36247 6.0039L1.31231 6.24198C0.925096 6.32977 0.650238 6.67391 0.650238 7.07095V7.92905C0.650238 8.32609 0.925096 8.67023 1.31231 8.75802L2.36247 8.9961C2.47269 9.3751 2.62363 9.73665 2.8115 10.0756L2.23881 10.9866C2.02635 11.3225 2.07297 11.7602 2.35373 12.041L2.95903 12.6463C3.23978 12.927 3.67748 12.9736 4.01335 12.7612L4.92436 12.1885C5.26335 12.3764 5.6249 12.5273 6.0039 12.6375L6.24198 13.6877C6.32977 14.0749 6.67391 14.3498 7.07095 14.3498H7.92905C8.32609 14.3498 8.67023 14.0749 8.75802 13.6877L8.9961 12.6375C9.3751 12.5273 9.73665 12.3764 10.0756 12.1885L10.9866 12.7612C11.3225 12.9736 11.7602 12.927 12.041 12.6463L12.6463 12.041C12.927 11.7602 12.9736 11.3225 12.7612 10.9866L12.1885 10.0756C12.3764 9.73665 12.5273 9.3751 12.6375 8.9961L13.6877 8.75802C14.0749 8.67023 14.3498 8.32609 14.3498 7.92905V7.07095C14.3498 6.67391 14.0749 6.32977 13.6877 6.24198L12.6375 6.0039C12.5273 5.6249 12.3764 5.26335 12.1885 4.92436L12.7612 4.01335C12.9736 3.67748 12.927 3.23978 12.6463 2.95903L12.041 2.35373C11.7602 2.07297 11.3225 2.02635 10.9866 2.23881L10.0756 2.8115C9.73665 2.62363 9.3751 2.47269 8.9961 2.36247L8.75802 1.31231C8.67023 0.925096 8.32609 0.650238 7.92905 0.650238H7.07095ZM7.5 10C8.88071 10 10 8.88071 10 7.5C10 6.11929 8.88071 5 7.5 5C6.11929 5 5 6.11929 5 7.5C5 8.88071 6.11929 10 7.5 10Z"
                fill="currentColor"
              />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" className="w-64 p-2">
          <Tabs defaultValue="pen">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pen">Pen</TabsTrigger>
              <TabsTrigger value="eraser">Eraser</TabsTrigger>
            </TabsList>
            <TabsContent value="pen" className="mt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Size</span>
                    <span className="text-sm">{penSize}px</span>
                  </div>
                  <Slider value={[penSize]} min={1} max={20} step={1} onValueChange={(value) => setPenSize(value[0])} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="eraser" className="mt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Size</span>
                    <span className="text-sm">{eraserSize}px</span>
                  </div>
                  <Slider
                    value={[eraserSize]}
                    min={5}
                    max={50}
                    step={1}
                    onValueChange={(value) => setEraserSize(value[0])}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>

      <div className="mt-auto flex flex-col gap-2">
        <Button variant="ghost" size="icon" title="Clear Canvas">
          <Trash2 className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" title="Download">
          <Download className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" title="Undo" disabled>
          <Undo className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" title="Redo" disabled>
          <Redo className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

