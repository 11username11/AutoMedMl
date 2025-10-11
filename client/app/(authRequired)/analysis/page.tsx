import { Badge } from "@/components/ui/badge";
import { getModels } from "@/lib/data/server/model";
import Link from "next/link";
import DynamicIcon from "@/components/ui/dynamic-icon";
import { iconKeys } from "@/components/ui/dynamic-icon";

export default async function Analysis() {
  const models = await getModels()

  return (
    <div className="flex flex-col p-10 gap-8">
      <div>
        <div className="text-3xl font-bold">Medical Analysis</div>
        <div className="text-muted">Choose from our advanced AI models to analyze medical images and scans</div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-6">
        {models.map((model) => (
          <Link href={"/analysis/" + model.technical_name} key={model.title} className="flex flex-col gap-4 p-6 bg-primary shadow-sm rounded-md hover:bg-secondary/5 duration-200 cursor-pointer">
            <div className="flex gap-3 items-center">
              <div className="text-secondary bg-secondary/10 p-2 h-10 w-10 rounded-md">
                <DynamicIcon name={model.icon.toLowerCase() as iconKeys}></DynamicIcon>
              </div>

              <Badge className="bg-secondary/10 text-foreground">{model.category}</Badge>
            </div>

            <div className="flex flex-col gap-2">
              <div className="text-lg font-semibold">{model.title}</div>
              <div className="text-muted text-sm">{model.description}</div>
            </div>
            <div className="flex gap-8 text-muted text-sm mt-auto">
              <div className="flex flex-col gap-1">
                <div>Accuracy</div>
                <div className="text-success font-semibold">{model.accuracy}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div>Processing</div>
                <div className="text-foreground font-semibold">{model.processing_time}</div>
              </div>
            </div>

            <div className="text-sm text-muted flex flex-col gap-1">
              <div>Supported formats:</div>
              <div className="flex gap-2">
                {model.supported_formats.map((format) => (
                  <Badge key={format} className="text-foreground border border-border font-semibold">{format}</Badge>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
