'use client'

import { useFormContext } from "react-hook-form"
import { InputField } from "./input-field"

interface EditableFieldProps {
  name: string
  isEditing: boolean
  text: string | undefined
  type?: "select" | "input" | "textarea" | "calendar",
  selectItems?: string[]
}

export default function EditableField({ name, isEditing, text, selectItems, type = "input" }: EditableFieldProps) {
  const { control } = useFormContext()

  return isEditing
    ? <InputField control={control} name={name} inputType={type} selectItems={selectItems}></InputField>
    : <div className="text-muted">{text ?? "-"}</div>
}