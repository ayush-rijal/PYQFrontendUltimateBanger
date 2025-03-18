import {qapiSlice}  from '../services/qapiSlice';
import {baseQuery} from '../services/qapiSlice';
// Types for quizapi
interface Category0 { name: string }
interface Category1 { name: string }
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

// Fetch all questions for sidebar
const fetchAllQuestions = async (
    initialUrl: string,
    api: any,
    extraOptions: any
  ): Promise<Question[]> => {
    let allQuestions: Question[] = [];
    let nextUrl: string | null = initialUrl;
  
    while (nextUrl) {
      const response = await baseQuery(nextUrl, api, extraOptions);
      if (response.error) throw new Error('Failed to fetch questions');
      const data = response.data as QuestionsResponse;
      allQuestions = [...allQuestions, ...data.results];
      nextUrl = data.next;
    }
  
    return allQuestions;
  };


const quizApiSlice = qapiSlice.injectEndpoints({
    endpoints: builder => ({

//Quizapi endpoints
getCategory0: builder.query<Category0[], void>({
    query: () => '/category0/',
  }),
  getCategory1: builder.query<Category1[], string>({
    query: (category0) => `/${category0}/`,
  }),
  getQuizFiles: builder.query<QuestionsFile[], { category0: string; category1: string }>({
    query: ({ category0, category1 }) => `/${category0}/${category1}/`,
  }),

  getAllQuestions: builder.query<Question[], { category0: string; category1: string; quizFile: string }>({
    queryFn: async ({ category0, category1, quizFile }, api, extraOptions) => {
      const initialUrl = `/${category0}/${category1}/${quizFile}/`;
      try {
        const allQuestions = await fetchAllQuestions(initialUrl, api, extraOptions);
        return { data: allQuestions };
      } catch (error) {
        return { error: { status: 'FETCH_ERROR', error: (error as Error).message } };
      }
    },
  }),



//for pagination of questions towards frontend
getQuestions: builder.query<
      QuestionsResponse,
      { category0: string; category1: string; quizFile: string; page?: number }
    >({
      query: ({ category0, category1, quizFile, page = 1 }) =>
        `/${category0}/${category1}/${quizFile}/?page=${page}`,
    }),


  getChoices: builder.query<
    Choice[],
    { category0: string; category1: string; quizFile: string; questionId: number }
  >({
    query: ({ category0, category1, quizFile, questionId }) =>
      `/${category0}/${category1}/${quizFile}/${questionId}/choices/`,
  }),

    }),
});

export const {
    useGetCategory0Query,
    useGetCategory1Query,
    useGetQuizFilesQuery,
    useGetQuestionsQuery,
    useGetChoicesQuery,
    useGetAllQuestionsQuery,
} = quizApiSlice;