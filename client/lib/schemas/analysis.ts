import z from "zod";

export const AnalysisFormSchema = z.object({
  patient: z.string().min(1, { message: "Validation.patient_required" }),
  image: z.any().array().min(1, { message: "Validation.image_required" })
});
