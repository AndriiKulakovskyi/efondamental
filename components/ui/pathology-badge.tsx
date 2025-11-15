import { PathologyType, PATHOLOGY_NAMES } from "@/lib/types/enums";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PathologyBadgeProps {
  pathology: PathologyType;
  variant?: "default" | "outline";
  className?: string;
}

const PATHOLOGY_COLORS: Record<PathologyType, string> = {
  [PathologyType.BIPOLAR]: "bg-amber-100 text-amber-800 border-amber-200",
  [PathologyType.SCHIZOPHRENIA]: "bg-purple-100 text-purple-800 border-purple-200",
  [PathologyType.ASD_ASPERGER]: "bg-cyan-100 text-cyan-800 border-cyan-200",
  [PathologyType.DEPRESSION]: "bg-blue-100 text-blue-800 border-blue-200",
};

export function PathologyBadge({
  pathology,
  variant = "default",
  className,
}: PathologyBadgeProps) {
  const colorClass = PATHOLOGY_COLORS[pathology];
  
  return (
    <Badge
      variant={variant}
      className={cn(
        variant === "default" && colorClass,
        className
      )}
    >
      {PATHOLOGY_NAMES[pathology]}
    </Badge>
  );
}

