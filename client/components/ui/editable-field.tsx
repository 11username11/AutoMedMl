'use client'

import { useFormContext } from "react-hook-form"
import { InputField } from "./input-field"
import { FormControl, FormField, FormItem, FormMessage } from "./form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./select"

interface BaseEditableFieldProps {
  name: string
  isEditing: boolean
  text: string | undefined
}

interface SelectFieldProps extends BaseEditableFieldProps {
  type: "select"
  selectItems: string[]
}

interface InputFieldProps extends BaseEditableFieldProps {
  type?: "input" | "textarea" | "calendar"
  selectItems?: never
}

type EditableFieldProps = SelectFieldProps | InputFieldProps

export default function EditableField({ name, isEditing, text, ...props }: EditableFieldProps) {
  const { control } = useFormContext()

  if (props.type == "select" && isEditing) {
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
                    {props.selectItems.map((item) => <SelectItem key={item} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </SelectItem>)}
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
    ? <InputField control={control} name={name} inputType={props.type}></InputField>
    : <div className="text-muted">{text ?? "-"}</div>
}