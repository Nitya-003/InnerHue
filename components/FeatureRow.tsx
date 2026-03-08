import { LucideIcon } from "lucide-react";

interface FeatureRowProps {
  icon: LucideIcon;
  title: string;
  description: string;
  align?: "left" | "right";
  index?: number;
}

export default function FeatureRow({
  icon: Icon,
  title,
  description,
  align = "left",
}: FeatureRowProps) {
  return (
    <div className={`flex items-center gap-6 my-12 ${align === "right" ? "flex-row-reverse" : ""}`}>
      <Icon className="w-10 h-10 text-purple-400" />
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-white/70">{description}</p>
      </div>
    </div>
  );
}