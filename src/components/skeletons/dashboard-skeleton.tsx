export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 h-[120px] animate-pulse bg-muted/50"></div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4 h-[300px] animate-pulse bg-muted/50"></div>
        <div className="rounded-lg border p-4 h-[300px] animate-pulse bg-muted/50"></div>
      </div>
      <div className="rounded-lg border p-4 h-[300px] animate-pulse bg-muted/50"></div>
      <div className="space-y-2">
        <div className="h-4 w-32 animate-pulse bg-muted/50 rounded"></div>
        <div className="rounded-lg border">
          <div className="h-10 border-b animate-pulse bg-muted/50"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 border-b last:border-0 animate-pulse bg-muted/50"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
