import { cn } from "@/lib/utils";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

const variants = {
  default: "text-accent-foreground bg-secondary hover:bg-secondary-foreground",
  secondary: "bg-primary border hover:bg-primary-foreground"
}

export default function NewCase({ variant = "default" }: { variant?: "default" | "secondary" }) {
  return (
    <Link href={"/new-case"} className={cn(variants[variant], "flex justify-center gap-3 items-center py-2.5 px-16 rounded-md text-sm  duration-200 cursor-pointer")}>
      <FaPlus /> New Case
    </Link>
  )
}