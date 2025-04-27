import type React from "react"
interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return <div className="container grid items-start gap-8 pb-8 pt-6">{children}</div>
}
