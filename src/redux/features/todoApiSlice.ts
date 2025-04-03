// import { tdapiSlice } from "@/redux/services/tdapislice";

// // Types for todoapi
// interface Task {
//   id?: number;
//   title: string;
//   due_date?: string;
//   completed: boolean;
//   user: string;
//   description?: string; // Optional, matches your backend expectation
// }

// const todoApiSlice = tdapiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     // Create a new task
//     createTask: builder.mutation<Task, Partial<Task>>({
//       query: (task) => ({
//         url: "/create/",
//         method: "POST",
//         body: task, // Includes description if provided
//       }),
//     }),

//     // Retrieve tasks for today
//     retrieveTasktoday: builder.query<{ data: Task[] }, void>({
//       // Adjusted to match your TodoPage usage
//       query: () => "/today/",
//     }),

//     // Update task completion status
//     updateTask: builder.mutation<Task, { id: number; completed: boolean }>({
//       query: ({ id, completed }) => ({
//         url: `/update/${id}/`,
//         method: "PATCH",
//         body: { completed },
//       }),
//     }),

//     // Delete a task
//     deleteTask: builder.mutation<void, number>({
//       query: (taskId) => ({
//         url: `/delete/${taskId}/`,
//         method: "DELETE",
//       }),
//     }),
//   }),
// });

// export const {
//   useCreateTaskMutation,
//   useRetrieveTasktodayQuery,
//   useDeleteTaskMutation,
//   useUpdateTaskMutation,
// } = todoApiSlice;

import { tdapiSlice } from "@/redux/services/tdapislice";

// Types for todoapi
interface Task {
  id?: number;
  title: string;
  due_date?: string;
  completed: boolean;
  user: string;
  description?: string; // Optional, matches your backend expectation
  created_at?: string; // Added to track creation time (adjust type if needed)
}

const todoApiSlice = tdapiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new task
    createTask: builder.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "/create/",
        method: "POST",
        body: task, // Includes description if provided
      }),
      // Optimistically update the cache (optional, for better UX)
      async onQueryStarted(task, { dispatch, queryFulfilled }) {
        try {
          const { data: createdTask } = await queryFulfilled;
          dispatch(
            todoApiSlice.util.updateQueryData(
              "retrieveTasktoday",
              undefined,
              (draft) => {
                draft.data.unshift(createdTask); // Add new task to the top
              }
            )
          );
        } catch {
          // Handle error if needed
        }
      },
    }),

    // Retrieve tasks for today
    retrieveTasktoday: builder.query<{ data: Task[] }, void>({
      query: () => ({
        url: "/today/",
        params: { ordering: "-created_at" }, // Sort by creation date descending
      }),
    }),

    // Update task completion status
    updateTask: builder.mutation<Task, { id: number; completed: boolean }>({
      query: ({ id, completed }) => ({
        url: `/update/${id}/`,
        method: "PATCH",
        body: { completed },
      }),
      // Update cache after completion toggle
      async onQueryStarted({ id, completed }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todoApiSlice.util.updateQueryData(
            "retrieveTasktoday",
            undefined,
            (draft) => {
              const task = draft.data.find((t) => t.id === id);
              if (task) task.completed = completed;
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Delete a task
    deleteTask: builder.mutation<void, number>({
      query: (taskId) => ({
        url: `/delete/${taskId}/`,
        method: "DELETE",
      }),
      // Update cache after deletion
      async onQueryStarted(taskId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todoApiSlice.util.updateQueryData(
            "retrieveTasktoday",
            undefined,
            (draft) => {
              draft.data = draft.data.filter((t) => t.id !== taskId);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useRetrieveTasktodayQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} = todoApiSlice;
