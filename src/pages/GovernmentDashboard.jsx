import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/layout/Sidebar';
import RiskCard from '../components/dashboard/RiskCard';
import WeatherCard from '../components/dashboard/WeatherCard';
import MarineCard from '../components/dashboard/MarineCard';
import AlertCard from '../components/dashboard/AlertCard';
import AlertFeed from '../components/dashboard/AlertFeed';
import RiskContributors from '../components/dashboard/RiskContributors';
import PFZCard from '../components/dashboard/PFZCard';
import RiskMap from '../components/map/RiskMap';
import AskORCA from '../components/ai/AskORCA';
import { apiService, USE_MOCK_DATA } from '../services/api';
import { Shield, MapPin, Clock, AlertTriangle, ArrowRight, RefreshCw, Activity } from 'lucide-react';

export default function GovernmentDashboard() {
  const [regions, setRegions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [restrictedZones, setRestrictedZones] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [regionData, alertData, restrictedData] = await Promise.all([
        apiService.getRegions(),
        apiService.getAlerts(),
        apiService.getRestrictedZones(),
      ]);

      setRegions(regionData);
      setAlerts(alertData);
      setRestrictedZones(restrictedData);

      if (regionData.length > 0 && (!selectedRegionId || !regionData.some((r) => r.id === selectedRegionId))) {
        setSelectedRegionId(regionData[0].id);
      }

      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastUpdated(now);
    } catch (err) {
      console.error("GovernmentDashboard load error:", err);
      setError(err.message || 'Failed to load telemetry data from ORCA backend.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedRegionId]);

  useEffect(() => {
    loadData(false);
  }, []);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  const handleAlertSelect = (alert) => {
    const match = regions.find((r) => alert.location.toLowerCase().includes(r.location.name.toLowerCase()));
    if (match) {
      setSelectedRegionId(match.id);
    }
  };

  return (
    <div className="flex flex-col md:flex-row flex-1">
      {/* Persistent Sidebar Navigation */}
      <Sidebar
        regions={regions}
        selectedRegionId={selectedRegionId}
        onSelectRegion={setSelectedRegionId}
      />

      {/* Main Content Command Center */}
      <main className="flex-1 bg-slate-950 p-4 md:p-8 overflow-y-auto space-y-6">
        
        {/* Top Header & Station Selector */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1 text-xs uppercase tracking-wider">
              <Shield className="h-4 w-4" />
              <span>Government Coastal Command Console</span>
              <span className={`ml-2 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${USE_MOCK_DATA ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                {USE_MOCK_DATA ? 'MOCK MODE' : 'LIVE FASTAPI'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Coastal Risk Overview
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Real-time environmental, marine, and disaster intelligence</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Station Dropdown Selector */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-sm">
              <MapPin className="h-4 w-4 text-blue-400 shrink-0" />
              <label htmlFor="station-select" className="text-xs text-slate-400 font-semibold">Station:</label>
              <select
                id="station-select"
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
                className="bg-transparent text-white font-bold text-sm outline-none cursor-pointer"
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                    {r.location.name} ({r.risk?.level || 'N/A'})
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Data Button */}
            <button
              onClick={() => loadData(true)}
              disabled={refreshing || loading}
              className="flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 px-3 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>

            {/* Last Updated Badge */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs text-slate-400 font-medium">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              <span>Updated: <strong>{lastUpdated || 'Just now'}</strong></span>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            <span className="text-sm font-semibold">Loading coastal intelligence...</span>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-xl space-y-3">
            <div className="flex items-center gap-2 font-bold text-base">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />
              <span>Telemetry Loading Error</span>
            </div>
            <p className="text-sm text-red-300 leading-relaxed">{error}</p>
            <button
              onClick={() => loadData(false)}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry Connecting</span>
            </button>
          </div>
        ) : selectedRegion ? (
          <div className="space-y-6">

            {/* SECTION 1: 4 KPI OVERVIEW CARDS */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <RiskCard risk={selectedRegion.risk} />
              <WeatherCard weather={selectedRegion.weather} />
              <MarineCard marine={selectedRegion.marine} />
              <AlertCard alerts={alerts} />
            </section>

            {/* SECTION 2: MAP & ALERTS GRID */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Interactive Map (7 cols) */}
              <div className="lg:col-span-7 min-h-[440px]">
                <RiskMap
                  regions={regions}
                  alerts={alerts}
                  restrictedZones={restrictedZones}
                  selectedRegionId={selectedRegionId}
                  onSelectRegion={setSelectedRegionId}
                />
              </div>

              {/* Active Alerts Feed (5 cols) */}
              <div className="lg:col-span-5 min-h-[440px]">
                <AlertFeed
                  alerts={alerts}
                  onSelectAlert={handleAlertSelect}
                />
              </div>
            </section>

            {/* SECTION 3: EXPLAINABILITY & PFZ INTELLIGENCE */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RiskContributors explainability={selectedRegion.explainability} />
              <PFZCard
                pfz={selectedRegion.pfz}
                marine={selectedRegion.marine}
                riskLevel={selectedRegion.risk?.level}
              />
            </section>

            {/* SECTION 4: GOVERNMENT ACTION RECOMMENDATION BANNER */}
            <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-blue-500/30 rounded-xl p-5 shadow-lg">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-3xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Recommended Decision Protocol
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Auto-generated advisory</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">Government Decision Support Advisory</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedRegion.recommendation?.government}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById('ask-orca');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shrink-0 shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <span>Query AI Advisory</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </section>

            {/* SECTION 5: ASK ORCA AI INTERFACE */}
            <section id="ask-orca">
              <AskORCA selectedRegionId={selectedRegionId} />
            </section>

          </div>
        ) : null}
      </main>
    </div>
  );
}
