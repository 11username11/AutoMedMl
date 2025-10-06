"use client"

import * as React from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { useVirtualizer } from "@tanstack/react-virtual"
import { cn, filterBySearch } from "@/lib/utils"
import { Input } from "./input"

type Option = {
  value: string
  label: string
  search?: string
}

type ComboboxContextType = {
  value?: string
  onChange: (val: string) => void
  open: boolean
  setOpen: (o: boolean) => void
  placeholder?: string
  options: Option[]
  registerOption: (option: Option) => void
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

  return (
    <ComboboxContext.Provider
      value={{ value, onChange, open, setOpen, placeholder, options, registerOption }}
    >
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </ComboboxContext.Provider>
  )
}

export function ComboboxTrigger(
  props: React.ComponentProps<typeof PopoverPrimitive.Trigger>
) {
  return <PopoverTrigger asChild {...props} />
}

export function ComboboxValue({ placeholder }: { placeholder: string }) {
  const ctx = React.useContext(ComboboxContext)!
  const label = ctx.options.find(o => o.value === ctx.value)?.label
  return <span>{label ?? placeholder}</span>
}

export function ComboboxContent<T>({
  items,
  getKey,
  getLabel,
  getSearchKeys,
  renderItem,
  estimateSize = 56,
  overscan = 6,
}: {
  items: T[]
  getKey: (item: T) => string
  getLabel: (item: T) => string
  getSearchKeys: (item: T) => (keyof T)[]
  renderItem: (item: T) => React.ReactNode
  estimateSize?: number
  overscan?: number
}) {
  const [query, setQuery] = React.useState("")
  const listRef = React.useRef<HTMLDivElement>(null)

  const filtered = React.useMemo(
    () => filterBySearch(items, query, getSearchKeys(items[0])),
    [items, query, getSearchKeys]
  )

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => estimateSize,
    overscan,
  })

  const ctx = React.useContext(ComboboxContext)!

  React.useEffect(() => {
    if (ctx.open) {
      requestAnimationFrame(() => {
        virtualizer.measure()
        virtualizer.scrollToIndex(0)
      })
    }
  }, [ctx.open])

  return (
    <PopoverContent forceMount className="w-[var(--radix-popover-trigger-width)] p-0">
      <div className="p-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="placeholder:text-muted-foreground flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50 ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
        />
      </div>
      <div
        ref={listRef}
        style={{ maxHeight: 320, height: "100%", overflowY: "auto" }}
        className="px-1 scrollbar-thin"
      >
        <div
          style={{
            position: "relative",
            height: virtualizer.getTotalSize(),
          }}
        >
          {virtualizer.getVirtualItems().map((row) => {
            const item = filtered[row.index]
            const key = getKey(item)

            return (
              <div
                key={key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${row.start}px)`,
                  height: row.size,
                }}
              >
                <ComboboxItem
                  value={key}
                  label={getLabel(item)}
                >
                  {renderItem(item)}
                </ComboboxItem>
              </div>
            )
          })}
        </div>
      </div>
    </PopoverContent>
  )
}


export function ComboboxItem({
  value,
  label,
  search,
  children,
  ...props
}: {
  value: string
  label: string
  search?: string
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  const ctx = React.useContext(ComboboxContext)!
  React.useEffect(() => {
    ctx.registerOption({ value, label, search })
  }, [value, label, search])

  return (
    <div
      onClick={() => {
        ctx.onChange(value)
        ctx.setOpen(false)
      }}
      className={cn("text-sm cursor-pointer px-3 py-2 hover:bg-accent rounded-sm duration-200", props.className)}
    >
      {children}
    </div>
  )
}
