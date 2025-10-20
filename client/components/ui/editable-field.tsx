import { InputField } from "./input-field"

interface EditableFieldProps {
  name: string
  isEditing: boolean
  text: string | undefined
  inputType?: "select" | "input" | "textarea" | "calendar",
  selectItems?: [string, string][]
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"]
}

export default function EditableField({ name, isEditing, text, selectItems, inputType = "input", type = "text" }: EditableFieldProps) {
  return isEditing
    ? <InputField name={name} type={type} inputType={inputType} selectItems={selectItems}></InputField>
    : <div className="text-muted">{text ?? "-"}</div>
}