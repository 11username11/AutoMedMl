import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatToHHMM(date: Date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function scrollDown(ref: React.RefObject<HTMLDivElement | null>, behavior: ScrollBehavior = "smooth") {
  ref.current?.scrollTo({
    top: ref.current.scrollHeight,
    behavior,
  });
}

export function filterBySearch<T>(
  items: T[],
  searchTerm: string,
  fields: (keyof T)[],
  options?: Partial<Record<keyof T, string>>
): T[] {
  const terms = searchTerm.toLowerCase().split(" ").filter(Boolean)

  return items.filter((item) => {
    const haystack = fields
      .map((field) => String(item[field] ?? "").toLowerCase())
      .join(" ")

    const matchesSearch = terms.length === 0
      ? true
      : terms.every((term) => haystack.includes(term))

    const matchesOptions = options
      ? Object.entries(options).every(([key, value]) => {
        if (value === undefined) return true;

        const fieldValue = item[key as keyof T]

        return String(fieldValue).toLowerCase() === String(value).toLowerCase()
      })
      : true

    return matchesSearch && matchesOptions
  })
}