export default function Avatar({ letters }: { letters: string }) {
  return (
    <div className="shrink-0 rounded-full flex items-center justify-center text-accent-foreground bg-secondary-foreground w-10 h-10">
      {letters.toUpperCase()}
    </div>
  )
}