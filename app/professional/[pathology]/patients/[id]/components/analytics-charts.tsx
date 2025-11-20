"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MoodTrendData, 
  RiskHistoryData, 
  AdherenceTrendData 
} from "@/lib/services/evaluation.service";
import { formatShortDate } from "@/lib/utils/date";

interface AnalyticsChartsProps {
  moodTrend: MoodTrendData[];
  riskHistory: RiskHistoryData[];
  adherenceTrend: AdherenceTrendData[];
}

export function AnalyticsCharts({
  moodTrend,
  riskHistory,
  adherenceTrend,
}: AnalyticsChartsProps) {
  const riskLevelToNumber = (level: string) => {
    const map: Record<string, number> = {
      'none': 0,
      'low': 1,
      'moderate': 2,
      'high': 3,
    };
    return map[level] || 0;
  };

  const numberToRiskLevel = (num: number) => {
    const map: Record<number, string> = {
      0: 'Aucun',
      1: 'Faible',
      2: 'Modéré',
      3: 'Élevé',
    };
    return map[num] || 'Aucun';
  };

  return (
    <div className="space-y-6">
      {/* Mood Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution de l'humeur</CardTitle>
        </CardHeader>
        <CardContent>
          {moodTrend.length > 0 ? (
            <div className="space-y-4">
              <div className="h-64 flex items-end justify-between gap-2">
                {moodTrend.map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="w-full bg-slate-200 rounded-t relative" style={{ height: '100%' }}>
                      <div
                        className="w-full bg-blue-500 rounded-t absolute bottom-0"
                        style={{ height: `${(data.mood_score / 10) * 100}%` }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold">
                          {data.mood_score}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 mt-2 text-center">
                      {formatShortDate(data.date)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Échelle: 0 (pire) - 10 (meilleur)</span>
                <span>{moodTrend.length} points de données</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Aucune donnée d'humeur disponible
            </div>
          )}
        </CardContent>
      </Card>

      {/* Risk History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Historique d'évaluation des risques</CardTitle>
        </CardHeader>
        <CardContent>
          {riskHistory.length > 0 ? (
            <div className="space-y-6">
              {/* Suicide Risk */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Risque de Suicide</h4>
                <div className="h-32 flex items-end justify-between gap-2">
                  {riskHistory.map((data, index) => {
                    const level = riskLevelToNumber(data.suicide_risk);
                    const colors = ['bg-slate-200', 'bg-blue-400', 'bg-amber-400', 'bg-red-500'];
                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div className="w-full bg-slate-100 rounded-t relative h-full">
                          <div
                            className={`w-full rounded-t absolute bottom-0 ${colors[level]}`}
                            style={{ height: `${(level / 3) * 100}%` }}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold">
                              {numberToRiskLevel(level)}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-600 mt-2 text-center">
                          {formatShortDate(data.date)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Relapse Risk */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Risque de Rechute</h4>
                <div className="h-32 flex items-end justify-between gap-2">
                  {riskHistory.map((data, index) => {
                    const level = riskLevelToNumber(data.relapse_risk);
                    const colors = ['bg-slate-200', 'bg-blue-400', 'bg-amber-400', 'bg-red-500'];
                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div className="w-full bg-slate-100 rounded-t relative h-full">
                          <div
                            className={`w-full rounded-t absolute bottom-0 ${colors[level]}`}
                            style={{ height: `${(level / 3) * 100}%` }}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold">
                              {numberToRiskLevel(level)}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-600 mt-2 text-center">
                          {formatShortDate(data.date)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-slate-200"></div>
                  <span>Aucun</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-400"></div>
                  <span>Faible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-400"></div>
                  <span>Modéré</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500"></div>
                  <span>Élevé</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Aucune donnée d'évaluation des risques disponible
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medication Adherence */}
      <Card>
        <CardHeader>
          <CardTitle>Adhésion médicamenteuse</CardTitle>
        </CardHeader>
        <CardContent>
          {adherenceTrend.length > 0 ? (
            <div className="space-y-4">
              <div className="h-64 flex items-end justify-between gap-2">
                {adherenceTrend.map((data, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div className="w-full bg-slate-200 rounded-t relative" style={{ height: '100%' }}>
                      <div
                        className={`w-full rounded-t absolute bottom-0 ${
                          data.adherence >= 80
                            ? 'bg-green-500'
                            : data.adherence >= 50
                            ? 'bg-amber-400'
                            : 'bg-red-500'
                        }`}
                        style={{ height: `${data.adherence}%` }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold">
                          {data.adherence}%
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 mt-2 text-center">
                      {formatShortDate(data.date)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500"></div>
                    <span>Bonne (80%+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-amber-400"></div>
                    <span>Moyenne (50-79%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-red-500"></div>
                    <span>Faible (&lt;50%)</span>
                  </div>
                </div>
                <span className="text-slate-500">{adherenceTrend.length} points de données</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Aucune donnée d'adhésion disponible
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

