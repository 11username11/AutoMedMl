import { IconName } from "lucide-react/dynamic";

export interface AnalysisModel {
  title: string;
  technical_name: string;
  category: string;
  description: string;
  accuracy: string;
  processing_time: string;
  supported_formats: string[];
  icon: IconName;
}