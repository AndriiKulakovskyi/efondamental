"use client";

import { useState } from "react";
import { Users, Calendar, CheckCircle, TrendingUp, PieChart as PieChartIcon, TrendingUp as ActivityIcon } from "lucide-react";
import { PatientDemographics } from "@/lib/services/patient.service";
import { DemographicCharts } from "./components/demographic-charts";
import { ActivityGraph } from "./components/activity-graph";

interface StatisticsClientProps {
  pathologyName: string;
  professionalStats: any;
  visitTypeStats: any[];
  centerStats: any;
  demographics: PatientDemographics;
  dailyActivity: { date: string; count: number }[];
}

type DatePeriod = 'month' | 'quarter' | 'year';

export function StatisticsClient({
  pathologyName,
  professionalStats,
  visitTypeStats,
  centerStats,
  demographics,
  dailyActivity,
}: StatisticsClientProps) {
  const [period, setPeriod] = useState<DatePeriod>('month');

  const periodLabels = {
    month: 'Ce mois',
    quarter: 'Trimestre',
    year: 'Année',
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Statistiques Cliniques</h2>
          <p className="text-slate-500 mt-1">Vue d'ensemble de vos performances et de l'activité du centre.</p>
        </div>
        
        {/* Date Filter */}
        <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
          {(['month', 'quarter', 'year'] as DatePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-bold rounded shadow-sm transition ${
                period === p
                  ? 'text-white bg-slate-900'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Patients */}
          <div className="group bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide group-hover:text-blue-600 transition">
                Total Patients
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{professionalStats.totalPatients}</p>
              <span className="text-[10px] text-slate-400">Suivi actif</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Visits This Month */}
          <div className="group bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-brand transition-all cursor-pointer">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide group-hover:text-brand transition">
                Visites (Mois)
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{professionalStats.visitsThisMonth}</p>
              <span className="text-[10px] text-slate-400">{professionalStats.completedVisitsThisMonth} complétées</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          {/* Completion Rate */}
          <div className="group bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide group-hover:text-emerald-600 transition">
                Taux de Complétion
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{professionalStats.visitCompletionRate}%</p>
              <span className="text-[10px] text-slate-400">Moyenne</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          {/* Active This Month */}
          <div className="group bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md hover:border-orange-300 transition-all cursor-pointer">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide group-hover:text-orange-600 transition">
                Actifs (Mois)
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{professionalStats.activePatientsThisMonth}</p>
              <span className="text-[10px] text-slate-400">Patient{professionalStats.activePatientsThisMonth !== 1 ? 's' : ''} vu{professionalStats.activePatientsThisMonth !== 1 ? 's' : ''}</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Activity Graph */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <ActivityIcon className="w-5 h-5 text-slate-400" />
            Activité des Visites (14 jours)
          </h3>
          <p className="text-sm text-slate-500">
            Suivez votre activité quotidienne sur les deux dernières semaines. Chaque barre représente le nombre de visites planifiées pour ce jour.
          </p>
        </div>
        <ActivityGraph data={dailyActivity} />
      </section>

      {/* Visit Type Breakdown */}
      <section className="max-w-4xl mx-auto w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
            <PieChartIcon className="w-5 h-5 text-brand" />
            Répartition des Visites
          </h3>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Visualisez la progression de vos visites par type. Les barres de progression indiquent le taux de complétion pour chaque catégorie de visite.
          </p>
        </div>
        
        <div className="space-y-8">
          {visitTypeStats.length > 0 ? (
            visitTypeStats.map((stat) => {
              const completionPercentage = stat.count > 0 ? (stat.completedCount / stat.count) * 100 : 0;
              const getBarColor = () => {
                if (completionPercentage === 0) return 'bg-slate-300';
                if (completionPercentage < 50) return 'bg-brand';
                return 'bg-emerald-500';
              };

              return (
                <div key={stat.visitType}>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{stat.visitTypeName}</h4>
                      <p className="text-sm text-slate-400">
                        {stat.completedCount} of {stat.count} completed
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-slate-900">{stat.count}</span>
                      <span className="text-xs text-slate-400 block uppercase font-medium">Total</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getBarColor()} rounded-full transition-all duration-500`}
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-slate-500">
              Aucune visite ce mois
            </div>
          )}
        </div>
      </section>

      {/* Demographics */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Données Démographiques des Patients</h3>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto">
            Analyse démographique de votre patientèle pour mieux comprendre la composition de vos patients par sexe et par tranche d'âge.
          </p>
        </div>
        <DemographicCharts demographics={demographics} />
      </section>

      <div className="h-10"></div>
    </div>
  );
}

