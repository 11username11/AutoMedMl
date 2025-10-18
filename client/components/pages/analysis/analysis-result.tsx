import { Button } from "@/components/ui/button";
import { Result } from "@/lib/types/model";
import { Activity, Info, MessageSquare, TrendingUp } from "lucide-react";

export default function AnalysisResult({ result, handleReset }: { result: Result, handleReset: () => void }) {
  function getRiskLevel(probability: number): string {
    if (probability < 0.2) {
      return "Very low risk";
    } else if (probability < 0.4) {
      return "Low risk";
    } else if (probability < 0.6) {
      return "Moderate risk";
    } else if (probability < 0.8) {
      return "High risk";
    } else {
      return "Very high risk";
    }
  }

  function getDiagnosis(probability: number): string {
    if (probability < 0.2) {
      return "Normal, no pathology detected";
    } else if (probability < 0.4) {
      return "Mostly normal, minor deviations, no clear pathology";
    } else if (probability < 0.6) {
      return "Uncertain findings, further evaluation recommended";
    } else if (probability < 0.8) {
      return "Suspicious findings, possible pathology";
    } else {
      return "Pathology detected, high probability";
    }
  }

  return (
    <div className="bg-primary p-6 rounded-md border shadow-sm space-y-6">
      <div className="flex text-2xl items-center gap-2 font-semibold">
        <Activity></Activity>
        Analysis Result
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-lg">Diagnosis</div>
          <span className="p-1 px-3 text-xs rounded-full border flex items-center">{getRiskLevel(result.probability)}</span>
        </div>
        <div>{getDiagnosis(result.probability)}</div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <TrendingUp size={16}></TrendingUp>
          <div>
            Probability: <span className="font-semibold">{(result.probability * 100).toFixed(2)}%</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 rounded-md p-2 bg-secondary/20 text-secondary font-light text-xs mt-auto">
        <Info className="shrink-0" size={16}></Info>
        These results are preliminary and require confirmation by a qualified physician.
      </div>

      <div className="flex gap-2 w-full">
        <Button onClick={handleReset} variant={"outline"} size={"lg"} className="flex-1">New Analysis</Button>
        <Button variant={"secondary"} size={"lg"} className="flex-1"><MessageSquare size={16}></MessageSquare> Chat with patient</Button>
      </div>
    </div>
  );
}