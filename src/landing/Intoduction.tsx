"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tag } from "@/landing/Tag"; // Assuming this is your updated Tag component

export default function Introduction() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative py-12 md:py-16 bg-background overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <Tag size="lg" variant="success" className="font-medium uppercase">
            Welcome to PastYearQuestion
          </Tag>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Your Path to Success Starts Here
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            {/* PastYearQuestion is your ultimate LMS companion, empowering Nepalese
            students to ace exams with smart tools and resources. */}

              The ultimate LMS companion, empowering Nepalese
              students to ace exams with smart tools and resources.

          </p>
          <p className="text-sm md:text-base text-primary font-medium">
            Simple. Powerful. Built for You.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
