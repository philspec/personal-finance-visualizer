"use client"

import { useEffect, useState } from "react"
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSummary() {
  const [isLoading, setIsLoading] = useState(true)
  const [summaryData, setSummaryData] = useState(0)

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        // Fetch transactions data
        const response = await fetch("/api/transactions")
        const transactions = await response.json()

        // Calculate summary data
        const totalExpenses = transactions.reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0)

        setSummaryData(totalExpenses)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching summary data:", error)
        setIsLoading(false)
      }
    }

    fetchSummaryData()
  }, [])

  if (isLoading) {
    return (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-4 w-[60px] mt-2" />
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-6 w-6 text-destructive" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summaryData.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">For the current month</p>
        </CardContent>
      </Card>
    </>
  )
}
