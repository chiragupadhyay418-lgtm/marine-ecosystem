import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SafetyStatusCard({ riskLevel = 'LOW', recommendation = '' }) {
  const normLevel = (riskLevel || '').toUpperCase();

  const getTheme = () => {
    switch (normLevel) {
      case 'CRITICAL':
      case 'HIGH':
        return {
          bannerBg: 'bg-red-600 border-red-500 text-white shadow-red-900/30',
          badgeBg: 'bg-white/20 text-white border-white/30',
          title: '🔴 DANGER / DO NOT FISH TODAY',
          subtitle: 'High waves and severe weather make offshore fishing unsafe.',
          Icon: AlertOctagon,
        };
      case 'MODERATE':
        return {
          bannerBg: 'bg-amber-600 border-amber-500 text-white shadow-amber-900/30',
          badgeBg: 'bg-white/20 text-white border-white/30',
          title: '⚠️ CAUTION / STAY NEAR SHORE',
          subtitle: 'Gusty winds and choppy waves active. Small boats remain near shore.',
          Icon: AlertTriangle,
        };
      case 'LOW':
      default:
        return {
          bannerBg: 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-900/30',
          badgeBg: 'bg-white/20 text-white border-white/30',
          title: '🟢 SAFE TO FISH TODAY',
          subtitle: 'Calm seas and favorable weather conditions along the coast.',
          Icon: CheckCircle2,
        };
    }
  };

  const theme = getTheme();
  const Icon = theme.Icon;

  return (
    <div className={`p-5 rounded-2xl border ${theme.bannerBg} shadow-xl relative overflow-hidden transition-all duration-200`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${theme.badgeBg}`}>
              Safety Advisory
            </span>
            <h2 className="text-xl md:text-2xl font-black tracking-tight mt-1">{theme.title}</h2>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 pt-3 mt-2">
        <p className="text-sm md:text-base font-semibold leading-relaxed text-white/95">
          "{recommendation}"
        </p>
      </div>

      <div className="mt-3 pt-2 flex items-center justify-between text-[11px] text-white/80 font-medium border-t border-white/10">
        <span>Updated real-time from marine sensors</span>
        <span className="font-bold underline cursor-pointer hover:text-white">Emergency Contacts &rarr;</span>
      </div>
    </div>
  );
}
