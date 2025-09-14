import { cn } from "@/lib/utils";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

const variants = {
  default: "text-accent-foreground bg-secondary hover:bg-secondary-foreground",
  secondary: "bg-primary border hover:bg-primary-foreground",
}

type NewCaseButtonProps = Omit<React.ComponentProps<typeof Link>, "href"> &{
  variant?: "default" | "secondary",
  href?: Url
};

export default function NewCase({ variant = "default", href="/new-case", className, ...props }: NewCaseButtonProps) {
  return (
    <Link {...props} href={href} className={cn(variants[variant], "flex justify-center gap-3 items-center whitespace-nowrap py-2.5 px-16 rounded-md text-sm duration-200 cursor-pointer h-10 group", className)}>
      <FaPlus className="shrink-0"/> <span className={cn("max-w-full w-[67.5px] overflow-hidden duration-200 group-data-[minimized=true]:w-0")}>New Case</span>
    </Link>
  )
}