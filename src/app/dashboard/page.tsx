"use client";

import Header from "@/dashboard/components/Header";
import CourseCardDemo from "@/dashboard/CourseCard";
import { TopUsers } from "@/dashboard/TopUser";
import DashboardTodo from "@/to-do/todo_dashboard";
import ResultAnalysis from "@/dashboard/components/HoursSpent";
// import { StudentPerformance } from "@/dashboard/components/performance";
import { DashboardCalendar } from "@/dashboard/Calendar_dashboard";

// import { cn } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <div className="bg-background  flex flex-col">
      <Header />
      <div className="container mx-auto p-4 pt-6">
        {/* First Row - Course Cards */}

        <section className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Courses Container */}
          <div className="w-full md:w-3/4 rounded-4xl  border-b-5 border-black-900 bg-card shadow-md transition-all duration-300 hover:shadow-lg">
            <h2 className="text-lg md:text-xl font-semibold text-foreground text-center mt-4 mb-4">
              My Courses
            </h2>
            <div className="p-4">
              <CourseCardDemo />
            </div>
          </div>

          {/* Calendar Container */}
          <div className="w-full md:w-1/4">
            <div className="   bg-card shadow-md transition-all duration-300 hover:shadow-lg h-full rounded-4xl  border-b-5 border-black-900 ">
              <DashboardCalendar />
            </div>
          </div>
        </section>

        {/* Second Row - Analytics and Calendar */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">
            Analytics & Schedule
          </h2>
          <ResultAnalysis />
        </section>
        {/* Todo Column */}

        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-foreground">
          Today&apos;s Tasks
        </h2>
        <div className=" p-4">
        <DashboardTodo />
          
        </div>
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
         
          Progress
        </h2>
        <div className=" p-4 ">
          <TopUsers />
        </div>
      </div>
    </div>
  );
}
