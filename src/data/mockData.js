// Mock data for ORCA platform

export const mockRegions = [
  {
    id: "chennai",
    location: {
      name: "Chennai Coast",
      lat: 13.0827,
      lon: 80.2707,
      district: "Chennai",
      state: "Tamil Nadu"
    },
    risk: {
      score: 78,
      level: "CRITICAL",
      trend: "up", // up, down, stable
      change_percent: 12
    },
    weather: {
      wind_speed: 42, // km/h
      wind_direction: "ENE",
      rainfall: 65, // mm
      temperature: 29, // °C
      humidity: 88 // %
    },
    marine: {
      wave_height: 3.2, // meters
      wave_period: 11, // seconds
      sst: 28.4, // Sea Surface Temperature in °C
      current_speed: 1.8 // knots
    },
    pfz: {
      available: true,
      distance_km: 18,
      suitability: "HIGH",
      confidence: 85, // %
      depth_m: 45
    },
    explainability: [
      { factor: "Cyclone Proximity", weight: 90, raw_value: "140km offshore" },
      { factor: "Wave Height", weight: 82, raw_value: "3.2m" },
      { factor: "Wind Speed", weight: 75, raw_value: "42 km/h" },
      { factor: "Rainfall", weight: 40, raw_value: "65 mm" }
    ],
    recommendation: {
      government: "Critical coastal risk detected. Recommend issuing a coastal fishing advisory due to elevated wave height, strong winds, and cyclone proximity. Prepare low-lying areas for potential storm surge.",
      community: "Don't go far into the sea today. Waves are high, winds are strong, and a storm system is nearby."
    }
  },
  {
    id: "cuddalore",
    location: {
      name: "Cuddalore Coast",
      lat: 11.75,
      lon: 79.75,
      district: "Cuddalore",
      state: "Tamil Nadu"
    },
    risk: {
      score: 55,
      level: "HIGH",
      trend: "up",
      change_percent: 5
    },
    weather: {
      wind_speed: 28,
      wind_direction: "NE",
      rainfall: 32,
      temperature: 30,
      humidity: 82
    },
    marine: {
      wave_height: 2.1,
      wave_period: 9,
      sst: 28.1,
      current_speed: 1.2
    },
    pfz: {
      available: true,
      distance_km: 24,
      suitability: "MEDIUM",
      confidence: 70,
      depth_m: 35
    },
    explainability: [
      { factor: "Wave Height", weight: 65, raw_value: "2.1m" },
      { factor: "Wind Speed", weight: 58, raw_value: "28 km/h" },
      { factor: "Rainfall", weight: 45, raw_value: "32 mm" }
    ],
    recommendation: {
      government: "High risk level. Monitor coastal conditions closely. Advise small vessels to exercise caution and avoid deep-sea operations.",
      community: "Be careful. Waves are moderately high and winds are gusty. Small boats should remain close to shore."
    }
  },
  {
    id: "kanyakumari",
    location: {
      name: "Kanyakumari Coast",
      lat: 8.08,
      lon: 77.55,
      district: "Kanyakumari",
      state: "Tamil Nadu"
    },
    risk: {
      score: 22,
      level: "LOW",
      trend: "down",
      change_percent: 8
    },
    weather: {
      wind_speed: 12,
      wind_direction: "W",
      rainfall: 2,
      temperature: 28,
      humidity: 75
    },
    marine: {
      wave_height: 0.9,
      wave_period: 7,
      sst: 27.2,
      current_speed: 0.5
    },
    pfz: {
      available: true,
      distance_km: 12,
      suitability: "HIGH",
      confidence: 90,
      depth_m: 28
    },
    explainability: [
      { factor: "Wave Height", weight: 20, raw_value: "0.9m" },
      { factor: "Wind Speed", weight: 15, raw_value: "12 km/h" },
      { factor: "Rainfall", weight: 5, raw_value: "2 mm" }
    ],
    recommendation: {
      government: "Low risk conditions. Normal operations permitted. PFZ suitability is high; encourage local fishing activity within designated zones.",
      community: "Safe for fishing today. Good weather, calm waves, and high fish presence 12 km out."
    }
  }
];

export const mockAlerts = [
  {
    id: "alert-1",
    severity: "CRITICAL", // CRITICAL, HIGH, MODERATE, LOW
    title: "Cyclone Proximity Advisory",
    location: "Chennai Coast",
    lat: 13.0827,
    lon: 80.2707,
    timestamp: "12 minutes ago",
    explanation: "Deep depression in the Bay of Bengal has intensified. Cyclone proximity has increased to 140km offshore of Chennai Coast, generating severe wind and swell conditions."
  },
  {
    id: "alert-2",
    severity: "HIGH",
    title: "Wave Height Limit Exceeded",
    location: "Chennai / Ennore Port",
    lat: 13.2161,
    lon: 80.3247,
    timestamp: "28 minutes ago",
    explanation: "Significant wave heights exceeding 3.0 meters recorded by local buoys. Strong rip currents active."
  },
  {
    id: "alert-3",
    severity: "MODERATE",
    title: "High Wind Alert",
    location: "Cuddalore Coast",
    lat: 11.75,
    lon: 79.75,
    timestamp: "1 hour ago",
    explanation: "Wind gusts up to 35 km/h expected nearshore. Small motorized crafts should exercise caution."
  }
];

export const mockAIAnswers = [
  {
    query: "is it safe for fishermen near chennai?",
    response: "No, it is not safe near Chennai today. A **CRITICAL** risk level is active due to a nearby cyclone system (140km offshore). Wave heights are at **3.2m** and winds are blowing at **42 km/h**. We strongly advise all fishermen to avoid offshore operations and stay at port."
  },
  {
    query: "why is the current risk critical?",
    response: "The risk level for Chennai Coast is **CRITICAL (Score: 78/100)** because of: \n1. **Cyclone Proximity**: Active system 140km offshore contributing 90% of the risk.\n2. **Extreme Wave Heights**: Wave heights have reached **3.2m** (82% contribution).\n3. **High Wind Speeds**: Winds are sustained at **42 km/h** (75% contribution)."
  },
  {
    query: "which coastal areas need attention?",
    response: "Currently, the **Chennai Coast** is in **CRITICAL** danger (Risk Score: 78) and requires immediate attention, including evacuation/advisory warnings. **Cuddalore Coast** is at **HIGH** risk (Risk Score: 55) and should be monitored closely. **Kanyakumari Coast** remains stable at **LOW** risk (Risk Score: 22)."
  },
  {
    query: "where is the nearest pfz?",
    response: "For Chennai, the nearest Potential Fishing Zone (PFZ) is **18 km away** with **HIGH** suitability. However, due to the **CRITICAL** marine risk, fishing is highly discouraged. For Kanyakumari, there is a safe PFZ **12 km away** with **HIGH** suitability and low risk, which is safe to harvest."
  },
  {
    query: "what factors caused the risk to increase?",
    response: "The 12% risk increase over the past period is driven by the rapid strengthening of a low-pressure depression into a deep depression in the Bay of Bengal, pushing wave heights from 2.4m to 3.2m and increasing near-shore wind speeds by 15 km/h."
  }
];
