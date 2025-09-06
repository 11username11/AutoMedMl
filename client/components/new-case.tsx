import { FaPlus } from "react-icons/fa6";

export default function NewCase() {
    return (
        <div className="flex justify-center gap-3 items-center py-2.5 px-16 border border-primary-border rounded-md text-sm text-primary bg-secondary hover:bg-secondary-foreground duration-200 cursor-pointer">
            <FaPlus /> New Case
        </div>
    )
}