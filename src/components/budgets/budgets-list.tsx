"use client"

import { useEffect, useState } from "react"
import { Edit2 } from "lucide-react"
import { format, startOfMonth, endOfMonth } from "date-fns"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import { MonthPicker } from "@/components/ui/month-picker"
import { BudgetFormSheet } from "@/components/budgets/budget-form-sheet"
import { cn } from "@/lib/utils"

interface Budget {
  _id: string
  category: string
  amount: number
  month: string
}

interface Transaction {
  _id: string
  amount: number
  category: string
  date: string
}

export function BudgetsList() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState<Date>(startOfMonth(new Date()))
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)

  const fetchData = async () => {
    try {
      const [budgetsResponse, transactionsResponse] = await Promise.all([
        fetch("/api/budgets"),
        fetch("/api/transactions"),
      ])

      const budgetsData = await budgetsResponse.json()
      const transactionsData = await transactionsResponse.json()

      setBudgets(budgetsData)
      setTransactions(transactionsData)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load budgets. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSuccess = () => {
    fetchData()
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete budget")
      }

      setBudgets(budgets.filter((budget) => budget._id !== id))
      toast({
        title: "Budget deleted",
        description: "Your budget has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting budget:", error)
      toast({
        title: "Error",
        description: "Failed to delete budget. Please try again.",
        variant: "destructive",
      })
    }
  }

  const calculateProgress = (budget: Budget) => {
    const monthStart = startOfMonth(selectedMonth)
    const monthEnd = endOfMonth(selectedMonth)
    const monthString = format(selectedMonth, "yyyy-MM")

    // Only calculate progress if the budget is for the selected month
    if (budget.month !== monthString) {
      return {
        amount: 0,
        percentage: 0,
      }
    }

    const categoryExpenses = transactions
      .filter((t) => {
        const transactionDate = new Date(t.date)
        return (
          t.category === budget.category &&
          transactionDate >= monthStart &&
          transactionDate <= monthEnd 
        )
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    return {
      amount: categoryExpenses,
      percentage: Math.round((categoryExpenses / budget.amount) * 100),
    }
  }

  // Filter budgets for the selected month
  const monthBudgets = budgets.filter(
    (budget) => budget.month === format(selectedMonth, "yyyy-MM")
  )

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Budget Amount</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="animate-pulse bg-muted/50 h-6 rounded text-center"></TableCell>
                <TableCell className="animate-pulse bg-muted/50 h-6 rounded"></TableCell>
                <TableCell className="animate-pulse bg-muted/50 h-6 rounded text-left"></TableCell>
                <TableCell className="animate-pulse bg-muted/50 h-6 rounded"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <MonthPicker date={selectedMonth} onSelect={setSelectedMonth} />
      </div>
      {monthBudgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">
            No budgets found for {format(selectedMonth, "MMMM yyyy")}
          </p>
          <p className="text-sm text-muted-foreground">
            Add budgets for this month to track your expenses
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Category</TableHead>
                <TableHead className="text-center">Budget Amount</TableHead>
                <TableHead className="text-center">Progress</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthBudgets.map((budget) => {
                const progress = calculateProgress(budget)
                return (
                  <TableRow key={budget._id}>
                    <TableCell className="capitalize text-center">{budget.category}</TableCell>
                    <TableCell className="capitalize text-center">${budget.amount.toFixed(2)}</TableCell>
                    <TableCell className="capitalize text-center">
                      <div className="flex items-center gap-2">
                        <Progress
                          value={progress.percentage}
                          className="h-2"
                          indicatorColor={progress.percentage > 100 ? "#ef4444" : undefined}
                        />
                        <span className="text-xs whitespace-nowrap">
                          ${progress.amount.toFixed(2)} / ${budget.amount.toFixed(2)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setEditingBudget(budget)}>
                            Edit budget
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                Delete budget
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this budget from your records.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(budget._id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
      {editingBudget && (
        <BudgetFormSheet 
          budget={editingBudget} 
          onSuccess={() => {
            setEditingBudget(null)
            handleSuccess()
          }} 
        />
      )}
    </div>
  )
}
