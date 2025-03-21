import  Leaderboard  from "@/leaderboard/Leaderboard"

export default function page() {
  return (
    <main className="min-h-screen md:p-8 lg:p-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Leaderboard</h1>
          <p className="text-muted-foreground md:text-xl">See who&apos;s leading the competition</p>
        </div>
        <Leaderboard /> 
      </div>
    </main>
  )
}

