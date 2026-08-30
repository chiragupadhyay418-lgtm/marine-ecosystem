import React from 'react';
import { ShieldAlert, Volume2, AlertCircle } from 'lucide-react';

export default function SafetyRecommendation({ recommendation = '', lang = 'en', onReadAloud }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg relative overflow-hidden">
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            {lang === 'hi' ? '⚠️ आपको क्या करना चाहिए' : '⚠️ WHAT YOU SHOULD DO'}
          </h3>
        </div>

        {/* 1-Tap Read Aloud Trigger */}
        <button
          onClick={onReadAloud}
          className="flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-extrabold px-2.5 py-1 rounded-xl transition-all active:scale-95"
        >
          <Volume2 className="h-3.5 w-3.5" />
          <span>{lang === 'hi' ? 'सुनें' : 'Read Aloud'}</span>
        </button>
      </div>

      {/* Main Advisory Content */}
      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
        <p className="text-sm font-bold text-amber-400 leading-snug">
          {lang === 'hi' ? 'मछुआरा सुरक्षा सलाह:' : 'Actionable Coastal Advisory:'}
        </p>
        <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-semibold">
          "{recommendation || (lang === 'hi' ? 'कृपया स्थानीय बंदरगाह निर्देशों का पालन करें।' : 'Please follow local port and harbor control advisories.')}"
        </p>
      </div>
    </div>
  );
}
