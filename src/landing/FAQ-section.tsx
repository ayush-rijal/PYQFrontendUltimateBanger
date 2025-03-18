import type { Metadata } from "next"
import { FaqSearch } from "./faq-search"
import { FaqContent } from "./faq-content"

export const metadata: Metadata = {
  title: "FAQ - Learning Management System",
  description: "Frequently asked questions about our Learning Management System",
}

export default function FaqPage() {
  return (
    <div className="container max-w-4xl py-12 mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about our Learning Management System.
        </p>
      </div>

      <FaqSearch />
      <FaqContent />
    </div>
  )
}

