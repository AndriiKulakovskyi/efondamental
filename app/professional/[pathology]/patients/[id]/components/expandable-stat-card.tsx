"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ExpandableStatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  expandedContent?: React.ReactNode;
  className?: string;
  valueColor?: string;
}

export function ExpandableStatCard({
  title,
  value,
  icon: Icon,
  expandedContent,
  className,
  valueColor,
}: ExpandableStatCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasExpandedContent = !!expandedContent;

  return (
    <div className="space-y-2">
      <Card 
        className={cn(
          "transition-all duration-300",
          hasExpandedContent && "cursor-pointer hover:shadow-lg hover:border-slate-300",
          isExpanded && "border-slate-700 shadow-lg",
          className
        )}
        onClick={hasExpandedContent ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-slate-500" />}
            {hasExpandedContent && (
              <ChevronDown 
                className={cn(
                  "h-4 w-4 text-slate-500 transition-transform duration-300",
                  isExpanded && "rotate-180"
                )}
              />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", valueColor || "text-slate-900")}>
            {value}
          </div>
        </CardContent>
      </Card>
      
      {hasExpandedContent && (
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

