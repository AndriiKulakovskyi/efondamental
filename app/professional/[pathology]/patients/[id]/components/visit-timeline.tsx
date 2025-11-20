import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatShortDate, formatDateTime } from "@/lib/utils/date";
import { ChevronDown, Clock, CheckCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { VISIT_TYPE_NAMES, VisitType } from "@/lib/types/enums";

interface VisitTimelineProps {
  visits: any[];
  pathology: string;
  patientId: string;
}

export function VisitTimeline({ visits, pathology, patientId }: VisitTimelineProps) {
  const [expandedVisitId, setExpandedVisitId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'completed' | 'scheduled' | 'upcoming'>('all');

  const filteredVisits = visits.filter(visit => {
    if (filter === 'all') return true;
    if (filter === 'completed') return visit.status === 'completed';
    if (filter === 'scheduled') return visit.status === 'scheduled';
    if (filter === 'upcoming') return visit.status === 'scheduled' || visit.status === 'in_progress';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'scheduled':
        return <Calendar className="h-4 w-4 text-slate-600" />;
      default:
        return <Calendar className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Toutes ({visits.length})
          </Button>
          <Button
            size="sm"
            variant={filter === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilter('completed')}
          >
            Terminées ({visits.filter(v => v.status === 'completed').length})
          </Button>
          <Button
            size="sm"
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setFilter('upcoming')}
          >
            À venir ({visits.filter(v => v.status === 'scheduled' || v.status === 'in_progress').length})
          </Button>
        </div>
        <Link href={`/professional/${pathology}/patients/${patientId}/visits/new`}>
          <Button size="sm">Planifier une visite</Button>
        </Link>
      </div>

      {filteredVisits.length > 0 ? (
        <div className="relative space-y-4">
          {/* Timeline line */}
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200" />
          
          {filteredVisits.map((visit, index) => {
            const isExpanded = expandedVisitId === visit.id;
            
            return (
              <div key={visit.id} className="relative pl-14">
                {/* Timeline dot */}
                <div className={cn(
                  "absolute left-0 w-12 h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center",
                  visit.status === 'completed' ? 'bg-green-500' : 
                  visit.status === 'in_progress' ? 'bg-blue-500' : 
                  'bg-slate-300'
                )}>
                  {getStatusIcon(visit.status)}
                </div>

                <Card 
                  className={cn(
                    "transition-all duration-300 hover:shadow-lg cursor-pointer",
                    isExpanded && "shadow-lg border-slate-700"
                  )}
                  onClick={() => setExpandedVisitId(isExpanded ? null : visit.id)}
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg text-slate-900">
                            {visit.template_name}
                          </h4>
                          <span className={cn(
                            "text-xs px-2.5 py-1 rounded-full border font-medium",
                            getStatusColor(visit.status)
                          )}>
                            {visit.status === 'in_progress' ? 'En cours' : 
                             visit.status === 'completed' ? 'Terminée' :
                             visit.status === 'scheduled' ? 'Planifiée' :
                             visit.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {visit.scheduled_date && formatShortDate(visit.scheduled_date)}
                          </span>
                          <span className="capitalize">
                            {visit.visit_type && VISIT_TYPE_NAMES[visit.visit_type as VisitType]}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/professional/${pathology}/patients/${patientId}/visits/${visit.id}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button size="sm" variant="outline">
                            Voir détails
                          </Button>
                        </Link>
                        <ChevronDown 
                          className={cn(
                            "h-5 w-5 text-slate-500 transition-transform duration-300",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </div>
                    </div>

                    {/* Expanded content */}
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300",
                        isExpanded ? "max-h-96 mt-4 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="border-t border-slate-200 pt-4 space-y-3">
                        {visit.notes && (
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                              Notes
                            </p>
                            <p className="text-sm text-slate-700">{visit.notes}</p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-3">
                          {visit.created_at && (
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                                Créé le
                              </p>
                              <p className="text-sm text-slate-900">{formatDateTime(visit.created_at)}</p>
                            </div>
                          )}
                          {visit.completed_at && (
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                                Terminé le
                              </p>
                              <p className="text-sm text-slate-900">{formatDateTime(visit.completed_at)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600">Aucune visite trouvée pour ce filtre</p>
          <Link href={`/professional/${pathology}/patients/${patientId}/visits/new`}>
            <Button className="mt-4" size="sm">
              Planifier la première visite
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

