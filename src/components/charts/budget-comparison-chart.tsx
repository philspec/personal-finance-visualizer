"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface Transaction {
  _id: string
  amount: number
  category: string
}

interface Budget {
  _id: string
  category: string
  amount: number
}

interface ComparisonData {
  name: string
  budget: number
  actual: number
}

export function BudgetComparisonChart() {
  const [chartData, setChartData] = useState<ComparisonData[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

        // Filter expenses only
        const expenses = transactions.filter((t: Transaction) => t.amount < 0)

        // Group expenses by category
        const categoryExpenses = expenses.reduce((acc: Record<string, number>, t: Transaction) => {
          const category = t.category || "Uncategorized"
          if (!acc[category]) {
            acc[category] = 0
          }
          acc[category] += Math.abs(t.amount)
          return acc
        }, {})

        // Create comparison data
        const comparisonData = budgets.map((budget: Budget) => {
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
  }, [])

  if (isLoading) {
    return (
      <Card className="w-full h-[300px] flex items-center justify-center">
        <div className="animate-pulse bg-muted/50 h-[250px] w-[90%] rounded"></div>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <p className="text-muted-foreground">No budget data available. Set up budgets to see comparison.</p>
      </div>
    )
  }

  return (
    <div aria-label="Budget versus actual spending comparison chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
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
          <Bar dataKey="budget" fill="var(--primary)" name="Budget" />
          <Bar dataKey="actual" fill="var(--accent-foreground)" name="Actual" />
        </BarChart>
      </ResponsiveContainer>
      <div className="sr-only">
        <h4>Budget vs Actual Spending Data</h4>
        <ul>
          {chartData.map((item) => (
            <li key={item.name}>
              {item.name}: Budget ${item.budget}, Actual ${item.actual}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
