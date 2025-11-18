"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertTriangle, Pill, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsSummaryProps {
  moodTrend: any[];
  riskHistory: any[];
  adherenceTrend: any[];
  currentRiskLevel: string;
}

export function AnalyticsSummary({ 
  moodTrend, 
  riskHistory, 
  adherenceTrend,
  currentRiskLevel 
}: AnalyticsSummaryProps) {
  // Calculate trends
  const calculateTrend = (data: any[], key: string) => {
    if (data.length < 2) return { value: 0, direction: 'stable' };
    const latest = data[data.length - 1][key];
    const previous = data[data.length - 2][key];
    const change = latest - previous;
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  };

  const moodChange = calculateTrend(moodTrend, 'mood_score');
  const adherenceChange = calculateTrend(adherenceTrend, 'adherence');

  const latestMood = moodTrend.length > 0 ? moodTrend[moodTrend.length - 1].mood_score : null;
  const latestAdherence = adherenceTrend.length > 0 ? adherenceTrend[adherenceTrend.length - 1].adherence : null;

  const getTrendIcon = (direction: string, isPositive: boolean) => {
    if (direction === 'up') return isPositive ? TrendingUp : TrendingUp;
    if (direction === 'down') return isPositive ? TrendingDown : TrendingDown;
    return Minus;
  };

  const getTrendColor = (direction: string, isPositive: boolean) => {
    if (direction === 'stable') return 'text-slate-500';
    const isGoodChange = (direction === 'up' && isPositive) || (direction === 'down' && !isPositive);
    return isGoodChange ? 'text-green-600' : 'text-red-600';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'text-red-600';
      case 'Moderate':
        return 'text-amber-600';
      case 'Low':
        return 'text-blue-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            Latest Mood Score
          </CardTitle>
          <Activity className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-slate-900">
              {latestMood !== null ? `${latestMood}/10` : 'N/A'}
            </div>
            {moodChange.direction !== 'stable' && latestMood !== null && (
              <div className={cn("flex items-center gap-1 text-sm font-medium", getTrendColor(moodChange.direction, true))}>
                {moodChange.direction === 'up' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{moodChange.value.toFixed(1)}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {moodTrend.length > 0 ? 'From last evaluation' : 'No data available'}
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            Current Risk Level
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className={cn("text-3xl font-bold", getRiskColor(currentRiskLevel))}>
            {currentRiskLevel}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Based on recent assessments
          </p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            Medication Adherence
          </CardTitle>
          <Pill className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-slate-900">
              {latestAdherence !== null ? `${latestAdherence}%` : 'N/A'}
            </div>
            {adherenceChange.direction !== 'stable' && latestAdherence !== null && (
              <div className={cn("flex items-center gap-1 text-sm font-medium", getTrendColor(adherenceChange.direction, true))}>
                {adherenceChange.direction === 'up' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{adherenceChange.value.toFixed(0)}%</span>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {adherenceTrend.length > 0 ? 'Latest reported adherence' : 'No data available'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

