// Quiz Types
export interface Question {
    id: number
    text: string
    subject_category_name: string
  }
  
  export interface Choice {
    id: number
    text: string
    is_correct: boolean
  }
  
  export interface Response {
    question: number
    selected_choice: number
    is_submitted: boolean
  }
  
  export interface QuizResult {
    status: string
    points: number
    total_questions: number
    responses: Response[]
  }
  
  export interface ChartData {
    subject: string
    correct: number
    incorrect: number
  }
  
  export interface Quiz {
    question: string
    options: string[]
    answer: string
  }
  
  // Chart configuration
  export const chartConfig = {
    performance: { label: "Performance" },
    correct: { label: "Correct Answers", color: "#10B981" },
    incorrect: { label: "Incorrect Answers", color: "#EF4444" },
  }
  