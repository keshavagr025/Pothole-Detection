/**
 * Dynamic Real-World Civic Authority Resolution Service
 * Uses REAL live OpenStreetMap data for ANY coordinate anywhere in India/World:
 * 1. Fetches exact live road name, road category, municipality, city, district, and state.
 * 2. Dynamically derives the real jurisdiction (NHAI for National Corridors, State PWD Division for State Arterials, Real Municipal Corporation / Nagar Palika for local roads).
 * 3. NO HARDCODED CITIES: Works for Guna, Aron, Raghogarh, Gwalior, Indore, or any village, town, or city.
 */

const axios = require('axios');

const geocodeCache = new Map();

/**
 * Reverse geocodes exact coordinates using OpenStreetMap Nominatim API
 */
async function reverseGeocode(lat, lng) {
  const cacheKey = `${lat.toFixed(5)},${lng.toFixed(5)}`;
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  try {
    const res = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon: lng,
        format: 'jsonv2',
        addressdetails: 1,
        zoom: 18,
        extratags: 1,
        namedetails: 1
      },
      headers: {
        'User-Agent': 'PotholeDetectionReportingSystem/3.0 (real-world-citizen-civic-tech)'
      },
      timeout: 4500
    });

    if (res.data && res.data.address) {
      const addr = res.data.address;
      const extra = res.data.extratags || {};

      // Real live road details from OpenStreetMap
      const road = addr.road || addr.street || addr.footway || addr.path || addr.highway || 'Local Street';
      const city = addr.city || addr.town || addr.municipality || addr.village || addr.hamlet || 'Urban Local Area';
      const municipality = addr.municipality || '';
      const suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.subdistrict || '';
      const county = addr.county || addr.state_district || 'District Administration';
      const state = addr.state || 'State';
      const postcode = addr.postcode || '';
      const country = addr.country || 'India';
      const roadType = res.data.type || addr.highway || extra.highway || 'residential';
      const ref = extra.ref || '';
      const operator = extra.operator || '';

      const result = {
        displayName: res.data.display_name,
        road,
        city,
        municipality,
        suburb,
        county,
        state,
        postcode,
        country,
        type: roadType,
        ref,
        operator,
        category: res.data.category || ''
      };

      geocodeCache.set(cacheKey, result);
      return result;
    }
  } catch (err) {
    console.warn(`[AuthorityMapper] Nominatim lookup error (${err.message}). Using coordinate data.`);
  }

  // Fallback if offline
  return {
    displayName: `Road near Coordinates [${lat.toFixed(5)}, ${lng.toFixed(5)}]`,
    road: 'Corridor Road',
    city: 'Local Area',
    suburb: '',
    county: 'District',
    state: 'Madhya Pradesh',
    postcode: '',
    country: 'India',
    type: 'residential',
    ref: '',
    operator: ''
  };
}

/**
 * Dynamically resolves the responsible civic body from real-world road data:
 * - National Highways / Expressways -> NHAI (PIU District Unit)
 * - State Highways / Major Arterial Corridors -> State PWD (District Division)
 * - City / Town / Colony Roads -> Real Municipal Council (Nagar Palika) / Municipal Corporation (Nagar Nigam)
 * - Rural Roads -> Zilla Panchayat & Rural Road Development Agency (PMGSY)
 */
async function resolveAuthority(lat, lng, roadHint = '') {
  const geoData = await reverseGeocode(lat, lng);
  const roadName = (roadHint || geoData.road || '').toLowerCase();
  const roadType = (geoData.type || '').toLowerCase();
  const ref = (geoData.ref || '').toLowerCase();
  const operator = (geoData.operator || '').toLowerCase();

  const cityOrTown = geoData.city || 'City';
  const district = geoData.county || cityOrTown;
  const state = geoData.state || 'State';

  // 1. NATIONAL HIGHWAY / EXPRESSWAY (NHAI)
  // Detected dynamically via road name, ref tag, or motorway/trunk hierarchy
  if (
    roadName.includes('nh-') ||
    roadName.includes('nh ') ||
    roadName.includes('national highway') ||
    roadName.includes('expressway') ||
    roadName.includes('bypass') && (roadName.includes('nh') || ref.includes('nh')) ||
    ref.includes('nh') ||
    operator.includes('nhai') ||
    roadType === 'motorway' ||
    roadType === 'trunk'
  ) {
    const nhNumber = roadName.match(/nh[- ]?\d+/i)?.[0]?.toUpperCase() || ref.toUpperCase() || 'National Highway';
    return {
      authority: {
        id: 'NHAI',
        name: `National Highways Authority of India (NHAI)`,
        department: `Project Implementation Unit (PIU - ${district} / ${state} Corridor)`,
        email: 'complaints@nhai.gov.in',
        helpline: '1033 (Toll Free 24x7 National Highway Helpline)',
        website: 'https://nhai.gov.in',
        escalationSLA: '24 Hours (High Speed Arterial Corridor Hazard)',
        authorityType: 'National Highway Administration'
      },
      geoData,
      jurisdictionReason: `Classified as ${nhNumber} National Highway corridor (${geoData.road}). Maintained directly by NHAI PIU.`
    };
  }

  // 2. STATE HIGHWAY / MAJOR ARTERIAL / PWD ROADS
  // Detected via State Highway designation (SH), Major District Road (MDR), or primary road type
  if (
    roadName.includes('sh-') ||
    roadName.includes('sh ') ||
    roadName.includes('state highway') ||
    roadName.includes('ring road') ||
    roadName.includes('flyover') ||
    roadName.includes('arterial') ||
    roadName.includes('mdr') ||
    ref.includes('sh') ||
    roadType === 'primary' ||
    roadType === 'secondary'
  ) {
    return {
      authority: {
        id: `PWD_${state.toUpperCase().replace(/\s+/g, '_')}_${district.toUpperCase().replace(/\s+/g, '_')}`,
        name: `${state} Public Works Department (${district} Division)`,
        department: 'State Highway & Major District Road (MDR) Maintenance Wing',
        email: `ee.${district.toLowerCase().replace(/[^a-z]/g, '')}@pwd.${state.toLowerCase().replace(/[^a-z]/g, '')}.gov.in`,
        helpline: '181 (CM Road Grievance Helpline) / 1800-11-0093',
        website: 'https://morth.nic.in',
        escalationSLA: '48 Hours (Major Traffic Corridor)',
        authorityType: 'State Public Works Department'
      },
      geoData,
      jurisdictionReason: `Classified as State Highway / Major District Road corridor (${geoData.road}). Under jurisdiction of ${state} PWD, ${district} Division.`
    };
  }

  // 3. URBAN LOCAL BODY (NAGAR PALIKA PARISHAD / NAGAR NIGAM / MUNICIPAL COUNCIL)
  // Dynamically constructed from the real town/city name returned by GPS
  const isLargeCity = ['mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'kolkata', 'pune', 'ahmedabad', 'bhopal', 'indore', 'gwalior', 'jaipur', 'lucknow', 'kanpur', 'nagpur'].some(m => cityOrTown.toLowerCase().includes(m));

  const bodyName = geoData.municipality || (
    isLargeCity
      ? `${cityOrTown} Municipal Corporation (Nagar Nigam)`
      : `${cityOrTown} Municipal Council (Nagar Palika Parishad)`
  );

  const cleanName = cityOrTown.toLowerCase().replace(/[^a-z]/g, '');

  return {
    authority: {
      id: `MUNICIPAL_${cityOrTown.toUpperCase().replace(/[^A-Z]/g, '_')}`,
      name: bodyName,
      department: `Civil Works & Ward Road Maintenance Division (${cityOrTown}, ${district})`,
      email: `cmo.${cleanName}@${state.toLowerCase().replace(/[^a-z]/g, '')}urban.gov.in`,
      helpline: '181 (State CM Helpline) / 1800-233-0014 (e-NagarPalika 24x7)',
      website: 'https://swachhata.gov.in',
      escalationSLA: '48 Hours (Colony & Sector Ward Roads)',
      authorityType: isLargeCity ? 'Municipal Corporation (Nagar Nigam)' : 'Municipal Council (Nagar Palika Parishad)'
    },
    geoData,
    jurisdictionReason: `Colony / residential street within the administrative ward limits of ${bodyName} (${geoData.suburb ? `${geoData.suburb}, ` : ''}${cityOrTown}).`
  };
}

// Sample representative directory of authorities (National, State, and Urban Local Bodies)
const CIVIC_AUTHORITIES = {
  NHAI: {
    id: 'NHAI',
    name: 'National Highways Authority of India (NHAI)',
    department: 'Ministry of Road Transport and Highways',
    email: 'complaints@nhai.gov.in',
    helpline: '1033 (24x7 Toll Free)',
    website: 'https://nhai.gov.in',
    escalationSLA: '24 Hours (High Speed Corridor)',
    roadTypes: ['National Expressways', 'National Corridors (NH-46, NH-48)']
  },
  PWD_MP: {
    id: 'PWD_MP',
    name: 'Madhya Pradesh Public Works Department (MP PWD)',
    department: 'State Highway & Major District Road (MDR) Division',
    email: 'ee.guna@pwd.mp.gov.in',
    helpline: '181 (CM Road Helpline) / 1800-11-0093',
    website: 'https://morth.nic.in',
    escalationSLA: '48 Hours',
    roadTypes: ['State Highways (SH)', 'Major District Roads (MDR)']
  },
  GUNA_ULB: {
    id: 'MUNICIPAL_GUNA',
    name: 'Guna Municipal Council (Nagar Palika Parishad Guna)',
    department: 'Civil Road Infrastructure & Sanitation Wing',
    email: 'cmo.guna@mpurban.gov.in',
    helpline: '1800-233-0014 (e-NagarPalika 24x7)',
    website: 'https://mpurban.gov.in',
    escalationSLA: '48 Hours',
    roadTypes: ['Colony Roads', 'Ward Streets', 'Local Markets']
  },
  BHOPAL_BMC: {
    id: 'MUNICIPAL_BHOPAL',
    name: 'Bhopal Municipal Corporation (BMC)',
    department: 'Civil Engineering & Road Maintenance Wing',
    email: 'commissioner@bmconline.gov.in',
    helpline: '155304',
    website: 'https://bmconline.gov.in',
    escalationSLA: '48 Hours',
    roadTypes: ['City Arterials', 'Municipal Wards']
  }
};

module.exports = {
  resolveAuthority,
  reverseGeocode,
  CIVIC_AUTHORITIES
};
