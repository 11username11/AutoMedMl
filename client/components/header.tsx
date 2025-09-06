import { FaChevronDown } from "react-icons/fa6";

export default function Header() {
    return (
        <div className="flex items-center gap-2 ml-auto cursor-pointer hover:bg-primary-foreground rounded-sm px-2.5 py-1.5 duration-200">
            <div className="rounded-full flex items-center justify-center text-primary bg-secondary-foreground w-10 h-10">
                DS
            </div>

            <div className="">
                <div className="text-sm font-semibold">
                    Dr. Smith
                </div>
                <div className="text-muted-foreground text-xs">
                    dr.smith@medical.com
                </div>
            </div>
            <FaChevronDown className="text-muted-foreground text-xs" />
        </div>
    )
}