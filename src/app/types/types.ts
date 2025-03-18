// types.ts
export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    due_date: string;
    created_at: string;
  }
  
  export interface NewTask {
    title: string;
    description: string;
    due_date: string;
  }