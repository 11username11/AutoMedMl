import { CiSearch } from "react-icons/ci";
import { Input } from "./input";

export default function SearchInput(props: React.ComponentProps<typeof Input>) {
    return (
        <div className="relative">
            <CiSearch strokeWidth={1} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <Input {...props} type="text" placeholder="Search patients" className="pl-8 bg-background h-10 shadow-none max-w-96"></Input>
        </div>
    )
}