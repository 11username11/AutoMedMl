import { STATUS } from "@/lib/constants";
import { Badge } from "./badge";
import { Patient } from "@/lib/types/patient";

export default function StatusBadge({ statusKey, status }: { statusKey: Patient["status"], status: string }) {
  const statusConfig: Record<typeof STATUS[number], { className: string }> = {
    "active treatment": { className: "bg-success text-accent-foreground" },
    "recovered": { className: "bg-secondary text-accent-foreground" },
    "deceased": { className: "bg-primary-foreground text-foreground" },
  };

  const config = statusConfig[statusKey];
  return <Badge className={config?.className}>{status}</Badge>;
};