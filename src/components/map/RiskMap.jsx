import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import RiskBadge, { getRiskConfig } from '../common/RiskBadge';
import { Eye, EyeOff, ShieldAlert, Fish, AlertTriangle, AlertOctagon, Anchor } from 'lucide-react';

// Helper component to smoothly handle map center changes when region changes
function MapRecenter({ center }) {
  const map = useMap();
  const lat = center?.[0];
  const lon = center?.[1];

  useEffect(() => {
    if (typeof lat === 'number' && typeof lon === 'number' && !isNaN(lat) && !isNaN(lon)) {
      map.flyTo([lat, lon], 10, { duration: 1.2 });
    }
  }, [lat, lon, map]);
  return null;
}

// Custom HTML div icon for Region Station Risk Markers
function createStationMarkerIcon(level, score, isSelected) {
  let bgClass = 'bg-emerald-600';
  let ringClass = 'ring-emerald-500/40';
  if (level === 'CRITICAL') { bgClass = 'bg-red-600'; ringClass = 'ring-red-500/60'; }
  else if (level === 'HIGH') { bgClass = 'bg-orange-500'; ringClass = 'ring-orange-500/60'; }
  else if (level === 'MODERATE') { bgClass = 'bg-yellow-500'; ringClass = 'ring-yellow-500/60'; }

  const sizeClass = isSelected ? 'w-10 h-10 ring-4 scale-110 shadow-2xl z-50' : 'w-8 h-8 ring-2 shadow-lg';
  const textClass = isSelected ? 'text-xs' : 'text-[11px]';

  const html = `
    <div class="relative flex items-center justify-center">
      ${isSelected ? `<span class="absolute inline-flex h-10 w-10 rounded-full ${bgClass} opacity-60 animate-ping"></span>` : ''}
      <div class="relative flex items-center justify-center rounded-full ${bgClass} ${ringClass} ${sizeClass} text-white font-black ${textClass} border-2 border-slate-900 transition-all duration-200">
        ${score}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-station-marker',
    iconSize: isSelected ? [40, 40] : [32, 32],
    iconAnchor: isSelected ? [20, 20] : [16, 16],
    popupAnchor: [0, -18],
  });
}

// Custom DivIcon for Potential Fishing Zone (PFZ)
function createPFZMarkerIcon() {
  const html = `
    <div class="relative flex items-center justify-center">
      <div class="flex items-center justify-center w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-sm shadow-lg border-2 border-slate-900 ring-2 ring-teal-400/50 hover:scale-110 transition-transform">
        🎣
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-pfz-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

// Custom DivIcon for Disaster Alert Markers
function createAlertMarkerIcon(severity) {
  const isCritical = (severity || '').toUpperCase() === 'CRITICAL';
  const bgClass = isCritical ? 'bg-red-600' : 'bg-amber-500';

  const html = `
    <div class="relative flex items-center justify-center">
      <span class="absolute inline-flex h-8 w-8 rounded-full ${bgClass} opacity-75 animate-ping"></span>
      <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${bgClass} text-white text-xs shadow-xl border-2 border-slate-900 font-bold">
        ⚠️
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-alert-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

export default function RiskMap({
  regions = [],
  alerts = [],
  restrictedZones = [],
  selectedRegionId,
  onSelectRegion,
}) {
  // Layer visibility state
  const [layers, setLayers] = useState({
    risk: true,
    pfz: true,
    alerts: true,
    restricted: true,
  });

  const [showLayerMenu, setShowLayerMenu] = useState(false);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) || regions[0];

  const defaultCenter = selectedRegion && typeof selectedRegion.location?.lat === 'number' && typeof selectedRegion.location?.lon === 'number'
    ? [selectedRegion.location.lat, selectedRegion.location.lon]
    : [13.0827, 80.2707];

  const toggleLayer = (layerKey) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const getRiskCircleOptions = (level) => {
    const norm = (level || '').toUpperCase();
    if (norm === 'CRITICAL') return { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.18, weight: 2, radius: 25000 };
    if (norm === 'HIGH') return { color: '#f97316', fillColor: '#f97316', fillOpacity: 0.16, weight: 2, radius: 18000 };
    if (norm === 'MODERATE') return { color: '#eab308', fillColor: '#eab308', fillOpacity: 0.14, weight: 2, radius: 12000 };
    return { color: '#10b981', fillColor: '#10b981', fillOpacity: 0.12, weight: 1.5, radius: 7000 };
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-full min-h-[440px] relative">
      
      {/* Top Header Bar & Layer Controls Toggle */}
      <div className="p-3.5 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex flex-wrap justify-between items-center gap-2 z-20">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Coastal Intelligence Map</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 font-extrabold px-2 py-0.5 rounded border border-blue-500/30 uppercase">
              Multi-Layer GIS
            </span>
          </h2>
          <p className="text-xs text-slate-400">Live risk perimeters, PFZ coordinates, active alerts & restricted corridors</p>
        </div>

        {/* Layer Checkboxes Panel Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 transition-all"
          >
            <Eye className="h-3.5 w-3.5 text-blue-400" />
            <span>Map Layers</span>
          </button>

          {/* Popover Layer Controls */}
          {showLayerMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-slate-950 border border-slate-800 rounded-xl p-3 shadow-2xl z-50 space-y-2 text-xs">
              <div className="font-bold text-slate-400 border-b border-slate-800 pb-1 uppercase text-[10px] tracking-wider">
                Toggle GIS Layers
              </div>
              <label className="flex items-center gap-2 text-slate-200 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={layers.risk}
                  onChange={() => toggleLayer('risk')}
                  className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0"
                />
                <span>🔴 Risk Hazard Zones</span>
              </label>
              <label className="flex items-center gap-2 text-slate-200 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={layers.pfz}
                  onChange={() => toggleLayer('pfz')}
                  className="rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-0"
                />
                <span>🎣 Potential Fishing Zones</span>
              </label>
              <label className="flex items-center gap-2 text-slate-200 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={layers.alerts}
                  onChange={() => toggleLayer('alerts')}
                  className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                />
                <span>⚠️ Disaster Alert Bulletins</span>
              </label>
              <label className="flex items-center gap-2 text-slate-200 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={layers.restricted}
                  onChange={() => toggleLayer('restricted')}
                  className="rounded border-slate-700 bg-slate-900 text-red-500 focus:ring-0"
                />
                <span>🚫 Restricted Fishing Corridors</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="flex-1 w-full h-full relative min-h-[380px]">
        <MapContainer
          center={defaultCenter}
          zoom={9}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', minHeight: '380px' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapRecenter center={defaultCenter} />

          {/* 1. LAYER: RESTRICTED FISHING ZONES POLYGONS */}
          {layers.restricted && restrictedZones.map((zone) => {
            if (!zone.coordinates || !Array.isArray(zone.coordinates)) return null;
            return (
              <Polygon
                key={zone.id}
                positions={zone.coordinates}
                pathOptions={{
                  color: '#dc2626',
                  fillColor: '#dc2626',
                  fillOpacity: 0.22,
                  weight: 2,
                  dashArray: '6, 6',
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1.5 text-slate-900 max-w-xs font-sans">
                    <div className="flex items-center gap-1.5 text-red-600 font-bold text-xs border-b pb-1">
                      <span>🚫 Restricted Fishing Zone</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">{zone.name}</h4>
                    <p className="text-xs text-slate-700 leading-snug">{zone.reason}</p>
                    <span className="inline-block text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase">
                      PROHIBITED FOR FISHING
                    </span>
                  </div>
                </Popup>
              </Polygon>
            );
          })}

          {/* 2. LAYER: COASTAL RISK HAZARD CIRCLES */}
          {layers.risk && regions.map((region) => {
            if (typeof region.location?.lat !== 'number' || typeof region.location?.lon !== 'number') return null;
            const circleOpts = getRiskCircleOptions(region.risk?.level);
            return (
              <Circle
                key={`circle-${region.id}`}
                center={[region.location.lat, region.location.lon]}
                radius={circleOpts.radius}
                pathOptions={{
                  color: circleOpts.color,
                  fillColor: circleOpts.fillColor,
                  fillOpacity: circleOpts.fillOpacity,
                  weight: circleOpts.weight,
                }}
              />
            );
          })}

          {/* 3. LAYER: REGION TELEMETRY STATION MARKERS */}
          {regions.map((region) => {
            if (typeof region.location?.lat !== 'number' || typeof region.location?.lon !== 'number') return null;

            const position = [region.location.lat, region.location.lon];
            const isSelected = region.id === selectedRegionId;
            const icon = createStationMarkerIcon(region.risk?.level, region.risk?.score, isSelected);

            return (
              <Marker
                key={`station-${region.id}`}
                position={position}
                icon={icon}
                zIndexOffset={isSelected ? 1000 : 100}
                eventHandlers={{
                  click: () => onSelectRegion && onSelectRegion(region.id),
                }}
              >
                <Popup>
                  <div className="p-1 space-y-2 text-slate-900 font-sans max-w-xs">
                    <div className="flex justify-between items-center border-b pb-1">
                      <h4 className="font-bold text-sm text-slate-900">{region.location.name}</h4>
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 border">
                        {region.risk?.level || 'N/A'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-xs text-slate-700">
                      <div>Risk Index: <strong>{region.risk?.score || 0}/100</strong></div>
                      <div>Wave Height: <strong>{region.marine?.wave_height || 'N/A'}m</strong></div>
                      <div>Wind Speed: <strong>{region.weather?.wind_speed || 'N/A'}km/h</strong></div>
                      <div>PFZ Dist: <strong>{region.pfz?.distance_km || 'N/A'}km</strong></div>
                    </div>

                    <div className="bg-slate-50 p-2 rounded border text-[11px] text-slate-700 leading-snug">
                      <strong>Government Advisory Protocol:</strong>
                      <p className="mt-0.5">{region.recommendation?.government}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* 4. LAYER: POTENTIAL FISHING ZONE (PFZ) MARKERS */}
          {layers.pfz && regions.map((region) => {
            if (!region.pfz?.available || typeof region.pfz?.lat !== 'number' || typeof region.pfz?.lon !== 'number') return null;

            const position = [region.pfz.lat, region.pfz.lon];
            const pfzIcon = createPFZMarkerIcon();
            const isRiskHigh = ['CRITICAL', 'HIGH'].includes((region.risk?.level || '').toUpperCase());

            return (
              <Marker key={`pfz-${region.id}`} position={position} icon={pfzIcon} zIndexOffset={500}>
                <Popup>
                  <div className="p-1 space-y-2 text-slate-900 font-sans max-w-xs">
                    <div className="flex justify-between items-center border-b pb-1">
                      <h4 className="font-bold text-sm text-teal-800 flex items-center gap-1">
                        <span>🎣 Potential Fishing Zone</span>
                      </h4>
                      <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
                        Suitability: {region.pfz.suitability}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1">
                      <p>Station: <strong>{region.location.name}</strong> ({region.pfz.distance_km} km offshore)</p>
                      <p>Confidence: <strong>{region.pfz.confidence}%</strong> | Depth: <strong>~{region.pfz.depth_m}m</strong></p>
                    </div>

                    {/* Safety Separation Warning */}
                    <div className={`p-2 rounded border text-[11px] leading-snug ${isRiskHigh ? 'bg-red-50 border-red-200 text-red-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                      <strong>Safety Advisory Notice:</strong>
                      <p className="mt-0.5">
                        {isRiskHigh
                          ? `High fish presence (${region.pfz.suitability}), but sea conditions are UNSAFE (Waves: ${region.marine?.wave_height}m). Avoid offshore fishing today.`
                          : `Sea conditions are safe. Excellent fishing potential within identified zone.`}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* 5. LAYER: DISASTER ALERT MARKERS */}
          {layers.alerts && alerts.map((alert) => {
            if (typeof alert.lat !== 'number' || typeof alert.lon !== 'number' || isNaN(alert.lat) || isNaN(alert.lon)) return null;

            const position = [alert.lat, alert.lon];
            const alertIcon = createAlertMarkerIcon(alert.severity);

            return (
              <Marker
                key={`alert-map-${alert.id}`}
                position={position}
                icon={alertIcon}
                zIndexOffset={800}
                eventHandlers={{
                  click: () => {
                    const match = regions.find((r) => alert.location.toLowerCase().includes(r.location.name.toLowerCase()));
                    if (match && onSelectRegion) onSelectRegion(match.id);
                  },
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1.5 text-slate-900 font-sans max-w-xs">
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                        ⚠️ {alert.severity} ALERT
                      </span>
                      <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900">{alert.title}</h4>
                    <p className="text-[11px] font-semibold text-blue-700">{alert.location}</p>
                    <p className="text-xs text-slate-700 leading-relaxed">{alert.explanation}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Expanded Multi-Layer Map Legend */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-3 z-10">
        <span className="font-semibold text-slate-300">Coastal Intelligence Legend:</span>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Critical</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> High</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span> Moderate</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Low</span>
          <span className="flex items-center gap-1 border-l border-slate-800 pl-2">🎣 PFZ Spot</span>
          <span className="flex items-center gap-1">⚠️ Alert Bulletin</span>
          <span className="flex items-center gap-1">🚫 Restricted Zone</span>
        </div>
      </div>
    </div>
  );
}
