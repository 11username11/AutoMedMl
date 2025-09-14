import { cn } from "@/lib/utils";

export default function Avatar({ letters, className }: { letters: string, className?: string }) {
  return (
    <div className={cn("shrink-0 rounded-full flex items-center justify-center text-accent-foreground bg-secondary-foreground w-10 h-10 duration-200", className)}>
      {letters.toUpperCase()}
    </div>
  )
}