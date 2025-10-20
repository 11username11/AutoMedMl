import { Button } from "@/components/ui/button";
import { Result } from "@/lib/types/model";
import { Activity, Info, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import z from "zod";
import { useTranslations } from "next-intl";
import { AnalysisFormSchema } from "@/lib/schemas/analysis";

export default function AnalysisResult({ result, handleReset }: { result: Result, handleReset: () => void }) {
  const t = useTranslations("ModelPage.form.results");

  const { getValues } = useFormContext<z.infer<typeof AnalysisFormSchema>>()

  function getRiskLevel(prob: number) {
    if (prob < 0.2) return t("risk.veryLow");
    if (prob < 0.4) return t("risk.low");
    if (prob < 0.6) return t("risk.moderate");
    if (prob < 0.8) return t("risk.high");
    return t("risk.veryHigh");
  }

  function getDiagnosis(prob: number) {
    if (prob < 0.2) t("diagnosis.veryLow");
    else if (prob < 0.4) t("diagnosis.low");
    else if (prob < 0.6) t("diagnosis.moderate");
    else if (prob < 0.8) t("diagnosis.high");
    return t("diagnosis.veryHigh");
  }

  return (
    <div className="bg-primary p-6 rounded-md border shadow-sm space-y-6">
      <div className="flex text-2xl items-center gap-2 font-semibold">
        <Activity></Activity>
        {t("label")}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-lg">{t("diagnosisLabel")}</div>
          <span className="p-1 px-3 text-xs rounded-full border flex items-center">{getRiskLevel(result.probability)}</span>
        </div>
        <div>{getDiagnosis(result.probability)}</div>
        {result.label && (
          <div className="text-sm text-muted">
            {t("conditionLabel")}: <span className="font-semibold">{result.label}</span>
          </div>
        )}
        <div className="text-sm text-muted">
          {t("probabilityLabel")}: <span className="font-semibold">{(result.probability * 100).toFixed(2)}%</span>
        </div>
      </div>

      <div className="flex gap-2 rounded-md p-2 bg-secondary/20 text-secondary font-light text-xs mt-auto">
        <Info className="shrink-0" size={16}></Info>
        {t("warning")}
      </div>

      <div className="flex gap-2 w-full">
        <Button onClick={handleReset} variant={"outline"} size={"lg"} className="flex-1 px-0">{t("buttons.new")}</Button>
        <Link href={`/?chat=${getValues().patient}`} className="flex-1">
          <Button variant={"secondary"} size={"lg"} className="w-full"><MessageSquare size={16}>
          </MessageSquare> {t("buttons.chat")}
          </Button>
        </Link>
      </div>
    </div>
  );
}