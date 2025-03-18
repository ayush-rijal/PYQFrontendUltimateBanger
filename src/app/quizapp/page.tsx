"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useCategories } from "@/hooks/use-api"
import { LoadingCards } from "@/components/ui/loading-cards"
import { ErrorMessage } from "@/components/ui/error-message"

export default function Home() {
  const { data: categories, isLoading, error, refetch } = useCategories()

  if (isLoading) {
    return (
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Quiz Application</h1>
        <LoadingCards />
      </main>
    )
  }

  if (error) {
    return (
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Quiz Application</h1>
        <ErrorMessage
          message="Failed to load categories. Please make sure the Django server is running on http://localhost:8000"
          onRetry={refetch}
        />
      </main>
    )
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Quiz Application</h1>
      {!categories || categories.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">No categories found. Please make sure your Django backend has data.</p>
          <Button onClick={refetch}>Refresh</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>Select to view subcategories</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Browse quizzes related to {category.name}</p>
              </CardContent>
              <CardFooter>
                {/* <Link href={`/category/${category.name}`} className="w-full"> */}
                <Link href={`/category/${category.name}`} className="w-full">
                  <Button className="w-full">Explore {category.name} Quizzes</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}

