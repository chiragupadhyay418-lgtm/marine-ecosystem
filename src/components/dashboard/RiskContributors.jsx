import React from 'react';
import { BarChart3, HelpCircle } from 'lucide-react';

export default function RiskContributors({ explainability = [] }) {
  const getWeightColor = (weight) => {
    if (weight >= 80) return 'bg-red-500 text-red-400';
    if (weight >= 60) return 'bg-orange-500 text-orange-400';
    if (weight >= 40) return 'bg-yellow-500 text-yellow-400';
    return 'bg-emerald-500 text-emerald-400';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Risk Contributors</h2>
              <p className="text-xs text-slate-400">Explainability breakdown for active risk index</p>
            </div>
          </div>
          <div className="group relative">
            <HelpCircle className="h-4 w-4 text-slate-500 hover:text-slate-300 cursor-pointer" />
            <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-56 p-2 bg-slate-950 border border-slate-800 text-[11px] text-slate-300 rounded-lg shadow-xl z-20">
              Factor weights represent relative contribution to the composite coastal risk index.
            </div>
          </div>
        </div>

        {explainability.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No contributor metrics available.</p>
        ) : (
          <div className="space-y-4">
            {explainability.map((item, index) => {
              const weightColor = getWeightColor(item.weight);
              const [barBg, textColor] = weightColor.split(' ');

              return (
                <div key={index} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-200">{item.factor}</span>
                    <div className="flex items-center gap-2">
                      {item.raw_value && (
                        <span className="text-[11px] text-slate-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800/80">
                          {item.raw_value}
                        </span>
                      )}
                      <span className={`font-bold ${textColor}`}>{item.weight}</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/60 p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                      style={{ width: `${Math.min(item.weight, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between items-center">
        <span>Powered by ORCA AI Risk Attribution Engine</span>
        <span className="text-blue-400 font-medium">Updated live</span>
      </div>
    </div>
  );
}
