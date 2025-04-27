"use client"

import { useEffect, useState } from "react"
import { Edit2 } from "lucide-react"

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

  useEffect(() => {
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

    fetchData()
  }, [])

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
    const categoryExpenses = transactions
      .filter((t) => t.category === budget.category && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    return {
      amount: categoryExpenses,
      percentage: Math.min(Math.round((categoryExpenses / budget.amount) * 100), 100),
    }
  }

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
                <TableCell className="animate-pulse bg-muted/50 h-6 rounded"></TableCell>
                <TableCell className="animate-pulse bg-muted/50 h-6 rounded"></TableCell>
                <TableCell className="animate-pulse bg-muted/50 h-6 rounded"></TableCell>
                <TableCell className="animate-pulse bg-muted/50 h-6 rounded"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No budgets found. Add your first budget to get started.</p>
      </div>
    )
  }

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
          {budgets.map((budget) => {
            const progress = calculateProgress(budget)
            return (
              <TableRow key={budget._id}>
                <TableCell className="capitalize">{budget.category}</TableCell>
                <TableCell>${budget.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={progress.percentage} className="h-2" />
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
                      <DropdownMenuItem>Edit budget</DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete budget</DropdownMenuItem>
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
  )
}
