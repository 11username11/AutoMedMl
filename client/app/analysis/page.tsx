import { Badge } from "@/components/ui/badge";
import { Activity, Brain, Eye, Heart } from "lucide-react";

interface AnalysisModel {
  name: string;
  category: string;
  description: string;
  accuracy: string;
  processing: string;
  supportedFormats: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const mockModels: AnalysisModel[] = [
  {
    name: "Brain MRI Analysis",
    category: "Radiology",
    description: "Advanced AI model for detecting brain anomalies, tumors, and neurological conditions from MRI scans.",
    accuracy: "97.8%",
    processing: "2-5 min",
    supportedFormats: ["DICOM", "NIfTI", "JPEG", "PNG"],
    icon: Brain,
  },
  {
    name: "Retinal Imaging",
    category: "Ophthalmology",
    description: "Comprehensive retinal analysis for diabetic retinopathy, glaucoma, and macular degeneration detection.",
    accuracy: "95.2%",
    processing: "1-2 min",
    supportedFormats: ["TIFF", "JPEG", "PNG"],
    icon: Eye,
  },
  {
    name: "Cardiac Echocardiogram",
    category: "Cardiology",
    description: "AI-powered analysis of echocardiograms for heart function assessment and cardiac condition detection.",
    accuracy: "93.5%",
    processing: "3-4 min",
    supportedFormats: ["DICOM", "AVI", "MP4"],
    icon: Heart,
  },
  {
    name: "Chest X-Ray Analysis",
    description: "Automated detection of pneumonia, COVID-19, tuberculosis, and other pulmonary conditions.",
    icon: Activity,
    category: "Pulmonology",
    accuracy: "96.1%",
    processing: "1 min",
    supportedFormats: ["DICOM", "PNG", "JPG"],
  },
];

export default function Analysis() {
  return (
    <div className="flex flex-col p-6 gap-8">
      <div className="p-4">
        <div className="text-3xl font-bold">Medical Analysis</div>
        <div className="text-muted">Choose from our advanced AI models to analyze medical images and scans</div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {mockModels.map((model, index) => (
          <div key={model.name + index} className="flex flex-col gap-4 p-6 bg-primary max-w-xl shadow-sm rounded-md hover:bg-secondary/5 duration-200 cursor-pointer">
            <div className="flex gap-3 items-center">
              <div className="text-secondary bg-secondary/10 p-2 rounded-md">
                <model.icon />
              </div>

              <Badge className="bg-secondary/10 text-foreground">{model.category}</Badge>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-lg font-semibold">{model.name}</div>
              <div className="text-muted text-sm">{model.description}</div>
            </div>
            <div className="flex gap-32 text-muted text-sm">
              <div className="flex flex-col gap-1">
                <div>Accuracy</div>
                <div className="text-success font-semibold">{model.accuracy}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div>Processing</div>
                <div className="text-foreground font-semibold">{model.processing}</div>
              </div>
            </div>

            <div className="text-sm text-muted flex flex-col gap-1">
              <div>Supported formats:</div>
              <div className="flex gap-2">
                {model.supportedFormats.map((format, index) => (
                  <Badge key={format + index} className="text-foreground border border-border font-semibold">{format}</Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
