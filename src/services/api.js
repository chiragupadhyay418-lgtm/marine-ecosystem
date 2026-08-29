import axios from 'axios';
import { mockRegions, mockAlerts, mockAIAnswers } from '../data/mockData';

// By default, if the environment variable is not defined or is set to 'true', use mock data
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Get all regions or summary
  getRegions: async () => {
    if (USE_MOCK_DATA) {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockRegions;
    }
    const response = await api.get('/regions');
    return response.data;
  },

  // Get details for a specific region
  getRegionDetails: async (regionId) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const region = mockRegions.find((r) => r.id === regionId);
      if (!region) throw new Error(`Region ${regionId} not found`);
      return region;
    }
    const response = await api.get(`/regions/${regionId}`);
    return response.data;
  },

  // Get active alerts
  getAlerts: async () => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return mockAlerts;
    }
    const response = await api.get('/alerts');
    return response.data;
  },

  // Ask ORCA (AI agent query interface)
  askORCA: async (query) => {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 800)); // AI queries take longer
      const cleanQuery = query.toLowerCase().trim();
      const match = mockAIAnswers.find((ans) => cleanQuery.includes(ans.query) || ans.query.includes(cleanQuery));
      
      if (match) {
        return { response: match.response };
      }
      
      return {
        response: `I received your query: "${query}". Based on the current coastal models for the Tamil Nadu coastline, the region is experiencing cyclone proximity conditions. Please specify if you'd like to check safety metrics, fishing zone coordinates, or wave height forecasts for a particular station like Chennai or Cuddalore.`
      };
    }
    
    const response = await api.post('/query', { query });
    return response.data;
  }
};
