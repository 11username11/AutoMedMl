import { CiSearch } from "react-icons/ci";
import { Input } from "./input";
import { cn } from "@/lib/utils";

type SearchInputProps = React.ComponentProps<typeof Input> & {
  isMinimized?: boolean
}

export default function SearchInput({ isMinimized, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <CiSearch strokeWidth={1} className={cn("absolute left-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none duration-200 transition-[width]", isMinimized && "left-1/2 -translate-x-1/2")} />
      <Input {...props} type="text" placeholder={isMinimized ? "" : "Search patients"} className="pl-8 bg-background h-10 shadow-none max-w-96 ring-0!"></Input>
    </div>
  )
}