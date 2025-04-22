'use server';
/**
 * @fileOverview Generates a quiz from a given topic.
 *
 * - generateQuizFromTopic - A function that generates a quiz from a topic.
 * - GenerateQuizFromTopicInput - The input type for the generateQuizFromTopic function.
 * - GenerateQuizFromTopicOutput - The return type for the generateQuizFromTopic function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateQuizFromTopicInputSchema = z.object({
  topic: z.string().describe('The topic to generate a quiz for.'),
  numQuestions: z.number().describe('The number of questions to generate.'),
});
export type GenerateQuizFromTopicInput = z.infer<
  typeof GenerateQuizFromTopicInputSchema
>;

const GenerateQuizFromTopicOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      options: z.array(z.string()).describe('The answer options.'),
      answer: z.string().describe('The correct answer.'),
    })
  ).
    describe('The generated quiz.'),
});
export type GenerateQuizFromTopicOutput = z.infer<
  typeof GenerateQuizFromTopicOutputSchema
>;

export async function generateQuizFromTopic(
  input: GenerateQuizFromTopicInput
): Promise<GenerateQuizFromTopicOutput> {
  return generateQuizFromTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizFromTopicPrompt',
  input: {
    schema: z.object({
      topic: z.string().describe('The topic to generate a quiz for.'),
      numQuestions: z.number().describe('The number of questions to generate.'),
    }),
  },
  output: {
    schema: z.object({
      quiz: z.array(
        z.object({
          question: z.string().describe('The quiz question.'),
          options: z.array(z.string()).describe('The answer options.'),
          answer: z.string().describe('The correct answer.'),
        })
      ).
        describe('The generated quiz.'),
    }),
  },
  prompt: `You are a quiz generator. Generate a quiz with {{numQuestions}} questions about {{topic}}. The quiz should have multiple choice questions with 4 options each. Each question should have one correct answer.

Output the quiz in JSON format. The JSON should be an array of objects. Each object should have the following keys:
- question: the quiz question
- options: an array of 4 strings, the answer options
- answer: the correct answer to the question

Here's an example:
[
  {
    "question": "What is the capital of France?",
    "options": ["London", "Paris", "Berlin", "Rome"],
    "answer": "Paris"
  },
  {
    "question": "What is the highest mountain in the world?",
    "options": ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"],
    "answer": "Mount Everest"
  }
]
`,
});

const generateQuizFromTopicFlow = ai.defineFlow<
  typeof GenerateQuizFromTopicInputSchema,
  typeof GenerateQuizFromTopicOutputSchema
>(
  {
    name: 'generateQuizFromTopicFlow',
    inputSchema: GenerateQuizFromTopicInputSchema,
    outputSchema: GenerateQuizFromTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
