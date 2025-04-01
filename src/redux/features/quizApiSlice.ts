// import { qapiSlice } from "../services/qapiSlice";
// import { baseQuery } from "../services/qapiSlice";
// // Types for quizapi
// interface Category0 {
//   name: string;
// }
// interface Category1 {
//   name: string;
// }
// interface QuestionsFile {
//   title: string;
//   category0: number;
//   category1: number;
//   created_at: string;
// }
// interface Question {
//   id: number;
//   text: string;
//   questions_file_title: string;
//   subject_category_name: string;
//   correct_choice_id?: number;
//   choices?: Choice[];
// }
// interface Choice {
//   id: number;
//   text: string;
//   is_correct: boolean;
//   question: number;
// }
// interface QuestionsResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: Question[];
// }

// // Fetch all questions for sidebar
// const fetchAllQuestions = async (
//   initialUrl: string,
//   api: { dispatch: (action: any) => void; getState: () => any },
//   extraOptions: any
// ): Promise<Question[]> => {
//   let allQuestions: Question[] = [];
//   let nextUrl: string | null = initialUrl;

//   while (nextUrl) {
//     const response = await baseQuery(nextUrl, api, extraOptions);
//     if (response.error) throw new Error("Failed to fetch questions");
//     const data = response.data as QuestionsResponse;
//     allQuestions = [...allQuestions, ...data.results];
//     nextUrl = data.next;
//   }

//   return allQuestions;
// };

// const quizApiSlice = qapiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     //Quizapi endpoints
//     getCategory0: builder.query<Category0[], void>({
//       query: () => "/category0/",
//     }),
//     getCategory1: builder.query<Category1[], string>({
//       query: (category0) => `/${category0}/`,
//     }),
//     getQuizFiles: builder.query<
//       QuestionsFile[],
//       { category0: string; category1: string }
//     >({
//       query: ({ category0, category1 }) => `/${category0}/${category1}/`,
//     }),

//     getAllQuestions: builder.query<
//       Question[],
//       { category0: string; category1: string; quizFile: string }
//     >({
//       queryFn: async (
//         { category0, category1, quizFile },
//         api,
//         extraOptions
//       ) => {
//         const initialUrl = `/${category0}/${category1}/${quizFile}/`;
//         try {
//           const allQuestions = await fetchAllQuestions(
//             initialUrl,
//             api,
//             extraOptions
//           );
//           return { data: allQuestions };
//         } catch (error) {
//           return {
//             error: { status: "FETCH_ERROR", error: (error as Error).message },
//           };
//         }
//       },
//     }),

//     //for pagination of questions towards frontend
//     getQuestions: builder.query<
//       QuestionsResponse,
//       { category0: string; category1: string; quizFile: string; page?: number }
//     >({
//       query: ({ category0, category1, quizFile, page = 1 }) =>
//         `/${category0}/${category1}/${quizFile}/?page=${page}`,
//     }),

//     getChoices: builder.query<
//       Choice[],
//       {
//         category0: string;
//         category1: string;
//         quizFile: string;
//         questionId: number;
//       }
//     >({
//       query: ({ category0, category1, quizFile, questionId }) =>
//         `/${category0}/${category1}/${quizFile}/${questionId}/choices/`,
//     }),
//   }),
// });

// export const {
//   useGetCategory0Query,
//   useGetCategory1Query,
//   useGetQuizFilesQuery,
//   useGetQuestionsQuery,
//   useGetChoicesQuery,
//   useGetAllQuestionsQuery,
// } = quizApiSlice;

// import { qapiSlice } from "../services/qapiSlice";
// import { baseQuery } from "../services/qapiSlice";

// // Types for quizapi
// interface Category0 {
//   name: string;
// }

// interface Category1 {
//   name: string;
// }

// interface QuestionsFile {
//   title: string;
//   category0: number;
//   category1: number;
//   created_at: string;
// }

// interface Question {
//   id: number;
//   text: string;
//   questions_file_title: string;
//   subject_category_name: string;
//   correct_choice_id?: number;
//   choices?: Choice[];
// }

// interface Choice {
//   id: number;
//   text: string;
//   is_correct: boolean;
//   question: number;
// }

// interface QuestionsResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: Question[];
// }

// interface QuizResult {
//   id: number;
//   score: number;
//   total_questions: number;
//   completed_at: string;
// }

// // Fetch all questions for sidebar
// const fetchAllQuestions = async (
//   initialUrl: string,
//   api: { dispatch: (action: any) => void; getState: () => any },
//   extraOptions: any
// ): Promise<Question[]> => {
//   let allQuestions: Question[] = [];
//   let nextUrl: string | null = initialUrl;

//   while (nextUrl) {
//     const response = await baseQuery(nextUrl, api, extraOptions);
//     if (response.error) throw new Error("Failed to fetch questions");
//     const data = response.data as QuestionsResponse;
//     allQuestions = [...allQuestions, ...data.results];
//     nextUrl = data.next;
//   }

//   return allQuestions;
// };

// // Extend qapiSlice with quiz-specific endpoints
// export const quizApiSlice = qapiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     // Existing Quizapi endpoints
//     getCategory0: builder.query<Category0[], void>({
//       query: () => "/category0/",
//     }),
//     getCategory1: builder.query<Category1[], string>({
//       query: (category0) => `/${category0}/`,
//     }),
//     getQuizFiles: builder.query<
//       QuestionsFile[],
//       { category0: string; category1: string }
//     >({
//       query: ({ category0, category1 }) => `/${category0}/${category1}/`,
//     }),

//     getAllQuestions: builder.query<
//       Question[],
//       { category0: string; category1: string; quizFile: string }
//     >({
//       queryFn: async (
//         { category0, category1, quizFile },
//         api,
//         extraOptions
//       ) => {
//         const initialUrl = `/${category0}/${category1}/${quizFile}/`;
//         try {
//           const allQuestions = await fetchAllQuestions(
//             initialUrl,
//             api,
//             extraOptions
//           );
//           return { data: allQuestions };
//         } catch (error) {
//           return {
//             error: { status: "FETCH_ERROR", error: (error as Error).message },
//           };
//         }
//       },
//     }),

//     getQuestions: builder.query<
//       QuestionsResponse,
//       { category0: string; category1: string; quizFile: string; page?: number }
//     >({
//       query: ({ category0, category1, quizFile, page = 1 }) =>
//         `/${category0}/${category1}/${quizFile}/?page=${page}`,
//     }),

//     getChoices: builder.query<
//       Choice[],
//       {
//         category0: string;
//         category1: string;
//         quizFile: string;
//         questionId: number;
//       }
//     >({
//       query: ({ category0, category1, quizFile, questionId }) =>
//         `/${category0}/${category1}/${quizFile}/${questionId}/choices/`,
//     }),

//     // Added endpoint for user quiz results
//     getUserQuizResults: builder.query<{id:number; score:number; total_questions:number; completed_at : string;}[], { timeRange: string }>({
//       query: ({ timeRange }) => ({
//         url: "/results/",
//         params: { time_range: timeRange },
//       }),
//     }),
//   }),
// });

// // Export all hooks
// export const {
//   useGetCategory0Query,
//   useGetCategory1Query,
//   useGetQuizFilesQuery,
//   useGetQuestionsQuery,
//   useGetChoicesQuery,
//   useGetAllQuestionsQuery,
//   useGetUserQuizResultsQuery, // Now available
// } = quizApiSlice;



import { qapiSlice } from "../services/qapiSlice";
import { baseQuery } from "../services/qapiSlice";

// Types for quizapi
interface Category0 {
  name: string;
}

interface Category1 {
  name: string;
}

interface QuestionsFile {
  title: string;
  category0: number;
  category1: number;
  created_at: string;
}

interface Question {
  id: number;
  text: string;
  questions_file_title: string;
  subject_category_name: string;
  correct_choice_id?: number;
  choices?: Choice[];
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
  id: number;
  score: number;
  total_questions: number;
  completed_at: string;
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
    // Fetch all Category0 entries
    getCategory0: builder.query<Category0[], void>({
      query: () => "/category0/",
    }),

    // Fetch Category1 entries for a given Category0
    getCategory1: builder.query<Category1[], string>({
      query: (category0) => `/${category0}/`,
    }),

    // Fetch quiz files for a Category0 and Category1
    getQuizFiles: builder.query<
      QuestionsFile[],
      { category0: string; category1: string }
    >({
      query: ({ category0, category1 }) => `/${category0}/${category1}/`,
    }),

    // Fetch all questions without pagination
    getAllQuestions: builder.query<
      Question[],
      { category0: string; category1: string; quizFile: string }
    >({
      queryFn: async (
        { category0, category1, quizFile },
        api,
        extraOptions
      ) => {
        const initialUrl = `/${category0}/${category1}/${quizFile}/`;
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
      { category0: string; category1: string; quizFile: string; page?: number }
    >({
      query: ({ category0, category1, quizFile, page = 1 }) =>
        `/${category0}/${category1}/${quizFile}/?page=${page}`,
    }),

    // Fetch choices for a specific question
    getChoices: builder.query<
      Choice[],
      {
        category0: string;
        category1: string;
        quizFile: string;
        questionId: number;
      }
    >({
      query: ({ category0, category1, quizFile, questionId }) =>
        `/${category0}/${category1}/${quizFile}/${questionId}/choices/`,
    }),

submitQuiz:builder.mutation({
  query:({category0,category1,quizFile,choices,is_submitted=true})=>({
  url:`${category0}/${category1}/${quizFile}/submit/`,
  method:'POST',
  body:{choices,is_submitted},
  })
}),


  //it is being  done from localstorage dude 
  // getQuizResult:builder.query({
  //   query:({category0,category1,quizFile})=>`${category0}/${category1}/${quizFile}/result/`
  // }),

  getLeaderboard:builder.query({
    query:()=>'quiz-leaderboard/',
  }),


  }),
});

// Export all hooks
export const {
  useGetCategory0Query,
  useGetCategory1Query,
  useGetQuizFilesQuery,
  useGetQuestionsQuery,
  useGetChoicesQuery,
  useGetAllQuestionsQuery,
  useSubmitQuizMutation,
  // useGetQuizResultQuery,
  useGetLeaderboardQuery,
} = quizApiSlice;