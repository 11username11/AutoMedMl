import AnalysisForm from "@/components/pages/analysis/analysis-form"
import { getModel } from "@/lib/data/server/model"
import { getPatients } from "@/lib/data/server/patient"

export default async function Model({ params }: { params: Promise<{ modelName: string }> }) {
  const modelName = (await params).modelName
  const [model, patients] = await Promise.all([getModel(modelName), getPatients()])

  return (
    <div className="flex flex-col p-10">
      <div>
        <div className="text-3xl font-bold">{model?.title}</div>
        <div className="text-muted">Upload medical images for AI-powered analysis</div>
      </div>
      <AnalysisForm model={model} patients={patients}></AnalysisForm>
    </div>
  )
}