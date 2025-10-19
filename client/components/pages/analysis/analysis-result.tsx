import { Button } from "@/components/ui/button";
import { Result } from "@/lib/types/model";
import { Activity, Info, MessageSquare, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { AnalysisFormSchema } from "./analysis-form";
import z from "zod";

export default function AnalysisResult({ result, handleReset }: { result: Result, handleReset: () => void }) {
  const { getValues } = useFormContext<z.infer<typeof AnalysisFormSchema>>()

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

  function getDiagnosis(probability: number, label?: string): string {
    let base: string;

    if (probability < 0.2) {
      base = "Normal, no pathology detected";
    } else if (probability < 0.4) {
      base = "Mostly normal, minor deviations, no clear pathology";
    } else if (probability < 0.6) {
      base = "Uncertain findings, further evaluation recommended";
    } else if (probability < 0.8) {
      base = "Suspicious findings, possible pathology";
    } else {
      base = "Pathology detected, high probability";
    }

    return label ? `${base} (${label})` : base;
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
        {result.label && (
          <div className="text-sm text-muted">
            Condition: <span className="font-semibold">{result.label}</span>
          </div>
        )}
        <div className="text-sm text-muted">
          Probability: <span className="font-semibold">{(result.probability * 100).toFixed(2)}%</span>
        </div>
      </div>

      <div className="flex gap-2 rounded-md p-2 bg-secondary/20 text-secondary font-light text-xs mt-auto">
        <Info className="shrink-0" size={16}></Info>
        These results are preliminary and require confirmation by a qualified physician.
      </div>

      <div className="flex gap-2 w-full">
        <Button onClick={handleReset} variant={"outline"} size={"lg"} className="flex-1 px-0">New Analysis</Button>
        <Link href={`/?chat=${getValues().patient}`} className="flex-1">
          <Button variant={"secondary"} size={"lg"} className="w-full"><MessageSquare size={16}>
          </MessageSquare> Chat with patient
          </Button>
        </Link>
      </div>
    </div>
  );
}