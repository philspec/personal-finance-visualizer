"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarIcon, Plus } from 'lucide-react'
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const transactionFormSchema = z.object({
  amount: z.coerce.number().nonnegative({
    message: "Amount must be a positive number",
  }),
  category: z.string({
    required_error: "Please select a category",
  }),
  date: z.date({
    required_error: "A date is required",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters",
  }),
})

type TransactionFormValues = z.infer<typeof transactionFormSchema>

export function TransactionFormSheet({ transaction, onSuccess }: { transaction?: Transaction, onSuccess?: () => void }) {
  const [open, setOpen] = useState(!!transaction)
  const categories= [
    "Food",
    "Rent",
    "Utilities",
    "Transportation",
    "Entertainment",
    "Upskilling",
    "Healthcare",
    "Miscellaneous",
  ]

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: transaction?.amount || 0,
      category: transaction?.category || "",
      date: transaction ? new Date(transaction.date) : new Date(),
      description: transaction?.description || "",
    },
  })

  async function onSubmit(data: TransactionFormValues) {
    try {
      const url = transaction ? `/api/transactions/${transaction._id}` : "/api/transactions"
      const method = transaction ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: data.amount,
          category: data.category,
          date: data.date.toISOString(),
          description: data.description,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${transaction ? 'update' : 'create'} transaction`)
      }

      toast({
        title: `Transaction ${transaction ? 'updated' : 'created'}`,
        description: `Your transaction has been ${transaction ? 'updated' : 'created'} successfully.`,
      })

      form.reset()
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error(`Error ${transaction ? 'updating' : 'creating'} transaction:`, error)
      toast({
        title: "Error",
        description: `Failed to ${transaction ? 'update' : 'create'} transaction. Please try again.`,
        variant: "destructive",
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen && transaction) {
        onSuccess?.()
      }
    }}>
      <SheetTrigger asChild>
        {!transaction && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>{transaction ? "Edit Transaction" : "Add Transaction"}</SheetTitle>
          <SheetDescription>
            {transaction ? "Update your transaction details." : "Add a new transaction to track your income or expenses."}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="amount">Amount</FormLabel>
                    <FormControl>
                      <Input 
                        id="amount"
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                        aria-describedby="amount-description"
                      />
                    </FormControl>
                    <FormDescription id="amount-description">Enter the amount in dollars.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger aria-label="Select a category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a description for this transaction"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {transaction ? "Update Transaction" : "Add Transaction"}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
