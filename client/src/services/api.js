/**
 * Frontend API Service
 */
import axios from 'axios';

const API_BASE = '/api/potholes';

export async function fetchPotholes(params = {}) {
  const res = await axios.get(API_BASE, { params });
  return res.data;
}

export async function fetchPotholeStats() {
  const res = await axios.get(`${API_BASE}/stats`);
  return res.data;
}

export async function fetchPotholeById(id) {
  const res = await axios.get(`${API_BASE}/${id}`);
  return res.data;
}

export async function detectPothole(formData) {
  const res = await axios.post(`${API_BASE}/detect`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

export async function updatePotholeStatus(id, formData) {
  const res = await axios.patch(`${API_BASE}/${id}/status`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
}

export async function updatePotholeLocation(id, { latitude, longitude, locationName, landmark }) {
  const res = await axios.patch(`${API_BASE}/${id}/location`, {
    latitude,
    longitude,
    locationName,
    landmark
  });
  return res.data;
}

export async function fetchRecentDispatches() {
  const res = await axios.get(`${API_BASE}/dispatches`);
  return res.data;
}

export async function fetchAuthorities() {
  const res = await axios.get(`${API_BASE}/authorities`);
  return res.data;
}

export async function searchAddress(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 5
      },
      headers: {
        'User-Agent': 'PotholeDetectionReportingSystem/2.0'
      },
      timeout: 3000
    });
    return res.data || [];
  } catch (err) {
    console.warn('Address search failed:', err.message);
    return [];
  }
}

export async function reverseGeocodeCoords(lat, lng) {
  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon: lng,
        format: 'jsonv2',
        addressdetails: 1,
        zoom: 18
      },
      headers: {
        'User-Agent': 'PotholeDetectionReportingSystem/2.0'
      },
      timeout: 3000
    });
    return res.data;
  } catch (err) {
    console.warn('Reverse geocode failed:', err.message);
    return null;
  }
}

export async function checkServerHealth() {
  try {
    const res = await axios.get('/api/health');
    return res.data;
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}
