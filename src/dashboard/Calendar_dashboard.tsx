// "use client";

// import { useState } from "react";
// import { Calendar } from "@/components/ui/calendar";

// interface DateSelectorProps {
//   className?: string;
// }

// export function DateSelector({ className }: DateSelectorProps) {
//   const [date, setDate] = useState<Date | undefined>(new Date());

//   return (
//     <div className={` overflow-hidden w-full h-full ${className}`}>
//       <Calendar
//         mode="single"
//         selected={date}
//         onSelect={setDate}
//         className=" p-1 pb-1 border rounded-md"
//       />
//     </div>
//   );
// }


"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Mock data for calendar events
const events = [
  { id: 1, date: "2025-03-15", title: "UX Design Final Project Due", type: "assignment" },
  { id: 2, date: "2025-03-18", title: "Web Dev Quiz", type: "quiz" },
  { id: 3, date: "2025-03-20", title: "Data Science Lab", type: "lab" },
  { id: 4, date: "2025-03-22", title: "Group Project Meeting", type: "meeting" },
]

export function DashboardCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Get month name and year
  const monthName = currentMonth.toLocaleString("default", { month: "long" })
  const year = currentMonth.getFullYear()

  // Get days in month
  const daysInMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate()

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(year, currentMonth.getMonth(), 1).getDay()

  // Create calendar days array
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Create empty cells for days before the first day of the month
  const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => null)

  // Combine empty cells and days
  const calendarCells = [...emptyCells, ...days]

  // Get today's date
  const today = new Date()
  const isCurrentMonth =
    today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear()
  const currentDate = today.getDate()

  // Get upcoming events (simplified for demo)
  const upcomingEvents = events.slice(0, 3)

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Calendar</CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {monthName} {year}
          </span>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarCells.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center text-xs rounded-full
                ${day === null ? "" : "hover:bg-muted cursor-pointer"}
                ${isCurrentMonth && day === currentDate ? "bg-primary text-primary-foreground" : ""}
              `}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t space-y-2">
          <h4 className="text-sm font-medium mb-2">Upcoming Deadlines</h4>
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-start gap-2">
              <div
                className={`
                w-2 h-2 rounded-full mt-1.5
                ${event.type === "assignment" ? "bg-red-500" : ""}
                ${event.type === "quiz" ? "bg-yellow-500" : ""}
                ${event.type === "lab" ? "bg-green-500" : ""}
                ${event.type === "meeting" ? "bg-blue-500" : ""}
              `}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

