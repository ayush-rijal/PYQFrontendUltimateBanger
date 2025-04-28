import type { NextApiRequest, NextApiResponse } from "next";

// Define response types
interface ApiResponse {
  interactions: Array<{
    user_message: string;
    bot_response: string;
    timestamp: string;
  }>;
}

interface ErrorResponse {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | ErrorResponse>
) {
  const { period } = req.query as { period: string };

  if (req.method === "GET") {
    try {
      // Forward request to Django backend
      const response = await fetch(
        `http://localhost:8000/chat/interactions/${period}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include authentication token if needed
            // "Authorization": `Bearer ${req.headers.authorization}`,
          },
        }
      );

      const data: ApiResponse = await response.json();

      if (response.ok) {
        res.status(200).json(data);
      } else {
        res.status(response.status).json({ error: data.error || "Failed to fetch interactions" });
      }
    } catch (error) {
      res.status(500).json({ error: "Network error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}