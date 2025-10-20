import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Textarea } from "./textarea"
import { CalendarInput } from "./calendar-input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./select"
import { FieldValues, Path, useFormContext } from "react-hook-form"

interface InputFieldProps<T extends FieldValues> {
  name: Path<T>
  label?: string
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"]
  placeholder?: string,
  className?: React.ComponentProps<"input">["className"],
  formItemClassName?: React.ComponentProps<"div">["className"],
  inputType?: "select" | "input" | "textarea" | "calendar",
  selectItems?: [string, string][],
  isRequired?: boolean
}


export function InputField<T extends FieldValues>({ name, label, type = "text", placeholder, className, formItemClassName, inputType = "input", selectItems, isRequired = false }: InputFieldProps<T>) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        let inputElement: React.ReactNode

        if (inputType === "input") {
          inputElement = (
            <Input
              className={cn("h-10", className)}
              type={type}
              placeholder={placeholder}
              {...field}
            />
          )
        } else if (inputType === "textarea") {
          inputElement = (
            <Textarea
              placeholder={placeholder}
              className={cn(className)}
              {...field}
            />
          )
        } else if (inputType === "select" && selectItems) {
          inputElement = (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger size="large" className={cn("w-full", className)}>
                <SelectValue>{selectItems[field.value]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {selectItems.map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )
        } else if (inputType === "calendar") {
          inputElement = (
            <CalendarInput
              className={cn("h-10", className)}
              type={type}
              placeholder={placeholder}
              field={field}
            />
          )
        }

        return (
          <FormItem className={cn("flex-1 shrink-0", formItemClassName)}>
            {label && <FormLabel>{isRequired ? `${label} *` : label}</FormLabel>}
            <FormControl>{inputElement}</FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}