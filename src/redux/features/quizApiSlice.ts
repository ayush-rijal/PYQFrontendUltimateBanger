import { number, string } from "zod";
import { qapiSlice } from "../services/qapiSlice";
import { baseQuery } from "../services/qapiSlice";

// Types for quizapi
interface Category{
  name:string;
  id:number;
  level:number;
  children:Category[];  //Nested children

}

interface QuestionsFile {
  title: string;
  description:string;
  category:string; //Slug field (name of the category)
  created_at: string;
}

interface Question {
  id: number;
  text: string;
  questions_file_title: string;
  subject_category_name: string;
}

interface Choice {
  id: number;
  text: string;
  is_correct: boolean;
  question: number;
}

interface QuestionsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Question[];
}

interface QuizResult {
  questions_file:string; //Title fo the questions file
  points:number;
  completed_at:string | null;
}

interface LeaderboardEntry{
  username:string;
  total_points:number;
  last_updated:string;
}

// Fetch all questions for sidebar with proper error typing
const fetchAllQuestions = async (
  initialUrl: string,
  api: { dispatch: (action: any) => void; getState: () => any },
  extraOptions: any
): Promise<Question[]> => {
  let allQuestions: Question[] = [];
  let nextUrl: string | null = initialUrl;

  while (nextUrl) {
    const response = await baseQuery(nextUrl, api, extraOptions);
    if (response.error) {
      throw new Error(
        response.error.data?.detail || "Failed to fetch questions"
      );
    }
    const data = response.data as QuestionsResponse;
    allQuestions = [...allQuestions, ...data.results];
    nextUrl = data.next;
  }

  return allQuestions;
};

// Extend qapiSlice with quiz-specific endpoints
export const quizApiSlice = qapiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //Fetch all root categories
    getRootCategories:builder.query<Category[],void>({
      query:()=>'/categories/',

    }),

    // Fetch children of a category by category path
    getCategoryChildren: builder.query<Category[], string>({
      query: (categoryPath) => `/${categoryPath}/`,
    }),

    // Fetch quiz files for a category path
    getQuizFiles: builder.query<
      QuestionsFile[],
      string
    >({
      query: (categoryPath) => `/${categoryPath}/files/`,
    }),

    // Fetch all questions for a quiz file without pagination
    getAllQuestions: builder.query<
      Question[],
      { categoryPath:string, questionsFile:string }
    >({
      queryFn: async (
        { categoryPath,questionsFile },
        api,
        extraOptions
      ) => {
        const initialUrl = `/${categoryPath}/${questionsFile}/`;
        try {
          const allQuestions = await fetchAllQuestions(
            initialUrl,
            api,
            extraOptions
          );
          return { data: allQuestions };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: error instanceof Error ? error.message : "Unknown error",
            },
          };
        }
      },
    }),

    // Fetch paginated questions
    getQuestions: builder.query<
      QuestionsResponse,
      { categoryPath:string; questionsFile:string; page?:number }
    >({
      query: ({ categoryPath,questionsFile, page = 1 }) =>
        `/${categoryPath}/${questionsFile}/?page=${page}`,
    }),

    //Fetch single questions
    getQuestion:builder.query<
    Question,
    {categoryPath:string;questionsFile:string;questionId:number}>({
      query:({categoryPath,questionsFile,questionId})=>
        `/${categoryPath}/${questionsFile}/question/${questionId}/`
    }),




    // Fetch choices for a specific question
    getChoices: builder.query<
      Choice[],
      {
        categoryPath:string;
        questionsFile:string;
        questionId: number;
      }
    >({
      query: ({ categoryPath,questionsFile, questionId }) =>
        `/${categoryPath}/${questionsFile}/question/${questionId}/choices/`,
    }),

    // Submit quiz
    submitQuiz: builder.mutation<
    {status:string; 
    points:number;
    total_questions:number;
    responses:any[]},
    {
      categoryPath:string;
      questionsFile:string;
      choices:Record<number,number>;//{question_id:choice_id}
      is_submitted?:boolean; 
    }
    >(
      {
      query: ({
        categoryPath,
        questionsFile,
        choices,
        is_submitted = true,
      }) => ({
        url: `${categoryPath}/${questionsFile}/submit/`,
        method: "POST",
        body: { choices, is_submitted },
      }),
    }),

    //Fetch quiz result
    getQuizResult:builder.query<
    QuizResult,
    {categoryPath:string; questionsFile:string}
    >({
      query:({categoryPath,questionsFile})=>
        `/${categoryPath}/${questionsFile}/result/`
    }),


    //Fetch leaderboard
    getLeaderboard: builder.query({
      query: () => "leaderboard/",
    }),
  }),
});

// Export all hooks
export const {
  useGetRootCategoriesQuery,
  useGetCategoryChildrenQuery,
  useGetQuizFilesQuery,
  useGetAllQuestionsQuery,
  useGetQuestionsQuery,
  useGetQuestionQuery,
  useGetChoicesQuery,
  useSubmitQuizMutation,
  useGetQuizResultQuery,
  useGetLeaderboardQuery,
} = quizApiSlice;
