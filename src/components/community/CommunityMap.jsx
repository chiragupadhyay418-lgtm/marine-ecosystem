import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

function MapRecenter({ center }) {
  const map = useMap();
  const lat = center?.[0];
  const lon = center?.[1];

  useEffect(() => {
    if (typeof lat === 'number' && typeof lon === 'number' && !isNaN(lat) && !isNaN(lon)) {
      map.flyTo([lat, lon], 9, { duration: 1.0 });
    }
  }, [lat, lon, map]);
  return null;
}

function createCommunityStationIcon(level) {
  const norm = (level || '').toUpperCase();
  let bg = 'bg-emerald-500';
  if (norm === 'CRITICAL' || norm === 'HIGH') bg = 'bg-red-600';
  else if (norm === 'MODERATE') bg = 'bg-amber-500';

  const html = `
    <div class="relative flex items-center justify-center">
      <span class="absolute inline-flex h-7 w-7 rounded-full ${bg} opacity-75 animate-ping"></span>
      <div class="relative flex items-center justify-center w-7 h-7 rounded-full ${bg} text-white font-bold text-xs shadow-lg border-2 border-slate-900">
        📍
      </div>
    </div>
  `;

  return L.divIcon({ html, className: 'custom-community-station', iconSize: [28, 28], iconAnchor: [14, 14] });
}

function createCommunityPFZIcon() {
  const html = `
    <div class="relative flex items-center justify-center">
      <div class="flex items-center justify-center w-7 h-7 rounded-full bg-teal-600 text-white font-bold text-xs shadow-lg border-2 border-slate-900">
        🎣
      </div>
    </div>
  `;
  return L.divIcon({ html, className: 'custom-community-pfz', iconSize: [28, 28], iconAnchor: [14, 14] });
}

export default function CommunityMap({ region, lang = 'en' }) {
  if (!region || typeof region.location?.lat !== 'number' || typeof region.location?.lon !== 'number') {
    return null;
  }

  const stationPos = [region.location.lat, region.location.lon];
  const stationIcon = createCommunityStationIcon(region.risk?.level);

  const hasPFZ = region.pfz?.available && typeof region.pfz?.lat === 'number' && typeof region.pfz?.lon === 'number';
  const pfzPos = hasPFZ ? [region.pfz.lat, region.pfz.lon] : null;
  const pfzIcon = createCommunityPFZIcon();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg space-y-2">
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs">
        <span className="font-bold text-white flex items-center gap-1.5">
          <span>📍 {region.location.name}</span>
        </span>
        <span className="text-[10px] text-teal-400 font-semibold">
          {hasPFZ ? `🎣 PFZ: ${region.pfz.distance_km}km offshore` : 'No PFZ coordinates'}
        </span>
      </div>

      <div className="w-full h-44 relative">
        <MapContainer
          center={stationPos}
          zoom={9}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapRecenter center={stationPos} />

          <Marker position={stationPos} icon={stationIcon}>
            <Popup>
              <div className="text-xs font-bold text-slate-900 p-0.5">
                {region.location.name} ({region.risk?.level})
              </div>
            </Popup>
          </Marker>

          {hasPFZ && (
            <Marker position={pfzPos} icon={pfzIcon}>
              <Popup>
                <div className="text-xs font-bold text-teal-800 p-0.5">
                  Potential Fishing Zone ({region.pfz.distance_km}km offshore)
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
