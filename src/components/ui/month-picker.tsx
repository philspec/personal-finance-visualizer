"use client"

import * as React from "react"
import { format, startOfMonth, setMonth, setYear } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface MonthPickerProps {
  date: Date
  onSelect: (date: Date) => void
  className?: string
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export function MonthPicker({ date, onSelect, className }: MonthPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const currentYear = date.getFullYear()
  const currentMonth = date.getMonth()

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(startOfMonth(date), monthIndex)
    onSelect(newDate)
    setIsOpen(false)
  }

  const handleYearChange = (change: number) => {
    const newDate = setYear(date, currentYear + change)
    onSelect(newDate)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-[200px] justify-start text-left font-normal", !date && "text-muted-foreground", className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MMMM yyyy") : <span>Pick a month</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4" align="start">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleYearChange(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">{currentYear}</div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleYearChange(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => (
            <Button
              key={month}
              variant={index === currentMonth ? "default" : "ghost"}
              className={cn(
                "h-8 px-2 text-sm",
                index === currentMonth && "bg-primary text-primary-foreground"
              )}
              onClick={() => handleMonthSelect(index)}
            >
              {month.slice(0, 3)}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
} 