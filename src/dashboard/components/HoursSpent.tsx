"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChartIcon, PieChartIcon } from "lucide-react"

export function ResultAnalysis() {
  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Result Analysis</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="grades">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="grades" className="flex items-center gap-2">
              <BarChartIcon className="h-4 w-4" />
              <span>Grades</span>
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span>Subjects</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grades" className="space-y-6">
            <div className="space-y-4">
              {[
                { subject: "Web Development", grade: "A", percentage: 92 },
                { subject: "Data Science", grade: "B+", percentage: 85 },
                { subject: "UX Design", grade: "A-", percentage: 88 },
                { subject: "Mobile App Dev", grade: "B", percentage: 82 },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.subject}</span>
                    <span className="font-semibold">
                      {item.grade} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Overall GPA</span>
                <span className="text-base font-bold">3.7/4.0</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="mt-0 flex items-center justify-center min-h-[200px]">
            <div className="relative w-full max-w-xs mx-auto">
              <div className="flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-primary relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">85%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <span>Technical</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span>Design</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>Theory</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}