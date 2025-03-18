"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PastPaper() {
  return (
    <section
      id="papers"
      className="py-12 sm:py-16 md:py-24 bg-muted/30"
      aria-labelledby="past-papers-heading"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Comprehensive Resources
            </div>
            <h2
              id="past-papers-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
            >
              Past Year Question Papers
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-[600px]">
              Access a vast repository of past question papers from various Nepalese educational institutions to help you prepare effectively.
            </p>

            <div className="mt-6 space-y-4">
              {[
                {
                  title: "CEE & IOM Papers",
                  desc: "Common Entrance Examination and Institute of Medicine",
                },
                {
                  title: "IOE & Pulchowk Papers",
                  desc: "Institute of Engineering and Pulchowk Campus",
                },
                {
                  title: "Lok Sewa & KU Papers",
                  desc: "Public Service Commission and Kathmandu University",
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button className="mt-6 w-full sm:w-auto gap-2 bg-amber-500">
              Browse All Papers <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "CEE 2022", pages: 24 },
              { name: "IOE 2023", pages: 32 },
              { name: "IOM 2022", pages: 18 },
              { name: "Pulchowk 2023", pages: 28 },
              { name: "Lok Sewa 2022", pages: 42 },
              { name: "KU 2023", pages: 36 },
            ].map((paper, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <CardContent className="p-0">
                  <div className="p-4 sm:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-sm sm:text-base">{paper.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {paper.pages} pages
                      </span>
                    </div>
                    <div className="h-24 sm:h-32 bg-muted rounded-md flex items-center justify-center">
                      <FileText
                        className="h-8 sm:h-10 w-8 sm:w-10 text-muted-foreground/50"
                        aria-hidden="true"
                      />
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View Paper
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}