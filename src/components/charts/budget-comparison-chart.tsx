"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { MonthPicker } from "@/components/ui/month-picker"

interface Transaction {
  _id: string
  amount: number
  category: string
  date: string
}

interface Budget {
  _id: string
  category: string
  amount: number
  month: string
}

interface ComparisonData {
  name: string
  budget: number
  actual: number
}

export function BudgetComparisonChart() {
  const [chartData, setChartData] = useState<ComparisonData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState<Date>(startOfMonth(new Date()))

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions and budgets
        const [transactionsResponse, budgetsResponse] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/budgets"),
        ])

        const transactions = await transactionsResponse.json()
        const budgets = await budgetsResponse.json()

        // Filter expenses for selected month
        const monthStart = startOfMonth(selectedMonth)
        const monthEnd = endOfMonth(selectedMonth)
        const monthString = format(selectedMonth, "yyyy-MM")

        const expenses = transactions.filter((t: Transaction) => {
          const transactionDate = new Date(t.date)
          return transactionDate >= monthStart && transactionDate <= monthEnd 
        })

        // Group expenses by category
        const categoryExpenses = expenses.reduce((acc: Record<string, number>, t: Transaction) => {
          const category = t.category || "Uncategorized"
          if (!acc[category]) {
            acc[category] = 0
          }
          acc[category] += Math.abs(t.amount)
          return acc
        }, {})

        // Filter budgets for selected month
        const monthBudgets = budgets.filter((budget: Budget) => budget.month === monthString)

        // Create comparison data
        const comparisonData = monthBudgets.map((budget: Budget) => {
          const actual = categoryExpenses[budget.category] || 0
          return {
            name: budget.category.charAt(0).toUpperCase() + budget.category.slice(1),
            budget: budget.amount,
            actual: Number.parseFloat(actual.toFixed(2)),
          }
        })

        setChartData(comparisonData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching chart data:", error)
        toast({
          title: "Error",
          description: "Failed to load budget comparison data. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedMonth])

  if (isLoading) {
    return (
      <Card className="w-full h-[300px] flex items-center justify-center">
        <div className="animate-pulse bg-muted/50 h-[250px] w-[90%] rounded"></div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <MonthPicker date={selectedMonth} onSelect={setSelectedMonth} />
      </div>
      {chartData.length === 0 ? (
        <Card className="w-full h-[300px] flex flex-col items-center justify-center text-center p-6">
          <p className="text-muted-foreground mb-2">
            No budget data available for {format(selectedMonth, "MMMM yyyy")}
          </p>
          <p className="text-sm text-muted-foreground">
            Set up budgets for this month to see the comparison
          </p>
        </Card>
      ) : (
        <div aria-label="Budget versus actual spending comparison chart">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'var(--foreground)' }}
                tickLine={{ stroke: 'var(--foreground)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--foreground)' }}
                tickLine={{ stroke: 'var(--foreground)' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value) => `$${value}`} 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)'
                }}
              />
              <Legend formatter={(value) => <span style={{ color: 'var(--foreground)' }}>{value}</span>} />
              <Bar dataKey="budget" fill="#22c55e" name="Budget" />
              <Bar dataKey="actual" fill="#de3a4d" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
          <div className="sr-only">
            <h4>Budget vs Actual Spending Data for {format(selectedMonth, "MMMM yyyy")}</h4>
            <ul>
              {chartData.map((item) => (
                <li key={item.name}>
                  {item.name}: Budget ${item.budget}, Actual ${item.actual}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
