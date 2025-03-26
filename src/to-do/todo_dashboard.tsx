"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Calendar,
  CheckCircle,
  Eye,
  RefreshCw,
  ListTodo,
  Save,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import {
  useRetrieveTasktodayQuery,
  useUpdateTaskMutation,
  useCreateTaskMutation,
} from "@/redux/features/todoApiSlice";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Task {
  id: number;
  title: string;
  description: string | null;
  due_date: string;
  completed: boolean;
}

export default function DashboardTodo() {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const { data, isLoading, refetch, isRefetching } =
    useRetrieveTasktodayQuery();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [createTask] = useCreateTaskMutation();

  useEffect(() => {
    if (data?.data) {
      setTodayTasks(data.data);
    }
  }, [data]);

  const handleCreateTask = async () => {
    try {
      // Format due_date to YYYY-MM-DD
      let dueDate = newTask.due_date;
      if (dueDate) {
        const parsedDate = new Date(dueDate);
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date format");
        }
        dueDate = format(parsedDate, "yyyy-MM-dd"); // Convert to YYYY-MM-DD
      } else {
        dueDate = format(new Date(), "yyyy-MM-dd"); // Default to today’s date
      }

      const formattedTask = {
        title: newTask.title || "",
        description: newTask.description || "",
        due_date: dueDate,
      };

      console.log("Sending task to server:", formattedTask); // Debug payload

      await createTask(formattedTask).unwrap();
      setNewTask({ title: "", description: "", due_date: "" });
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const toggleTaskCompletion = async (taskId: number, completed: boolean) => {
    try {
      await updateTask({ id: taskId, completed: !completed }).unwrap();
      refetch();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getTimeStatus = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const hoursLeft = Math.floor(
      (due.getTime() - now.getTime()) / (1000 * 60 * 60)
    );

    if (hoursLeft < 0)
      return {
        label: "Overdue",
        variant: "destructive",
        icon: <Clock className="h-3.5 w-3.5 mr-1" />,
      };
    if (hoursLeft < 3)
      return {
        label: "Urgent",
        variant: "destructive",
        icon: <Clock className="h-3.5 w-3.5 mr-1" />,
      };
    if (hoursLeft < 6)
      return {
        label: "Soon",
        variant: "outline",
        icon: <Clock className="h-3.5 w-3.5 mr-1" />,
      };
    return {
      label: "Upcoming",
      variant: "default",
      icon: <Clock className="h-3.5 w-3.5 mr-1" />,
    };
  };

  const completedTasksCount = todayTasks.filter((t) => t.completed).length;
  const completionPercentage =
    todayTasks.length > 0
      ? Math.round((completedTasksCount / todayTasks.length) * 100)
      : 0;

  return (
    <div className={cn("w-full shadow-xl rounded-2xl  bg-gradient-to-b ")}>
      <div className="max-w-4xl mx-auto space-y-6 gap-3">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <ListTodo className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-sm sm:text-3xl truncate">Today&apos;s Tasks</h1>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className="border border-b-3 border-amber-900"
                    >
                      <Plus />
                      Quick Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Quick Add Task</DialogTitle>
                      <DialogDescription>
                        Add a new task here. Click save when you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="title"
                          spellCheck="true"
                          placeholder="Task title (max 100 chars)"
                          value={newTask.title}
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              title: e.target.value.slice(0, 100),
                            })
                          }
                          className={cn(
                            "bg-gray-50 dark:bg-gray-700",
                            "text-gray-900 dark:text-gray-100",
                            "border-gray-300 dark:border-gray-600",
                            "focus:ring-2 focus:ring-primary/50",
                            "h-10 sm:h-11",
                            "col-span-3"
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Input
                          id="description"
                          spellCheck="true"
                          placeholder="Description (max 500 chars)"
                          value={newTask.description}
                          onChange={(e) =>
                            setNewTask({
                              ...newTask,
                              description: e.target.value.slice(0, 500),
                            })
                          }
                          className={cn(
                            "bg-gray-50 dark:bg-gray-700",
                            "text-gray-900 dark:text-gray-100",
                            "border-gray-300 dark:border-gray-600",
                            "focus:ring-2 focus:ring-primary/50",
                            "h-10 sm:h-11",
                            "truncate",
                            "col-span-3"
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="due_date" className="text-right">
                          Due Date
                        </Label>
                        <Input
                          id="due_date"
                          type="date" // Changed to "date" to match YYYY-MM-DD
                          value={newTask.due_date}
                          onChange={(e) =>
                            setNewTask({ ...newTask, due_date: e.target.value })
                          }
                          className={cn(
                            "bg-gray-50 dark:bg-gray-700",
                            "text-gray-900 dark:text-gray-100",
                            "border-gray-300 dark:border-gray-600",
                            "focus:ring-2 focus:ring-primary/50",
                            "h-10 sm:h-11",
                            "col-span-3"
                          )}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateTask} type="submit">
                        <Save />
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a new task</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Card className="border border-border shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-border bg-muted/30">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <span>{format(new Date(), "EEEE, MMMM d")}</span>
            </CardTitle>
          </CardHeader>

          <ScrollArea className="h-[200px]  sm:h-[200px] overflow-hidden">
            <CardContent className="pt-6 px-4 sm:px-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 animate-pulse p-4 rounded-lg border"
                    >
                      <div className="h-5 w-5 rounded-full bg-muted"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                        <div className="h-3 bg-muted rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : todayTasks.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="bg-primary/10 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">All caught up!</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    You have no tasks scheduled for today. Enjoy your day or add
                    a new task to get started.
                  </p>
                  <Link href="/todo" className="mt-6 inline-block">
                    <Button variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Show All Todo&apos;s
                    </Button>
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  {todayTasks.map((task) => {
                    const timeStatus = getTimeStatus(task.due_date);

                    return (
                      <li
                        key={task.id}
                        className={cn(
                          "p-4 rounded-lg border flex flex-col sm:flex-row sm:items-start gap-3",
                          task.completed
                            ? "bg-muted/30 border-muted"
                            : "bg-card hover:border-primary/30 hover:shadow-sm",
                          "transition-all duration-200"
                        )}
                      >
                        <div className="flex items-start space-x-3 w-full sm:w-3/4">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() =>
                              toggleTaskCompletion(task.id, task.completed)
                            }
                            className={cn(
                              "mt-1 flex-shrink-0 h-5 w-5 rounded-md transition-all duration-200",
                              task.completed ? "bg-primary border-primary" : ""
                            )}
                            disabled={isUpdating}
                          />
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
                              <p
                                className={cn(
                                  "font-medium text-base",
                                  task.completed
                                    ? "line-through text-muted-foreground"
                                    : "",
                                  "break-words line-clamp-2"
                                )}
                              >
                                {task.title}
                              </p>
                              <Badge
                                variant={
                                  timeStatus.variant as
                                    | "destructive"
                                    | "outline"
                                    | "default"
                                }
                                className="whitespace-nowrap flex-shrink-0 flex justify-between ml-8 text-black dark:text-white"
                              >
                                {timeStatus.icon}
                                {timeStatus.label}
                              </Badge>
                            </div>
                            {task.description && (
                              <p
                                className={cn(
                                  "text-sm",
                                  task.completed
                                    ? "line-through text-muted-foreground"
                                    : "text-foreground/80",
                                  "break-words line-clamp-3"
                                )}
                              >
                                {task.description}
                              </p>
                            )}
                            <div
                              className={cn(
                                "flex items-center text-sm text-muted-foreground",
                                "break-words"
                              )}
                            >
                              <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                              <span>
                                Due at{" "}
                                {format(new Date(task.due_date), "h:mm a")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </ScrollArea>

          {todayTasks.length > 0 && (
            <CardFooter className="border-t border-border pt-4 px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-full sm:w-2/3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {completedTasksCount} of {todayTasks.length} completed
                  </span>
                  <span className="font-medium">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
              <div className="flex gap-2 ml-auto">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        className="h-9 w-9 p-0"
                      >
                        <RefreshCw
                          className={cn(
                            "h-4 w-4",
                            isRefetching && "animate-spin"
                          )}
                        />
                        <span className="sr-only">Refresh</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Refresh tasks</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Link href="/todo">
                  <Button size="sm" className="h-9">
                    <Eye className="h-4 w-4 mr-1" />
                    View All Tasks
                  </Button>
                </Link>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
