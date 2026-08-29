import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Users, AlertOctagon, CheckCircle, HelpCircle, Navigation } from 'lucide-react';

export default function CommunityDashboard() {
  const [regions, setRegions] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRegions() {
      try {
        setLoading(true);
        const data = await apiService.getRegions();
        setRegions(data);
        if (data.length > 0) {
          setSelectedRegionId(data[0].id);
        }
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadRegions();
  }, []);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId);

  const getSafetyTheme = (level) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return {
          bannerBg: 'bg-red-600 border-red-500 text-white',
          statusText: '🔴 DANGER / NO FISHING',
          badgeBg: 'bg-red-500/20 text-red-400 border-red-500/30'
        };
      case 'MODERATE':
        return {
          bannerBg: 'bg-yellow-600 border-yellow-500 text-white',
          statusText: '⚠️ CAUTION ADVISED',
          badgeBg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
        };
      case 'LOW':
        return {
          bannerBg: 'bg-emerald-600 border-emerald-500 text-white',
          statusText: '🟢 SAFE TO FISH',
          badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        };
      default:
        return {
          bannerBg: 'bg-slate-700 border-slate-600 text-white',
          statusText: 'UNKNOWN RISK',
          badgeBg: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
        };
    }
  };

  return (
    <main className="flex-1 bg-slate-950 px-4 py-6 flex justify-center items-start overflow-y-auto">
      {/* Mobile Frame Container (Simulated mobile-first display on larger screens) */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-5">
        
        {/* Header */}
        <header className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-teal-400" />
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Community Safety</span>
          </div>
          <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold px-2 py-0.5 rounded-full">
            Fisherman Mode
          </span>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mb-3"></div>
            <p className="text-sm">Fetching ocean conditions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-sm">
            Failed to connect: {error}
          </div>
        ) : selectedRegion ? (
          (() => {
            const theme = getSafetyTheme(selectedRegion.risk.level);
            return (
              <div className="space-y-5">
                {/* Location Select Dropdown */}
                <div className="space-y-1">
                  <label htmlFor="location-select" className="text-xs text-slate-400 font-semibold block flex items-center gap-1">
                    <Navigation className="h-3 w-3 text-teal-400" /> Choose Location
                  </label>
                  <select
                    id="location-select"
                    value={selectedRegionId}
                    onChange={(e) => setSelectedRegionId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:border-teal-500 transition-all"
                  >
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.location.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Big Recommendation Banner */}
                <div className={`p-4 rounded-2xl border text-center ${theme.bannerBg} shadow-lg shadow-black/20`}>
                  <p className="text-xs font-bold uppercase tracking-wider opacity-85 mb-1">Safety Status</p>
                  <p className="text-xl font-black tracking-wide mb-2">{theme.statusText}</p>
                  <div className="h-[1px] bg-white/20 my-2"></div>
                  <p className="text-sm font-semibold leading-relaxed">
                    {selectedRegion.recommendation.community}
                  </p>
                </div>

                {/* Weather & Marine Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl text-center">
                    <span className="text-xs text-slate-400 block mb-1">Waves</span>
                    <span className="text-xl font-extrabold text-white">{selectedRegion.marine.wave_height} m</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl text-center">
                    <span className="text-xs text-slate-400 block mb-1">Wind Speed</span>
                    <span className="text-xl font-extrabold text-white">{selectedRegion.weather.wind_speed} km/h</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl text-center">
                    <span className="text-xs text-slate-400 block mb-1">Rain Chance</span>
                    <span className="text-xl font-extrabold text-white">{selectedRegion.weather.rainfall > 50 ? 'High' : 'Low'}</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800/80 p-3.5 rounded-xl text-center">
                    <span className="text-xs text-slate-400 block mb-1">Fishing Zone</span>
                    <span className="text-xl font-extrabold text-white">{selectedRegion.pfz.distance_km} km</span>
                  </div>
                </div>

                {/* Info Text */}
                <div className="text-center text-slate-500 text-[11px] pt-2">
                  <p>Swipe or switch locations above to check local warnings.</p>
                  <p className="mt-1">ORCA Coast Community App v1.0</p>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="text-center text-slate-400 py-10">No location data.</div>
        )}
      </div>
    </main>
  );
}
