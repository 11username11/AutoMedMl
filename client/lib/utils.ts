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

export function scrollDown(ref: React.RefObject<HTMLDivElement | null>, behavior : ScrollBehavior = "smooth") {
  ref.current?.scrollTo({
    top: ref.current.scrollHeight,
    behavior,
  });
}