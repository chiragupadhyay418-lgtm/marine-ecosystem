import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function CommunityRiskStatus({ riskLevel = 'LOW', lang = 'en' }) {
  const normLevel = (riskLevel || '').toUpperCase();

  const getContent = () => {
    switch (normLevel) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-600 border-red-500 text-white shadow-red-900/30',
          title: lang === 'hi' ? '🔴 अत्यधिक खतरा' : '🔴 CRITICAL RISK',
          statusText: lang === 'hi' ? 'आज समुद्र में बिल्कुल न जाएं।' : 'Do not go offshore today.',
          subText: lang === 'hi' ? 'तूफान और खतरनाक लहरें सक्रिय हैं।' : 'Severe storm surge and extreme swells active.',
          Icon: AlertOctagon,
        };
      case 'HIGH':
        return {
          bg: 'bg-red-600 border-red-500 text-white shadow-red-900/30',
          title: lang === 'hi' ? '🔴 उच्च जोखिम' : '🔴 HIGH RISK',
          statusText: lang === 'hi' ? 'आज मछली पकड़ना अनुशंसित नहीं है।' : 'Fishing is not recommended today.',
          subText: lang === 'hi' ? 'ऊंची लहरें और तेज हवाएं।' : 'High waves and strong winds nearshore.',
          Icon: AlertTriangle,
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-600 border-amber-500 text-white shadow-amber-900/30',
          title: lang === 'hi' ? '⚠️ मध्यम जोखिम' : '⚠️ MODERATE RISK',
          statusText: lang === 'hi' ? 'तट के पास ही रहें और सावधानी बरतें।' : 'Use caution. Remain nearshore.',
          subText: lang === 'hi' ? 'हवा में तेजी और लहरों में उछाल।' : 'Gusty winds and moderate wave action.',
          Icon: ShieldAlert,
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-900/30',
          title: lang === 'hi' ? '🟢 कम जोखिम' : '🟢 LOW RISK',
          statusText: lang === 'hi' ? 'समुद्र की स्थिति सुरक्षित दिख रही है।' : 'Conditions look safe for fishing.',
          subText: lang === 'hi' ? 'शांत समुद्र और अनुकूल मौसम।' : 'Calm seas and favorable weather conditions.',
          Icon: CheckCircle2,
        };
    }
  };

  const content = getContent();
  const Icon = content.Icon;

  return (
    <div className={`p-5 rounded-2xl border ${content.bg} shadow-xl flex flex-col justify-between transition-all duration-200`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-6 text-white" />
          <span className="text-xl md:text-2xl font-black tracking-tight">{content.title}</span>
        </div>
        <span className="text-[10px] bg-white/20 text-white font-extrabold px-2.5 py-1 rounded-full uppercase border border-white/30 tracking-wider">
          {normLevel}
        </span>
      </div>

      <div className="mt-2 border-t border-white/20 pt-3">
        <p className="text-lg md:text-xl font-extrabold leading-snug">{content.statusText}</p>
        <p className="text-xs text-white/90 font-medium mt-1">{content.subText}</p>
      </div>
    </div>
  );
}
