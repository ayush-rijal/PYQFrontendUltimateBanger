"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function FaqSearch() {
  const [searchQuery, setSearchQuery] = useState("")

  // This function would be used to filter FAQ items
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // You would typically dispatch this value to a context or pass it up to a parent component
    window.dispatchEvent(new CustomEvent("faq-search", { detail: e.target.value }))
  }

  return (
    <div className="relative mb-8">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search for answers..."
        className="pl-10"
        value={searchQuery}
        onChange={handleSearch}
      />
    </div>
  )
}

