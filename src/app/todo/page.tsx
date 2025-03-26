"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  useCreateTaskMutation,
  useRetrieveTasktodayQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/redux/features/todoApiSlice";
import { cn } from "@/lib/utils";
import { Trash2, Plus } from "lucide-react";
import Loading from "@/loading/Loading";

export default function TodoPage() {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
  });

  const { data, isLoading, refetch } = useRetrieveTasktodayQuery();
  const tasks = data?.data || [];
  const [createTask] = useCreateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleCreateTask = async () => {
    try {
      const formattedTask = {
        ...newTask,
        due_date: newTask.due_date || undefined,
      };
      await createTask(formattedTask).unwrap();
      setNewTask({ title: "", description: "", due_date: "" });
      refetch();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleToggleTask = async (taskId: number, completed: boolean) => {
    try {
      await updateTask({ id: taskId, completed: !completed }).unwrap();
      refetch();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId).unwrap();
      refetch();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen p-4 sm:p-6 lg:p-8",
        "transition-colors duration-300"
      )}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <h1
          className={cn(
            "text-2xl sm:text-3xl font-bold",
            "text-gray-900 dark:text-gray-100",
            "truncate" // Truncate long titles in the header
          )}
        >
          To-Do List
        </h1>

        {/* Create Task Form */}
        <Card
          className={cn(
            "shadow-md hover:shadow-lg transition-shadow duration-300",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700"
          )}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="grid gap-4">
              <Input
                spellCheck="true"
                placeholder="Task title (max 100 chars)"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    title: e.target.value.slice(0, 100), // Limit input length
                  })
                }
                className={cn(
                  "bg-gray-50 dark:bg-gray-700",
                  "text-gray-900 dark:text-gray-100",
                  "border-gray-300 dark:border-gray-600",
                  "focus:ring-2 focus:ring-primary/50",
                  "h-10 sm:h-11",
                  "truncate" // Truncate long text in input field
                )}
              />
              <Input
                placeholder="Description (max 500 chars)"
                spellCheck="true"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    description: e.target.value.slice(0, 500), // Limit input length
                  })
                }
                className={cn(
                  "bg-gray-50 dark:bg-gray-700",
                  "text-gray-900 dark:text-gray-100",
                  "border-gray-300 dark:border-gray-600",
                  "focus:ring-2 focus:ring-primary/50",
                  "h-10 sm:h-11",
                  "truncate"
                )}
              />
              <Input
                type="date"
                value={newTask.due_date}
                onChange={(e) =>
                  setNewTask({ ...newTask, due_date: e.target.value })
                }
                className={cn(
                  "bg-gray-50 dark:bg-gray-700",
                  "text-gray-900 dark:text-gray-100",
                  "border-gray-300 dark:border-gray-600",
                  "focus:ring-2 focus:ring-primary/50",
                  "h-10 sm:h-11"
                )}
              />
              <Button
                onClick={handleCreateTask}
                className={cn(
                  "w-full h-10 sm:h-11",
                  "bg-primary hover:bg-primary/90",
                  "text-white",
                  "transition-colors duration-200",
                  "dark:bg-amber-900 rounded-4xl"
                )}
              >
                <Plus className="h-12 w-12" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <Card
          className={cn(
            "shadow-md hover:shadow-lg transition-shadow duration-300",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700"
          )}
        >
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <CardTitle
              className={cn(
                "text-lg sm:text-xl font-semibold",
                "text-gray-900 dark:text-gray-100"
              )}
            >
              Your Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {isLoading ? (
              <Loading />
            ) : tasks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No tasks yet.</p>
            ) : (
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-start justify-between p-4",
                      "bg-gray-50 dark:bg-gray-700",
                      "rounded-lg",
                      "border border-gray-200 dark:border-gray-600",
                      "transition-colors duration-200"
                    )}
                  >
                    <div className="flex items-start space-x-3 w-full sm:w-3/4">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() =>
                          handleToggleTask(task.id!, task.completed)
                        }
                        className="mt-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <p
                          className={cn(
                            "text-base font-medium",
                            task.completed
                              ? "line-through text-gray-500 dark:text-gray-400"
                              : "text-gray-900 dark:text-gray-100",
                            "break-words line-clamp-2" // Limit to 2 lines with ellipsis
                          )}
                        >
                          {task.title}
                        </p>
                        {task.description && (
                          <p
                            className={cn(
                              "text-sm",
                              task.completed
                                ? "line-through text-gray-400 dark:text-gray-500"
                                : "text-gray-700 dark:text-gray-300",
                              "break-words line-clamp-3" // Limit to 3 lines with ellipsis
                            )}
                          >
                            {task.description}
                          </p>
                        )}
                        <p
                          className={cn(
                            "text-sm",
                            "text-gray-600 dark:text-gray-400",
                            "break-words"
                          )}
                        >
                          Due:{" "}
                          {task.due_date
                            ? format(new Date(task.due_date), "PPP")
                            : "No due date"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id!)}
                      className={cn(
                        "mt-2 sm:mt-0 sm:ml-4",
                        "h-9 flex-shrink-0",
                        "bg-none hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800",
                        "text-white",
                        "transition-colors duration-200",
                        "text-center items-center justify-center rounded-full"
                      )}
                    >
                      <Trash2 className="h-12 w-12" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
