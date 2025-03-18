"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, Calendar, CheckCircle,  } from "lucide-react"
import axios from "axios"
import { format } from "date-fns"
import type { Task } from "@/app/types/types"

export default function DashboardTodo() {
  const [todayTasks, setTodayTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  

  useEffect(() => {
    fetchTodayTasks()
  }, [])

  const fetchTodayTasks = async () => {
    setLoading(true)
    try {
      const response = await axios.get<{ data: Task[] }>("/api/tasks/today", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      setTodayTasks(response.data.data)
    } catch (error) {
      console.error("Error fetching today's tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTaskCompletion = async (taskId: number, completed: boolean) => {
    try {
      await axios.patch(
        `/api/tasks/${taskId}`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
      )

      // Update local state
      setTodayTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? { ...task, completed: !completed } : task))
      )
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  

  const getTimeStatus = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const hoursLeft = Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60))

    if (hoursLeft < 0) return { label: "Overdue", variant: "destructive" }
    if (hoursLeft < 3) return { label: "Urgent", variant: "destructive" }
    if (hoursLeft < 6) return { label: "Soon", variant: "outline" }
    return { label: "Upcoming", variant: "default" }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Today&apos;s Tasks</h1>
         
        </div>

        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>{format(new Date(), "EEEE, MMMM d")}</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 animate-pulse">
                    <div className="h-5 w-5 rounded-full bg-muted"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : todayTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No tasks for today. Enjoy your day!</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {todayTasks.map((task) => {
                  const timeStatus = getTimeStatus(task.due_date)

                  return (
                    <li
                      key={task.id}
                      className={`p-4 rounded-lg border flex items-start gap-3 transition-all ${
                        task.completed ? "bg-muted/50 border-muted" : "bg-card hover:border-primary/30 hover:shadow-sm"
                      }`}
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id, task.completed)}
                        className="mt-1"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                            {task.title}
                          </p>

                          <Badge variant={timeStatus.variant as "destructive" | "outline" | "default" | "secondary"} className="whitespace-nowrap">
                            {timeStatus.label}
                          </Badge>
                        </div>

                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{format(new Date(task.due_date), "h:mm a")}</span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>

          <CardFooter className="border-t pt-4 flex justify-between">
            <p className="text-sm text-muted-foreground">
              {todayTasks.filter((t) => t.completed).length} of {todayTasks.length} tasks completed
            </p>
            <Button variant="outline" size="sm" onClick={fetchTodayTasks} className="text-xs">
              Refresh
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

