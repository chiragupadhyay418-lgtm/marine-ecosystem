import React, { useState, useEffect, useCallback } from 'react';
import CommunityHeader from '../components/community/CommunityHeader';
import CommunityRiskStatus from '../components/community/CommunityRiskStatus';
import ConditionsCard from '../components/community/ConditionsCard';
import CommunityPFZCard from '../components/community/CommunityPFZCard';
import SafetyRecommendation from '../components/community/SafetyRecommendation';
import CommunityAlert from '../components/community/CommunityAlert';
import CommunityMap from '../components/community/CommunityMap';
import EmergencyContactDrawer from '../components/community/EmergencyContactDrawer';
import FishermanAIQuery from '../components/community/FishermanAIQuery';
import { apiService } from '../services/api';
import { ShieldCheck, RefreshCw } from 'lucide-react';

export default function CommunityDashboard() {
  const [regions, setRegions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [lang, setLang] = useState('en'); // 'en' | 'hi'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [regionData, alertData] = await Promise.all([
        apiService.getRegions(),
        apiService.getAlerts(),
      ]);
      setRegions(regionData);
      setAlerts(alertData);
      if (regionData.length > 0 && (!selectedRegionId || !regionData.some((r) => r.id === selectedRegionId))) {
        setSelectedRegionId(regionData[0].id);
      }
    } catch (err) {
      console.error("CommunityDashboard load error:", err);
      setError(err.message || 'Failed to load coastal telemetry');
    } finally {
      setLoading(false);
    }
  }, [selectedRegionId]);

  useEffect(() => {
    loadData();
  }, []);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  // Filter alerts relevant to selected location
  const stationAlerts = selectedRegion
    ? alerts.filter((a) => a.location?.toLowerCase().includes(selectedRegion.location?.name?.toLowerCase()))
    : alerts;

  // Text-to-speech Audio Read Aloud handler using Web Speech API
  const handleReadAloud = () => {
    if (!selectedRegion || !('speechSynthesis' in window)) {
      alert("Audio Read Aloud is not supported on this browser.");
      return;
    }

    window.speechSynthesis.cancel(); // Stop ongoing speech

    const recommendationText = selectedRegion.recommendation?.community || "No active recommendation.";
    const textToSpeak = lang === 'hi'
      ? `स्थान ${selectedRegion.location?.name}। जोखिम स्तर ${selectedRegion.risk?.level}। सलाह: ${recommendationText}`
      : `Station ${selectedRegion.location?.name}. Risk level ${selectedRegion.risk?.level}. Safety advice: ${recommendationText}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    if (lang === 'hi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-US';

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  return (
    <main className="flex-1 bg-slate-950 px-3 py-6 flex justify-center items-start overflow-y-auto min-h-[calc(100vh-70px)]">
      {/* Mobile-First Frame Container (Centered preview on desktop, fills mobile viewports) */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-4 md:p-6 shadow-2xl space-y-5 my-auto">
        
        {/* 1. TOP HEADER & STATION SWITCHER & LANGUAGE TOGGLE */}
        <CommunityHeader
          regions={regions}
          selectedRegionId={selectedRegionId}
          onSelectRegion={setSelectedRegionId}
          lang={lang}
          onToggleLang={handleToggleLang}
          onReadAloud={handleReadAloud}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
            <p className="text-xs font-semibold">Loading current safety conditions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-center text-xs space-y-2">
            <p>Unable to fetch ocean conditions: {error}</p>
            <button
              onClick={loadData}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1.5 rounded-lg border border-red-500/30 transition-all text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry</span>
            </button>
          </div>
        ) : selectedRegion ? (
          <div className="space-y-4">
            
            {/* 2. PRIMARY RISK STATUS BANNER */}
            <CommunityRiskStatus
              riskLevel={selectedRegion.risk?.level}
              lang={lang}
            />

            {/* 3. "WHAT YOU SHOULD DO" ACTION CARD WITH READ ALOUD */}
            <SafetyRecommendation
              recommendation={selectedRegion.recommendation?.community}
              lang={lang}
              onReadAloud={handleReadAloud}
            />

            {/* 4. CURRENT SEA CONDITIONS TILES */}
            <ConditionsCard
              marine={selectedRegion.marine}
              weather={selectedRegion.weather}
              lang={lang}
            />

            {/* 5. FISHING ZONE (PFZ) CARD */}
            <CommunityPFZCard
              pfz={selectedRegion.pfz}
              riskLevel={selectedRegion.risk?.level}
              lang={lang}
            />

            {/* 6. WEATHER ALERT BULLETINS */}
            <CommunityAlert
              alerts={stationAlerts.length > 0 ? stationAlerts : alerts}
              lang={lang}
            />

            {/* 7. SIMPLIFIED COMMUNITY MAP */}
            <CommunityMap
              region={selectedRegion}
              lang={lang}
            />

            {/* 8. 1-TAP EMERGENCY SOS HELPLINE */}
            <EmergencyContactDrawer />

            {/* 9. FISHERMAN AI ASSISTANT */}
            <FishermanAIQuery selectedRegionId={selectedRegionId} />

            {/* Footer */}
            <footer className="text-center text-slate-500 text-[11px] pt-3 border-t border-slate-800 space-y-1">
              <p className="flex items-center justify-center gap-1 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                <span>ORCA Decision Support — Fisherman Portal</span>
              </p>
              <p className="text-[10px] text-slate-600">Same Data → Different Communication</p>
            </footer>
          </div>
        ) : null}
      </div>
    </main>
  );
}
