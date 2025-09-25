"use client"

import * as React from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Command as CommandPrimitive } from "cmdk"

type Option = {
  value: string
  label: string
}

type ComboboxContextType = {
  value?: string
  onChange: (val: string) => void
  open: boolean
  setOpen: (o: boolean) => void
  placeholder?: string
  options: Option[]
  registerOption: (option: Option) => void
  unregisterOption: (value: string) => void
}

const ComboboxContext = React.createContext<ComboboxContextType | null>(null)

export function Combobox({
  value,
  onChange,
  placeholder,
  children,
}: {
  value?: string
  onChange: (val: string) => void

  placeholder?: string
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState<Option[]>([])

  const registerOption = React.useCallback((opt: Option) => {
    setOptions((prev) => {
      if (prev.find((p) => p.value === opt.value)) return prev
      return [...prev, opt]
    })
  }, [])

  const unregisterOption = React.useCallback((value: string) => {
    setOptions((prev) => prev.filter((p) => p.value !== value))
  }, [])

  return (
    <ComboboxContext.Provider
      value={{ value, onChange, open, setOpen, placeholder, options, registerOption, unregisterOption }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  )
}

export function ComboboxTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {

  return (
    <PopoverTrigger asChild {...props}>
    </PopoverTrigger>
  )
}

export function ComboboxContent({
  children
}: { children: React.ReactNode }) {
  return (
    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          {children}
        </CommandList>
      </Command>
    </PopoverContent>
  )
}

export function ComboboxGroup({
  children
}: { children: React.ReactNode }) {
  return (
    <CommandGroup>
      {children}
    </CommandGroup>
  )
}

function childrenToString(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map(child => {
      if (typeof child === "string" || typeof child === "number") {
        return child.toString()
      }
      return ""
    })
    .join("")
}

export function ComboboxItem({
  value,
  children,
  search,
}: { value: string, children: React.ReactNode, search?: string }) {
  const ctx = React.useContext(ComboboxContext)!

  const label = childrenToString(children)

  React.useEffect(() => {
    ctx.registerOption({ value, label })
  }, [value, label])

  return (
    <CommandItem
      className="cursor-pointer"
      value={search}
      onSelect={() => {
        ctx.setOpen(false)
        ctx.onChange(value)
      }}
    >
      {children}
    </CommandItem>
  )
}

export function ComboboxEmpty({
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandEmpty {...props}>{children ? children : "No results."}</CommandEmpty>
  )
}

export function ComboboxValue({ placeholder }: { placeholder: string }) {
  const ctx = React.useContext(ComboboxContext)
  if (!ctx) return null

  const label = ctx.options?.find(o => o.value === ctx.value)?.label
  return <span>{label ?? ctx.placeholder ?? placeholder}</span>
}