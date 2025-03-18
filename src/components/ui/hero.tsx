"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface HeroProps {
  title: string;
  subtitle: string;
  actions?: { label: string; href: string; variant: string }[];
  titleClassName?: string;
  subtitleClassName?: string;
  actionsClassName?: string;
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  ({ title, subtitle }, ref) => {
    return (
      <section ref={ref} className="relative py-24 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/10 via-background to-background/80 z-0" />

        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-64 w-64 rounded-full bg-primary/5"
              initial={{
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
                scale: 0.8,
                opacity: 0.3,
              }}
              animate={{
                x: Math.random() * 100 - 50,
                y: Math.random() * 100 - 50,
                scale: 1.2,
                opacity: 0.2,
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="container relative z-10">
          <div className="flex flex-col items-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="inline-flex items-center py-1.5 px-4 bg-gradient-to-r from-primary/80 to-primary text-primary-foreground rounded-full font-medium shadow-lg">
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                Discuss with fellow students, share solutions, and improve
                together!
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-3xl md:text-6xl lg:text-7xl font-bold text-center mt-8 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl md:text-2xl text-center text-foreground/60 mt-6 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {subtitle}
            </motion.p>

            {/* Form */}
            <motion.div
              className="w-full mt-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <form className="flex flex-col sm:flex-row gap-3 sm:gap-0 p-1.5 sm:p-2 bg-background/30 backdrop-blur-sm border-2 border-amber-100  rounded-full max-w-lg mx-auto shadow-xl">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background/50 border-0 rounded-full px-6 h-12 flex-1 placeholder:text-foreground/40"
                />
                <Link href="/try-demo">
                  <Button
                    className="rounded-full bg-amber-500 hover:bg-primary/90 text-primary-foreground h-12 px-6 transition-all duration-300 ease-in-out"
                    type="submit"
                  >
                    Start Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </form>
            </motion.div>

            {/* Stats or social proof */}
            <motion.div
              className="flex flex-wrap justify-center gap-8 mt-12 text-foreground/60"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-foreground">10k+</span>
                <span className="text-sm">Students</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-foreground">500+</span>
                <span className="text-sm">Solutions</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-foreground">95%</span>
                <span className="text-sm">Satisfaction</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }
);

Hero.displayName = "Hero";

export { Hero };
