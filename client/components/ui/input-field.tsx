import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Textarea } from "./textarea"
import { CalendarInput } from "./calendar-input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./select"
import { Control, FieldValues, Path } from "react-hook-form"

interface InputFieldProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"]
  placeholder?: string,
  className?: React.ComponentProps<"input">["className"],
  formItemClassName?: React.ComponentProps<"div">["className"],
  inputType?: "select" | "input" | "textarea" | "calendar",
  selectItems?: string[]
}


export function InputField<T extends FieldValues>({ control, name, label, type = "text", placeholder, className, formItemClassName, inputType = "input", selectItems }: InputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        let inputElement: React.ReactNode

        if (inputType === "input") {
          inputElement = (
            <Input
              className={cn("h-10", className, "bg-background")}
              type={type}
              placeholder={placeholder}
              {...field}
            />
          )
        } else if (inputType === "textarea") {
          inputElement = (
            <Textarea
              placeholder={placeholder}
              className={cn(className, "bg-background")}
              {...field}
            />
          )
        } else if (inputType === "select" && selectItems) {
          inputElement = (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger size="large" className={cn(className, "bg-background")}>
                <SelectValue>{field.value}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {selectItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )
        } else if (inputType === "calendar") {
          inputElement = (
            <CalendarInput
              className={cn("h-10", className, "bg-background")}
              type={type}
              placeholder={placeholder}
              field={field}
            />
          )
        }

        return (
          <FormItem className={cn("flex-1 shrink-0", formItemClassName)}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>{inputElement}</FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}