"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginFormProps {
  onLogin: () => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<"login" | "register" | "success">("login")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)

      if (view === "register") {
        setView("success")
      } else {
        onLogin()
      }
    }, 300)
  }

  return (
    <div className="space-y-4 py-2 pb-4">
      {view === "success" ? (
        <div className="space-y-4 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-medium text-lg">Account Created</h3>
          <p className="text-sm text-muted-foreground">
            Your account has been successfully created. You now have access to all quiz questions.
          </p>
          <Button onClick={onLogin}>Continue to Quiz</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {view === "login" ? "Logging in..." : "Creating account..."}
              </>
            ) : view === "login" ? (
              "Log in"
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      )}

      {view !== "success" && (
        <div className="mt-4 text-center text-sm">
          {view === "login" ? (
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => setView("register")}>
                Create one
              </Button>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => setView("login")}>
                Log in
              </Button>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

