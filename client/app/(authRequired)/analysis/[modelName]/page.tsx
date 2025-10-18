import AnalysisForm from "@/components/pages/analysis/analysis-form"
import { getModel } from "@/lib/data/server/model"
import { getPatients } from "@/lib/data/server/patient"
import { notFound } from "next/navigation"

export default async function Model({ params }: { params: Promise<{ modelName: string }> }) {
  const modelName = (await params).modelName
  const [model, patients] = await Promise.all([getModel(modelName), getPatients()])

  if (!model) notFound()

  model.technical_name = modelName

  return (
    <div className="flex flex-col p-6 items-center">
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <div className="text-3xl font-bold">{model?.title}</div>
          <div className="text-muted">Upload medical images for AI-powered analysis</div>
        </div>
        <AnalysisForm model={model} patients={patients}></AnalysisForm>
      </div>
    </div>
  )
}