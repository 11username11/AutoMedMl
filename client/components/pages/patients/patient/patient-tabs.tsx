"use client"

import { useRouter, useSearchParams } from "next/navigation"
import GeneralInformation from "./tabs/general-information"
import MedicalHistory from "./tabs/medical-history"
import Scans from "./tabs/scans"
import AnalysisResults from "./tabs/analysis-results"
import { Patient } from "@/lib/types/patient"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PatientTabs({ patient }: { patient: Patient }) {
  const router = useRouter()

  const searchParams = useSearchParams()
  const currentTab = searchParams.get("tab") ?? "general"
  const isEditing = searchParams.get("mode") == "edit"

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", value)
    router.replace(`?${params.toString()}`)
  }

  return (
    <Tabs defaultValue={currentTab} onValueChange={handleChange} className="w-full gap-4">
      <div className="flex gap-4 items-center">
        <TabsList className="">
          <TabsTrigger value="general" className="px-4 py-2">
            General Information
          </TabsTrigger>
          <TabsTrigger value="history" className="px-4 py-2">
            Medical History
          </TabsTrigger>
          <TabsTrigger value="scans" className="px-4 py-2">
            Scans & Images
          </TabsTrigger>
          <TabsTrigger value="analysis" className="px-4 py-2">
            Analysis Results
          </TabsTrigger>

        </TabsList>
      </div>

      <TabsContent value="general">
        <GeneralInformation patient={patient} isEditing={isEditing} />
      </TabsContent>

      <TabsContent value="history">
        <MedicalHistory patient={patient} isEditing={isEditing} />
      </TabsContent>

      <TabsContent value="scans">
        <Scans patient={patient} />
      </TabsContent>

      <TabsContent value="analysis">
        <AnalysisResults patient={patient} />
      </TabsContent>
    </Tabs>
  )
}
