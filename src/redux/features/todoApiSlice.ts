import {tdapiSlice}  from '@/redux/services/tdapislice';

// Types for todoapi

interface Task{
    id?:number,
    title:string,
    due_date?:string,
    completed:boolean,
    user:string,
    description?: string;
}





const todoApiSlice = tdapiSlice.injectEndpoints({
    endpoints: builder => ({

//Quizapi endpoints
//Partial will include ? to every interface attribute
createTask:builder.mutation<Task,Partial<Task>>({
    query: (task) => ({
        url: '/create/',
        method: 'POST',
        body: task,
    }),

}),

retrieveTasktoday: builder.query<Task, void>({
    query: () => '/today/',
  }),


  updateTask: builder.mutation<Task, { id: number; completed: boolean }>({
    query: ({ id, completed }) => ({
      url: `/update/${id}/`,
      method: 'PATCH',
      body: { completed },
    }),
  }),


  
deleteTask:builder.mutation<void,number>({
    query:(taskId)=>({
        url:`/delete/${taskId}/`,
        method:'DELETE',
    }),
})


    }),
});

export const {
useCreateTaskMutation,
useRetrieveTasktodayQuery,
useDeleteTaskMutation,
useUpdateTaskMutation,
}=todoApiSlice;