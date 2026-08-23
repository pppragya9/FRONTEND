import React, { useState } from 'react';
import { useTactical } from '../../context/TacticalContext';
import { 
  Radar, 
  Video, 
  BatteryCharging, 
  Wifi, 
  Thermometer, 
  Compass, 
  Maximize2, 
  Sparkles,
  Eye,
  Sliders,
  AlertTriangle,
  RotateCcw,
  Zap,
  Crosshair,
  ShieldCheck
} from 'lucide-react';

export const FleetTracking = () => {
  const { drones, selectedDroneId, setSelectedDroneId } = useTactical();
  const [expandedDrone, setExpandedDrone] = useState(null);
  const [cameraMode, setCameraMode] = useState("FLIR_THERMAL"); // FLIR_THERMAL | HD_OPTICAL

  const activeExpanded = drones.find(d => d.id === expandedDrone);

  return (
    <div className="space-y-5 pb-24 max-w-7xl mx-auto px-3 pt-4 font-mono">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
            FLEET TRACKING & LIVE AVIONICS HUD
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Multi-UAV stream matrix, thermal FLIR spectrum analysis & AI anomaly detection.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded border border-slate-800 text-xs">
          <span className="text-slate-400">ACTIVE MATRIX:</span>
          <span className="text-cyan-400 font-bold">{drones.length} UNITS SYNCED</span>
        </div>
      </div>

      {/* UAV Unit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {drones.map(drone => {
          const isOffline = drone.status === 'OFFLINE' || drone.status === 'STANDBY';
          const isLowBatt = drone.status === 'LOW_BATTERY';
          const isSelected = selectedDroneId === drone.id;

          return (
            <div
              key={drone.id}
              onClick={() => setSelectedDroneId(drone.id)}
              className={`rounded-xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                isLowBatt
                  ? 'glass-card-danger'
                  : isSelected
                  ? 'glass-card-active'
                  : isOffline
                  ? 'glass-card opacity-70 grayscale-[30%]'
                  : 'glass-card hover:border-cyan-400/50'
              }`}
            >
              
              {/* Card Header */}
              <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      isLowBatt ? 'bg-red-400 animate-ping' : isOffline ? 'bg-slate-500' : 'bg-emerald-400 animate-pulse'
                    }`}></span>
                    <h3 className="font-bold text-slate-100 text-sm tracking-wide">{drone.id}</h3>
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans">{drone.model} • {drone.type}</div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  isLowBatt
                    ? 'bg-red-500/20 text-red-400 border-red-500/50'
                    : isOffline
                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'
                }`}>
                  {drone.status}
                </span>
              </div>

              {/* Simulated Live Video Feed Box */}
              <div className="relative w-full h-44 bg-slate-950 overflow-hidden group">
                
                {/* Simulated FLIR / Optical Background Canvas Styling */}
                <div className={`absolute inset-0 ${
                  cameraMode === 'FLIR_THERMAL'
                    ? 'bg-gradient-to-br from-indigo-950 via-purple-900 to-amber-900 opacity-90'
                    : 'bg-slate-900'
                }`}>
                  {/* Grid Lines */}
                  <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 opacity-20">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="border border-cyan-400/40"></div>
                    ))}
                  </div>
                </div>

                {/* Scanlines & Tactical Crosshair */}
                <div className="absolute inset-0 scanlines opacity-60"></div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Crosshair className="w-12 h-12 text-cyan-400/40 stroke-1" />
                </div>

                {/* Video HUD Overlays */}
                <div className="absolute top-2 left-2 z-10 text-[10px] text-emerald-400 bg-black/60 px-2 py-0.5 rounded font-mono border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  {cameraMode === 'FLIR_THERMAL' ? 'FLIR THERMAL 640x512' : 'HD OPTICAL 4K'}
                </div>

                <div className="absolute top-2 right-2 z-10 text-[10px] text-slate-300 bg-black/60 px-2 py-0.5 rounded font-mono border border-slate-700">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>

                {/* Center Target Info */}
                <div className="absolute bottom-2 left-2 z-10 text-[10px] text-slate-300 bg-black/60 px-2 py-0.5 rounded font-mono">
                  LAT: {drone.lat.toFixed(4)} | LNG: {drone.lng.toFixed(4)}
                </div>

                {/* Hover overlay button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedDrone(drone.id);
                  }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-cyan-300 font-bold text-xs"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>EXPAND HUD FEED</span>
                </button>
              </div>

              {/* AI Insight Chip (SIH Key Innovation Feature!) */}
              <div className="p-2.5 bg-slate-950/90 border-t border-slate-800">
                <div className="flex items-start gap-2 text-[11px] font-sans">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                  <span className={`leading-tight font-medium ${
                    drone.aiSeverity === 'critical' 
                      ? 'text-red-400 font-bold' 
                      : drone.aiSeverity === 'warning'
                      ? 'text-amber-300'
                      : 'text-cyan-300'
                  }`}>
                    {drone.aiInsight}
                  </span>
                </div>
              </div>

              {/* Mini Status Strip (Battery, Signal, Altitude, Temp) */}
              <div className="p-3 bg-slate-950/50 border-t border-slate-800/80 grid grid-cols-4 gap-2 text-center text-xs">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <BatteryCharging className="w-3 h-3 text-cyan-400" /> BATT
                  </span>
                  <span className={`font-bold ${drone.battery <= 20 ? 'text-red-400' : 'text-slate-200'}`}>
                    {drone.battery}%
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-emerald-400" /> LINK
                  </span>
                  <span className="font-bold text-slate-200">{drone.signal}%</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-amber-400" /> ALT
                  </span>
                  <span className="font-bold text-slate-200">{drone.altitude}m</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-purple-400" /> TEMP
                  </span>
                  <span className="font-bold text-slate-200">{drone.temp}°C</span>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-2 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setExpandedDrone(drone.id)}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 text-xs font-bold rounded border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>VIEW TACTICAL FEED</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Fullscreen Expanded HUD Video Modal */}
      {activeExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/90 backdrop-blur-md">
          <div className="glass-card w-full max-w-4xl rounded-2xl border border-cyan-500/60 shadow-cyan-glow-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
                <div>
                  <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    TACTICAL HUD: {activeExpanded.id}
                    <span className="text-xs text-cyan-400 font-mono">[{activeExpanded.model}]</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-sans">
                    Target: {activeExpanded.missionId} | Satellites: {activeExpanded.satellites}
                  </p>
                </div>
              </div>

              {/* FLIR / Optical Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCameraMode(cameraMode === 'FLIR_THERMAL' ? 'HD_OPTICAL' : 'FLIR_THERMAL')}
                  className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold rounded border border-cyan-400/50 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>MODE: {cameraMode}</span>
                </button>

                <button
                  onClick={() => setExpandedDrone(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-700"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Video Canvas Body */}
            <div className="relative w-full h-[360px] md:h-[450px] bg-slate-950 overflow-hidden flex items-center justify-center">
              
              <div className={`absolute inset-0 ${
                cameraMode === 'FLIR_THERMAL'
                  ? 'bg-gradient-to-br from-indigo-950 via-purple-900 to-amber-900 opacity-90'
                  : 'bg-slate-900'
              }`}>
                {/* HUD Grid overlay */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-20">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="border border-cyan-400/40"></div>
                  ))}
                </div>
              </div>

              {/* Crosshair & Pitch/Roll Indicator */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-2 pointer-events-none">
                <Crosshair className="w-24 h-24 text-cyan-400/60 stroke-1 animate-pulse" />
                <div className="text-xs text-cyan-300 bg-black/70 px-3 py-1 rounded border border-cyan-500/40 font-mono">
                  HEADING: {activeExpanded.heading}° | ALT: {activeExpanded.altitude} m | PITCH: -12°
                </div>
              </div>

              {/* Top HUD Telemetry Corner */}
              <div className="absolute top-4 left-4 z-20 bg-slate-950/85 p-3 rounded border border-cyan-500/30 text-xs space-y-1">
                <div className="text-cyan-400 font-bold">FLIGHT TELEMETRY</div>
                <div className="text-slate-300">BATTERY: <span className="text-emerald-400 font-bold">{activeExpanded.battery}%</span></div>
                <div className="text-slate-300">SPEED: <span className="text-cyan-300 font-bold">{activeExpanded.speed} m/s</span></div>
                <div className="text-slate-300">SIGNAL: <span className="text-cyan-300 font-bold">{activeExpanded.signal}%</span></div>
              </div>

              {/* Bottom AI Insight Chip */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-950/90 p-3 rounded border border-cyan-500/50 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-cyan-300 font-sans">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>{activeExpanded.aiInsight}</span>
                </div>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded font-mono border border-cyan-500/30">
                  AI ML INFERENCE ACTIVE
                </span>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
