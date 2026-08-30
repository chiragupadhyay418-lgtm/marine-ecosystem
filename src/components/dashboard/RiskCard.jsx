import React from 'react';
import { TrendingUp, TrendingDown, Minus, ShieldAlert } from 'lucide-react';
import RiskBadge, { getRiskConfig } from '../common/RiskBadge';

export default function RiskCard({ risk }) {
  if (!risk) return null;

  const { score = 0, level = 'LOW', trend = 'stable', change_percent = 0 } = risk;
  const config = getRiskConfig(level);

  const renderTrend = () => {
    if (trend === 'up') {
      return (
        <span className="flex items-center gap-1 text-xs font-semibold text-red-400">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>↑ {change_percent}% from previous period</span>
        </span>
      );
    }
    if (trend === 'down') {
      return (
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
          <TrendingDown className="h-3.5 w-3.5" />
          <span>↓ {change_percent}% from previous period</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
        <Minus className="h-3.5 w-3.5" />
        <span>No significant change</span>
      </span>
    );
  };

  return (
    <div
      className={`bg-slate-900 border ${config.cardBorder} rounded-xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between group transition-all duration-200 hover:border-opacity-100`}
    >
      {/* Background Accent Blur */}
      <div
        className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-20 ${config.progressBg}`}
      ></div>

      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className={`h-4 w-4 ${config.textAccent}`} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Coastal Risk Index
            </span>
          </div>
          <RiskBadge level={level} size="sm" />
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl md:text-4xl font-black tracking-tight text-white">
            {score}
          </span>
          <span className="text-sm font-semibold text-slate-500">/ 100</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
        {renderTrend()}
      </div>
    </div>
  );
}
