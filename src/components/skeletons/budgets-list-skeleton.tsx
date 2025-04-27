export function BudgetsListSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="h-10 border-b animate-pulse bg-muted/50"></div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-16 border-b last:border-0 animate-pulse bg-muted/50"></div>
      ))}
    </div>
  )
}
