"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import Link from "next/link"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

interface Transaction {
  _id: string
  amount: number
  date: string
  description: string
  category: string
}

interface RecentTransactionsProps {
  limit?: number
}

export function RecentTransactions({ limit = 5 }: RecentTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions")
        const data = await response.json()
        // Sort by date (newest first) and limit
        const sortedData = data
          .sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit)

        setTransactions(sortedData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching transactions:", error)
        toast({
          title: "Error",
          description: "Failed to load recent transactions. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [limit])

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: limit }).map((_, index) => (
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

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <p className="text-muted-foreground">No transactions found. Add your first transaction to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>{format(new Date(transaction.date), "MMM d, yyyy")}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="capitalize">{transaction.category}</TableCell>
                <TableCell className={`text-right ${transaction.amount < 0 ? "text-destructive" : "text-green-500"}`}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        <Button variant="outline" asChild>
          <Link href="/transactions">View all transactions</Link>
        </Button>
      </div>
    </div>
  )
}
