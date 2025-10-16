import { Eye, Heart, Activity, Hand } from "lucide-react"

const icons = {
  eye: Eye,
  heart: Heart,
  activity: Activity,
  hand: Hand,
}

export type iconKeys = keyof typeof icons

export default function DynamicIcon({ name }: { name: iconKeys }) {
  const Icon = icons[name]
  return <Icon />
}