import { NextResponse } from "next/server"

// Simulated backend API that would normally connect to your database or monitoring service
export async function GET() {
  // Simulate a small delay like a real API would have
  await new Promise((resolve) => setTimeout(resolve, 500))

  try {
    // In a real application, you would fetch this data from your database or monitoring service
    // This is just a simulation that returns random performance data
    const performanceData = {
      value: Math.random() * 100, // Random value between 0 and 100
      min: 0,
      max: 100,
      label: "Your Performance",
    }

    return NextResponse.json(performanceData)
  } catch {
    return NextResponse.json({ error: "Failed to fetch performance data" }, { status: 500 })
  }
}

