"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientDemographics } from "@/lib/services/patient.service";
import { Users, Calendar } from "lucide-react";

interface DemographicChartsProps {
  demographics: PatientDemographics;
}

export function DemographicCharts({ demographics }: DemographicChartsProps) {
  // Prepare gender data for pie chart
  const genderData = [
    { name: 'Hommes', value: demographics.gender.male, color: '#3B82F6' },
    { name: 'Femmes', value: demographics.gender.female, color: '#EC4899' },
    { name: 'Autre', value: demographics.gender.other, color: '#8B5CF6' },
    { name: 'Non spécifié', value: demographics.gender.unspecified, color: '#94A3B8' },
  ].filter(item => item.value > 0);

  // Prepare age data for bar chart
  const ageData = [
    { name: '0-18', value: demographics.age['0-18'], fill: '#3B82F6' },
    { name: '19-30', value: demographics.age['19-30'], fill: '#06B6D4' },
    { name: '31-50', value: demographics.age['31-50'], fill: '#10B981' },
    { name: '51-70', value: demographics.age['51-70'], fill: '#F59E0B' },
    { name: '70+', value: demographics.age['70+'], fill: '#EF4444' },
  ];

  const totalPatients = genderData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gender Distribution Card */}
      <Card className="border-slate-200 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand" />
            Distribution par sexe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    fontSize: '14px',
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {genderData.map((item, index) => {
              const percentage = totalPatients > 0 ? ((item.value / totalPatients) * 100).toFixed(0) : 0;
              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-600">{item.value} ({percentage}%)</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Age Distribution Card */}
      <Card className="border-slate-200 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand" />
            Distribution par âge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#64748B' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#64748B' }}
                  axisLine={{ stroke: '#E5E7EB' }}
                  label={{ value: 'Nombre de patients', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748B' } }}
                />
                <Tooltip 
                  contentStyle={{ 
                    fontSize: '14px',
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center gap-4 flex-wrap">
            {ageData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm text-slate-700">
                  {item.name}: <span className="font-semibold">{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


