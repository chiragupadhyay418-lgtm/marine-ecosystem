import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Loader2, Bot, AlertCircle, RefreshCw } from 'lucide-react';
import { apiService } from '../../services/api';

const FISHERMAN_QUESTIONS = [
  "Is it safe to go deep-sea fishing today?",
  "When will wave heights decrease near Chennai?",
  "Where is the nearest safe fishing spot?"
];

export default function FishermanAIQuery({ selectedRegionId = '' }) {
  const [query, setQuery] = useState('');
  const [responseObj, setResponseObj] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAsk = async (questionText) => {
    const activeQuery = questionText || query;
    if (!activeQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await apiService.askORCA(activeQuery, { region_id: selectedRegionId });
      setResponseObj(res);
    } catch (err) {
      console.error("FishermanAIQuery error:", err);
      setError(err.message || "Unable to reach ORCA intelligence service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
        <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
          <Bot className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Ask ORCA Ocean Assistant</h3>
          <p className="text-[11px] text-slate-400">Ask simple safety questions in plain language</p>
        </div>
      </div>

      {/* Tappable Chip Suggestions */}
      <div className="space-y-1">
        <span className="text-[11px] font-semibold text-slate-400 block">Tap a question:</span>
        <div className="flex flex-col gap-1.5">
          {FISHERMAN_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => {
                setQuery(q);
                handleAsk(q);
              }}
              className="text-xs bg-slate-950 hover:bg-slate-800 border border-slate-800 text-teal-300 px-3 py-2 rounded-xl text-left font-medium transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              💬 "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="flex gap-2 pt-1">
        <input
          type="text"
          value={query}
          disabled={loading}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs placeholder-slate-500 outline-none focus:border-teal-500 transition-all disabled:opacity-60"
        />
        <button
          onClick={() => handleAsk()}
          disabled={loading || !query.trim()}
          className="bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 text-white font-bold px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-1 shrink-0 cursor-pointer"
        >
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="p-2.5 bg-teal-950/30 border border-teal-500/20 text-teal-300 text-xs rounded-xl flex items-center gap-2 animate-pulse">
          <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0 text-teal-400" />
          <span>ORCA is analyzing current conditions...</span>
        </div>
      )}

      {/* Error state with retry */}
      {error && !loading && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => handleAsk()}
            className="text-red-300 hover:text-red-200 underline font-semibold text-[11px] shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Response Box */}
      {responseObj && !loading && (
        <div className="p-3 bg-slate-950 border border-teal-500/30 rounded-xl space-y-1.5 animate-fadeIn">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> ORCA Advice:
          </span>
          {responseObj.structured?.recommendation ? (
            <div className="space-y-1 text-xs">
              <p className="text-slate-200 font-medium">{responseObj.structured.answer}</p>
              <div className="p-2 bg-teal-950/40 rounded border border-teal-500/20 text-teal-200 text-[11px]">
                <strong>Advice:</strong> {responseObj.structured.recommendation}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-200 leading-relaxed font-medium whitespace-pre-line">
              {responseObj.response}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
