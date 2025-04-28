"use server";
/**
 * @fileOverview A sentiment-based tone adjustment AI agent.
 *
 * - sentimentBasedToneAdjustment - A function that adjusts the chatbot's tone based on user sentiment.
 * - SentimentBasedToneAdjustmentInput - The input type for the sentimentBasedToneAdjustment function.
 * - SentimentBasedToneAdjustmentOutput - The return type for the sentimentBasedToneAdjustment function.
 */

import { ai } from "@/ai/ai-instance";
import { z } from "genkit";

const SentimentBasedToneAdjustmentInputSchema = z.object({
  userInput: z
    .string()
    .describe("The user input to be analyzed for sentiment."),
  defaultResponse: z.string().describe("The default chatbot response."),
});
export type SentimentBasedToneAdjustmentInput = z.infer<
  typeof SentimentBasedToneAdjustmentInputSchema
>;

const SentimentBasedToneAdjustmentOutputSchema = z.object({
  adjustedResponse: z
    .string()
    .describe("The chatbot response adjusted based on sentiment."),
});
export type SentimentBasedToneAdjustmentOutput = z.infer<
  typeof SentimentBasedToneAdjustmentOutputSchema
>;

export async function sentimentBasedToneAdjustment(
  input: SentimentBasedToneAdjustmentInput
): Promise<SentimentBasedToneAdjustmentOutput> {
  return sentimentBasedToneAdjustmentFlow(input);
}

const analyzeSentiment = ai.defineTool(
  {
    name: "analyzeSentiment",
    description:
      "Analyzes the sentiment of the user input and returns whether the user is frustrated or not.",
    inputSchema: z.object({
      text: z.string().describe("The text to analyze for sentiment."),
    }),
    outputSchema: z.object({
      isFrustrated: z.boolean().describe("Whether the user is frustrated."),
      sentimentScore: z.number().describe("The sentiment score of the text."),
    }),
  },
  async (input) => {
    // Mock implementation - replace with actual sentiment analysis logic
    // This is just to simulate sentiment analysis.
    const frustrationKeywords = [
      "frustrated",
      "angry",
      "mad",
      "hate",
      "difficult",
    ];
    const isFrustrated = frustrationKeywords.some((keyword) =>
      input.text.toLowerCase().includes(keyword)
    );
    const sentimentScore = isFrustrated ? -0.8 : 0.5; // Arbitrary scores

    return {
      isFrustrated: isFrustrated,
      sentimentScore: sentimentScore,
    };
  }
);

const adjustTonePrompt = ai.definePrompt({
  name: "adjustTonePrompt",
  input: {
    schema: z.object({
      userInput: z
        .string()
        .describe("The user input to be analyzed for sentiment."),
      defaultResponse: z.string().describe("The default chatbot response."),
      isFrustrated: z.boolean().describe("Whether the user is frustrated."),
    }),
  },
  output: {
    schema: z.object({
      adjustedResponse: z
        .string()
        .describe("The chatbot response adjusted based on sentiment."),
    }),
  },
  prompt: `{{#if isFrustrated}}
    You have detected that the user is frustrated. Please respond with a calming and supportive tone.

    Default Response: {{{defaultResponse}}}

    Adjusted Response:
    {{else}}
    {{defaultResponse}}
    {{/if}}`,
});

const sentimentBasedToneAdjustmentFlow = ai.defineFlow<
  typeof SentimentBasedToneAdjustmentInputSchema,
  typeof SentimentBasedToneAdjustmentOutputSchema
>(
  {
    name: "sentimentBasedToneAdjustmentFlow",
    inputSchema: SentimentBasedToneAdjustmentInputSchema,
    outputSchema: SentimentBasedToneAdjustmentOutputSchema,
  },
  async (input) => {
    const sentimentAnalysisResult = await analyzeSentiment({
      text: input.userInput,
    });

    const { output } = await adjustTonePrompt({
      ...input,
      isFrustrated: sentimentAnalysisResult.isFrustrated,
    });

    return {
      adjustedResponse: output?.adjustedResponse ?? input.defaultResponse,
    };
  }
);
