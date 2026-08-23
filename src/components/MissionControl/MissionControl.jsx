import React, { useState } from 'react';
import { useTactical } from '../../context/TacticalContext';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { 
  Play, 
  OctagonAlert, 
  Plus, 
  MapPin, 
  Navigation, 
  Clock, 
  Target, 
  ShieldAlert,
  Flame,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

// Custom Leaflet DivIcon for UAV with heading rotation
const createDroneMarkerIcon = (drone) => {
  const isLowBattery = drone.status === 'LOW_BATTERY';
  const color = isLowBattery ? '#ff3b3b' : '#00d4ff';

  const html = `
    <div style="transform: rotate(${drone.heading}deg); transition: transform 0.5s ease;" class="relative flex items-center justify-center">
      <div class="w-8 h-8 rounded-full border-2 border-[${color}] bg-slate-950/80 flex items-center justify-center shadow-lg" style="box-shadow: 0 0 12px ${color};">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
        </svg>
      </div>
      <div class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[${color}] animate-ping"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-uav-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

export const MissionControl = () => {
  const { 
    drones, 
    missions, 
    geofences, 
    dispatchMission, 
    abortMission, 
    createMission,
    selectedDroneId,
    setSelectedDroneId 
  } = useTactical();

  const [abortModalMissionId, setAbortModalMissionId] = useState(null);
  const [isNewMissionModalOpen, setIsNewMissionModalOpen] = useState(false);
  const [newMission, setNewMission] = useState({
    name: "",
    category: "SAR / RESCUE",
    priority: "CRITICAL",
    droneId: "UAV-01 ALPHA",
    targetLocation: "Disaster Zone Sector 5",
    details: ""
  });

  const activeMissionToAbort = missions.find(m => m.id === abortModalMissionId);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newMission.name) return;
    createMission(newMission);
    setIsNewMissionModalOpen(false);
    setNewMission({
      name: "",
      category: "SAR / RESCUE",
      priority: "CRITICAL",
      droneId: "UAV-01 ALPHA",
      targetLocation: "Disaster Zone Sector 5",
      details: ""
    });
  };

  return (
    <div className="space-y-5 pb-24 max-w-7xl mx-auto px-3 pt-4">
      
      {/* Top Header & New Mission Launcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
            MISSION CONTROL & TACTICAL MAP
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Real-time GIS spatial tracking, waypoint nav paths & priority dispatch queue.
          </p>
        </div>

        <button
          onClick={() => setIsNewMissionModalOpen(true)}
          className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg shadow-cyan-glow flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE TACTICAL MISSION</span>
        </button>
      </div>

      {/* Main Grid: Interactive Map (Left/Top) + Mission Queue (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Leaflet Tactical Map (2 Columns on Desktop) */}
        <div className="lg:col-span-2 glass-card rounded-xl p-2 border border-cyan-500/30 overflow-hidden relative min-h-[420px] flex flex-col">
          
          {/* Map Status HUD Overlay */}
          <div className="absolute top-4 left-4 z-20 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded border border-cyan-500/40 text-xs font-mono flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              CARTODB DARK MATTER GIS
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">ZOOM: 14</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">{drones.length} MESH UNITS</span>
          </div>

          <div className="w-full h-[450px] lg:h-[500px] rounded-lg overflow-hidden">
            <MapContainer
              center={[28.6139, 77.2090]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              {/* Geofence Polygon Overlays */}
              {geofences.map(zone => (
                <Polygon
                  key={zone.id}
                  positions={zone.coordinates}
                  pathOptions={{
                    color: zone.color,
                    fillColor: zone.color,
                    fillOpacity: zone.status === 'ACTIVE' ? 0.25 : 0.05,
                    weight: zone.status === 'ACTIVE' ? 2 : 1,
                    dashArray: zone.status === 'ACTIVE' ? '6, 6' : null
                  }}
                >
                  <Popup>
                    <div className="font-mono text-xs text-slate-100 p-1 space-y-1">
                      <div className="font-bold text-red-400 uppercase">{zone.name}</div>
                      <div>Type: {zone.type}</div>
                      <div>Max Alt Cap: {zone.maxAltFeet} ft</div>
                      <div>Status: <span className="font-bold text-emerald-400">{zone.status}</span></div>
                    </div>
                  </Popup>
                </Polygon>
              ))}

              {/* Drone Waypoint Polylines */}
              {missions.filter(m => m.waypoints && m.status === 'IN_PROGRESS').map(m => (
                <Polyline
                  key={`poly-${m.id}`}
                  positions={m.waypoints}
                  pathOptions={{ color: '#00d4ff', weight: 2, dashArray: '4, 8' }}
                />
              ))}

              {/* Live Drone Markers */}
              {drones.map(drone => (
                <Marker
                  key={drone.id}
                  position={[drone.lat, drone.lng]}
                  icon={createDroneMarkerIcon(drone)}
                  eventHandlers={{
                    click: () => setSelectedDroneId(drone.id)
                  }}
                >
                  <Popup>
                    <div className="font-mono text-xs p-1 space-y-1 text-slate-100">
                      <div className="font-bold text-cyan-400">{drone.id} ({drone.name})</div>
                      <div>Alt: <span className="text-cyan-300 font-bold">{drone.altitude} m</span></div>
                      <div>Speed: <span className="text-cyan-300 font-bold">{drone.speed} m/s</span></div>
                      <div>Batt: <span className={drone.battery <= 20 ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{drone.battery}%</span></div>
                      <div>Heading: {drone.heading}°</div>
                      <div className="text-[10px] text-slate-400 pt-1">Mission: {drone.missionId}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Mission Queue & Priority List (Right Column) */}
        <div className="space-y-4 font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 text-cyan-400 text-sm font-bold">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h2>PRIORITY MISSION QUEUE</h2>
            </div>
            <span className="text-xs text-slate-400">({missions.length})</span>
          </div>

          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            {missions.map(mission => {
              const isCritical = mission.priority === 'CRITICAL';
              const isHigh = mission.priority === 'HIGH';
              const isInProgress = mission.status === 'IN_PROGRESS';
              const isAborted = mission.status === 'ABORTED';

              return (
                <div
                  key={mission.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isAborted
                      ? 'bg-red-950/20 border-red-900/50 opacity-60'
                      : isInProgress
                      ? 'glass-card-active'
                      : 'glass-card'
                  }`}
                >
                  {/* Card Top Strip */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-cyan-400">{mission.id}</span>

                    {/* Priority Badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isCritical
                        ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-danger-glow'
                        : isHigh
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {mission.priority}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold font-sans text-slate-100 mb-1 leading-snug">
                    {mission.name}
                  </h3>

                  <p className="text-xs font-sans text-slate-400 mb-3">
                    {mission.details}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded border border-slate-800 mb-3">
                    <div>ASSIGNED: <span className="text-cyan-300 font-bold">{mission.droneId}</span></div>
                    <div>ETA: <span className="text-emerald-300 font-bold">{mission.eta}</span></div>
                    <div className="col-span-2 truncate">TARGET: <span className="text-slate-200">{mission.targetLocation}</span></div>
                  </div>

                  {/* Actions: GO / ABORT Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    {!isInProgress && !isAborted && (
                      <button
                        onClick={() => dispatchMission(mission.id)}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded flex items-center justify-center gap-1.5 transition-all shadow-success-glow"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>GO / DISPATCH</span>
                      </button>
                    )}

                    {isInProgress && (
                      <button
                        onClick={() => setAbortModalMissionId(mission.id)}
                        className="flex-1 py-1.5 bg-red-600/90 hover:bg-red-500 text-white font-bold text-xs rounded flex items-center justify-center gap-1.5 transition-all border border-red-400 shadow-danger-glow"
                      >
                        <OctagonAlert className="w-3.5 h-3.5" />
                        <span>ABORT MISSION</span>
                      </button>
                    )}

                    {isAborted && (
                      <div className="w-full py-1 text-center text-xs font-bold text-red-400 bg-red-950/40 rounded border border-red-900">
                        MISSION ABORTED
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Confirm Abort Dialog */}
      <ConfirmDialog
        isOpen={!!abortModalMissionId}
        title="CONFIRM MISSION ABORT"
        message={`Warning: Aborting ${activeMissionToAbort?.id} will order ${activeMissionToAbort?.droneId} to instantly disengage and return to home base.`}
        confirmText="ABORT MISSION NOW"
        onConfirm={() => {
          if (abortModalMissionId) abortMission(abortModalMissionId);
          setAbortModalMissionId(null);
        }}
        onCancel={() => setAbortModalMissionId(null)}
        severity="danger"
      />

      {/* Create New Mission Wizard Modal */}
      {isNewMissionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-mono">
          <div className="glass-card w-full max-w-lg p-6 rounded-xl border border-cyan-500/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h2 className="text-base font-bold text-cyan-400 flex items-center gap-2">
                <Target className="w-5 h-5" />
                CREATE TACTICAL MISSION
              </h2>
              <button
                onClick={() => setIsNewMissionModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">MISSION NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flood Search & Medical Drop Sector 9"
                  value={newMission.name}
                  onChange={(e) => setNewMission({ ...newMission, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">PRIORITY LEVEL</label>
                  <select
                    value={newMission.priority}
                    onChange={(e) => setNewMission({ ...newMission, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-cyan-300 focus:outline-none"
                  >
                    <option value="CRITICAL">CRITICAL (SAR / Rescue)</option>
                    <option value="HIGH">HIGH (Infrastructure)</option>
                    <option value="ROUTINE">ROUTINE (Border Recon)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">ASSIGNED UAV</label>
                  <select
                    value={newMission.droneId}
                    onChange={(e) => setNewMission({ ...newMission, droneId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-cyan-300 focus:outline-none"
                  >
                    {drones.map(d => (
                      <option key={d.id} value={d.id}>{d.id} ({d.name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">TARGET LOCATION / COORDINATES</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 5 River Bank (Lat 28.618, Lng 77.214)"
                  value={newMission.targetLocation}
                  onChange={(e) => setNewMission({ ...newMission, targetLocation: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-cyan-300 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">TACTICAL BRIEFING / DETAILS</label>
                <textarea
                  rows={3}
                  placeholder="Mission operational directives..."
                  value={newMission.details}
                  onChange={(e) => setNewMission({ ...newMission, details: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-cyan-300 focus:outline-none focus:border-cyan-400 font-sans"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewMissionModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded shadow-cyan-glow"
                >
                  LAUNCH MISSION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
