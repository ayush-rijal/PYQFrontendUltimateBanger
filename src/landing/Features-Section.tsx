"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Users,
  Award,
  MessageSquare,
  Brain,
  FileText,
  ChevronRight,
} from "lucide-react";

export default function FeaturesSection() {
  const [activeCard, setActiveCard] = useState(0);

  const features = [
    {
      title: "Real-time Collaboration",
      description:
        "Work together with peers on documents, projects, and presentations in real-time with synchronized editing and changes.",
      icon: <Users className="h-6 w-6" aria-hidden="true" />,
      color: "from-blue-500 to-indigo-600",
      image: "/Frame 47.svg",
    },
    {
      title: "Result Analysis & Leaderboard",
      description:
        "Track your progress with detailed performance analytics and compete with peers on our dynamic leaderboard.",
      icon: <Award className="h-6 w-6" aria-hidden="true" />,
      color: "from-amber-500 to-orange-600",
      image: "/Frame 47.svg",
    },
    {
      title: "AI-Powered Whiteboard & Lab",
      description:
        "Collaborate on our intelligent whiteboard and experiment in our AI-driven lab environment for enhanced learning.",
      icon: <Brain className="h-6 w-6" aria-hidden="true" />,
      color: "from-emerald-500 to-green-600",
      image: "/Frame 47.svg",
    },
    {
      title: "Real-time Chat with Mentors",
      description:
        "Connect instantly with high-ranking users and mentors for guidance, support, and collaborative learning.",
      icon: <MessageSquare className="h-6 w-6" aria-hidden="true" />,
      color: "from-purple-500 to-violet-600",
      image: "/Frame 47.svg",
    },
    {
      title: "Personalized Skill Improvement",
      description:
        "Receive tailored suggestions to enhance your skills based on your performance and learning patterns.",
      icon: <BookOpen className="h-6 w-6" aria-hidden="true" />,
      color: "from-rose-500 to-pink-600",
      image: "/Frame 47.svg",
    },
    {
      title: "Comprehensive Past Papers",
      description:
        "Access a vast repository of past question papers from CEE, IOM, IOE, Lok Sewa, KU, Pulchowk, and more.",
      icon: <FileText className="h-6 w-6" aria-hidden="true" />,
      color: "from-cyan-500 to-blue-600",
      image: "/Frame 47.svg",
    },
  ];

  return (
    <section
      id="features"
      className="py-12 sm:py-16 md:py-24 bg-muted/30"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Key Features
            </div>
            <h2
              id="features-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
            >
              Everything you need to excel in your education
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-[600px]">
              Our platform combines cutting-edge technology with comprehensive educational resources tailored for Nepalese students preparing for various competitive exams.
            </p>
            <ul className="space-y-3 mt-6">
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                    activeCard === index
                      ? "bg-primary/10 border border-primary/20 shadow-sm"
                      : "hover:bg-muted"
                  )}
                  onClick={() => setActiveCard(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setActiveCard(index)}
                >
                  <div
                    className={cn(
                      "rounded-full p-2 bg-gradient-to-br flex-shrink-0",
                      feature.color
                    )}
                  >
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm sm:text-base">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
                      {feature.description}
                    </p>
                  </div>
                  <ChevronRight
                    className={cn(
                      "ml-auto h-5 w-5 text-primary transition-transform duration-200",
                      activeCard === index ? "rotate-90" : ""
                    )}
                    aria-hidden="true"
                  />
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right Column */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-xl border shadow-xl">
            <motion.div
              key={activeCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Image
                src={features[activeCard].image || "/placeholder.svg"}
                alt={`${features[activeCard].title} feature preview`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                priority={activeCard === 0} // Priority for first image only
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  {features[activeCard].title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                  {features[activeCard].description}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}