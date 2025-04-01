"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetAllQuestionsQuery ,useGetChoicesQuery} from "@/redux/features/quizApiSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Download, Send } from "lucide-react";
import Loading from "@/loading/Loading";
// import jsPDF from "jspdf";

// Interfaces
interface Question {
  id: number;
  text: string;
  subject_category_name: string;
}

interface Choice {
  id: number;
  text: string;
  is_correct: boolean;
}

interface Response{
  question:number;
  selected_choice:number;
  is_submitted:boolean,
  }


// interface QuizResult {
//   questions_file: string; // title from serializer
//   points: number;
//   completed_at: string | null;
// }
interface QuizResult{
  status:string;
  points:number;
  total_questions:number;
  responses:Response[];
}



export default function QuizResultsPage() {
  const router = useRouter();
  const {
    category0,
    category1,
    quizFile: rawQuizFile,
    quizId,
  } = useParams() as {
    category0: string;
    category1: string;
    quizFile: string;
    quizId: string;
  };
  const quizFile = decodeURIComponent(rawQuizFile);

  //get the quiz result from localStorge
  const[quizResult,setQuizResult]=useState<QuizResult | null>(null);

  useEffect(()=>{
    const storedResult = localStorage.getItem(`quizResult_${quizId}`);    
    console.log("Stored result from localStorage:", storedResult);
    if(storedResult){
      setQuizResult(JSON.parse(storedResult));
      

      //Opitonal :Clean up after loading
      localStorage.removeItem('quizResult_${quizId}');
    }
    else {
      console.log("No result found in localStorage for quizId:", quizId);
      // Fallback: redirect back to quiz page if no result
      router.push(`/quiz-app/category/${category0}/${category1}/${quizFile}`);
    }
  },[quizId, router, category0, category1, quizFile]);
  


  // //for now doing from localstorge so not required this redux now
  // // Fetch quiz result from backend
  // const {
  //   data: result,
  //   isLoading: resultLoading,
  //   error: resultError,
  // } = useGetQuizResultQuery({ category0, category1, quizFile });

  // Fetch all questions for answer display and total count
  const {
    data: allQuestions = [],
    isLoading: questionsLoading,
    error: questionsError,
  } = useGetAllQuestionsQuery({ category0, category1, quizFile });

  // const [timeTaken, setTimeTaken] = useState<string | null>(null);
  // const [selectedChoices, setSelectedChoices] = useState<Record<number, number>>({});
  // const [feedback, setFeedback] = useState("");

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const choicesParam = urlParams.get("choices");
  //   const timeParam = urlParams.get("time");
  //   if (choicesParam) {
  //     setSelectedChoices(JSON.parse(decodeURIComponent(choicesParam)));
  //   }
  //   if (timeParam) {
  //     setTimeTaken(decodeURIComponent(timeParam));
  //   }
  // }, []);

  // if (resultLoading || questionsLoading) {
  //   return (
  //     <div className="flex h-screen w-full items-center justify-center">
  //       <Loading />
  //     </div>
  //   );
  // }

  // if (resultError || questionsError) {
  //   return (
  //     <div className="p-8 text-center text-destructive">
  //       Error: {(resultError as any)?.data?.detail || (questionsError as Error)?.message || "Failed to load results"}
  //     </div>
  //   );
  // }

  // const score = result?.points || 0;
  // const totalQuestions = allQuestions.length;
  // const maxPossibleScore = totalQuestions ; // 10 points per question from backend logic
  // const percentage = maxPossibleScore > 0 ? (score / maxPossibleScore) * 100 : 0;

  // const exportToPDF = () => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(16);
  //   doc.text(`Quiz Results: ${quizFile}`, 20, 20);
  //   doc.setFontSize(12);
  //   doc.text(`${category0} / ${category1}`, 20, 30);
  //   doc.text(`Score: ${score}/${maxPossibleScore} (${Math.round(percentage)}%)`, 20, 40);
  //   if (timeTaken) doc.text(`Time Taken: ${timeTaken}`, 20, 50);

  //   let y = 60;
  //   doc.text("Your Answers:", 20, y);
  //   y += 10;
  //   allQuestions.forEach((q: Question, index: number) => {
  //     const selectedChoice = choicesForQuestion(q.id)?.find(
  //       (c: Choice) => c.id === selectedChoices[q.id]
  //     );
  //     const correctChoice = choicesForQuestion(q.id)?.find(
  //       (c: Choice) => c.is_correct
  //     );
  //     doc.text(`${index + 1}. ${q.text}`, 20, y, { maxWidth: 160 });
  //     y += 10;
  //     doc.text(`Your Answer: ${selectedChoice?.text || "Not answered"}`, 30, y);
  //     y += 10;
  //     doc.text(`Correct Answer: ${correctChoice?.text || "N/A"}`, 30, y);
  //     y += 15;
  //   });

  //   doc.save(`${quizFile}_results.pdf`);
  // };

  // const choicesForQuestion = (questionId: number) => {
  //   const { data: choices = [] } = useGetChoicesQuery({
  //     category0,
  //     category1,
  //     quizFile,
  //     questionId,
  //   });
  //   return choices;
  // };

  // const handleRetryQuiz = () => {
  //   router.push(`/quiz-app/category/${category0}/${category1}/${quizFile}`);
  // };

  // const handleFeedbackSubmit = () => {
  //   console.log("Feedback submitted:", feedback);
  //   setFeedback("");
  //   alert("Thank you for your feedback!");
  // };

  if (questionsLoading || !quizResult){
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loading/>
      </div>
    )
  }

if (questionsError) {

  return (
    <div className="p-8 text-center text-destructive">
      Error:{(questionsError as Error)?.message || "Failed to load results"}
    </div>
  );

}

const score=quizResult.points
const totalQuestions=quizResult.total_questions;
const percentage=totalQuestions>0? (score/totalQuestions)*100:0;


const responsesMap=quizResult.responses.reduce((acc,resp)=>{
  acc[resp.question]=resp.selected_choice;
  return acc;
},{} as Record<number,number>);


const handleRetryQuiz=()=>{
  router.push(`/quiz-app/category/${category0}/${category1}/${quizFile}`);
}

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <header className="mb-8">
        <Button
          variant="outline"
          onClick={() => router.push(`/quiz-app/category/${category0}/${category1}/${quizFile}`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quiz
        </Button>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Quiz Results: {quizFile}
          </h1>
          <p className="text-muted-foreground mt-2">
            {category0} / {category1}
          </p>
          <div className="mt-4 flex flex-col items-center gap-4">
            <Badge variant="secondary" className="text-lg py-2 px-4">
              Score: {score}/{totalQuestions} ({Math.round(percentage)}%)
            </Badge>
            {/* {timeTaken && <Badge variant="outline">Time Taken: {timeTaken}</Badge>} */}



            <div className="text-sm text-muted-foreground">
              Completed on {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </header>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Answers</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[50vh] pr-4">
            <div className="space-y-6">
              {allQuestions.map((question: Question) => (
                <QuestionResult
                  key={question.id}
                  question={question}
                  // selectedChoiceId={selectedChoices[question.id]}
                  selectedChoiceId={responsesMap[question.id]}
                  category0={category0}
                  category1={category1}
                  quizFile={quizFile}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Button onClick={handleRetryQuiz} variant="outline" className="flex-1">
          Retry Quiz
        </Button>
        <Button onClick={exportToPDF} variant="outline" className="flex-1 hidden disabled">
          <Download className="mr-2 h-4 w-4" />
          Export as PDF
        </Button>
      </div> */}

      
    </div>
  );
}

function QuestionResult({
  question,
  selectedChoiceId,
  category0,
  category1,
  quizFile,
}: {
  question: Question;
  selectedChoiceId?: number;
  category0: string;
  category1: string;
  quizFile: string;
}) {
  const {
    data: choices = [],
    isLoading,
    error,
  } = useGetChoicesQuery({
    category0,
    category1,
    quizFile,
    questionId: question.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-center text-destructive">
        Error loading choices
      </div>
    );
  }

  // const correctChoice = choices.find((c: Choice) => c.is_correct);
  // const correctChoiceId = correctChoice?.id;
  // const isCorrect = selectedChoiceId === correctChoiceId;
  // const cardClass = isCorrect
  //   ? "border-green-500 bg-green-50 dark:bg-green-900/20"
  //   : selectedChoiceId
  //   ? "border-red-500 bg-red-50 dark:bg-red-900/20"
  //   : "border-muted";
  const selectedChoice = choices.find((c: Choice) => c.id === selectedChoiceId);
  const correctChoice = choices.find((c: Choice) => c.is_correct);
  const isCorrect = selectedChoiceId === correctChoice?.id;
  const cardClass = isCorrect
    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
    : selectedChoiceId
    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
    : "border-muted";


  return (
    <Card className={`transition-all ${cardClass}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{question.subject_category_name}</Badge>
{isCorrect ? (
            <span className="text-green-600 dark:text-green-400">Correct</span>
          ) : selectedChoiceId ? (
            <span className="text-red-600 dark:text-red-400">Incorrect</span>
          ) : (
            <span className="text-muted-foreground">Not Answered</span>
          )}
        </div>
        <CardTitle className="text-lg">{question.text}</CardTitle>
      </CardHeader>
      {/* <CardContent>
        <div className="space-y-2">
          {choices.map((choice: Choice) => {
            const isSelected = choice.id === selectedChoiceId;
            const isCorrectChoice = choice.is_correct;
            const textClass = isSelected
              ? isCorrectChoice
                ? "text-green-700 dark:text-green-300 font-medium"
                : "text-red-700 dark:text-red-300 font-medium"
              : isCorrectChoice
              ? "text-green-600 dark:text-green-400"
              : "text-foreground";

            return (
              <div
                key={choice.id}
                className="flex items-start gap-2 rounded-md p-2 hover:bg-muted/50"
              >
                <span
                  className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? isCorrectChoice
                        ? "border-green-500 bg-green-200 dark:bg-green-700"
                        : "border-red-500 bg-red-200 dark:bg-red-700"
                      : "border-muted"
                  }`}
                >
                  {isSelected && (
                    <span
                      className={
                        isCorrectChoice
                          ? "h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"
                          : "h-2 w-2 rounded-full bg-red-600 dark:bg-red-400"
                      }
                    />
                  )}
                </span>
                <p className={textClass}>
                  {choice.text}
                  {isCorrectChoice && !isSelected && " (Correct)"}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent> */}


<CardContent>
        <div className="space-y-2">
          <p>
            <strong>Your Answer:</strong>{" "}
            {selectedChoice?.text || "Not answered"}
          </p>
          <p>
            <strong>Correct Answer:</strong> {correctChoice?.text || "N/A"}
          </p>
          {!isCorrect && selectedChoiceId && (
            <p className="text-sm text-muted-foreground">
              You selected an incorrect option.
            </p>
          )}
        </div>
      </CardContent>

      <Separator />
    </Card>
  );
}