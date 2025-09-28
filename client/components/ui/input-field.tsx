import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Textarea } from "./textarea"

interface InputFieldProps {
  control: any
  name: string
  label?: string
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"]
  placeholder?: string,
  className?: React.ComponentProps<"input">["className"],
  formItemClassName?: React.ComponentProps<"div">["className"],
  textarea?: boolean
}

export function InputField({ control, name, label, type = "text", placeholder, className, formItemClassName, textarea = false }: InputFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", formItemClassName)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {textarea ? (
              <Textarea
                placeholder={placeholder}
                className={className}
                {...field}
              />
            ) : <Input className={cn("h-10", className)} type={type} placeholder={placeholder} {...field} />}
            
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}