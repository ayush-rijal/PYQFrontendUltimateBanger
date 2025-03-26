"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function DashboardCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Get month name and year
  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  // Get days in month
  const daysInMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate();

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(year, currentMonth.getMonth(), 1).getDay();

  // Create calendar days array
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Create empty cells for days before the first day of the month
  const emptyCells = Array.from({ length: firstDayOfMonth }, () => null);

  // Combine empty cells and days
  const calendarCells = [...emptyCells, ...days];

  // Get today's date
  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === currentMonth.getMonth() &&
    today.getFullYear() === currentMonth.getFullYear();
  const currentDate = today.getDate();

  return (
    <Card className="col-span-1 border-none shadow-none">
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
                ${
                  isCurrentMonth && day === currentDate
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              `}
            >
              {day}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
