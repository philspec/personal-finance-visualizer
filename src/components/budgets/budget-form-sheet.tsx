"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus } from "lucide-react"
import { format, startOfMonth } from "date-fns"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "@/components/ui/use-toast"
import { MonthPicker } from "@/components/ui/month-picker"

interface Budget {
  _id: string
  category: string
  amount: number
  month: string
}

const budgetFormSchema = z.object({
  category: z.string({
    required_error: "Please select a category",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number",
  }),
  month: z.date({
    required_error: "A month is required",
  }),
})

type BudgetFormValues = z.infer<typeof budgetFormSchema>

export function BudgetFormSheet({ budget, onSuccess }: { budget?: Budget, onSuccess?: () => void }) {
  const [open, setOpen] = useState(!!budget)
  const [categories, setCategories] = useState([
    "Food",
    "Rent",
    "Utilities",
    "Transportation",
    "Entertainment",
    "Salary",
    "Freelance",
    "Gifts",
  ])

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      amount: budget?.amount || 0,
      category: budget?.category || "",
      month: budget ? new Date(budget.month) : startOfMonth(new Date()),
    },
  })

  async function onSubmit(data: BudgetFormValues) {
    try {
      const url = budget ? `/api/budgets/${budget._id}` : "/api/budgets"
      const method = budget ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          month: format(data.month, "yyyy-MM"),
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${budget ? 'update' : 'create'} budget`)
      }

      toast({
        title: `Budget ${budget ? 'updated' : 'created'}`,
        description: `Your budget has been ${budget ? 'updated' : 'created'} successfully.`,
      })

      form.reset()
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error(`Error ${budget ? 'updating' : 'creating'} budget:`, error)
      toast({
        title: "Error",
        description: `Failed to ${budget ? 'update' : 'create'} budget. Please try again.`,
        variant: "destructive",
      })
    }
  }

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen && budget) {
        onSuccess?.()
      }
    }}>
      <SheetTrigger asChild>
        {!budget && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Budget
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>{budget ? "Edit Budget" : "Add Budget"}</SheetTitle>
          <SheetDescription>
            {budget ? "Update your budget details." : "Set a monthly budget for a specific category."}
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Amount</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormDescription>Enter the budget amount in dollars.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Month</FormLabel>
                    <FormControl>
                      <MonthPicker date={field.value} onSelect={field.onChange} />
                    </FormControl>
                    <FormDescription>Select the month for this budget.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {budget ? "Update Budget" : "Add Budget"}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
