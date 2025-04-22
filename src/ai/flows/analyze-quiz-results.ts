// // /**
// //  * @fileOverview Analyzes quiz results and generates private, personalized feedback for science students.
// //  *
// //  * - analyzeQuizResults - Processes quiz results and returns feedback without exposing raw data.
// //  * - AnalyzeQuizResultsInput - Input type for quiz results.
// //  * - AnalyzeQuizResultsOutput - Output type for feedback.
// //  */

// // "use server";

// // import { ai } from "@/ai/ai-instance";
// // import { z } from "genkit";
// // import { cache } from "react";

// // // Input schema
// // const AnalyzeQuizResultsInputSchema = z.object({
// //   questions: z
// //     .array(
// //       z.object({
// //         id: z.number().describe("The question ID."),
// //         text: z.string().describe("The question text."),
// //         subject: z
// //           .string()
// //           .describe("Science category (e.g., Physics, Chemistry, Zoology)."),
// //         choices: z
// //           .array(
// //             z.object({
// //               id: z.number().describe("The choice ID."),
// //               text: z.string().describe("The choice text."),
// //               is_correct: z
// //                 .boolean()
// //                 .describe("Whether the choice is correct."),
// //             })
// //           )
// //           .describe("Answer choices for the question."),
// //         selected_choice_id: z
// //           .number()
// //           .optional()
// //           .describe("User's selected choice ID, if answered."),
// //       })
// //     )
// //     .describe("List of questions with choices and user responses."),
// // });
// // export type AnalyzeQuizResultsInput = z.infer<
// //   typeof AnalyzeQuizResultsInputSchema
// // >;

// // const AnalyzeQuizResultsOutputSchema = z.object({
// //   feedback: z.string().describe("Personalized feedback and study suggestions."),
// // });
// // export type AnalyzeQuizResultsOutput = z.infer<
// //   typeof AnalyzeQuizResultsOutputSchema
// // >;

// // // Cached AI call
// // const cachedAnalyzeQuizResults = cache(
// //   async (input: AnalyzeQuizResultsInput): Promise<AnalyzeQuizResultsOutput> => {
// //     try {
// //       const result = await analyzeQuizResultsFlow(input);
// //       return result;
// //     } catch (error: any) {
// //       console.error("[analyzeQuizResults] AI flow error:", error);
// //       throw new Error("Failed to generate feedback. Please try again.");
// //     }
// //   }
// // );

// // export async function analyzeQuizResults(
// //   input: AnalyzeQuizResultsInput
// // ): Promise<AnalyzeQuizResultsOutput> {
// //   return cachedAnalyzeQuizResults(input);
// // }

// // const prompt = ai.definePrompt({
// //   name: "analyzeQuizResultsPrompt",
// //   input: { schema: AnalyzeQuizResultsInputSchema },
// //   output: { schema: AnalyzeQuizResultsOutputSchema },
// //   prompt: `You are an expert science tutor for high school and college students, specializing in Physics, Chemistry, Zoology, and related fields. Your task is to analyze quiz results and provide personalized feedback to help the student improve, without exposing raw results to ensure user privacy.

// // **Quiz Results**:
// // {{#each questions}}
// // **Question {{@index + 1}}** ({{this.subject}}):
// // - Text: {{this.text}}
// // - Choices:
// //   {{#each this.choices}}
// //   - {{this.text}} ({{this.is_correct ? "Correct" : "Incorrect"}})
// //   {{/each}}
// // - Selected Choice: {{this.selected_choice_id ? (this.choices.find(c => c.id === this.selected_choice_id)?.text || "N/A") : "Not answered"}}
// // - Correct: {{this.selected_choice_id && this.choices.find(c => c.id === this.selected_choice_id)?.is_correct ? "Yes" : "No"}}
// // {{/each}}

// // **Instructions**:
// // - **Analyze Performance**: Calculate the percentage of correct answers per subject (e.g., Physics, Chemistry, Zoology) and identify subjects with low performance (<50% correct) and strengths (>75% correct).
// // - **Identify Patterns**: Based on question text and incorrect choices, note specific concepts the student struggles with (e.g., mechanics in Physics, organic chemistry in Chemistry, taxonomy in Zoology).
// // - **Provide Feedback**: Generate 3-5 actionable study tips tailored to the weakest subjects. Do not include raw results (e.g., specific question texts, choices, or user selections) in the output—focus on general performance trends and strategies.
// // - **Format**: Return feedback in paragraphs separated by double newlines (\n\n). Start with a performance summary, followed by weaknesses, and end with study strategies. Keep it 200-300 words.
// // - **Tone**: Encouraging, clear, and motivational, suitable for science students.
// // - **Privacy**: Ensure feedback is general and does not reveal specific questions, choices, or user answers.

// // **Example Output**:
// // Your quiz performance shows a solid effort, with strong results in Zoology but room for improvement in Physics and Chemistry.

// // Physics appears to be your weakest area, possibly due to challenges with mechanics-related concepts. Chemistry performance suggests difficulties with organic chemistry topics.

// // To boost your Physics skills, try interactive simulations like PhET to visualize motion and forces. For Chemistry, practice naming organic compounds using flashcards or apps like ChemDraw. Maintain your Zoology strength with case studies on ecosystems. Dedicate 30 minutes daily to problem-solving in weaker areas, using textbooks like Giancoli Physics or Campbell Biology. You're on the right track—keep up the great work!
// // `,
// // });

// // const analyzeQuizResultsFlow = ai.defineFlow<
// //   typeof AnalyzeQuizResultsInputSchema,
// //   typeof AnalyzeQuizResultsOutputSchema
// // >(
// //   {
// //     name: "analyzeQuizResultsFlow",
// //     inputSchema: AnalyzeQuizResultsInputSchema,
// //     outputSchema: AnalyzeQuizResultsOutputSchema,
// //   },
// //   async (input) => {
// //     const { output } = await prompt(input);
// //     if (!output?.feedback) {
// //       throw new Error("No feedback generated by AI model.");
// //     }
// //     return output;
// //   }
// // );




// // typescript
// // File: src/ai/flows/analyze-quiz-results.ts

// interface Quiz {
//   question: string;
//   options: string[];
//   answer: string;
// }

// interface AnalyzeQuizResultsInput {
//   quiz: Quiz[];
//   selectedAnswers: string[];
// }

// interface AnalyzeQuizResultsOutput {
//   feedback: string;
// }

// /**
//  * Analyzes quiz results and generates feedback tailored for high school and college science students.
//  * @param input - Object containing the quiz and selected answers.
//  * @returns Object with a feedback string summarizing performance and science-specific suggestions.
//  * @throws Error if input is invalid (e.g., mismatched arrays, invalid quiz data).
//  */
// export async function analyzeQuizResults({
//   quiz,
//   selectedAnswers,
// }: AnalyzeQuizResultsInput): Promise<AnalyzeQuizResultsOutput> {
//   // Input validation
//   if (!Array.isArray(quiz) || !Array.isArray(selectedAnswers)) {
//     throw new Error("Quiz and selectedAnswers must be arrays");
//   }

//   if (quiz.length !== selectedAnswers.length) {
//     throw new Error(
//       `Quiz and selectedAnswers must have the same length (got ${quiz.length} questions, ${selectedAnswers.length} answers)`
//     );
//   }

//   if (quiz.length === 0) {
//     return { feedback: "No questions were provided. Try taking a quiz to get feedback!" };
//   }

//   for (const [index, question] of quiz.entries()) {
//     if (
//       !question ||
//       typeof question.question !== "string" ||
//       !Array.isArray(question.options) ||
//       typeof question.answer !== "string"
//     ) {
//       throw new Error(`Invalid quiz data at question ${index + 1}`);
//     }
//     if (!question.options.includes(question.answer)) {
//       throw new Error(
//         `Correct answer for question ${index + 1} is not in options`
//       );
//     }
//   }

//   // Analyze performance
//   let correctCount = 0;
//   let incorrectCount = 0;
//   let unansweredCount = 0;
//   const incorrectIndices: number[] = [];
//   const correctIndices: number[] = [];

//   for (let i = 0; i < quiz.length; i++) {
//     const userAnswer = selectedAnswers[i] || "";
//     const correctAnswer = quiz[i].answer;

//     if (userAnswer === "") {
//       unansweredCount++;
//       incorrectIndices.push(i);
//     } else if (userAnswer === correctAnswer) {
//       correctCount++;
//       correctIndices.push(i);
//     } else {
//       incorrectCount++;
//       incorrectIndices.push(i);
//     }
//   }

//   const totalQuestions = quiz.length;
//   const percentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;

//   // Generate feedback
//   let feedback = `You scored ${correctCount} out of ${totalQuestions} (${percentage.toFixed(0)}%). `;

//   // Summary
//   if (correctCount === totalQuestions) {
//     feedback += "Awesome job! You aced this science quiz! ";
//   } else if (correctCount >= totalQuestions * 0.7) {
//     feedback += "Great work! You're making strong progress in science. ";
//   } else if (correctCount >= totalQuestions * 0.4) {
//     feedback += "Nice effort! Let's boost those science skills even more. ";
//   } else {
//     feedback += "Science can be tough, but you're learning! Let's tackle those tricky areas. ";
//   }

//   // Strengths
//   if (correctCount > 0) {
//     feedback += `You did well on ${correctCount} question${correctCount > 1 ? "s" : ""}. `;
//     const strongTopics = inferScienceTopics(quiz, correctIndices);
//     if (strongTopics.length > 0) {
//       feedback += `You're strong in ${strongTopics.join(" and ")} concepts. Keep it up! `;
//     }
//   }

//   // Weaknesses
//   if (incorrectCount > 0 || unansweredCount > 0) {
//     const missedCount = incorrectCount + unansweredCount;
//     feedback += `You missed ${missedCount} question${missedCount > 1 ? "s" : ""} (${unansweredCount} unanswered). `;
//     const weakTopics = inferScienceTopics(quiz, incorrectIndices);
//     if (weakTopics.length > 0) {
//       feedback += `You might need to brush up on ${weakTopics.join(" and ")}. `;
//     } else {
//       feedback += `Take a look at questions ${incorrectIndices.map((i) => i + 1).join(", ")} to see where you went wrong. `;
//     }
//   }

//   // Suggestions
//   if (percentage < 100) {
//     feedback += "Here’s how to improve your science skills: ";
//     if (unansweredCount > 0) {
//       feedback += "Try answering every question, even if you’re unsure—it’s great practice! ";
//     }
//     if (incorrectCount > 0) {
//       const weakTopics = inferScienceTopics(quiz, incorrectIndices);
//       if (weakTopics.length > 0) {
//         feedback += getTopicSpecificSuggestions(weakTopics);
//       } else {
//         feedback += "Review the correct answers in your textbook or class notes. ";
//       }
//     }
//     feedback += "Watch science videos on Khan Academy or YouTube, and try practice problems to reinforce concepts. ";
//     feedback += "Drawing diagrams or making flashcards can also help you visualize and memorize key ideas!";
//   } else {
//     feedback += "You’re a science star! Keep practicing with more challenging questions to stay sharp.";
//   }

//   return { feedback };
// }

// /**
//  * Infers science topics from question text based on science-specific keywords.
//  * @param quiz - Array of quiz questions.
//  * @param indices - Indices of questions to analyze.
//  * @returns Array of inferred science topics.
//  */
// function inferScienceTopics(quiz: Quiz[], indices: number[]): string[] {
//   const topics: Set<string> = new Set();
//   const scienceKeywords: Record<string, string[]> = {
//     Biology: [
//       "cell", "dna", "photosynthesis", "evolution", "genetics", "enzyme",
//       "ecosystem", "protein", "mitosis", "bacteria", "virus", "organism",
//     ],
//     Chemistry: [
//       "atom", "molecule", "chemical", "reaction", "bond", "acid", "base",
//       "periodic table", "element", "compound", "oxidation", "pH",
//     ],
//     Physics: [
//       "force", "motion", "energy", "gravity", "circuit", "wave", "light",
//       "thermodynamics", "velocity", "acceleration", "electricity", "magnetism",
//     ],
//     "Earth Science": [
//       "plate tectonics", "earthquake", "volcano", "weather", "climate",
//       "rock", "mineral", "ocean", "atmosphere", "erosion",
//     ],
//     Math: [
//       "equation", "calculate", "graph", "function", "derivative", "integral",
//       "probability", "statistics", "geometry", "algebra",
//     ],
//   };

//   for (const index of indices) {
//     const questionText = quiz[index].question.toLowerCase();
//     for (const [topic, keywords] of Object.entries(scienceKeywords)) {
//       if (keywords.some((keyword) => questionText.includes(keyword))) {
//         topics.add(topic);
//       }
//     }
//   }

//   return Array.from(topics).length > 0 ? Array.from(topics) : ["science concepts"];
// }

// /**
//  * Provides specific study suggestions based on weak science topics.
//  * @param topics - Array of science topics needing improvement.
//  * @returns String with tailored study suggestions.
//  */
// function getTopicSpecificSuggestions(topics: string[]): string {
//   const suggestions: string[] = [];
//   for (const topic of topics) {
//     switch (topic) {
//       case "Biology":
//         suggestions.push(
//           "Review cell structures or genetics in your biology textbook. Practice Punnett squares or diagram food webs. "
//         );
//         break;
//       case "Chemistry":
//         suggestions.push(
//           "Practice balancing chemical equations or study the periodic table. Watch videos on reaction types. "
//         );
//         break;
//       case "Physics":
//         suggestions.push(
//           "Work on physics problems involving forces or energy. Draw free-body diagrams to understand motion. "
//         );
//         break;
//       case "Earth Science":
//         suggestions.push(
//           "Study rock cycles or plate tectonics in your notes. Use apps like EarthViewer to visualize processes. "
//         );
//         break;
//       case "Math":
//         suggestions.push(
//           "Solve extra math problems, focusing on equations or graphs. Use tools like Desmos to visualize functions. "
//         );
//         break;
//       default:
//         suggestions.push(
//           "Review key concepts in your science textbook or class notes. "
//         );
//     }
//   }
//   return suggestions.join("");
// }





// ```typescript
// File: src/ai/flows/analyze-quiz-results.ts

interface AnalyzeQuizResultsOutput {
  feedback: string;
}

/**
 * Analyzes quiz results from a text prompt and generates feedback for high school/college science students.
 * @param prompt - Text prompt containing quiz results (questions, user answers, correct answers, score).
 * @returns Object with a feedback string summarizing performance and science-specific suggestions.
 * @throws Error if prompt is invalid or cannot be parsed.
 */
export async function analyzeQuizResults(prompt: string): Promise<AnalyzeQuizResultsOutput> {
  // Input validation
  if (typeof prompt !== "string" || prompt.trim() === "") {
    throw new Error("Prompt must be a non-empty string");
  }

  // Parse prompt
  const lines = prompt.split("\n").map(line => line.trim()).filter(line => line);
  if (!lines[0].startsWith("Quiz Results for a science quiz")) {
    throw new Error("Invalid prompt format: Must start with quiz results header");
  }

  // Extract score
  const scoreLine = lines.find(line => line.startsWith("Score:"));
  if (!scoreLine) {
    throw new Error("Invalid prompt format: Missing score");
  }
  const scoreMatch = scoreLine.match(/Score: (\d+)\/(\d+) \((\d+)%\)/);
  if (!scoreMatch) {
    throw new Error("Invalid prompt format: Cannot parse score");
  }
  const correctCount = parseInt(scoreMatch[1], 10);
  const totalQuestions = parseInt(scoreMatch[2], 10);
  const percentage = parseInt(scoreMatch[3], 10);

  // Extract question data
  const questions: { question: string; userAnswer: string; correctAnswer: string; isCorrect: boolean }[] = [];
  let currentQuestion: any = null;
  for (const line of lines) {
    if (line.match(/^Question \d+:/)) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = { question: line.replace(/^Question \d+:\s*/, ""), userAnswer: "", correctAnswer: "", isCorrect: false };
    } else if (line.startsWith("User Answer:") && currentQuestion) {
      currentQuestion.userAnswer = line.replace("User Answer: ", "");
    } else if (line.startsWith("Correct Answer:") && currentQuestion) {
      currentQuestion.correctAnswer = line.replace("Correct Answer: ", "");
    } else if (line.startsWith("Correctness:") && currentQuestion) {
      currentQuestion.isCorrect = line.includes("Correct");
    }
  }
  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  if (questions.length !== totalQuestions) {
    throw new Error(`Invalid prompt format: Expected ${totalQuestions} questions, found ${questions.length}`);
  }

  // Analyze performance
  const incorrectCount = questions.filter(q => !q.isCorrect && q.userAnswer !== "Not answered").length;
  const unansweredCount = questions.filter(q => q.userAnswer === "Not answered").length;
  const correctIndices = questions.map((q, i) => q.isCorrect ? i : -1).filter(i => i !== -1);
  const incorrectIndices = questions.map((q, i) => !q.isCorrect ? i : -1).filter(i => i !== -1);

  // Generate feedback
  let feedback = `You scored ${correctCount} out of ${totalQuestions} (${percentage}%). `;

  // Summary
  if (correctCount === totalQuestions) {
    feedback += "Fantastic work! You mastered this science quiz! ";
  } else if (percentage >= 70) {
    feedback += "Great job! You're building strong science skills. ";
  } else if (percentage >= 40) {
    feedback += "Good effort! Let's work on those science concepts. ";
  } else {
    feedback += "Science can be challenging, but you're learning! Let's focus on key areas. ";
  }

  // Strengths
  if (correctCount > 0) {
    feedback += `You answered ${correctCount} question${correctCount > 1 ? "s" : ""} correctly. `;
    const strongTopics = inferScienceTopics(questions, correctIndices);
    if (strongTopics.length > 0) {
      feedback += `You're excelling in ${strongTopics.join(" and ")} concepts. Keep it up! `;
    }
  }

  // Weaknesses
  if (incorrectCount > 0 || unansweredCount > 0) {
    const missedCount = incorrectCount + unansweredCount;
    feedback += `You missed ${missedCount} question${missedCount > 1 ? "s" : ""} (${unansweredCount} unanswered). `;
    const weakTopics = inferScienceTopics(questions, incorrectIndices);
    if (weakTopics.length > 0) {
      feedback += `You might need to review ${weakTopics.join(" and ")}. `;
    } else {
      feedback += `Check questions ${incorrectIndices.map(i => i + 1).join(", ")} to understand your mistakes. `;
    }
  }

  // Suggestions
  if (percentage < 100) {
    feedback += "Here’s how to boost your science skills: ";
    if (unansweredCount > 0) {
      feedback += "Try answering all questions, even if unsure—it helps you learn! ";
    }
    if (incorrectCount > 0) {
      const weakTopics = inferScienceTopics(questions, incorrectIndices);
      if (weakTopics.length > 0) {
        feedback += getTopicSpecificSuggestions(weakTopics);
      } else {
        feedback += "Review your textbook or notes for the correct answers. ";
      }
    }
    feedback += "Explore Khan Academy or YouTube for science videos, and practice problems to solidify concepts. ";
    feedback += "Try drawing diagrams or using flashcards to visualize ideas like chemical structures or physics forces!";
  } else {
    feedback += "You're a science pro! Challenge yourself with tougher questions to keep growing.";
  }

  return { feedback };
}

/**
 * Infers science topics from question text based on science-specific keywords.
 * @param questions - Array of question objects with question text.
 * @param indices - Indices of questions to analyze.
 * @returns Array of inferred science topics.
 */
function inferScienceTopics(questions: { question: string }[], indices: number[]): string[] {
  const topics: Set<string> = new Set();
  const scienceKeywords: Record<string, string[]> = {
    Biology: [
      "cell", "dna", "photosynthesis", "evolution", "genetics", "enzyme",
      "ecosystem", "protein", "mitosis", "bacteria", "virus", "organism", "zoology",
    ],
    Chemistry: [
      "atom", "molecule", "chemical", "reaction", "bond", "acid", "base",
      "periodic table", "element", "compound", "oxidation", "pH",
    ],
    Physics: [
      "force", "motion", "energy", "gravity", "circuit", "wave", "light",
      "thermodynamics", "velocity", "acceleration", "electricity", "magnetism",
    ],
    "Earth Science": [
      "plate tectonics", "earthquake", "volcano", "weather", "climate",
      "rock", "mineral", "ocean", "atmosphere", "erosion",
    ],
    Math: [
      "equation", "calculate", "graph", "function", "derivative", "integral",
      "probability", "statistics", "geometry", "algebra",
    ],
  };

  for (const index of indices) {
    const questionText = questions[index].question.toLowerCase();
    for (const [topic, keywords] of Object.entries(scienceKeywords)) {
      if (keywords.some(keyword => questionText.includes(keyword))) {
        topics.add(topic);
      }
    }
  }

  return topics.size > 0 ? Array.from(topics) : ["science concepts"];
}

/**
 * Provides specific study suggestions based on weak science topics.
 * @param topics - Array of science topics needing improvement.
 * @returns String with tailored study suggestions.
 */
function getTopicSpecificSuggestions(topics: string[]): string {
  const suggestions: string[] = [];
  for (const topic of topics) {
    switch (topic) {
      case "Biology":
        suggestions.push(
          "Review cell structures or genetics in your biology textbook. Practice Punnett squares or diagram food webs. "
        );
        break;
      case "Chemistry":
        suggestions.push(
          "Practice balancing chemical equations or study the periodic table. Watch videos on reaction types. "
        );
        break;
      case "Physics":
        suggestions.push(
          "Work on physics problems involving forces or energy. Draw free-body diagrams to understand motion. "
        );
        break;
      case "Earth Science":
        suggestions.push(
          "Study rock cycles or plate tectonics in your notes. Use apps like EarthViewer to visualize processes. "
        );
        break;
      case "Math":
        suggestions.push(
          "Solve extra math problems, focusing on equations or graphs. Use tools like Desmos to visualize functions. "
        );
        break;
      default:
        suggestions.push(
          "Review key concepts in your science textbook or class notes. "
        );
    }
  }
  return suggestions.join("");
}
