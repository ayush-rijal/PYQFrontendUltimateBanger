import type { NextApiRequest, NextApiResponse } from "next";

interface ChatRequest {
  message: string;
}

interface ChatResponse {
  response: string;
}

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse | ErrorResponse>
) {
  if (req.method === "POST") {
    try {
      const { message } = req.body as ChatRequest;

      // Forward request to Django backend
      const response = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data: ChatResponse = await response.json();

      if (response.ok) {
        res.status(200).json(data);
      } else {
        res.status(response.status).json({ error: data.error || "Failed to get response" });
      }
    } catch (error) {
      res.status(500).json({ error: "Network error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}