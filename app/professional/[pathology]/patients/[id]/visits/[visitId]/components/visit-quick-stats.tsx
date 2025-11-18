"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, Layers } from "lucide-react";

interface VisitQuickStatsProps {
  totalModules: number;
  totalQuestionnaires: number;
  completedQuestionnaires: number;
  completionPercentage: number;
}

export function VisitQuickStats({ 
  totalModules,
  totalQuestionnaires,
  completedQuestionnaires,
  completionPercentage
}: VisitQuickStatsProps) {
  const pendingQuestionnaires = totalQuestionnaires - completedQuestionnaires;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Layers className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Modules</p>
              <p className="text-2xl font-bold text-slate-900">{totalModules}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Total Forms</p>
              <p className="text-2xl font-bold text-slate-900">{totalQuestionnaires}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-700">{completedQuestionnaires}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">Pending</p>
              <p className="text-2xl font-bold text-amber-700">{pendingQuestionnaires}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

