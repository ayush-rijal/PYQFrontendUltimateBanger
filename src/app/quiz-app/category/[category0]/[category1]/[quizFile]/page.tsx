// 'use client';
// import { useState } from 'react';
// import { useGetQuestionsQuery, useGetChoicesQuery } from '@/redux/features/quizApiSlice';
// import { useParams } from 'next/navigation';

// export default function QuizPage() {
//   const { category0, category1, quizFile } = useParams() as {
//     category0: string;
//     category1: string;
//     quizFile: string;
//   };
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [selectedSubject, setSelectedSubject] = useState<string>('all');

//   const { data: questionsData, isLoading: qLoading, error: qError } = useGetQuestionsQuery({
//     category0,
//     category1,
//     quizFile,
//   });

//   const questions = questionsData?.results || [];
//   const currentQuestion = questions[currentQuestionIndex];
//   const { data: choices, isLoading: cLoading, error: cError } = useGetChoicesQuery({
//     category0,
//     category1,
//     quizFile,
//     questionId: currentQuestion?.id || 0,
//   });

//   // Extract unique subject categories
//   const subjectCategories = Array.from(new Set(questions.map((q) => q.subject_category_name)));
//   const filteredQuestions =
//     selectedSubject === 'all'
//       ? questions
//       : questions.filter((q) => q.subject_category_name === selectedSubject);

//   if (qLoading || cLoading) return <div>Loading...</div>;
//   if (qError) return <div>Error: {(qError as any).message}</div>;
//   if (cError) return <div>Error: {(cError as any).message}</div>;

//   return (
//     <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6">
//       {/* Sidebar */}
//       <div className="w-full md:w-1/4">
//         <div className="bg-gray-100 p-4 rounded-lg">
//           <h3 className="text-lg font-semibold mb-2">Filter by Subject</h3>
//           <div className="flex flex-col gap-2">
//             <button
//               className={`p-2 rounded ${selectedSubject === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//               onClick={() => setSelectedSubject('all')}
//             >
//               All
//             </button>
//             {subjectCategories.map((subject) => (
//               <button
//                 key={subject}
//                 className={`p-2 rounded ${selectedSubject === subject ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//                 onClick={() => setSelectedSubject(subject)}
//               >
//                 {subject}
//               </button>
//             ))}
//           </div>
//           <h3 className="text-lg font-semibold mt-4 mb-2">Questions</h3>
//           <div className="grid grid-cols-5 gap-2">
//             {filteredQuestions.map((q, index) => (
//               <button
//                 key={q.id}
//                 className={`p-2 rounded ${currentQuestionIndex === questions.indexOf(q) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
//                 onClick={() => setCurrentQuestionIndex(questions.indexOf(q))}
//               >
//                 {index + 1}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Quiz Content */}
//       <div className="w-full md:w-3/4">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h2 className="text-2xl font-bold mb-4">{currentQuestion?.text}</h2>
//           <div className="space-y-4">
//             {choices?.map((choice) => (
//               <div key={choice.id} className="p-2 border rounded hover:bg-gray-100">
//                 <input type="radio" name="choice" className="mr-2" />
//                 {choice.text}
//               </div>
//             ))}
//           </div>
//           <div className="mt-6 flex justify-between">
//             <button
//               className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//               disabled={currentQuestionIndex === 0}
//               onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
//             >
//               Previous
//             </button>
//             <button
//               className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//               disabled={currentQuestionIndex === questions.length - 1}
//               onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import { useState } from 'react';
import { useGetAllQuestionsQuery, useGetQuestionsQuery, useGetChoicesQuery } from '@/redux/features/quizApiSlice';
import { useParams } from 'next/navigation';


// Define Question type locally (or import from anyplace where question interface is defined and exported)
interface Question {
    id: number;
    text: string;
    questions_file_title: string;
    subject_category_name: string;
  }

export default function QuizPage() {
  const { category0, category1, quizFile:rawQuizFile } = useParams() as {
    category0: string;
    category1: string;
    quizFile: string;
  };

  const quizFile= decodeURIComponent(rawQuizFile);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch all questions for sidebar
  const { data: allQuestions = [], isLoading: allLoading, error: allError } = useGetAllQuestionsQuery({
    category0,
    category1,
    quizFile,
  });

  // Fetch paginated questions for middle
  const { data: questionsData, isLoading: qLoading, error: qError } = useGetQuestionsQuery({
    category0,
    category1,
    quizFile,
    page: currentPage,
  });

  const questions = questionsData?.results || [];
  const totalCount = questionsData?.count || 0;
  const pageSize = 5;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Group all questions by subject category
  const groupedQuestions = allQuestions.reduce((acc, q) => {
    const subject = q.subject_category_name;
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  // Handle question click
  const handleQuestionClick = (questionId: number) => {
    const questionIndex = allQuestions.findIndex((q) => q.id === questionId);
    const page = Math.floor(questionIndex / pageSize) + 1;
    setCurrentPage(page);
  };

  if (allLoading || qLoading) return <div>Loading...</div>;
  if (allError) return <div>Error: {(allError as any).message}</div>;
  if (qError) return <div>Error: {(qError as any).message}</div>;

  return (
    <div className="container mx-auto p-4 flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold">{quizFile}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-gray-100 p-4 rounded-lg max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-2">Questions ({totalCount})</h3>
            {Object.entries(groupedQuestions).map(([subject, qs]) => (
              <div key={subject} className="mb-4">
                <h4 className="text-md font-semibold">{subject} ({qs.length})</h4>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {qs.map((q) => (
                    <button
                      key={q.id}
                      className={`p-2 rounded ${
                        questions.some((pq) => pq.id === q.id)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200'
                      }`}
                      onClick={() => handleQuestionClick(q.id)}
                    >
                      {allQuestions.indexOf(q) + 1}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Container */}
        <div className="w-full md:w-3/4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Questions (Page {currentPage})</h2>
            <div className="space-y-6">
              {questions.map((question) => (
                <div key={question.id}>
                  <p className="text-lg font-semibold">{question.text}</p>
                  <Choices
                    category0={category0}
                    category1={category1}
                    quizFile={quizFile}
                    questionId={question.id}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous Page
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Choices Component
function Choices({
  category0,
  category1,
  quizFile,
  questionId,
}: {
  category0: string;
  category1: string;
  quizFile: string;
  questionId: number;
}) {
  const { data: choices, isLoading, error } = useGetChoicesQuery({
    category0,
    category1,
    quizFile,
    questionId,
  });

  if (isLoading) return <div>Loading choices...</div>;
  if (error) return <div>Error loading choices</div>;

  return (
    <div className="space-y-2 mt-2">
      {choices?.map((choice) => (
        <div key={choice.id} className="p-2 border rounded hover:bg-gray-100">
          <input type="radio" name={`choice-${questionId}`} className="mr-2" />
          {choice.text}
        </div>
      ))}
    </div>
  );
}

