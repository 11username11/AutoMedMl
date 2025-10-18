import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Info, MessageSquare, TrendingUp } from "lucide-react";

export function AnalysisResultSkeleton() {
  return (
    <div className="bg-primary p-6 rounded-md border shadow-sm space-y-6 ">
      <div className="flex text-2xl items-center gap-2 font-semibold">
        <Activity></Activity>
        Analysis Result
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-lg">Diagnosis</div>
          <span className="p-1 px-3 text-xs rounded-full border flex items-center">
            <Skeleton className="h-4 w-16 rounded-full bg-foreground/10" />
          </span>
        </div>
        <Skeleton className="h-6 w-3/4 rounded bg-foreground/10" />
        <div className="flex items-center gap-2 text-sm text-muted">
          <TrendingUp size={16} />
          <Skeleton className="h-5 w-32 rounded bg-foreground/10" />
        </div>
      </div>

      <div className="flex gap-2 rounded-md p-2 bg-secondary/20 text-secondary font-light text-xs mt-auto">
        <Info className="shrink-0" size={16}></Info>
        These results are preliminary and require confirmation by a qualified physician.
      </div>

      <div className="flex gap-2 w-full">
        <Button variant={"outline"} size={"lg"} className="flex-1">New Analysis</Button>
        <Button variant={"secondary"} size={"lg"} className="flex-1"><MessageSquare size={16}></MessageSquare> Chat with patient</Button>
      </div>
    </div>
  );
}