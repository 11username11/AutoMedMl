import { STATUS } from "@/lib/constants";
import { Badge } from "./badge";
import { Patient } from "@/lib/types/patient";

export default function StatusBadge (status: Patient["status"]) {
  const statusConfig: Record<typeof STATUS[number], { className: string }> = {
    "Active Treatment": { className: "bg-success text-accent-foreground" },
    "Recovered": { className: "bg-secondary text-accent-foreground" },
    "Deceased": { className: "bg-primary-foreground text-foreground" },
  };

  const config = statusConfig[status];
  return <Badge className={config?.className}>{status}</Badge>;
};