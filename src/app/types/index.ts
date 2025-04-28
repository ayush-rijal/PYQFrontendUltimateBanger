export interface User {
    id: number;
    username: string;
  }
  
  export interface Author {
    id: number;
    user: User;
    bio: string;
  }
  
  export interface Comment {
    id: number;
    post: number;
    user: User;
    content: string;
    created_at: string;
  }
  
  export interface Post {
    id: number;
    title: string;
    content: string;
    author: Author;
    created_at: string;
    updated_at: string;
    comments: Comment[];
  }