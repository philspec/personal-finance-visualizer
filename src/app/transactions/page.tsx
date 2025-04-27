import { Suspense } from "react"
import type { Metadata } from "next"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { TransactionsList } from "@/components/transactions/transactions-list"
import { TransactionFormSheet } from "@/components/transactions/transaction-form-sheet"
import { TransactionsListSkeleton } from "@/components/skeletons/transactions-list-skeleton"
import { MonthlyExpensesChart } from "@/components/charts/monthly-expenses-chart"
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton"


export const metadata: Metadata = {
  title: "Transactions | Personal Finance Visualizer",
  description: "Manage your income and expense transactions.",
}

export default function TransactionsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Transactions" text="Manage your income and expense transactions.">
        <TransactionFormSheet />
      </DashboardHeader>
      <Suspense fallback={<TransactionsListSkeleton />}>
        <TransactionsList />
      </Suspense>
      <Suspense fallback={<DashboardSkeleton />}>
          <section aria-labelledby="charts-heading" className="mb-6">
              <div className="p-6 bg-card rounded-lg border shadow-sm">
                <h3 className="text-lg font-medium mb-4">Monthly Expenses</h3>
                <MonthlyExpensesChart />
              </div>
          </section>   
        </Suspense>
    </DashboardShell>
  )
}
