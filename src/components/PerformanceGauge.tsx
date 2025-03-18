"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface PerformanceGaugeProps {
  apiEndpoint: string
  refreshInterval?: number
  size?: "sm" | "md" | "lg" | "xl"
  showValue?: boolean
  label?: string
  valueFormatter?: (value: number) => string
  thickness?: number
  animated?: boolean
  className?: string
}

interface PerformanceData {
  value: number
  min: number
  max: number
  label?: string
}

export function PerformanceGauge({
  apiEndpoint,
  refreshInterval = 5000,
  size = "lg",
  showValue = true,
  label: defaultLabel,
  valueFormatter = (val) => `${Math.round(val)}%`,
  thickness = 10,
  animated = true,
  className,
}: PerformanceGaugeProps) {
  const [data, setData] = useState<PerformanceData | null>(null)
  const [currentValue, setCurrentValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data from the backend
  const fetchData = async () => {
    try {
      const response = await fetch(apiEndpoint)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  // Initial data fetch and refresh interval
  useEffect(() => {
    fetchData()

    const intervalId = setInterval(fetchData, refreshInterval)

    return () => clearInterval(intervalId)
  }, [apiEndpoint, refreshInterval])

  // Animation effect when value changes
  useEffect(() => {
    if (data && animated) {
      setCurrentValue(0)
      const timer = setTimeout(() => {
        setCurrentValue(data.value)
      }, 100)
      return () => clearTimeout(timer)
    } else if (data) {
      setCurrentValue(data.value)
    }
  }, [data, animated])

  // If still loading, show loading spinner
  if (loading) {
    return (
      <div className={cn("flex items-center justify-center", getSizeClass(size))}>
        <Loader2 className="animate-spin text-primary" />
      </div>
    )
  }

  // If error occurred, show error message
  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center text-center", getSizeClass(size))}>
        <div className="text-red-500 dark:text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm">Failed to load data</p>
        </div>
      </div>
    )
  }

  // If no data, return empty state
  if (!data) {
    return (
      <div className={cn("flex items-center justify-center", getSizeClass(size))}>
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  // Calculate SVG parameters
  const min = data.min || 0
  const max = data.max || 100
  const normalizedValue = Math.min(Math.max(currentValue, min), max)
  const percentage = ((normalizedValue - min) / (max - min)) * 100

  const radius = 50 - thickness / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Determine color based on value
  const getColorClass = (value: number, min: number, max: number) => {
    const percentage = ((value - min) / (max - min)) * 100

    if (percentage >= 75) return "stroke-green-500 dark:stroke-green-400"
    if (percentage >= 40) return "stroke-amber-500 dark:stroke-amber-400"
    return "stroke-red-500 dark:stroke-red-400"
  }

  const label = data.label || defaultLabel

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className={cn("relative flex items-center justify-center", getSizeClass(size))}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth={thickness}
            className="stroke-gray-200 dark:stroke-gray-700"
          />

          {/* Foreground track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={animated ? strokeDashoffset : strokeDashoffset}
            strokeLinecap="round"
            className={cn(
              getColorClass(normalizedValue, min, max),
              animated ? "transition-all duration-1000 ease-out" : "",
            )}
          />
        </svg>

        {/* Center content */}
        {showValue && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span
              className={cn(
                "font-bold text-foreground",
                size === "sm" ? "text-lg" : "",
                size === "md" ? "text-xl" : "",
                size === "lg" ? "text-2xl" : "",
                size === "xl" ? "text-3xl" : "",
              )}
            >
              {valueFormatter(normalizedValue)}
            </span>
            {label && (
              <span
                className={cn(
                  "text-muted-foreground",
                  size === "sm" ? "text-xs" : "",
                  size === "md" ? "text-sm" : "",
                  size === "lg" ? "text-xs" : "",
                  size === "xl" ? "text-lg" : "",
                )}
              >
                {label}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to get size class
function getSizeClass(size: string) {
  const sizeMap: Record<string, string> = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-40 h-40",
    xl: "w-48 h-48",
  }
  return sizeMap[size] || sizeMap.lg
}

