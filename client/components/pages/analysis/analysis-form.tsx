'use client'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dropzone, DropzoneContent, DropzoneEmptyState, renderBytes } from "@/components/ui/shadcn-io/dropzone"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Image, Info, Upload, User } from "lucide-react"
import { useForm } from "react-hook-form"
import z from "zod"
import toast from "react-hot-toast"
import { useMutation } from "@tanstack/react-query"
import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { AnalysisModel } from "@/lib/types/model"
import { Badge } from "@/components/ui/badge"
import { Patient } from "@/lib/types/patient"
import SubmitButton from "@/components/ui/submit-btn"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxItem, ComboboxTrigger, ComboboxValue } from "@/components/ui/combobox"
import NewCaseBtn from "@/components/ui/new-case-btn"

const FormSchema = z.object({
  patient: z.string(),
  image: z.file().array()
});

export default function AnalysisForm({ model, patients }: { model: AnalysisModel | undefined, patients: Patient[] }) {
  const { mutateAsync, isPending } = useMutation(
    {
      mutationFn: (data: FormData) => api.post(`/model/${model?.technical_name}/send_data`, data),
    }
  )

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      patient: "",
      image: undefined
    }
  })

  function osSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData()

    formData.append("patient", data.patient)
    formData.append("image", data.image[0])

    toast.promise(mutateAsync(formData), {
      loading: "Verifying your data",
      error: (error) => error?.response?.data.detail || "Something went wrong",
      success: (success) => success.data.message || "You are signed up"
    })
  }

  return (
    <div className="p-2 rounded-md shrink-0 h-full">
      <Form {...form} >
        <form onSubmit={form.handleSubmit(osSubmit)} className="flex flex-col lg:flex-row gap-4 h-full">
          <FormField
            control={form.control}
            name={"image"}
            render={({ field }) => (
              <FormItem className="flex flex-col p-4 bg-primary rounded-md shadow-sm w-full">
                <FormLabel className="flex gap-2 items-center font-semibold text-xl">
                  <Image></Image> Upload Medical Image
                </FormLabel>
                <FormControl>
                  <Dropzone
                    className="py-8 h-full shrink"
                    accept={{ 'image/*': [] }}
                    maxFiles={1}
                    multiple={false}
                    maxSize={1024 * 1024 * 10}
                    onDrop={field.onChange}
                    onError={console.error}
                    src={field.value}
                  >
                    <DropzoneEmptyState>
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="text-secondary bg-secondary/20 p-3 rounded-md box-content" />
                        <div className="space-y-0.5 text-base">
                          <div className="font-semibold">Drag and drop your medical image here</div>
                          <div className="text-muted font-light">or click to browse files</div>
                        </div>
                        <div className="border rounded-sm p-2 px-3 bg-background hover:bg-accent duration-200">Browse Files</div>
                        <div className="flex gap-2">
                          {model?.supported_formats.map((format) => (
                            <Badge key={format} className="border border-border text-foreground">{format}</Badge>
                          ))}
                        </div>
                      </div>
                    </DropzoneEmptyState>
                    <DropzoneContent>
                      <div className="flex flex-col items-center gap-3">
                        <Check className="text-primary bg-primary/20 dark:bg-foreground/20 dark:text-foreground p-3 rounded-md box-content" />
                        {field.value && (
                          <div className="space-y-0.5 text-base text-primary dark:text-foreground">
                            <div className="font-semibold">{field.value[0].name}</div>
                            <div className="text-primary/70 dark:text-foreground/70 font-light text-sm">{renderBytes(field.value[0].size)} • {field.value[0].type}</div>
                          </div>
                        )}
                        <div onClick={(e) => {
                          e.stopPropagation()
                          field.onChange(undefined)
                        }} className="border rounded-sm p-2 px-3 bg-background/70 backdrop-blur-xs hover:bg-accent hover:brightness-90 duration-200">Remove file</div>
                      </div>
                    </DropzoneContent>
                  </Dropzone>
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4 shrink-0 h-full">
            <FormField
              control={form.control}
              name="patient"
              render={({ field }) => (
                <FormItem className="p-4 bg-primary rounded-md shadow-sm">
                  <FormLabel className="flex gap-2 items-center font-semibold text-xl">
                    <User /> Patient Assignment
                  </FormLabel>
                  <FormControl>
                    <Combobox value={field.value} onChange={field.onChange}>
                      <ComboboxTrigger>
                        <button
                          role="combobox"
                          className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm"
                        >
                          <ComboboxValue placeholder="Select a patient"/>
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </button>
                      </ComboboxTrigger >
                      <ComboboxContent>
                        {patients.length > 0 ? (
                          <ComboboxGroup>
                            <ComboboxEmpty></ComboboxEmpty>

                            {patients.map((p) => (
                              <ComboboxItem key={p.patient_id} search={`${p.patient_id} ${p.name} ${p.surname} ${p.email} ${p.phone}`} value={p.patient_id}>
                                {p.name} {p.surname}
                              </ComboboxItem>
                            ))
                            }
                          </ComboboxGroup>
                        ) : (
                          <div className="px-4 py-2 space-y-2 text-center">
                            <div className="text-sm text-muted">You have no patients yet.</div>
                            <NewCaseBtn className="h-8 px-0 w-full text-xs"></NewCaseBtn>
                          </div>
                        )}
                      </ComboboxContent>
                    </Combobox>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-4 p-4 bg-primary rounded-md shadow-sm h-full">
              <div className="text-xl font-semibold">Analysis Details</div>
              <div className="text-sm space-y-2">
                <div className="flex">
                  <div className="text-muted">
                    Model:
                  </div>
                  <div className="font-semibold ml-auto">
                    {model?.title}
                  </div>
                </div>
                <div className="flex">
                  <div className="text-muted">
                    Expected time:
                  </div>
                  <div className="font-semibold ml-auto">
                    {model?.processing_time}
                  </div>
                </div>
                <div className="flex">
                  <div className="text-muted">
                    Accuracy:
                  </div>
                  <div className="font-semibold ml-auto text-success">
                    {model?.accuracy}%
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-min min-w-full rounded-md p-2 bg-secondary/20 text-secondary font-light text-xs mt-auto">
                <Info className="shrink-0" size={16}></Info>
                AI analysis results are for reference only and should be reviewed by qualified medical professionals.
              </div>
              <SubmitButton isPending={isPending}>Start Analysis</SubmitButton>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}