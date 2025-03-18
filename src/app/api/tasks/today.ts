import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Task = {
  id: number;
  title: string;
  due_date: string;
  completed: boolean;
};

type ApiResponse = {
  data?: Task[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { method } = req;
  const token = req.headers.authorization;

  if (method === "GET") {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await axios.get<Task[]>("http://localhost:8000/api/tasks/", {
        headers: { Authorization: token },
        params: { due_date__date: today },
      });
      res.status(200).json({ data: response.data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}