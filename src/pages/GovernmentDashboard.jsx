import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import { apiService } from '../services/api';
import { Shield, MapPin, Compass } from 'lucide-react';

export default function GovernmentDashboard() {
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
        setError(err.message || 'Failed to load regions');
      } finally {
        setLoading(false);
      }
    }
    loadRegions();
  }, []);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId);

  return (
    <div className="flex flex-col md:flex-row flex-1">
      {/* Sidebar navigation and station picker */}
      <Sidebar
        regions={regions}
        selectedRegionId={selectedRegionId}
        onSelectRegion={setSelectedRegionId}
      />

      {/* Main command content area */}
      <main className="flex-1 bg-slate-950 p-6 md:p-8 overflow-y-auto">
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1 text-sm">
              <Shield className="h-4 w-4" />
              <span>Government / Advisory Console</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Coastal Intelligence Operations
            </h1>
          </div>
          {selectedRegion && (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-sm text-slate-300">
              <MapPin className="h-4 w-4 text-blue-500" />
              <span>Active Telemetry: <strong>{selectedRegion.location.name}</strong></span>
            </div>
          )}
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
            <span>Loading telemetry stations...</span>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
            Failed to load coastal stations: {error}
          </div>
        ) : selectedRegion ? (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Compass className="h-5 w-5 text-blue-500" />
                Station Overview: {selectedRegion.location.name}
              </h2>
              <p className="text-sm text-slate-400 mb-4">
                Coordinates: {selectedRegion.location.lat}°N, {selectedRegion.location.lon}°E | State: {selectedRegion.location.state}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                  <span className="text-xs text-slate-400 block mb-1">Risk Score</span>
                  <span className="text-2xl font-black text-white">{selectedRegion.risk.score} / 100</span>
                  <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 border border-red-500/30 text-red-400 uppercase font-bold">
                    {selectedRegion.risk.level}
                  </span>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                  <span className="text-xs text-slate-400 block mb-1">Wave Height</span>
                  <span className="text-2xl font-black text-white">{selectedRegion.marine.wave_height} m</span>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80">
                  <span className="text-xs text-slate-400 block mb-1">Wind Speed</span>
                  <span className="text-2xl font-black text-white">{selectedRegion.weather.wind_speed} km/h</span>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-800 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Government Action Recommendation</h3>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  {selectedRegion.recommendation.government}
                </p>
              </div>
            </div>

            <div className="border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500">
              <p className="text-sm font-semibold mb-1">Other Dashboard Components Pending</p>
              <p className="text-xs">Interactive Map, Risk Cards, PFZ Intelligence, and AI Query interface will be added in subsequent phases.</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 py-10">No station selected.</div>
        )}
      </main>
    </div>
  );
}
