"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  useCreateTaskMutation,
  useRetrieveTasktodayQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/redux/features/todoApiSlice";
import { cn } from "@/lib/utils";
import {
  Trash2,
  Plus,
  Calendar,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Loading from "@/loading/Loading";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function TodoPage() {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: format(new Date(), "yyyy-MM-dd"),
  });
  const [activeTab, setActiveTab] = useState("all");

  const { data, isLoading, refetch } = useRetrieveTasktodayQuery();
  const tasks = data?.data || [];
  const [createTask] = useCreateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast.error("Task title cannot be empty!");
      return;
    }

    try {
      const formattedTask = {
        ...newTask,
        due_date: newTask.due_date || undefined,
      };
      await createTask(formattedTask).unwrap();
      setNewTask({
        title: "",
        description: "",
        due_date: format(new Date(), "yyyy-MM-dd"),
      });
      // No need to manually update local state; cache is updated by mutation
      toast.success("Task created successfully!");
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task.");
    }
  };

  const handleToggleTask = async (taskId: number, completed: boolean) => {
    try {
      await updateTask({ id: taskId, completed: !completed }).unwrap();
      toast.success(
        completed ? "Task marked as incomplete!" : "Task completed!"
      );
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task.");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId).unwrap();
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    if (activeTab === "completed") return task.completed;
    if (activeTab === "pending") return !task.completed;
    return true;
  });

  const isPastDue = (dueDate: string) => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    return taskDate < today;
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 ">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-primary" />
            <span>Today&apos;s Tasks</span>
          </h1>
          <Badge variant="outline" className="px-3 py-1 text-sm">
            {tasks.filter((t) => !t.completed).length} pending
          </Badge>
        </div>

        {/* Create Task Form */}
        <Card className="shadow-lg border-t-4 border-t-primary bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-700 pb-2">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Add New Task
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-4">
            <div className="grid gap-4">
              <Input
                spellCheck="true"
                placeholder="What needs to be done?"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    title: e.target.value.slice(0, 100),
                  })
                }
                className="h-12 text-base border-gray-300 dark:border-gray-600 focus:ring-primary"
              />
              <Textarea
                placeholder="Add details (optional)"
                spellCheck="true"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    description: e.target.value.slice(0, 500),
                  })
                }
                className="min-h-[80px] text-base border-gray-300 dark:border-gray-600 focus:ring-primary"
              />
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <Input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) =>
                    setNewTask({ ...newTask, due_date: e.target.value })
                  }
                  className="h-12 border-gray-300 dark:border-gray-600 focus:ring-primary"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
            <Button
              onClick={handleCreateTask}
              disabled={!newTask.title.trim()}
              size="lg"
              className="w-full gap-2 text-base bg-primary hover:bg-primary/90"
            >
              <Plus className="h-5 w-5" />
              Add Task
            </Button>
          </CardFooter>
        </Card>

        {/* Task List */}
        <Card className="shadow-lg bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
          <CardHeader className="bg-gray-50 dark:bg-gray-700 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Your Tasks
              </CardTitle>
            </div>
          </CardHeader>

          <Tabs
            defaultValue="all"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <div className="px-6 pt-2 bg-gray-50 dark:bg-gray-700">
              <TabsList className="grid w-full grid-cols-3 bg-gray-200 dark:bg-gray-600">
                <TabsTrigger
                  value="all"
                  className="text-gray-700 dark:text-gray-200"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="text-gray-700 dark:text-gray-200"
                >
                  Pending
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="text-gray-700 dark:text-gray-200"
                >
                  Completed
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="m-0">
              <CardContent className="p-4 sm:p-6">
                {renderTaskList(filteredTasks)}
              </CardContent>
            </TabsContent>

            <TabsContent value="pending" className="m-0">
              <CardContent className="p-4 sm:p-6">
                {renderTaskList(filteredTasks)}
              </CardContent>
            </TabsContent>

            <TabsContent value="completed" className="m-0">
              <CardContent className="p-4 sm:p-6">
                {renderTaskList(filteredTasks)}
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );

  function renderTaskList(taskList: any[]) {
    if (isLoading) {
      return <Loading />;
    }

    if (taskList.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
            <ClipboardList className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {activeTab === "all"
              ? "No tasks yet. Add your first task above!"
              : activeTab === "completed"
              ? "No completed tasks yet."
              : "No pending tasks."}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {taskList.map((task, index) => {
          const rotation = Math.random() * 3 * (index % 2 === 0 ? 1 : -1);

          let bgColor = "bg-yellow-100 dark:bg-yellow-900/40";
          let borderColor = "border-yellow-300 dark:border-yellow-700";
          let shadowColor = "shadow-yellow-300/50 dark:shadow-yellow-800/30";

          if (task.completed) {
            bgColor = "bg-green-100 dark:bg-green-900/40";
            borderColor = "border-green-300 dark:border-green-700";
            shadowColor = "shadow-green-300/50 dark:shadow-green-800/30";
          } else if (isPastDue(task.due_date)) {
            bgColor = "bg-red-100 dark:bg-red-900/40";
            borderColor = "border-red-300 dark:border-red-700";
            shadowColor = "shadow-red-300/50 dark:shadow-red-800/30";
          } else if (task.due_date) {
            const dueDate = new Date(task.due_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dueDate.getTime() === today.getTime()) {
              bgColor = "bg-amber-100 dark:bg-amber-900/40";
              borderColor = "border-amber-300 dark:border-amber-700";
              shadowColor = "shadow-amber-300/50 dark:shadow-amber-800/30";
            }
          }

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, rotate: rotation }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "relative p-5 rounded-md border-2",
                "transform transition-all duration-300 ease-in-out",
                "hover:shadow-xl hover:-translate-y-1 hover:rotate-0",
                "min-h-[200px] flex flex-col",
                bgColor,
                borderColor,
                `shadow-lg ${shadowColor}`,
                "before:absolute before:bottom-0 before:right-0 before:w-8 before:h-8 before:bg-gray-200/50 before:dark:bg-gray-700/50 before:rounded-tl-md before:shadow-inner before:transform before:-rotate-45 before:origin-bottom-right"
              )}
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              {/* Pin */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-red-500 shadow-md border-2 border-white dark:border-gray-800" />

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 w-full">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() =>
                      handleToggleTask(task.id!, task.completed)
                    }
                    className={cn(
                      "mt-1 h-5 w-5",
                      task.completed ? "text-green-500" : ""
                    )}
                  />
                  <h3
                    className={cn(
                      "text-xl font-semibold break-words flex-1",
                      task.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : "text-gray-900 dark:text-gray-100"
                    )}
                  >
                    {task.title}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTask(task.id!)}
                    className="h-8 w-8 rounded-full text-gray-500 hover:text-red-500 hover:bg-red-200/50 dark:hover:bg-red-800/30 -mr-1 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Always render description section, even if empty */}
              <div className="flex-1 overflow-auto mb-3 max-h-[100px]">
                <p
                  className={cn(
                    "text-base break-words whitespace-pre-wrap",
                    task.completed
                      ? "line-through text-gray-400 dark:text-gray-500"
                      : "text-gray-700 dark:text-gray-300"
                  )}
                >
                  {task.description || "No description provided."}
                </p>
              </div>

              {task.due_date && (
                <div className="mt-auto pt-2 border-t border-gray-300/50 dark:border-gray-600/50 flex items-center gap-1.5">
                  <Calendar
                    className={cn(
                      "h-4 w-4",
                      isPastDue(task.due_date) && !task.completed
                        ? "text-red-500"
                        : "text-gray-500"
                    )}
                  />
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isPastDue(task.due_date) && !task.completed
                        ? "text-red-500"
                        : "text-gray-500"
                    )}
                  >
                    {isPastDue(task.due_date) && !task.completed ? (
                      <span className="flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        Overdue: {format(new Date(task.due_date), "PPP")}
                      </span>
                    ) : (
                      format(new Date(task.due_date), "PPP")
                    )}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  }
}
