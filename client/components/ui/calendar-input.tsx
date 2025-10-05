"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ControllerRenderProps, FieldValues } from "react-hook-form"
import { cn } from "@/lib/utils"
import { parse } from "date-fns"
import InputMask from "@mona-health/react-input-mask";
import { enGB } from "date-fns/locale"

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

interface CalendarInput extends React.ComponentProps<typeof Input> {
  field: ControllerRenderProps<FieldValues, string>
}

export function CalendarInput({ field, className, ...props }: CalendarInput) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const parsed = parse(value, "dd.MM.yyyy", new Date())

    field.onChange(e)

    if (!isValidDate(parsed)) {
      setDate(new Date())
      setMonth(new Date())
    }
    else {
      setDate(parsed)
      setMonth(parsed)
    }
  }

  return (
    <div ref={wrapperRef} className="relative flex gap-2 flex-1 shrink-0 min-w-fit">
      <InputMask
        {...field}
        mask={"99.99.9999"}
        placeholder="DD.MM.YYYY"
        maskPlaceholder={"DD.MM.YYYY"}
        onChange={handleChange}
        onFocus={() => setOpen(true)}
        value={field.value}
        className={cn(className)}
        {...props}
      >
        <Input></Input>
      </InputMask>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
          onOpenAutoFocus={(e: Event) => e.preventDefault()}
          onPointerDown={(e) => {
            const target = e.target as HTMLElement
            const btn = target.closest(".rdp-day") as HTMLButtonElement | null

            if (!btn || btn.disabled) return

            const day = btn.dataset.day
            if (!day) return

            const parsed = parse(day, "dd.MM.yyyy", new Date())

            field.onChange(day)
            setDate(parsed)
            setOpen(false)
          }}
          onInteractOutside={(e) => {
            const target = e?.target as Node | null
            if (wrapperRef.current && target && wrapperRef.current.contains(target)) {
              e.preventDefault()
            }
          }}
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={month}
            locale={enGB}
            onMonthChange={setMonth}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
