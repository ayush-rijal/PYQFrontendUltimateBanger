
"use server";

import { ai } from "@/ai/ai-instance";
import { z } from "genkit";
import { cache } from "react";

// Input schema
const ExplainQuestionInputSchema = z.object({
  question: z
    .string()
    .describe("The quiz question to be solved and explained."),
  choices: z.array(z.string()).optional().describe("The answer choices."),
  correctAnswer: z.string().optional().describe("The correct answer."),
  subject: z
    .string()
    .optional()
    .describe("The science subject (e.g., Physics)."),
});

export type ExplainQuestionInput = z.infer<typeof ExplainQuestionInputSchema>;

// Output schema
const ExplainQuestionOutputSchema = z.object({
  explanation: z.string().describe("Structured explanation of the concept."),
});

export type ExplainQuestionOutput = z.infer<typeof ExplainQuestionOutputSchema>;

// Prompt definition
const explainQuestionPrompt = ai.definePrompt({
  name: "explainQuestionPrompt",
  input: { schema: ExplainQuestionInputSchema },
  output: { schema: ExplainQuestionOutputSchema },
  prompt: `
  You are an expert science tutor for high school and college students. Solve the quiz question below and provide a structured, engaging explanation.

  **Question**: {{{question}}}
  {{#if choices}}
  **Choices**:
  {{#each choices}}- {{this}}
  {{/each}}
  {{/if}}
  {{#if correctAnswer}}**Correct Answer Provided**: {{{correctAnswer}}}{{/if}}
  {{#if subject}}**Category**: {{{subject}}}{{/if}}
  

  Instructions:
  - Solve the Question: Identify the correct answer.
  - Explain the Concept.
  - Justify the Answer.
  - Include an Example.
  - Highlight a Common Misconception.
  - Use markdown with bullet points and the following sections:
    - Correct Answer
    - Concept
    - Why Correct
    - Why Others Incorrect (optional)
    - Example
    - Common Misconception

  **Length**: Keep between 150-300 words.
  **Tone**: Clear, student-friendly, and encouraging.
`,
});

// Flow
const explainQuestionFlow = ai.defineFlow<
  typeof ExplainQuestionInputSchema,
  typeof ExplainQuestionOutputSchema
>(
  {
    name: "explainQuestionFlow",
    inputSchema: ExplainQuestionInputSchema,
    outputSchema: ExplainQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await explainQuestionPrompt(input);
    if (!output?.explanation) throw new Error("No explanation generated.");
    return output;
  }
);

// Cache logic
const cachedExplainQuestion = cache(async (input: ExplainQuestionInput) => {
  try {
    return await explainQuestionFlow(input);
  } catch (err) {
    console.error("[ExplainQuestion] Failed:", err);
    throw new Error("Unable to generate explanation. Please try again.");
  }
});

// Main export
export async function explainQuestion(
  input: ExplainQuestionInput
): Promise<ExplainQuestionOutput> {
  return cachedExplainQuestion(input);
}
