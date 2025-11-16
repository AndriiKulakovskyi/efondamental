import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
  onClick?: () => void;
  isExpanded?: boolean;
  expandedContent?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  onClick,
  isExpanded,
  expandedContent,
}: StatCardProps) {
  const isClickable = !!onClick;

  return (
    <div className="space-y-2">
      <Card 
        className={cn(
          "transition-all duration-200",
          isClickable && "cursor-pointer hover:shadow-md hover:border-slate-300",
          isExpanded && "border-slate-400 shadow-md",
          className
        )}
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-slate-500" />}
            {isClickable && (
              <ChevronDown 
                className={cn(
                  "h-4 w-4 text-slate-500 transition-transform duration-200",
                  isExpanded && "rotate-180"
                )}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          {(description || trend) && (
            <div className="mt-1 flex items-center gap-2">
              {trend && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    trend.positive
                      ? "text-green-600"
                      : trend.positive === false
                      ? "text-red-600"
                      : "text-slate-600"
                  )}
                >
                  {trend.value > 0 ? "+" : ""}
                  {trend.value}% {trend.label}
                </span>
              )}
              {description && !trend && (
                <p className="text-xs text-slate-500">{description}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {isClickable && expandedContent && (
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
            {expandedContent}
          </div>
        </div>
      )}
    </div>
  );
}

