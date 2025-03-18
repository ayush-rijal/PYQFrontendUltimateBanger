"use client"
import React from 'react'
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
export default function CTASection() {
  return (
    <section className=" flex flex-col justify-center  py-10 ms-4 mr-4 md:py-24">
    <div className="container border-2 border-amber-100 rounded-xl">
      <div className="rounded-xl bg-primary/10 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background opacity-50" />
        <div className="relative z-10 max-w-[800px] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to transform your learning experience?
          </h2>
          <p className="text-lg text-muted-foreground mt-4">
            Join thousands of students who are already benefiting from our comprehensive learning platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="gap-2 bg-amber-500">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}
