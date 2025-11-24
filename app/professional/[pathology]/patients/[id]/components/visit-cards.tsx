"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Eye, Play, ArrowRight, Filter, User } from "lucide-react";
import { formatShortDate } from "@/lib/utils/date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VISIT_TYPE_NAMES } from "@/lib/types/enums";
import { VisitFull } from "@/lib/types/database.types";

interface VisitWithCompletion extends VisitFull {
  completionPercentage: number;
}

interface VisitCardsProps {
  visits: VisitWithCompletion[];
  pathology: string;
  patientId: string;
}

export function VisitCards({ visits, pathology, patientId }: VisitCardsProps) {
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set(['upcoming']));

  // Calculate visit counts
  const allCount = visits.length;
  const upcomingCount = visits.filter(v => v.status === 'scheduled' || v.status === 'in_progress').length;
  const completedCount = visits.filter(v => v.status === 'completed').length;

  // Handle filter toggle
  const handleFilterToggle = (filterType: string) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(filterType)) {
      newFilters.delete(filterType);
    } else {
      newFilters.add(filterType);
    }
    setSelectedFilters(newFilters);
  };

  // Filter visits based on selected filters
  const filteredVisits = visits.filter(visit => {
    if (selectedFilters.size === 0) return false;
    
    if (selectedFilters.has('all')) return true;
    
    const isUpcoming = visit.status === 'scheduled' || visit.status === 'in_progress';
    const isCompleted = visit.status === 'completed';
    
    if (selectedFilters.has('upcoming') && isUpcoming) return true;
    if (selectedFilters.has('completed') && isCompleted) return true;
    
    return false;
  });

  const getActionButton = (visit: VisitWithCompletion) => {
    // Show review button if 100% complete, regardless of status
    if (visit.completionPercentage === 100 || visit.status === 'completed') {
      return (
        <Link href={`/professional/${pathology}/patients/${patientId}/visits/${visit.id}`}>
          <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm">
            <Eye className="w-4 h-4" />
            Revoir
          </button>
        </Link>
      );
    }
    
    if (visit.status === 'in_progress' || visit.status === 'scheduled') {
      const hasStarted = visit.completionPercentage > 0;
      return (
        <Link href={`/professional/${pathology}/patients/${patientId}/visits/${visit.id}`}>
          <button className="w-full py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm">
            {hasStarted ? 'Continuer' : 'Commencer'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Filter and Action Buttons */}
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrer les visites
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem 
              onSelect={(e) => {
                e.preventDefault();
                handleFilterToggle('all');
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox 
                checked={selectedFilters.has('all')}
                onCheckedChange={() => handleFilterToggle('all')}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="flex-1">Toutes</span>
              <span className="text-slate-500">({allCount})</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onSelect={(e) => {
                e.preventDefault();
                handleFilterToggle('upcoming');
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox 
                checked={selectedFilters.has('upcoming')}
                onCheckedChange={() => handleFilterToggle('upcoming')}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="flex-1">À venir</span>
              <span className="text-slate-500">({upcomingCount})</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onSelect={(e) => {
                e.preventDefault();
                handleFilterToggle('completed');
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox 
                checked={selectedFilters.has('completed')}
                onCheckedChange={() => handleFilterToggle('completed')}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="flex-1">Terminées</span>
              <span className="text-slate-500">({completedCount})</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link href={`/professional/${pathology}/patients/${patientId}/visits/new`}>
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            Planifier une visite
          </Button>
        </Link>
      </div>

      {/* Visit Cards Grid */}
      {filteredVisits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVisits.map((visit) => {
            const doctorName = visit.conducted_by_first_name && visit.conducted_by_last_name
              ? `Dr. ${visit.conducted_by_first_name} ${visit.conducted_by_last_name}`
              : 'Non assigné';

            // A visit is completed if status is 'completed' OR if completion is 100%
            const isCompleted = visit.status === 'completed' || visit.completionPercentage === 100;
            const isInProgress = !isCompleted && (visit.status === 'in_progress' || visit.status === 'scheduled');

            return (
              <div
                key={visit.id}
                className={cn(
                  "rounded-2xl overflow-hidden flex flex-col group transition-all cursor-pointer",
                  isCompleted && "bg-emerald-50/70 border-2 border-emerald-300 shadow-lg shadow-emerald-200/60 hover:shadow-xl hover:border-emerald-400",
                  isInProgress && "bg-white border-2 border-brand/10 shadow-lg shadow-brand/5 hover:border-brand/30",
                  !isCompleted && !isInProgress && "bg-white border border-slate-200"
                )}
              >
                <div className="p-6 flex-1">
                  {/* Header */}
                  <div className="mb-4">
                    <h3 className={cn(
                      "text-lg font-bold",
                      isCompleted ? "text-emerald-900" : "text-slate-900"
                    )}>
                      {VISIT_TYPE_NAMES[visit.visit_type as keyof typeof VISIT_TYPE_NAMES] || visit.template_name}
                    </h3>
                  </div>

                  {/* Date and Doctor */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {visit.scheduled_date ? formatShortDate(visit.scheduled_date) : 'Date non définie'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <User className="w-4 h-4 text-slate-400" />
                      {doctorName}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {visit.status !== 'cancelled' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-semibold uppercase tracking-wide">
                        <span className="text-slate-500">Progression</span>
                        <span className={isCompleted ? "text-emerald-600 font-bold" : "text-slate-900"}>{visit.completionPercentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            isCompleted ? "bg-emerald-500" : "bg-brand"
                          )}
                          style={{ width: `${visit.completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer with Action Button */}
                <div className={cn(
                  "p-4 border-t",
                  isCompleted ? "bg-emerald-100/60 border-emerald-200" : "bg-brand/5 border-brand/10"
                )}>
                  {getActionButton(visit)}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-600 mb-1">
            Aucune visite trouvée
          </p>
          <p className="text-xs text-slate-400">
            {selectedFilters.size === 0
              ? 'Sélectionnez un filtre pour afficher les visites'
              : 'Aucune visite dans les catégories sélectionnées'}
          </p>
        </div>
      )}
    </div>
  );
}
