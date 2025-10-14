import { CiSearch } from "react-icons/ci";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export default function SearchInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <div className="relative h-fit">
      <Input type="text" className={cn("pl-8 h-10 shadow-none max-w-96 ring-0! placeholder group-data-[minimized=true]:placeholder:opacity-0 duration-200", className)} {...props}></Input>
      <CiSearch strokeWidth={1} className={"absolute left-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none group-data-[minimized=true]:left-1/2 group-data-[minimized=true]:-translate-x-1/2"} />
    </div>
  )
}