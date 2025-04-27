import { Suspense } from "react"
import type { Metadata } from "next"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardSummary } from "@/components/dashboard/dashboard-summary"
import { RecentTransactions } from "@/components/transactions/recent-transactions"
import { MonthlyExpensesChart } from "@/components/charts/monthly-expenses-chart"
import { CategoryPieChart } from "@/components/charts/category-pie-chart"
import { BudgetComparisonChart } from "@/components/charts/budget-comparison-chart"
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton"

export const metadata: Metadata = {
  title: "Dashboard | Personal Finance Visualizer",
  description: "Track your income, expenses, and budget with our personal finance visualizer.",
}

export default function DashboardPage() {
  return (
    <main>
      <DashboardShell>
        <DashboardHeader 
          heading="Dashboard" 
          text="Get an overview of your financial health." 
        />
        <Suspense fallback={<DashboardSkeleton />}>
          <section aria-labelledby="summary-heading" className="mb-6">
            <h2 id="summary-heading" className="sr-only">Financial Summary</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DashboardSummary />
            </div>
          </section>
          
          <section aria-labelledby="charts-heading" className="mb-6">
            <div>
            <h2 id="charts-heading" className="sr-only">Financial Charts</h2>
              <div className="p-6 bg-card rounded-lg border shadow-sm">
                <h3 className="text-lg font-medium mb-4">Spending by Category</h3>
                <CategoryPieChart />
              </div>
            </div>
          </section>
          
          <section aria-labelledby="budget-comparison-heading" className="mb-6">
            <h2 id="budget-comparison-heading" className="sr-only">Budget Comparison</h2>
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <h3 className="text-lg font-medium mb-4">Budget vs. Actual</h3>
              <BudgetComparisonChart />
            </div>
          </section>
          
          <section aria-labelledby="recent-transactions-heading">
            <h2 id="recent-transactions-heading" className="text-lg font-medium mb-4">Recent Transactions</h2>
            <RecentTransactions limit={5} />
          </section>
        </Suspense>
      </DashboardShell>
    </main>
  )
}
