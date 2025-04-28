"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#A4DE6C", "#D0ED57"]

export function CategoryPieChart() {
  const [chartData, setChartData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/transactions")
        const transactions = await response.json()

        // Filter expenses only
        const expenses = transactions.filter(t => t.amount)

        // Group by category
        const categoryMap = expenses.reduce((acc, t) => {
          const category = t.category || "Uncategorized"
          if (!acc[category]) {
            acc[category] = 0
          }
          acc[category] += Math.abs(t.amount)
          return acc
        }, {})

        // Convert to chart data format
        const categoryData = Object.entries(categoryMap).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value: Number.parseFloat(value.toFixed(2)),
        }))

        setChartData(categoryData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching chart data:", error)
        toast({
          title: "Error",
          description: "Failed to load category data. Please try again.",
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
        <p className="text-muted-foreground">No expense data available. Add transactions to see category breakdown.</p>
      </div>
    )
  }

  return (
    <div aria-label="Spending by category pie chart">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => `$${value}`} 
            contentStyle={{ 
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)'
            }}
          />
          <Legend formatter={(value) => <span style={{ color: 'var(--foreground)' }}>{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
      <div className="sr-only">
        <h4>Category Spending Data</h4>
        <ul>
          {chartData.map((item) => (
            <li key={item.name}>
              {item.name}: ${item.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 