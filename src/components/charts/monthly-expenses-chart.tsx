"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"

import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

interface Transaction {
  _id: string
  amount: number
  date: string
}

interface MonthlyData {
  name: string
  expenses: number
}

export function MonthlyExpensesChart() {
  const [chartData, setChartData] = useState<MonthlyData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/transactions")
        const transactions = await response.json()

        // Get the last 6 months
        const months = Array.from({ length: 6 }, (_, i) => {
          const date = subMonths(new Date(), i)
          return {
            start: startOfMonth(date),
            end: endOfMonth(date),
            name: format(date, "MMM yyyy"),
          }
        }).reverse()

        // Calculate expenses for each month
        const monthlyData = months.map((month) => {
          const monthlyExpenses = transactions
            .filter((t: Transaction) => {
              const transactionDate = new Date(t.date)
              return transactionDate >= month.start && transactionDate <= month.end
            })
            .reduce((sum: number, t: Transaction) => sum + Math.abs(t.amount), 0)

          return {
            name: month.name,
            expenses: Number.parseFloat(monthlyExpenses.toFixed(2)),
          }
        })

        setChartData(monthlyData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching chart data:", error)
        toast({
          title: "Error",
          description: "Failed to load chart data. Please try again.",
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

  return (
    <div aria-label="Monthly expenses chart for the last 6 months">
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
            formatter={(value) => [`$${value}`, "Expenses"]} 
            labelFormatter={(label) => `Month: ${label}`}
            contentStyle={{ 
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)'
            }}
          />
          <Bar dataKey="expenses" fill="var(--destructive)" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
      <div className="sr-only">
        <h4>Monthly Expenses Data</h4>
        <ul>
          {chartData.map((item) => (
            <li key={item.name}>
              {item.name}: ${item.expenses}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
