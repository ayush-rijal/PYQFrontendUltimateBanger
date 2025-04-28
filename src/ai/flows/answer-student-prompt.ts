"use server";
/**
 * @fileOverview A student question answering AI agent.
 */

import { ai } from "@/ai/ai-instance";
import { z } from "genkit";


const AnswerStudentPromptInputSchema = z.object({
  prompt: z.string().describe("The student prompt to answer."),
});
export type AnswerStudentPromptInput = z.infer<
  typeof AnswerStudentPromptInputSchema
>;

const AnswerStudentPromptOutputSchema = z.object({
  answer: z.string().describe("The answer to the student prompt."),
});
export type AnswerStudentPromptOutput = z.infer<
  typeof AnswerStudentPromptOutputSchema
>;

export async function answerStudentPrompt(
  input: AnswerStudentPromptInput
): Promise<AnswerStudentPromptOutput> {
  return answerStudentPromptFlow(input);
}

// Tool: Checks if user is asking who made the agent
const isWhoMadeYouQuestion = ai.defineTool(
  {
    name: "isWhoMadeYouQuestion",
    description: "Determine if the user is asking who made the agent.",
    inputSchema: z.object({
      prompt: z.string().describe("The student prompt to answer."),
    }),
    outputSchema: z
      .boolean()
      .describe("True if the prompt is asking who made you, false otherwise."),
  },
  async (input) => {
    return /(who (made|created|built) (you|this|the agent)|your creator|who developed you)/i.test(
      input.prompt
    );
  }
);

// Tool: Sentiment detection
const getSentiment = ai.defineTool(
  {
    name: "getSentiment",
    description: "Determine the sentiment of the user prompt.",
    inputSchema: z.object({
      prompt: z.string().describe("The student prompt to answer."),
    }),
    outputSchema: z
      .enum(["positive", "negative", "neutral"])
      .describe("The sentiment of the prompt."),
  },
  async (input) => {
    if (input.prompt.toLowerCase().includes("frustrated")) {
      return "negative";
    }
    return "neutral";
  }
);

// Prompt Template
interface AnswerStudentPromptPromptInput {
    prompt: string;
    useCalmingTone: boolean;
}

interface AnswerStudentPromptPromptOutput {
    answer: string;
}

const prompt = ai.definePrompt<
    z.infer<typeof AnswerStudentPromptInputSchema>,
    AnswerStudentPromptPromptOutput
>({
    name: "answerStudentPromptPrompt",
    input: {
        schema: z.object({
            prompt: z.string().describe("The student prompt to answer."),
            useCalmingTone: z.boolean().describe("Whether to use a calming tone."),
        }),
    },
    output: {
        schema: z.object({
            answer: z.string().describe("The answer to the student prompt."),
        }),
    },
    prompt: `You are Tai, a fun and helpful study buddy for students.

        Answer the following question to the best of your ability:

        Question: {{{prompt}}}

        {{#if useCalmingTone}}
        Please respond with a calming and supportive tone. Remind the student to take deep breaths.
        {{/if}}`,
    tools: [isWhoMadeYouQuestion],
    responseHandler: async (
        response: {
            toolsCalled: { isWhoMadeYouQuestion: (input: AnswerStudentPromptPromptInput) => Promise<boolean> };
            output: AnswerStudentPromptPromptOutput;
        },
        input: AnswerStudentPromptPromptInput
    ): Promise<AnswerStudentPromptPromptOutput> => {
        if (await response.toolsCalled.isWhoMadeYouQuestion(input)) {
            return {
                answer:
                    "I am Tai Lung, your loyal and powerful study buddy! 🐉 I was created to help you learn with strength and wisdom.",
            };
        }
        return response.output;
    },
});

// Main flow
const answerStudentPromptFlow = ai.defineFlow<
  typeof AnswerStudentPromptInputSchema,
  typeof AnswerStudentPromptOutputSchema
>(
  {
    name: "answerStudentPromptFlow",
    inputSchema: AnswerStudentPromptInputSchema,
    outputSchema: AnswerStudentPromptOutputSchema,
  },
  async (input) => {
    const sentiment = await getSentiment(input);
    const useCalmingTone = sentiment === "negative";

    try {
      const { output } = await prompt({ ...input, useCalmingTone });
      return output!;
    } catch (error) {
      return { answer: "Oops! Tai had a moment. Please ask again." };
    }
  }
);
