import dynamic from "next/dynamic";

const DynamicIcon = ({ name }: { name: string }) => {
  const LucideIcon = dynamic(() =>
    import("lucide-react").then((mod) => (mod as any)[name])
  );
  return <LucideIcon />;
};