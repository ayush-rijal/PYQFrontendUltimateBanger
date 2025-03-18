"use client";
import React from "react";
import { Users, Award, Brain } from "lucide-react";
import Image from "next/image";
import FeatureCard from "@/landing/feature-card";

export default function DashboardSection() {
  return (
    <section
      id="dashboard"
      className="py-12 sm:py-16 md:py-24 bg-background"
      aria-labelledby="dashboard-heading"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="text-center max-w-[800px] mx-auto mb-8 sm:mb-12">
          <h2
            id="dashboard-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
          >
            Powerful Dashboard for Enhanced Learning
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mt-4">
            Our intuitive dashboard brings together all the tools you need to
            succeed in your educational journey.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8 sm:mt-12">
          {[
            {
              title: "Real-time Collaboration",
              description:
                "Work together with peers on documents and projects with synchronized editing.",
              icon: <Users className="h-5 w-5" aria-hidden="true" />,
            },
            {
              title: "AI-Powered Whiteboard",
              description:
                "Brainstorm and solve problems collaboratively with our intelligent whiteboard.",
              icon: <Brain className="h-5 w-5" aria-hidden="true" />,
            },
            {
              title: "Performance Analytics",
              description:
                "Track your progress with detailed insights and performance metrics.",
              icon: <Award className="h-5 w-5" aria-hidden="true" />,
            },
          ].map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>

        {/* Image Preview */}
        <div className="mt-12 sm:mt-16 relative rounded-xl overflow-hidden border shadow-xl">
          <Image
            src="/Frame 47.svg"
            height={800}
            width={1600}
            alt="Dashboard Preview showing key features and interface"
            className="w-full h-auto object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
            priority
          />
        </div>
      </div>
    </section>
  );
}
