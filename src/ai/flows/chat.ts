import { defineFlow } from "genkit";
import { ai } from "../ai-instance"; // Import your configured AI instance
import { z } from "zod";

export const chatFlow = defineFlow(
  {
    name: "chatFlow",
    inputSchema: z.object({ message: z.string() }),
    outputSchema: z.string(),
  },
  async (input) => {
    const llmResponse = await ai.generate({
      model: "googleai/gemini-pro", // Or use your default from ai-instance if preferred
      prompt: input.message,
      // You might add history or context here later
      // history: [
      //   { role: 'user', content: '...' },
      //   { role: 'model', content: '...' },
      // ]
    });

    return llmResponse.text() ?? "Sorry, I could not generate a response.";
  }
);
