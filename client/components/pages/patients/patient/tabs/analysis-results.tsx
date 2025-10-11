import { Button } from "@/components/ui/button";
import { Patient } from "@/lib/types/patient";
import { Brain, Download, Eye } from "lucide-react";

const resultsMock = [{
  name: "Blood Test",
  description: "All parameters within normal range",
  date: new Date().toLocaleDateString()
}]

export default function AnalysisResults({ patient }: { patient: Patient }) {
  return (
    <div className="flex gap-8">
      <div className="rounded-md p-4 shadow-sm w-full space-y-4 bg-primary">

        <div className="flex gap-2 items-center text-xl font-semibold">
          <Brain size={20} className="text-secondary"></Brain>
          Analysis Results
        </div>

        <div className="space-y-2">
          {resultsMock.map((scan) => (
            <div key={scan.name} className="flex not-dark:border p-4 rounded-md items-center justify-between bg-background">
              <div className="space-y-1">
                <div className="font-semibold">{scan.name}</div>
                <div className="text-muted text-sm">{scan.description}</div>
                <div className="text-muted text-xs">Date: {scan.date}</div>
              </div>
              <div className="space-x-4">
                <Button variant="outline">
                  <Eye size={16}></Eye>
                  View
                </Button>
                <Button variant="outline">
                  <Download size={16}></Download>
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}