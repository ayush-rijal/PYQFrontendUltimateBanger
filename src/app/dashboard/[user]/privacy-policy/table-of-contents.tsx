"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const tocItems = [
  { id: "introduction", label: "1. Introduction" },
  { id: "information-we-collect", label: "2. Information We Collect" },
  { id: "how-we-use-information", label: "3. How We Use Your Information" },
  { id: "data-sharing", label: "4. How We Share Your Information" },
  { id: "data-security", label: "5. Data Security" },
  { id: "cookies", label: "6. Cookies and Tracking Technologies" },
  { id: "user-rights", label: "7. Your Data Protection Rights" },
  { id: "children-privacy", label: "8. Children's Privacy" },
  { id: "international-transfers", label: "9. International Data Transfers" },
  { id: "policy-changes", label: "10. Changes to This Privacy Policy" },
  { id: "contact-us", label: "11. Contact Us" },
]

export function TableOfContents() {
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-100px 0px -80% 0px",
        threshold: 0,
      },
    )

    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => {
      observer.observe(section)
    })

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section)
      })
    }
  }, [])

  return (
    <div className="hidden md:block sticky top-20 self-start">
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Table of Contents</h3>
        <nav className="space-y-1">
          {tocItems.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              className={`block py-1 text-sm hover:text-primary transition-colors ${
                activeSection === item.id ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

