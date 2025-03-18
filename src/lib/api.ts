// Base API configuration and utility functions
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/quizapi"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// Error handling utility
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

// Generic fetch function with error handling
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new ApiError(`API error: ${response.statusText}`, response.status)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Handle network errors or other issues
    throw new ApiError(error instanceof Error ? error.message : "Unknown error occurred", 0)
  }
}

// Type definitions
export interface Category {
  name: string
}

export interface QuizFile {
  title: string
  category0: number
  category1: number
  created_at: string
}

export interface Question {
  id: number
  text: string
  questions_file_title: string
  subject_category_name: string
}

export interface Choice {
  id: number
  text: string
  is_correct: boolean
  question: number
}

export interface QuestionsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Question[]
}

// API functions
export const api = {
  // Get all top-level categories (Category0)
  getCategories: () => fetchApi<Category[]>("/category0/"),

  // Get subcategories (Category1) for a specific Category0
  getSubcategories: (category0: string) => fetchApi<Category[]>(`/${category0}/`),

  // Get quiz files for a specific Category0 and Category1
  getQuizFiles: (category0: string, category1: string) => fetchApi<QuizFile[]>(`/${category0}/${category1}/`),

  // Get questions for a specific quiz file
  getQuestions: (category0: string, category1: string, quizFile: string) =>
    fetchApi<QuestionsResponse>(`/${category0}/${category1}/${quizFile}/`),

  // Get a specific question
  getQuestion: (category0: string, category1: string, quizFile: string, questionId: number) =>
    fetchApi<Question>(`/${category0}/${category1}/${quizFile}/${questionId}/`),

  // Get choices for a specific question
  getChoices: (category0: string, category1: string, quizFile: string, questionId: number) =>
    fetchApi<Choice[]>(`/${category0}/${category1}/${quizFile}/${questionId}/choices/`),
}

