// // types.ts
// export interface Task {
//     id: number;
//     title: string;
//     description: string;
//     completed: boolean;
//     due_date?: string;
//     created_at?: string;
//   }
  
//   export interface NewTask {
//     title: string;
//     description: string;
//     due_date?: string;
//   }

export interface Task {
  id?: number;
  title: string;
  due_date: string; // YYYY-MM-DD format
  completed: boolean;
  user: number | string; // Adjust based on backend (number here)
  description?: string; // Added to match model
}

export interface NewTask {
  title: string;
  description: string;
  due_date: string; // YYYY-MM-DD format
}