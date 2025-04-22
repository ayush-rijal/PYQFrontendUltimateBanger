import React from "react"

interface HighlightProps {
  text: string
  highlights?: string[]
  className?: string
}

export function ExplanationHighlight({ text, highlights = [], className }: HighlightProps) {
  if (!highlights.length) {
    return <p className={className}>{text}</p>
  }

  // Create a regex to match all highlights
  const regex = new RegExp(`(${highlights.join("|")})`, "gi")
  const parts = text.split(regex)

  return (
    <p className={className}>
      {parts.map((part, i) => {
        // Check if this part matches any highlight term (case insensitive)
        const isHighlight = highlights.some((h) => part.toLowerCase() === h.toLowerCase())

        return isHighlight ? (
          <span key={i} className="bg-primary/20 text-primary-foreground px-1 rounded">
            {part}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      })}
    </p>
  )
}
