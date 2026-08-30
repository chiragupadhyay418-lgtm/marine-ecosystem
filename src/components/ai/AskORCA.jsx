import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Loader2, AlertCircle, RefreshCw, ShieldAlert, CheckCircle } from 'lucide-react';
import { apiService } from '../../services/api';

const SAMPLE_QUESTIONS = [
  "Is it safe for fishermen near Chennai?",
  "Why is the current risk critical?",
  "Which coastal areas need attention?",
  "Where is the nearest PFZ?"
];

export default function AskORCA({ initialQuery = '', selectedRegionId = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const [responseObj, setResponseObj] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAsk = async (questionToAsk) => {
    const activeQuery = questionToAsk || query;
    if (!activeQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await apiService.askORCA(activeQuery, { region_id: selectedRegionId });
      setResponseObj(res);
    } catch (err) {
      console.error("AskORCA error:", err);
      setError(err.message || 'Unable to reach ORCA intelligence service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleSampleClick = (sample) => {
    setQuery(sample);
    handleAsk(sample);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600/20 text-blue-400 p-2 rounded-lg border border-blue-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Ask ORCA AI Agent</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 font-extrabold px-2 py-0.5 rounded border border-blue-500/30 uppercase">
                LLM Decision Support
              </span>
            </h2>
            <p className="text-xs text-slate-400">Natural language reasoning for coastal hazards & emergency advice</p>
          </div>
        </div>
      </div>

      {/* Suggested Chips */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-slate-400 block">Suggested Queries:</span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map((sample, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSampleClick(sample)}
              className="text-xs bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-all text-left disabled:opacity-50 cursor-pointer"
            >
              "{sample}"
            </button>
          ))}
        </div>
      </div>

      {/* Query Input Box */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={query}
            disabled={loading}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask ORCA anything about wave risk, storm surge, or fishing advisories..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 text-white rounded-xl pl-10 pr-4 py-3 text-sm placeholder-slate-500 outline-none transition-all disabled:opacity-60"
          />
        </div>
        <button
          onClick={() => handleAsk()}
          disabled={loading || !query.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold px-5 py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shrink-0 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Ask</span>
            </>
          )}
        </button>
      </div>

      {/* Loading state indicator */}
      {loading && (
        <div className="p-4 bg-blue-950/20 border border-blue-500/20 text-blue-300 text-xs rounded-xl flex items-center gap-3 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin shrink-0 text-blue-400" />
          <span className="font-medium">ORCA is analyzing current conditions...</span>
        </div>
      )}

      {/* Error state with retry */}
      {error && !loading && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span className="font-medium">{error}</span>
          </div>
          <button
            onClick={() => handleAsk()}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg border border-red-500/30 transition-all text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Structured / Natural Language AI Response UI */}
      {responseObj && !loading && (
        <div className="p-5 bg-slate-950 border border-blue-500/30 rounded-xl space-y-4 animate-fadeIn shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span>ORCA AI Intelligence Advisory</span>
            </div>
            {responseObj.structured?.risk && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Risk: {responseObj.structured.risk}
              </span>
            )}
          </div>

          {/* Structured Output Breakdown if available */}
          {responseObj.structured ? (
            <div className="space-y-3 text-xs md:text-sm">
              {/* Answer */}
              {responseObj.structured.answer && (
                <div className="text-slate-200 leading-relaxed font-normal">
                  {responseObj.structured.answer}
                </div>
              )}

              {/* Reasons / Contributing Factors */}
              {Array.isArray(responseObj.structured.reasons) && responseObj.structured.reasons.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Contributing Factors (WHY):
                  </span>
                  <ul className="space-y-1 text-slate-300 text-xs pl-2">
                    {responseObj.structured.reasons.map((reason, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{typeof reason === 'object' ? `${reason.factor || reason.name}: ${reason.value || reason.raw_value || ''}` : reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendation */}
              {responseObj.structured.recommendation && (
                <div className="mt-3 p-3 bg-blue-950/40 border border-blue-500/30 rounded-lg space-y-1">
                  <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5 text-blue-400" />
                    <span>RECOMMENDATION</span>
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {responseObj.structured.recommendation}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Plain Text Response with natural formatting */
            <div className="text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-normal">
              {responseObj.response}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
