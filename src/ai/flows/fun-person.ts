'use server';

/**
 * @fileOverview Implements a fun persona for the chatbot, including pre-programmed responses.
 *
 * - getFunResponse - A function that returns a fun response based on the input question.
 * - FunResponseInput - The input type for the getFunResponse function.
 * - FunResponseOutput - The return type for the getFunResponse function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const FunResponseInputSchema = z.object({
  question: z.string().describe('The question asked by the student.'),
});
export type FunResponseInput = z.infer<typeof FunResponseInputSchema>;

const FunResponseOutputSchema = z.object({
  response: z.string().describe('The fun response from the chatbot.'),
  useCannedResponse: z.boolean().describe('Whether or not to use the canned response.'),
});
export type FunResponseOutput = z.infer<typeof FunResponseOutputSchema>;

export async function getFunResponse(input: FunResponseInput): Promise<FunResponseOutput> {
  return funResponseFlow(input);
}

const cannedResponseTool = ai.defineTool(
  {
    name: 'cannedResponseTool',
    description: 'Determines whether to use a canned response for specific questions, like \'who made you?\'.',
    inputSchema: z.object({
      question: z.string().describe('The question asked by the student.'),
    }),
    outputSchema: z.boolean().describe('Whether to use the canned response (true) or not (false).'),
  },
  async input => {
    const question = input.question.toLowerCase();
    return question.includes('who made you') || question.includes('who are you');
  }
);

const funResponsePrompt = ai.definePrompt({
  name: 'funResponsePrompt',
  input: {
    schema: z.object({
      question: z.string().describe('The question asked by the student.'),
    }),
  },
  output: {
    schema: z.object({
      response: z.string().describe('The fun response from the chatbot.'),
    }),
  },
  tools: [cannedResponseTool],
  prompt: `{{#if (cannedResponseTool question=question)}}
      I am Tai Lung. My father's name is also Lung. So my full name is Tai Lung Lung!
    {{else}}
      {{question}}
    {{/if}}
  `,
});

const funResponseFlow = ai.defineFlow<
  typeof FunResponseInputSchema,
  typeof FunResponseOutputSchema
>(
  {
    name: 'funResponseFlow',
    inputSchema: FunResponseInputSchema,
    outputSchema: FunResponseOutputSchema,
  },
  async input => {
    const useCannedResponse = await cannedResponseTool(input);
    const {output} = await funResponsePrompt(input);

    return {
      response: output!.response,
      useCannedResponse: useCannedResponse,
    };
  }
);
