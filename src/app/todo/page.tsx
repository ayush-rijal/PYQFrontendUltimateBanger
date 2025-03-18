"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { format } from "date-fns";
import { Task, NewTask } from "@/app/types/types";

export default function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    due_date: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Task[]>("http://localhost:8000/api/tasks/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      await axios.post("http://localhost:8000/api/tasks/", newTask, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNewTask({ title: "", description: "", due_date: "" });
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleToggleTask = async (taskId: number, completed: boolean) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/tasks/${taskId}/`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${taskId}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">To-Do List</h1>

        {/* Create Task Form */}
        <Card className="bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <Input
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
              <Input
                placeholder="Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
              <Input
                type="datetime-local"
                value={newTask.due_date}
                onChange={(e) =>
                  setNewTask({ ...newTask, due_date: e.target.value })
                }
              />
              <Button onClick={handleCreateTask} className="w-full">
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : tasks.length === 0 ? (
              <p className="text-gray-500">No tasks yet.</p>
            ) : (
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() =>
                          handleToggleTask(task.id, task.completed)
                        }
                      />
                      <div>
                        <p
                          className={
                            task.completed
                              ? "line-through text-gray-500"
                              : "text-gray-800"
                          }
                        >
                          {task.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          Due: {format(new Date(task.due_date), "PPPp")}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
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