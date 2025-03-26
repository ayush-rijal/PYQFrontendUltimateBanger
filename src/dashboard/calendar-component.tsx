"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"

interface CalendarCardProps {
  variant: "purple" | "beige" | "green"
}

export function CalendarCard({ variant }: CalendarCardProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Variant styles for light and dark modes
  const variantStyles = {
    purple: "bg-purple-100 dark:bg-purple-900/50 border-purple-200 dark:border-purple-800",
    beige: "bg-amber-100 dark:bg-amber-900/50 border-amber-200 dark:border-amber-800",
    green: "bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-800",
  }

  return (
    <Card
      className={`rounded-xl p-5 flex flex-col gap-4 border ${variantStyles[variant]} hover:shadow-lg transition-all duration-300`}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-sm">
        <CalendarIcon className="text-gray-800 dark:text-gray-200" size={24} />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Calendar</h3>

      {/* Calendar */}
      <div className="calendar-container w-full">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border-0 bg-white/80 dark:bg-gray-800/80 p-2"
        />
      </div>
    </Card>
  )
}

