"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"

interface Transaction {
  _id: string
  amount: number
  date: string
  description: string
  category: string
}

interface CategoryBreakdown {
  category: string
  total: number
  percentage: number
}

export function CategoryBreakdown() {
  const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions")
        const data = await response.json()
        
        // Calculate category breakdown
        const categoryTotals = data.reduce((acc: { [key: string]: number }, transaction: Transaction) => {
          acc[transaction.category] = (acc[transaction.category] || 0) + Math.abs(transaction.amount)
          return acc
        }, {})

        const totalExpenses = (Object.values(categoryTotals) as number[]).reduce((sum, amount) => sum + amount, 0)
        
        const breakdownData: CategoryBreakdown[] = Object.entries(categoryTotals).map(([category, total]) => ({
          category,
          total: total as number,
          percentage: ((total as number) / totalExpenses) * 100
        })).sort((a, b) => b.total - a.total)

        setBreakdown(breakdownData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching transactions:", error)
        toast({
          title: "Error",
          description: "Failed to load category breakdown. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  if (isLoading) {
    return (
      <div className="rounded-md border h-full min-h-full flex flex-col justify-center">
        <Table className="h-full min-h-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="animate-pulse bg-muted/50 h-6 rounded text-center"></TableCell>
                <TableCell className="animate-pulse bg-muted/50 h-6 rounded text-center"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (breakdown.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <p className="text-muted-foreground">No expense data found. Add transactions to see category breakdown.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border h-full min-h-full flex flex-col justify-center">
      <Table className="h-full min-h-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Category</TableHead>
            <TableHead className="text-center">Percentage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {breakdown.map((item) => (
            <TableRow key={item.category}>
              <TableCell className="capitalize text-center">{item.category}</TableCell>
              <TableCell className="text-center">
                {item.percentage.toFixed(1)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
