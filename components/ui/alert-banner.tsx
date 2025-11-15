import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "info" | "warning" | "error" | "success";

interface AlertBannerProps {
  type?: AlertType;
  title?: string;
  message: string;
  className?: string;
}

const ALERT_STYLES: Record<AlertType, { icon: typeof Info; className: string }> = {
  info: {
    icon: Info,
    className: "bg-blue-50 border-blue-200 text-blue-800",
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-amber-50 border-amber-200 text-amber-800",
  },
  error: {
    icon: AlertCircle,
    className: "bg-red-50 border-red-200 text-red-800",
  },
  success: {
    icon: CheckCircle,
    className: "bg-green-50 border-green-200 text-green-800",
  },
};

export function AlertBanner({
  type = "info",
  title,
  message,
  className,
}: AlertBannerProps) {
  const { icon: Icon, className: styleClassName } = ALERT_STYLES[type];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-4",
        styleClassName,
        className
      )}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <div className="flex-1">
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div className="text-sm">{message}</div>
      </div>
    </div>
  );
}

