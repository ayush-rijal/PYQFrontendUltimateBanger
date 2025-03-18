"use client"; // Required for any client-side interactivity (optional here unless adding state)

import React from "react";
import { GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";

// Define props interface
interface CourseCardProps {
  title: string;
  pages: number;
  assignments: number;
  questions: number;
  variant: "purple" | "beige" | "green";
}

// Demo data for testing
const demoCourses: CourseCardProps[] = [
  { title: "Basic Exam", pages: 24, assignments: 8, questions: 99, variant: "purple" },
  { title: "Learning Query", pages: 30, assignments: 10, questions: 120, variant: "beige" },
  { title: "Advanced Learning", pages: 18, assignments: 6, questions: 75, variant: "green" },
];

export function CourseCard({ title, pages, assignments, questions, variant }: CourseCardProps) {
  // Variant styles for light and dark modes
  const variantStyles = {
    purple: "bg-purple-100 dark:bg-purple-900/50 border-purple-200 dark:border-purple-800",
    beige: "bg-amber-100 dark:bg-amber-900/50 border-amber-200 dark:border-amber-800",
    green: "bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-800",
  };

  // SVG icons for consistency
  const icons = {
    pages: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-700 dark:text-gray-300">
        <path
          d="M4 19.5V4.5C4 3.4 4.9 2.5 6 2.5H18C19.1 2.5 20 3.4 20 4.5V19.5C20 20.6 19.1 21.5 18 21.5H6C4.9 21.5 4 20.6 4 19.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M8 7.5H16M8 11.5H16M8 15.5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    assignments: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-700 dark:text-gray-300">
        <path
          d="M8 5.5H6C4.9 5.5 4 6.4 4 7.5V18.5C4 19.6 4.9 20.5 6 20.5H18C19.1 20.5 20 19.6 20 18.5V7.5C20 6.4 19.1 5.5 18 5.5H16M8 5.5V3.5C8 2.4 8.9 1.5 10 1.5H14C15.1 1.5 16 2.4 16 3.5V5.5M8 5.5H16"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9 12.5L11 14.5L15 10.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    questions: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-700 dark:text-gray-300">
        <path
          d="M12 21.5C16.9706 21.5 21 17.4706 21 12.5C21 7.52944 16.9706 3.5 12 3.5C7.02944 3.5 3 7.52944 3 12.5C3 17.4706 7.02944 21.5 12 21.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M12 7.5V12.5L15 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <Card
      className={`  rounded-xl p-5 flex flex-col gap-4 border ${variantStyles[variant]} hover:shadow-lg transition-all duration-300`}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-lg bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-sm">
        <GraduationCap className="text-gray-800 dark:text-gray-200" size={24} />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1">{title}</h3>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-1.5">
          {icons.pages}
          <span>{pages} Pages</span>
        </div>
        <div className="flex items-center gap-1.5">
          {icons.assignments}
          <span>{assignments} Assignments</span>
        </div>
        <div className="flex items-center gap-1.5">
          {icons.questions}
          <span>{questions} Questions</span>
        </div>
      </div>
    </Card>
    
  );
}

// Demo Component to showcase with demo data
export function CourseCardDemo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {demoCourses.map((course) => (
        <CourseCard
          key={course.title}
          title={course.title}
          pages={course.pages}
          assignments={course.assignments}
          questions={course.questions}
          variant={course.variant}
        />
      ))}
    </div>
  );
}