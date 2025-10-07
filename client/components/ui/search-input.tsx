import { CiSearch } from "react-icons/ci";
import { Input } from "./input";
import { cn } from "@/lib/utils";

type SearchInputProps = React.ComponentProps<typeof Input> & {
  isMinimized?: boolean
}

export default function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <CiSearch strokeWidth={1} className={"absolute left-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none group-data-[minimized=true]:left-1/2 group-data-[minimized=true]:-translate-x-1/2"} />
      <Input type="text" placeholder={"Search patients"} className={cn("pl-8 h-10 shadow-none max-w-96 ring-0! placeholder group-data-[minimized=true]:placeholder:opacity-0 duration-200", className)} {...props}></Input>
    </div>
  )
}