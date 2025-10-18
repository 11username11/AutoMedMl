import { FaLungsVirus } from "react-icons/fa6"

const icons = {
  FaLungsVirus
}

export type iconKeys = keyof typeof icons

export default function DynamicIcon({ name }: { name: iconKeys }) {
  const Icon = icons[name]

  if (!Icon) return null;

  return <Icon size={20}/>
}