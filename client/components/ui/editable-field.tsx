'use client'

import { useFormContext } from "react-hook-form"
import { InputField } from "./input-field"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./select"
import { GENDER } from "@/lib/constants"
import { Textarea } from "./textarea"

interface EditableFieldProps {
  name: string,
  isEditing: boolean,
  text: string | undefined,
  type?: "select" | "input" | "textarea"
}

export default function EditableField({ name, isEditing, text, type = "input" }: EditableFieldProps) {
  const { control } = useFormContext()

  if (type == "select" && isEditing) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem className="w-full flex flex-col">
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger size="large" className="w-full cursor-pointer bg-primary">
                  <SelectValue>{field.value}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {GENDER.map((gender) => <SelectItem key={gender} value={gender}>{gender}</SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}>
      </FormField>
    )
  }

  return isEditing
    ? <InputField control={control} name={name} textarea={type === "textarea"}></InputField>
    : <div className="text-muted">{text ?? "-"}</div>
}