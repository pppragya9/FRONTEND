// AeroTactical Command - Live Telemetry & Event Simulator
// Implements an event-driven mock socket interface for real-time UAV fleet state.

export const INITIAL_DRONES = [
  {
    id: "UAV-01 ALPHA",
    name: "Alpha Hexacopter",
    model: "AeroTactics Hexa-V4",
    type: "SAR / Recon",
    status: "AIRBORNE",
    battery: 78,
    signal: 94,
    altitude: 105.4, // meters
    speed: 14.2, // m/s
    temp: 42, // Celsius
    satellites: 18,
    hdop: 0.8,
    heading: 45, // degrees
    lat: 28.6139,
    lng: 77.2090,
    missionId: "MIS-2026-SAR-01",
    mode: "AUTO-PATROL",
    videoSource: "hd_optical",
    aiInsight: "🤖 AI Insight: Optimal flight path efficiency (+14% battery saved)",
    aiSeverity: "info",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "UAV-02 BRAVO",
    name: "Bravo Heavy Lift",
    model: "SkyCarrier Cargo-X",
    type: "Disaster Supply",
    status: "AIRBORNE",
    battery: 62,
    signal: 88,
    altitude: 88.2,
    speed: 11.5,
    temp: 49,
    satellites: 16,
    hdop: 1.1,
    heading: 130,
    lat: 28.6185,
    lng: 77.2155,
    missionId: "MIS-2026-SAR-01",
    mode: "WAYPOINT",
    videoSource: "flir_thermal",
    aiInsight: "🤖 AI Insight: Thermal anomaly detected in Sector 4 (Human heat signature)",
    aiSeverity: "warning",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "UAV-03 RECON-X",
    name: "Recon-X Scout",
    model: "Phantom Blade-9",
    type: "High-Speed Recon",
    status: "LOW_BATTERY",
    battery: 18,
    signal: 65,
    altitude: 118.0,
    speed: 22.1,
    temp: 58,
    satellites: 14,
    hdop: 1.4,
    heading: 270,
    lat: 28.6090,
    lng: 77.2010,
    missionId: "MIS-2026-INF-02",
    mode: "RETURNING_HOME",
    videoSource: "flir_thermal",
    aiInsight: "🤖 AI Insight: Motor #2 vibration anomaly & rapid voltage drop",
    aiSeverity: "critical",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "UAV-04 FALCON",
    name: "Falcon Inspector",
    model: "AeroTactics Survey-3",
    type: "Infra Inspector",
    status: "AIRBORNE",
    battery: 89,
    signal: 96,
    altitude: 94.6,
    speed: 8.8,
    temp: 38,
    satellites: 20,
    hdop: 0.7,
    heading: 180,
    lat: 28.6220,
    lng: 77.1950,
    missionId: "MIS-2026-BDR-03",
    mode: "AUTO-PATROL",
    videoSource: "hd_optical",
    aiInsight: "🤖 AI Insight: Structural crack detected on Power Grid Tower #4",
    aiSeverity: "info",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "UAV-05 SCOUT-9",
    name: "Scout-9 Standby",
    model: "AeroTactics Micro-Q",
    type: "Tactical Scout",
    status: "STANDBY",
    battery: 99,
    signal: 99,
    altitude: 0.0,
    speed: 0.0,
    temp: 28,
    satellites: 22,
    hdop: 0.6,
    heading: 0,
    lat: 28.6020,
    lng: 77.2190,
    missionId: "NONE",
    mode: "IDLE",
    videoSource: "hd_optical",
    aiInsight: "🤖 AI Insight: System diagnostic normal. Ready for launch.",
    aiSeverity: "info",
    lastUpdated: new Date().toISOString()
  }
];

export const INITIAL_MISSIONS = [
  {
    id: "MIS-2026-SAR-01",
    name: "Disaster Flood Relief Search & Rescue",
    category: "SAR / RESCUE",
    priority: "CRITICAL",
    droneId: "UAV-01 ALPHA",
    secondaryDroneId: "UAV-02 BRAVO",
    targetLocation: "Sector 4 Flood Plain (Lat 28.616, Lng 77.212)",
    eta: "4 mins",
    distance: "1.4 km",
    status: "IN_PROGRESS",
    waypoints: [
      [28.6139, 77.2090],
      [28.6160, 77.2120],
      [28.6185, 77.2155]
    ],
    details: "Locating stranded flood survivors & dropping medical survival kit."
  },
  {
    id: "MIS-2026-INF-02",
    name: "High-Voltage Power Line Thermal Inspection",
    category: "INFRASTRUCTURE",
    priority: "HIGH",
    droneId: "UAV-03 RECON-X",
    targetLocation: "Grid Substation North (Lat 28.609, Lng 77.201)",
    eta: "RETURNING",
    distance: "0.8 km",
    status: "RETURNING",
    waypoints: [
      [28.6090, 77.2010],
      [28.6050, 77.2050]
    ],
    details: "Scanning transformer insulation for overheating hot spots."
  },
  {
    id: "MIS-2026-BDR-03",
    name: "Perimeter Security & Perimeter Patrol",
    category: "BORDER RECON",
    priority: "ROUTINE",
    droneId: "UAV-04 FALCON",
    targetLocation: "Border Sector Delta (Lat 28.622, Lng 77.195)",
    eta: "18 mins",
    distance: "3.2 km",
    status: "IN_PROGRESS",
    waypoints: [
      [28.6220, 77.1950],
      [28.6250, 77.1980],
      [28.6200, 77.2020]
    ],
    details: "Automated night-vision corridor security sweep."
  }
];

export const INITIAL_GEOFENCES = [
  {
    id: "GEO-01",
    name: "Airport Buffer Zone (DGCA Strict NFZ)",
    type: "RESTRICTED",
    status: "ACTIVE",
    coordinates: [
      [28.628, 77.200],
      [28.635, 77.205],
      [28.632, 77.215],
      [28.624, 77.210]
    ],
    color: "#ff3b3b",
    maxAltFeet: 0
  },
  {
    id: "GEO-02",
    name: "Disaster Search & Relief Operation Zone Alpha",
    type: "OPERATIONAL",
    status: "ACTIVE",
    coordinates: [
      [28.610, 77.205],
      [28.622, 77.205],
      [28.622, 77.220],
      [28.610, 77.220]
    ],
    color: "#00d4ff",
    maxAltFeet: 400
  }
];

class TelemetrySimulatorService {
  constructor() {
    this.drones = JSON.parse(JSON.stringify(INITIAL_DRONES));
    this.listeners = [];
    this.alertListeners = [];
    this.historyBuffer = {};
    this.timer = null;
    this.isOffline = false;

    // Initialize history buffer for charts
    this.drones.forEach(drone => {
      this.historyBuffer[drone.id] = Array.from({ length: 15 }, (_, i) => ({
        time: new Date(Date.now() - (15 - i) * 10000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        battery: Math.min(100, Math.max(10, drone.battery + (15 - i) * 0.8)),
        signal: Math.min(100, Math.max(40, drone.signal + Math.sin(i) * 5)),
        altitude: drone.altitude + Math.sin(i) * 3,
        speed: drone.speed + Math.cos(i) * 1.5,
        temp: drone.temp + Math.sin(i) * 1
      }));
    });
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      if (this.isOffline) return; // Freeze updates when simulated offline

      this.tick();
    }, 1500);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  setOffline(offlineState) {
    this.isOffline = offlineState;
  }

  tick() {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const fullIso = new Date().toISOString();

    this.drones = this.drones.map(drone => {
      if (drone.status === "STANDBY" || drone.status === "OFFLINE") {
        return drone;
      }

      // Simulate movement: move slightly based on heading
      const rad = (drone.heading * Math.PI) / 180;
      const latDelta = Math.cos(rad) * 0.00015;
      const lngDelta = Math.sin(rad) * 0.00015;

      const newLat = drone.lat + latDelta;
      const newLng = drone.lng + lngDelta;

      // Battery drain
      let batteryDrain = 0.15;
      if (drone.status === "LOW_BATTERY") batteryDrain = 0.3;
      const newBattery = Math.max(0, parseFloat((drone.battery - batteryDrain).toFixed(1)));

      // Signal fluctuation
      const signalDelta = (Math.random() - 0.5) * 2;
      const newSignal = Math.min(100, Math.max(10, Math.round(drone.signal + signalDelta)));

      // Altitude fluctuation
      const altDelta = (Math.random() - 0.5) * 0.8;
      const newAlt = Math.max(5, parseFloat((drone.altitude + altDelta).toFixed(1)));

      // Speed fluctuation
      const speedDelta = (Math.random() - 0.5) * 0.4;
      const newSpeed = Math.max(0, parseFloat((drone.speed + speedDelta).toFixed(1)));

      // Temperature
      const tempDelta = (Math.random() - 0.48) * 0.2;
      const newTemp = Math.round(drone.temp + tempDelta);

      // Status updates based on threshold
      let newStatus = drone.status;
      if (newBattery <= 20 && newStatus !== "LOW_BATTERY" && newStatus !== "RETURNING") {
        newStatus = "LOW_BATTERY";
        this.emitAlert({
          id: `ALT-BAT-${drone.id}-${Date.now()}`,
          title: `CRITICAL LOW BATTERY: ${drone.id}`,
          message: `Battery level reached ${newBattery}%. Emergency Return to Home triggered!`,
          severity: "critical",
          droneId: drone.id,
          timestamp: timestamp
        });
      }

      const updatedDrone = {
        ...drone,
        lat: parseFloat(newLat.toFixed(5)),
        lng: parseFloat(newLng.toFixed(5)),
        battery: newBattery,
        signal: newSignal,
        altitude: newAlt,
        speed: newSpeed,
        temp: newTemp,
        status: newStatus,
        lastUpdated: fullIso
      };

      // Push history point
      if (this.historyBuffer[drone.id]) {
        const hist = this.historyBuffer[drone.id];
        hist.shift();
        hist.push({
          time: timestamp,
          battery: newBattery,
          signal: newSignal,
          altitude: newAlt,
          speed: newSpeed,
          temp: newTemp
        });
      }

      return updatedDrone;
    });

    this.notifyListeners();
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.drones, this.historyBuffer));
  }

  emitAlert(alertObj) {
    this.alertListeners.forEach(cb => cb(alertObj));
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.drones, this.historyBuffer);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  subscribeAlerts(callback) {
    this.alertListeners.push(callback);
    return () => {
      this.alertListeners = this.alertListeners.filter(cb => cb !== callback);
    };
  }
}

export const telemetrySimulator = new TelemetrySimulatorService();
