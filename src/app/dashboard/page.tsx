"use client";
// import type { Metadata } from "next"
import Header from "@/dashboard/components/Header";
import { CourseCardDemo } from "@/dashboard/CourseCard";
import { TopUsers } from "@/dashboard/TopUser";
import DashboardTodo from "@/to-do/todo_dashboard";
import { ResultAnalysis } from "@/dashboard/components/HoursSpent"
import { StudentPerformance } from "@/dashboard/components/performance"
import { DashboardCalendar } from "@/dashboard/Calendar_dashboard"
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-4 pt-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* First Row - Course Cards */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-4">My Courses</h2>
          <CourseCardDemo />
        </section>

        {/* Second Row - Analytics and Calendar */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Analytics & Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ResultAnalysis />
            <StudentPerformance />
            <DashboardCalendar />
          </div>
        </section>

        {/* Third Row - Leaderboard and Todo */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Progress & Tasks</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopUsers />
            <DashboardTodo />
          </div>
        </section>
      </div>
    </div>
  )
}

