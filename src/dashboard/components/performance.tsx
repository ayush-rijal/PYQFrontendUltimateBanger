
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StudentPerformance() {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold">Performance</CardTitle>
        <Select defaultValue="month">
          <SelectTrigger className="w-[120px] h-8 text-sm">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="semester">Semester</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-6">
          {/* Bar Chart */}
          <div className="h-[200px] w-full relative">
            <div className="absolute inset-x-0 bottom-0 grid grid-cols-7 gap-2 h-[180px]">
              {[65, 40, 75, 50, 90, 60, 80].map((height, i) => (
                <div key={i} className="relative">
                  <div
                    className="absolute bottom-0 w-full bg-[#e74c3c]  rounded-t-md transition-all duration-300"
                    style={{ height: `${height}%` }}
                  />
                  <div
                    className="absolute bottom-0 w-full  bg-[#3498db] rounded-t-md transition-all duration-300"
                    style={{ height: `${height * 0.7}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 text-white solid items-baseline text-center w-full flex justify-between text-xs  text-bold ">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
          

          {/* Stats */}
          <div className="pt-4 border-t space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Average Score</span>
              <span className="font-semibold">78%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Study Time</span>
              <span className="font-semibold">24.5 hours</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Completion Rate</span>
              <span className="font-semibold">85%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
