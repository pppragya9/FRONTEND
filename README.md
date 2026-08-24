# AeroTactical Command 🛰️🚁
### Autonomous UAV Fleet Traffic Management (UTM) & Command Center
**Smart India Hackathon (SIH) **

---

## 📌 Problem Statement Alignment
In critical missions such as **Disaster Relief & Search & Rescue (SAR)**, **High-Voltage Infrastructure Inspection**, and **Border Perimeter Reconnaissance**, managing autonomous multi-UAV fleets demands real-time spatial awareness, sub-second telemetry tracking, DGCA regulatory compliance, and high resilience under low connectivity.

**AeroTactical Command** is a production-quality, tactical command & control dashboard built to meet the operational guidelines set forth by civil aviation authorities (DGCA / UTM DigitalSky).

---

## ⚡ Key Highlights (SIH Hackathon Pitch Features)

### 1. 🛡️ DGCA Airspace Compliance & Safety Lock
- **Altitude Cap Lock**: Enforces DGCA Rule 34(a) cap (eg-400 ft / 121.9 m AGL) with active compliance indicators.
- **Geofence Enforcement**: Live polygon overlays for restricted airspace and airport buffer zones with automated trigger warnings.
- **Master Emergency Fleet Shutdown**: Two-step authorization modal to trigger controlled descent across all airborne units.
- **Compliance Audit Trail**: Timestamped log table tracking all operator actions with unique DGCA reference codes (`DGCA-LOG-XXXX`).

### 2. 🤖 AI Anomaly Detection Engine (ML Insights)
- Built-in ML insight chip on every drone card providing dynamic diagnostics (e.g. *"Rotor #3 micro-vibration anomaly detected"*, *"Thermal hotspot identified in Sector 4"*).
- Demonstrates advanced edge-computing and computer vision readiness.

### 3. 📡 Offline-First & Connectivity Resilience Mode
- Built for field operations with patchy cellular or satellite links.
- Interactive toggle allows judges to simulate network disconnects, locking telemetry in local cache while queueing commands (e.g. mission dispatches) for auto-sync once link is re-established.

### 4. 👁️ Dual-Persona Operational Demo
- **Administrator View**: Complete governance, geofence editing, RBAC matrix, flight safety parameters, and audit logs.
- **Field Operator View**: Streamlined tactical HUD focusing on quick dispatch, FLIR camera controls, and mission execution.

### 5. 📹 Live FLIR Thermal & HD Optical Stream HUD
- Simulated video feed box featuring scanlines, HUD crosshair target lock, FLIR spectrum analysis, and altitude/heading overlays.

### 6. 📊 Real-Time Telemetry & CSV Export
- Dynamic gauges for Battery %, Signal Strength %, Altitude, Air Speed, and Core Temperature.
- Interactive Recharts sparklines for battery drain rate over time and signal degradation curves.
- Full CSV Export feature generating real downloadable audit reports.

---

## 🏗️ Architecture & Technical Stack

- **Frontend Framework**: React 18 + Vite
- **Styling & HUD Design System**: Tailwind CSS (Dark Tactical Military Aesthetic: `#0a0f1a` Navy, `#00d4ff` Electric Cyan, `#ff3b3b` Danger Red, `#00e676` Go Green)
- **Mapping & GIS Engine**: Leaflet + React-Leaflet with CartoDB Dark Matter tile layer & custom animated SVG rotated markers
- **Data Visualization**: Recharts for telemetry trend analytics
- **Icons**: Lucide-React
- **State & Simulation**: React Context API + Event-driven modular Telemetry Simulator (`setInterval` with subscriber pattern)

---

## 🗺️ Screen Mapping to Operational Needs

| Module | UI View | Operational Need Solved |
| :--- | :--- | :--- |
| **1. Admin Command** | `AdminCommand.jsx` | Fleet governance, DGCA altitude enforcement, geofences, audit traceability |
| **2. Mission Control** | `MissionControl.jsx` | GIS tactical map, animated drone markers, priority mission queue (SAR/Rescue), GO/ABORT triggers |
| **3. Fleet Tracking** | `FleetTracking.jsx` | Multi-unit video matrix, FLIR thermal HUD drawer, camera gimbal controls, AI anomaly badges |
| **4. Telemetry Data** | `TelemetryData.jsx` | Real-time animated gauges, GPS precision readouts, Recharts trend lines, CSV report export |

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation Steps
```bash
# 1. Clone or navigate to project directory
cd "FRONTEND SIH"

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open your browser at `http://localhost:3000` to interact with the live command dashboard.

---

## Summary
**AeroTactical Command** bridges the gap between raw drone telemetry and high-stakes field execution. By incorporating DGCA airspace compliance hooks, AI anomaly chips, offline resilience, and a dual-persona HUD, this project offers judges a complete, industry-ready UTM command center solution.
