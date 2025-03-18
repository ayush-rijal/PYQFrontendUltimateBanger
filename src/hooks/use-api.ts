"use client"

import { useState, useEffect } from "react"
import { api, ApiError } from "@/lib/api"

interface ApiState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

// Generic hook for API calls
function useApi<T>(apiCall: () => Promise<T>, dependencies: any[] = []): ApiState<T> & { refetch: () => void } {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: true,
    error: null,
  })

  const fetchData = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const data = await apiCall()
      setState({ data, isLoading: false, error: null })
    } catch (error) {
      console.error("API Error:", error)
      setState({
        data: null,
        isLoading: false,
        error:
          error instanceof ApiError
            ? `Error ${error.status}: ${error.message}`
            : "An unexpected error occurred. Please try again.",
      })
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)

  return {
    ...state,
    refetch: fetchData,
  }
}

// Specific hooks for each API endpoint
export function useCategories() {
  return useApi(() => api.getCategories(), [])
}

export function useSubcategories(category0: string) {
  return useApi(() => api.getSubcategories(category0), [category0])
}

export function useQuizFiles(category0: string, category1: string) {
  return useApi(() => api.getQuizFiles(category0, category1), [category0, category1])
}

export function useQuestions(category0: string, category1: string, quizFile: string) {
  return useApi(() => api.getQuestions(category0, category1, quizFile), [category0, category1, quizFile])
}

export function useQuestion(category0: string, category1: string, quizFile: string, questionId: number) {
  return useApi(
    () => api.getQuestion(category0, category1, quizFile, questionId),
    [category0, category1, quizFile, questionId],
  )
}

export function useChoices(category0: string, category1: string, quizFile: string, questionId: number) {
  return useApi(
    () => api.getChoices(category0, category1, quizFile, questionId),
    [category0, category1, quizFile, questionId],
  )
}

