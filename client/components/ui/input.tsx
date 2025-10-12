import * as React from "react"

import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const [isHidden, setIsHidden] = React.useState(true)

  return (
    <div className="relative">
      <input
        type={type === "password" ? isHidden ? "password" : "text" : type}
        data-slot="input"
        className={cn(
          "file:text-foreground shadow-xs placeholdefr:text-muted-foreground bg-primary flex h-9 w-full min-w-0 rounded-sm border px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
      {
        type === "password" &&
        <div onClick={() => setIsHidden((isHidden) => !isHidden)} className="absolute hover:bg-primary-foreground p-2 right-2 rounded-md duration-200 cursor-pointer top-1/2 -translate-y-1/2">
          {isHidden ? <Eye size={20}></Eye> : <EyeOff size={20}></EyeOff> }
        </div>
      }
    </div>
  )
}

export { Input }
