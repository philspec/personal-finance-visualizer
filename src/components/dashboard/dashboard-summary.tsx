"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

interface Transaction {
  amount: number
  category: string
  description: string
  date: string
}

interface Budget {
  category: string
  amount: number
  month: string
}

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function DashboardSummary() {
  const [isLoading, setIsLoading] = useState(true)
  const [summaryData, setSummaryData] = useState({
    totalExpenses: 0,
    exceededCategories: [] as { category: string; spent: number; budget: number }[],
    largestTransaction: null as Transaction | null
  })
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        // Fetch transactions and budgets data
        const [transactionsRes, budgetsRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/budgets")
        ])
        const transactions: Transaction[] = await transactionsRes.json()
        const budgets: Budget[] = await budgetsRes.json()

        // Calculate total expenses
        const totalExpenses = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)

        // Find largest transaction
        const largestTransaction = transactions.reduce((max, t) => 
          Math.abs(t.amount) > Math.abs(max.amount) ? t : max
        , transactions[0])

        // Calculate categories that exceeded budget
        const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
        const categorySpending = transactions.reduce((acc, t) => {
          const month = t.date.slice(0, 7)
          if (month === currentMonth) {
            acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
          }
          return acc
        }, {} as Record<string, number>)

        const exceededCategories = budgets
          .filter(b => b.month.slice(0, 7) === currentMonth)
          .map(b => ({
            category: b.category,
            spent: categorySpending[b.category] || 0,
            budget: b.amount
          }))
          .filter(c => c.spent > c.budget)

        setSummaryData({
          totalExpenses,
          exceededCategories,
          largestTransaction
        })
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching summary data:", error)
        setIsLoading(false)
      }
    }

    fetchSummaryData()
  }, [])

  const nextCategory = () => {
    setCurrentCategoryIndex((prev) => 
      (prev + 1) % summaryData.exceededCategories.length
    )
  }

  const prevCategory = () => {
    setCurrentCategoryIndex((prev) => 
      prev === 0 ? summaryData.exceededCategories.length - 1 : prev - 1
    )
  }

  if (isLoading) {
    return (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-4 w-[60px] mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Categories that crossed the budget</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-4 w-[60px] mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md font-medium">Most Expensive Transaction</CardTitle>
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
          <CardTitle className="text-md font-medium">Total Expenses</CardTitle>
          <TrendingDown className="h-6 w-6 text-destructive" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${summaryData.totalExpenses.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">For the current month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium text-center">Categories that crossed the budget</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryData.exceededCategories.length > 0 ? (
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={prevCategory}
                disabled={summaryData.exceededCategories.length <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {capitalizeFirstLetter(summaryData.exceededCategories[currentCategoryIndex].category)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Spent: ${summaryData.exceededCategories[currentCategoryIndex].spent.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Budget: ${summaryData.exceededCategories[currentCategoryIndex].budget.toFixed(2)}
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={nextCategory}
                disabled={summaryData.exceededCategories.length <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No categories exceeded budget this month
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium">Most Expensive Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          {summaryData.largestTransaction ? (
            <>
              <div className="text-2xl font-bold text-center">
                ${Math.abs(summaryData.largestTransaction.amount).toFixed(2)}
              </div>
              <div className="text-md text-muted-foreground text-center">
                {capitalizeFirstLetter(summaryData.largestTransaction.category)}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {summaryData.largestTransaction.description}
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              No transactions found
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
