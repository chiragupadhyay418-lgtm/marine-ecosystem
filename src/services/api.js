import axios from 'axios';
import { mockRegions, mockAlerts, mockRestrictedZones, mockAIAnswers } from '../data/mockData';

// By default, if environment variable is not set or set to 'true', use mock data
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const deriveRiskLevel = (score, level) => {
  if (level && typeof level === 'string') {
    const norm = level.toUpperCase();
    if (['CRITICAL', 'HIGH', 'MODERATE', 'LOW'].includes(norm)) return norm;
  }
  const s = Number(score) || 0;
  if (s >= 75) return 'CRITICAL';
  if (s >= 50) return 'HIGH';
  if (s >= 30) return 'MODERATE';
  return 'LOW';
};

/**
 * Normalize backend region object to guarantee mandatory UI fields exist
 */
const normalizeRegion = (item) => {
  if (!item) return null;

  const rawScore = item.risk?.score ?? item.risk_score ?? item.score ?? 0;
  const rawLevel = item.risk?.level || item.risk_level;
  const normalizedLevel = deriveRiskLevel(rawScore, rawLevel);

  return {
    id: item.id || item.region_id || 'unknown',
    location: {
      name: item.location?.name || item.name || item.location_name || 'Coastal Station',
      lat: Number(item.location?.lat ?? item.lat ?? 13.0827),
      lon: Number(item.location?.lon ?? item.lon ?? 80.2707),
      district: item.location?.district || item.district || '',
      state: item.location?.state || item.state || 'Tamil Nadu',
    },
    risk: {
      score: rawScore,
      level: normalizedLevel,
      trend: item.risk?.trend || item.trend || 'stable',
      change_percent: item.risk?.change_percent ?? item.change_percent ?? 0,
    },
    weather: {
      wind_speed: item.weather?.wind_speed ?? item.wind_speed ?? 0,
      wind_direction: item.weather?.wind_direction || item.wind_direction || 'N/A',
      rainfall: item.weather?.rainfall ?? item.rainfall ?? 0,
      temperature: item.weather?.temperature ?? item.temperature ?? 0,
      humidity: item.weather?.humidity ?? item.humidity ?? 0,
    },
    marine: {
      wave_height: item.marine?.wave_height ?? item.wave_height ?? 0,
      wave_period: item.marine?.wave_period ?? item.wave_period ?? 0,
      sst: item.marine?.sst ?? item.sst ?? 0,
      current_speed: item.marine?.current_speed ?? item.current_speed ?? 0,
    },
    pfz: {
      available: Boolean(item.pfz?.available ?? item.pfz_available ?? true),
      distance_km: item.pfz?.distance_km ?? item.pfz_distance_km ?? 0,
      suitability: item.pfz?.suitability || item.pfz_suitability || 'MEDIUM',
      confidence: item.pfz?.confidence ?? item.pfz_confidence ?? 70,
      depth_m: item.pfz?.depth_m ?? item.pfz_depth_m ?? 0,
      lat: Number(item.pfz?.lat ?? item.pfz_lat ?? item.location?.lat ?? 13.0827),
      lon: Number(item.pfz?.lon ?? item.pfz_lon ?? item.location?.lon ?? 80.2707),
    },
    explainability: Array.isArray(item.explainability)
      ? item.explainability.map((f) => ({
          factor: f.factor || f.name || 'Factor',
          weight: f.weight ?? f.impact ?? 0,
          raw_value: f.raw_value ?? f.value ?? '',
        }))
      : [],
    recommendation: {
      government:
        item.recommendation?.government ||
        item.government_recommendation ||
        'Monitor coastal conditions closely.',
      community:
        item.recommendation?.community ||
        item.community_recommendation ||
        'Exercise caution when going into the sea.',
    },
    updated_at: item.updated_at || item.timestamp || null,
  };
};

/**
 * Normalize backend alert item
 */
const normalizeAlert = (alert) => {
  if (!alert) return null;
  return {
    id: alert.id || alert.alert_id || `alert-${Math.random()}`,
    severity: alert.severity || alert.level || 'MODERATE',
    title: alert.title || alert.name || 'Coastal Advisory',
    location: alert.location || alert.region || 'Coastal Area',
    lat: Number(alert.lat ?? 13.0827),
    lon: Number(alert.lon ?? 80.2707),
    timestamp: alert.timestamp || alert.created_at || 'Just now',
    explanation: alert.explanation || alert.description || alert.message || '',
  };
};

/**
 * Normalize backend AI response structure
 */
const normalizeAIResponse = (data) => {
  if (typeof data === 'string') {
    return { response: data, structured: null };
  }
  if (!data) {
    return { response: 'No response received from ORCA AI.', structured: null };
  }

  // Handle direct text field
  const textResponse = data.response || data.answer || data.message || data.text || '';

  // Extract structured fields if present from backend
  const structured = {
    answer: data.answer || textResponse,
    risk: data.risk || data.risk_level || null,
    reasons: data.reasons || data.factors || data.why || [],
    recommendation: data.recommendation || data.advice || null,
  };

  const hasStructured = Boolean(data.risk || data.risk_level || (Array.isArray(data.reasons) && data.reasons.length > 0) || data.recommendation || data.advice);

  return {
    response: textResponse || structured.answer || 'Query processed successfully.',
    structured: hasStructured ? structured : null,
    raw: data,
  };
};

/**
 * Handle API error scenarios consistently
 */
const handleApiError = (err, fallbackMsg = 'API request failed') => {
  if (axios.isAxiosError(err)) {
    if (err.response) {
      const status = err.response.status;
      const detail = err.response.data?.detail || err.response.data?.message;
      if (status === 400) return new Error(detail || 'Bad request. Please check input parameters.');
      if (status === 401 || status === 403) return new Error('Access denied to ORCA backend.');
      if (status === 404) return new Error('Requested resource or endpoint was not found.');
      if (status === 429) return new Error('Too many requests. Please slow down.');
      if (status >= 500) return new Error('ORCA backend server error. Please try again later.');
      return new Error(detail || fallbackMsg);
    }
    if (err.code === 'ECONNABORTED') {
      return new Error('Request timed out while connecting to ORCA backend.');
    }
    if (err.request) {
      return new Error('Unable to connect to ORCA backend server at ' + API_BASE_URL);
    }
  }
  return new Error(err.message || fallbackMsg);
};

export const apiService = {
  getRegions: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockRegions.map(normalizeRegion);
    }
    try {
      const response = await api.get('/regions');
      const data = Array.isArray(response.data) ? response.data : response.data.regions || [];
      return data.map(normalizeRegion);
    } catch (err) {
      throw handleApiError(err, 'Failed to fetch regions from backend');
    }
  },

  getRegionDetails: async (regionId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const region = mockRegions.find((r) => r.id === regionId);
      if (!region) throw new Error(`Region ${regionId} not found`);
      return normalizeRegion(region);
    }
    try {
      const response = await api.get(`/regions/${regionId}`);
      return normalizeRegion(response.data);
    } catch (err) {
      throw handleApiError(err, `Failed to fetch region ${regionId}`);
    }
  },

  getRisk: async (regionId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const region = mockRegions.find((r) => r.id === regionId) || mockRegions[0];
      return region.risk;
    }
    try {
      const response = await api.get(`/risk/${regionId}`);
      return response.data;
    } catch (err) {
      const details = await apiService.getRegionDetails(regionId);
      return details.risk;
    }
  },

  getAlerts: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockAlerts.map(normalizeAlert);
    }
    try {
      const response = await api.get('/alerts');
      const data = Array.isArray(response.data) ? response.data : response.data.alerts || [];
      return data.map(normalizeAlert);
    } catch (err) {
      throw handleApiError(err, 'Failed to fetch alerts from backend');
    }
  },

  getRestrictedZones: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockRestrictedZones;
    }
    try {
      const response = await api.get('/restricted-zones');
      return Array.isArray(response.data) ? response.data : response.data.zones || [];
    } catch (err) {
      throw handleApiError(err, 'Failed to fetch restricted zones');
    }
  },

  getPFZ: async (regionId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const region = mockRegions.find((r) => r.id === regionId) || mockRegions[0];
      return region.pfz;
    }
    try {
      const response = await api.get(`/pfz/${regionId}`);
      return response.data;
    } catch (err) {
      const details = await apiService.getRegionDetails(regionId);
      return details.pfz;
    }
  },

  getWeather: async (regionId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const region = mockRegions.find((r) => r.id === regionId) || mockRegions[0];
      return region.weather;
    }
    try {
      const response = await api.get(`/weather/${regionId}`);
      return response.data;
    } catch (err) {
      const details = await apiService.getRegionDetails(regionId);
      return details.weather;
    }
  },

  getMarine: async (regionId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const region = mockRegions.find((r) => r.id === regionId) || mockRegions[0];
      return region.marine;
    }
    try {
      const response = await api.get(`/marine/${regionId}`);
      return response.data;
    } catch (err) {
      const details = await apiService.getRegionDetails(regionId);
      return details.marine;
    }
  },

  askORCA: async (query, context = {}) => {
    const regionId = typeof context === 'string' ? context : context?.region_id;

    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const cleanQuery = query.toLowerCase().trim();
      const match = mockAIAnswers.find((ans) => cleanQuery.includes(ans.query) || ans.query.includes(cleanQuery));

      if (match) {
        return normalizeAIResponse({ response: match.response });
      }

      const targetRegionName = regionId
        ? mockRegions.find((r) => r.id === regionId)?.location.name || regionId
        : 'Tamil Nadu coastline';

      return normalizeAIResponse({
        response: `Based on current coastal AI models for ${targetRegionName}, the region is experiencing elevated marine risk. Please check safety metrics or specify wave forecasts.`,
      });
    }

    try {
      const payload = {
        query,
        ...(regionId ? { region_id: regionId } : {}),
        ...(typeof context === 'object' ? context : {}),
      };

      const response = await api.post('/query', payload);
      return normalizeAIResponse(response.data);
    } catch (err) {
      throw handleApiError(err, 'Unable to reach ORCA intelligence service. Please try again.');
    }
  },
};
