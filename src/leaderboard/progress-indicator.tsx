"use client"

import { motion } from "framer-motion"

interface ProgressIndicatorProps {
  value: number
}

export function ProgressIndicator({ value }: ProgressIndicatorProps) {
  // Determine color based on progress value
  const getColorClass = (value: number) => {
    if (value >= 80) return "bg-green-500"
    if (value >= 60) return "bg-blue-500"
    if (value >= 40) return "bg-yellow-500"
    if (value >= 20) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColorClass(value)}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <span className="text-xs font-medium w-7 text-right">{value}%</span>
    </div>
  )
}

