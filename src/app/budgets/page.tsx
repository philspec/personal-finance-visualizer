import { Suspense } from "react"
import type { Metadata } from "next"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { BudgetsList } from "@/components/budgets/budgets-list"
import { BudgetFormSheet } from "@/components/budgets/budget-form-sheet"
import { BudgetsListSkeleton } from "@/components/skeletons/budgets-list-skeleton"

export const metadata: Metadata = {
  title: "Budgets | Personal Finance Visualizer",
  description: "Set and manage your monthly budgets by category.",
}

export default function BudgetsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Budgets" text="Set and manage your monthly budgets by category.">
        <BudgetFormSheet />
      </DashboardHeader>
      <Suspense fallback={<BudgetsListSkeleton />}>
        <BudgetsList />
      </Suspense>
    </DashboardShell>
  )
}
