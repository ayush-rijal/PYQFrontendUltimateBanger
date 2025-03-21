// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Checkbox } from "@/components/ui/checkbox";
// // import axios from "axios";
// import { format } from "date-fns";
// import { Task, NewTask } from "@/app/types/types";
// import {
//   useCreateTaskMutation,
//   useRetrieveTasktodayQuery,
//   useDeleteTaskMutation,
// } from "@/redux/features/todoApiSlice";



// export default function TodoPage() {
//   const [newTask, setNewTask] = useState<NewTask>({
//     title: "",
//     description: "",
//     due_date: "",
//   });


//   // const [loading, setLoading] = useState<boolean>(false);

//   // useEffect(() => {
//   //   fetchTasks();
//   // }, []);


//   // const fetchTasks = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const response = await axios.get<Task[]>("http://localhost:8000/todoapi/today/", {
//   //       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   //     });
//   //     setTasks(response.data);
//   //   } catch (error) {
//   //     console.error("Error fetching tasks:", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const { data: tasks = [] as Task[], isLoading, refetch } = useRetrieveTasktodayQuery();

//   // Mutations for creating and deleting tasks
//   const [createTask] = useCreateTaskMutation();
//   const [deleteTask] = useDeleteTaskMutation();



//   // Refetch tasks on mount (optional, since RTK Query fetches automatically)
//   useEffect(() => {
//     refetch();
//   }, [refetch]);

//   // const handleCreateTask = async () => {
//   //   try {
//   //     await axios.post("http://localhost:8000/todoapi/create/", newTask, {
//   //       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   //     });
//   //     setNewTask({ title: "", description: "", due_date: "" });
//   //     fetchTasks();
//   //   } catch (error) {
//   //     console.error("Error creating task:", error);
//   //   }
//   // };
//   const handleCreateTask = async () => {
//     try {
//       await createTask(newTask).unwrap();
//       setNewTask({ title: "", description: "", due_date: "" });
//       refetch(); // Refetch tasks after creating
//     } catch (error) {
//       console.error("Error creating task:", error);
//     }
//   };

//   // const handleToggleTask = async (taskId: number, completed: boolean) => {
//   //   try {
//   //     await axios.patch(
//   //       `http://localhost:8000/api/tasks/${taskId}/`,
//   //       { completed: !completed },
//   //       { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//   //     );
//   //     fetchTasks();
//   //   } catch (error) {
//   //     console.error("Error updating task:", error);
//   //   }
//   // };

//   const handleToggleTask = async (taskId: number, completed: boolean) => {
//     try {
//       // Note: Your current todoApiSlice doesn’t have an update endpoint.
//       // This is a placeholder; you’d need to add an updateTask mutation.
//       console.log(`Toggle task ${taskId} to ${!completed}`);
//       refetch(); // Refetch after toggling (if update endpoint added)
//     } catch (error) {
//       console.error("Error updating task:", error);
//     }
//   };



//   // const handleDeleteTask = async (taskId: number) => {
//   //   try {
//   //     await axios.delete(`http://localhost:8000/api/tasks/${taskId}/`, {
//   //       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   //     });
//   //     fetchTasks();
//   //   } catch (error) {
//   //     console.error("Error deleting task:", error);
//   //   }
//   // };
//   const handleDeleteTask = async (taskId: number) => {
//     try {
//       await deleteTask(taskId).unwrap();
//       refetch(); // Refetch tasks after deleting
//     } catch (error) {
//       console.error("Error deleting task:", error);
//     }
//   };



//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-4xl mx-auto space-y-6">
//         <h1 className="text-3xl font-bold text-gray-800">To-Do List</h1>

//         {/* Create Task Form */}
//         <Card className="bg-white shadow-sm">
//           <CardContent className="pt-6">
//             <div className="grid gap-4">
//               <Input
//                 placeholder="Task title"
//                 value={newTask.title}
//                 onChange={(e) =>
//                   setNewTask({ ...newTask, title: e.target.value })
//                 }
//               />
              
//               <Input
//                 placeholder="Description"
//                 value={newTask.description}
//                 onChange={(e) =>
//                   setNewTask({ ...newTask, description: e.target.value })
//                 }
//               />
//               <Input
//                 // type="datetime-local"
//                 type="date"
//                 value={newTask.due_date}
//                 onChange={(e) =>
//                   setNewTask({ ...newTask, due_date: e.target.value })
//                 }
//               />
            

//               <Button onClick={handleCreateTask} className="w-full">
//                 Add Task
//               </Button>

              
//             </div>
//           </CardContent>
//         </Card>

//         {/* Task List */}
//         <Card className="bg-white shadow-sm">
//           <CardHeader>
//             <CardTitle>Your Tasks</CardTitle>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <p>Loading...</p>
//             ) : Array.isArray(tasks) && tasks.length === 0 ? (
//               <p className="text-gray-500">No tasks yet.</p>
//             ) : (
//               <ul className="space-y-4">
//                 {Array.isArray(tasks) && tasks.map((task) => (
//                   <li
//                     key={task.id}
//                     className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
//                   >
//                     <div className="flex items-center space-x-3">
//                       <Checkbox
//                         checked={task.completed}
//                         onCheckedChange={() =>
//                           handleToggleTask(task.id, task.completed)
//                         }
//                       />
//                       <div>
//                         <p
//                           className={
//                             task.completed
//                               ? "line-through text-gray-500"
//                               : "text-gray-800"
//                           }
//                         >
//                           {task.title}
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           Due: {task.due_date ? format(new Date(task.due_date), "PPP") : "No due date"}
//                         </p>
//                       </div>
//                     </div>
//                     <Button
//                       variant="destructive"
//                       size="sm"
//                       onClick={() => handleDeleteTask(task.id)}
//                     >
//                       Delete
//                     </Button>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </CardContent>
//         </Card>
       
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Task, NewTask } from "@/app/types/types";
import {
  useCreateTaskMutation,
  useRetrieveTasktodayQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/redux/features/todoApiSlice";

export default function TodoPage() {
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    due_date: "",
  });

  const { data, isLoading, refetch } = useRetrieveTasktodayQuery();
  const tasks = data?.data || []; // Extract the 'data' array, default to empty array
  const [createTask] = useCreateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation(); // Add this

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleCreateTask = async () => {
    try {
      const formattedTask = {
        ...newTask,
        due_date: newTask.due_date ? newTask.due_date : undefined,
      };
      await createTask(formattedTask).unwrap();
      setNewTask({ title: "", description: "", due_date: "" });
      refetch();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // const handleToggleTask = async (taskId: number, completed: boolean) => {
  //   try {
  //     console.log(`Toggle task ${taskId} to ${!completed}`);
  //     refetch();
  //   } catch (error) {
  //     console.error("Error updating task:", error);
  //   }
  // };
  
  const handleToggleTask = async (taskId: number, completed: boolean) => {
    try {
      console.log(`Toggle task ${taskId} to ${!completed}`);
      await updateTask({ id: taskId, completed: !completed }).unwrap(); // Update the task
      refetch(); // Fetch updated tasks
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
                type="date"
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
            {isLoading ? (
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
                          handleToggleTask(task.id!, task.completed)
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