"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Clock, CheckCircle, XCircle, Eye, Play, ArrowRight, Filter } from "lucide-react";
import { formatShortDate } from "@/lib/utils/date";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VISIT_TYPE_NAMES } from "@/lib/types/enums";

interface VisitWithCompletion {
  id: string;
  visit_type: string;
  scheduled_date: string | null;
  status: string;
  template_name: string;
  conducted_by_first_name: string | null;
  conducted_by_last_name: string | null;
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Terminée
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            En cours
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge className="bg-slate-100 text-slate-700 border-slate-200">
            <Calendar className="w-3 h-3 mr-1" />
            Planifiée
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Annulée
          </Badge>
        );
      default:
        return null;
    }
  };

  const getActionButton = (visit: VisitWithCompletion) => {
    if (visit.status === 'completed') {
      return (
        <Link href={`/professional/${pathology}/patients/${patientId}/visits/${visit.id}`}>
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            Voir détails
          </Button>
        </Link>
      );
    }
    
    if (visit.status === 'in_progress') {
      return (
        <Link href={`/professional/${pathology}/patients/${patientId}/visits/${visit.id}`}>
          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
            <ArrowRight className="w-4 h-4 mr-2" />
            Continuer
          </Button>
        </Link>
      );
    }
    
    if (visit.status === 'scheduled') {
      return (
        <Link href={`/professional/${pathology}/patients/${patientId}/visits/${visit.id}`}>
          <Button size="sm" className="w-full bg-slate-900 hover:bg-slate-800">
            <Play className="w-4 h-4 mr-2" />
            Commencer
          </Button>
        </Link>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Filter Dropdown */}
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

      {/* Visit Cards Grid */}
      {filteredVisits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVisits.map((visit) => {
            const doctorName = visit.conducted_by_first_name && visit.conducted_by_last_name
              ? `Dr. ${visit.conducted_by_first_name} ${visit.conducted_by_last_name}`
              : 'Non assigné';

            return (
              <div
                key={visit.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {VISIT_TYPE_NAMES[visit.visit_type as keyof typeof VISIT_TYPE_NAMES] || visit.template_name}
                      </h3>
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {visit.scheduled_date ? formatShortDate(visit.scheduled_date) : 'Date non définie'}
                      </p>
                    </div>
                    {getStatusBadge(visit.status)}
                  </div>

                  {/* Doctor */}
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">Médecin:</span> {doctorName}
                  </div>

                  {/* Progress Bar */}
                  {visit.status !== 'cancelled' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                          Progression
                        </span>
                      </div>
                      <ProgressBar 
                        percentage={visit.completionPercentage}
                        size="md"
                      />
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    {getActionButton(visit)}
                  </div>
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
