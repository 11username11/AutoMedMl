import { cn } from "@/lib/utils";
import { Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { Button } from "./button";

type NewCaseButtonProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  variant?: React.ComponentProps<typeof Button>["variant"],
  href?: Url
};

export default function NewCaseBtn({ variant = "secondary", href = "/new-case", className, ...props }: NewCaseButtonProps) {
  return (
    <Link className={cn("group  duration-200", className)} href={href} {...props}>
      <Button size={"lg"} variant={variant} className={cn("px-16 max-w-full group duration-200", className, "group-data-[minimized=true]:px-4")} >
        <FaPlus className="shrink-0" />
        <span className={cn("max-w-full group-data-[minimized=true]:overflow-hidden duration-200  group-data-[minimized=true]:opacity-0 opacity-100")}>
          New Case
        </span>
      </Button>
    </Link>
  )
}