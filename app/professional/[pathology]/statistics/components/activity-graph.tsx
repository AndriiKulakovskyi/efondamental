"use client";

import { useState } from "react";

interface ActivityGraphProps {
  data: { date: string; count: number }[];
}

export function ActivityGraph({ data }: ActivityGraphProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Ensure we have exactly 14 days of data
  const graphData = data.length > 0 ? data.slice(-14) : [];
  
  // If we don't have enough data, pad with empty days
  if (graphData.length < 14) {
    const today = new Date();
    const filledData = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const existingData = graphData.find(d => d.date === dateStr);
      filledData.push(existingData || { date: dateStr, count: 0 });
    }
    graphData.length = 0;
    graphData.push(...filledData);
  }

  const maxCount = Math.max(...graphData.map(d => d.count), 1);
  const totalVisits = graphData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative">
        {/* Graph Container - Fixed height with relative positioning */}
        <div className="relative h-64 mb-6">
          {/* Grid Lines - positioned absolutely to cover the chart area */}
          <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none z-0">
            <div className="w-full h-px bg-slate-300 opacity-30"></div>
            <div className="w-full h-px bg-slate-300 opacity-30"></div>
            <div className="w-full h-px bg-slate-300 opacity-30"></div>
            <div className="w-full h-px bg-slate-300 opacity-30"></div>
            <div className="w-full h-px bg-slate-300 opacity-30"></div>
          </div>

          {/* Bars Container - flex layout for bars */}
          <div className="relative h-full flex items-end justify-between gap-1.5 md:gap-2 pb-8 z-10">
            {graphData.map((item, index) => {
              // Calculate height in pixels, normalized to max count
              const barHeight = maxCount > 0 ? Math.round((item.count / maxCount) * 200) : 0;
              const minHeight = item.count > 0 ? 16 : 4;
              const finalHeight = Math.max(barHeight, item.count > 0 ? minHeight : 0);
              
              const isToday = index === graphData.length - 1;
              const date = new Date(item.date);
              const day = date.getDate().toString().padStart(2, '0');

              return (
                <div
                  key={item.date}
                  className="flex-1 flex flex-col items-center min-w-[8px] cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Bar wrapper with fixed height */}
                  <div className="w-full relative" style={{ height: '200px' }}>
                    {/* The actual bar - positioned at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-end">
                      <div
                        className={`w-full rounded-t-md transition-all duration-300 relative ${
                          item.count === 0 
                            ? 'bg-slate-100' 
                            : hoveredIndex === index 
                              ? 'bg-brand shadow-lg shadow-brand/30' 
                              : 'bg-brand'
                        }`}
                        style={{ 
                          height: `${finalHeight}px`
                        }}
                      >
                        {/* Tooltip on Hover */}
                        {hoveredIndex === index && (
                          <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1.5 px-2.5 rounded whitespace-nowrap z-30 shadow-xl">
                            <div className="font-bold">{item.count} visite{item.count !== 1 ? 's' : ''}</div>
                            <div className="text-[9px] opacity-80 mt-0.5">
                              {new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </div>
                          </div>
                        )}
                        
                        {/* Show count above bar for non-zero values when not hovering */}
                        {item.count > 0 && hoveredIndex !== index && (
                          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-slate-600">
                            {item.count}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Day Label */}
                  <div className={`text-[10px] text-center mt-2 transition-colors ${
                    isToday 
                      ? 'text-brand font-bold' 
                      : hoveredIndex === index 
                        ? 'text-slate-900 font-medium' 
                        : 'text-slate-400'
                  }`}>
                    {isToday ? 'Today' : day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="flex items-center justify-center gap-6 text-sm flex-wrap pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-brand"></div>
            <span className="text-slate-600">
              Total: <span className="font-bold text-slate-900">{totalVisits}</span> visites
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-brand"></div>
            <span className="text-slate-600">
              Moyenne: <span className="font-bold text-slate-900">{(totalVisits / 14).toFixed(1)}</span> par jour
            </span>
          </div>
          {maxCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-slate-600">
                Maximum: <span className="font-bold text-brand">{maxCount}</span> visites/jour
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

