import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Textarea } from "./textarea"
import { CalendarInput } from "./calendar-input"

type inputType = "input" | "textarea" | "calendar" | "select"

interface InputFieldProps {
  control: any
  name: string
  label?: string
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"]
  placeholder?: string,
  className?: React.ComponentProps<"input">["className"],
  formItemClassName?: React.ComponentProps<"div">["className"],
  inputType?: inputType
}

export function InputField({ control, name, label, type = "text", placeholder, className, formItemClassName, inputType = "input" }: InputFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn(" flex-1 shrink-0 ", formItemClassName)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {
              inputType === "input" ?
                <Input className={cn("h-10", className)} type={type} placeholder={placeholder} {...field} /> :
                inputType === "textarea" ?
                  <Textarea
                    placeholder={placeholder}
                    className={className}
                    {...field}
                  /> :
                  <CalendarInput className={cn("h-10", className)} type={type} placeholder={placeholder} field={field} />
            }
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}