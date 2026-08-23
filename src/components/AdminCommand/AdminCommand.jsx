import React, { useState } from 'react';
import { useTactical } from '../../context/TacticalContext';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Sliders, 
  MapPin, 
  FileText, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Database,
  Search,
  ExternalLink
} from 'lucide-react';

export const AdminCommand = () => {
  const { 
    userRole, 
    flightSafety, 
    updateFlightSafety, 
    geofences, 
    toggleGeofenceStatus, 
    auditLogs,
    triggerEmergencyShutdown,
    addAuditLog
  } = useTactical();

  const [isShutdownOpen, setIsShutdownOpen] = useState(false);
  const [altInput, setAltInput] = useState(flightSafety.maxAltitudeFeet);
  const [logSearch, setLogSearch] = useState("");

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log => 
    log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
    log.user.toLowerCase().includes(logSearch.toLowerCase()) ||
    log.dgcaRef.toLowerCase().includes(logSearch.toLowerCase())
  );

  const handleAltChange = (e) => {
    const val = Number(e.target.value);
    setAltInput(val);
    updateFlightSafety({ maxAltitudeFeet: val });
  };

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-3 pt-4">
      
      {/* 1. Fleet Administration Header & Emergency Trigger */}
      <div className="glass-card p-5 rounded-xl border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-mono font-bold tracking-wider text-slate-100 flex items-center gap-2">
              FLEET ADMINISTRATION & UTILITY GOVERNANCE
            </h1>
            <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold border ${
              userRole === "ADMIN" 
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/50" 
                : "bg-emerald-500/20 text-emerald-300 border-emerald-400/50"
            }`}>
              {userRole} MODE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-1">
            DGCA DigitalSky & Airspace Safety Protocol Enforcement Engine. Real-time fleet locking & audit traceability.
          </p>
        </div>

        {/* Emergency Fleet Shutdown Trigger */}
        <button
          onClick={() => setIsShutdownOpen(true)}
          className="px-4 py-2.5 bg-red-600/90 hover:bg-red-500 text-white font-mono text-xs font-bold rounded-lg shadow-danger-glow flex items-center gap-2 border border-red-400 transition-all"
        >
          <ShieldAlert className="w-4 h-4 animate-pulse" />
          <span>EMERGENCY FLEET SHUTDOWN</span>
        </button>
      </div>

      {/* Confirmation Modal for Fleet Shutdown */}
      <ConfirmDialog
        isOpen={isShutdownOpen}
        title="CRITICAL: MASTER FLEET SHUTDOWN"
        message="Warning: This action will issue an immediate airborne kill-switch to all active UAV units in the tactical mesh network. Drones will execute controlled emergency descent or return to home."
        confirmText="EXECUTE SHUTDOWN"
        confirmCode="SHUTDOWN"
        onConfirm={triggerEmergencyShutdown}
        onCancel={() => setIsShutdownOpen(false)}
        severity="danger"
      />

      {/* 2. Grid: Flight Safety & Geofencing Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Flight Safety & DGCA Rules */}
        <div className="glass-card p-5 rounded-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-700/60 text-cyan-400 font-mono text-sm font-bold">
            <Sliders className="w-4 h-4" />
            <h2>FLIGHT SAFETY & DGCA AIRSPACE RULES</h2>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* DGCA Altitude Lock Input */}
            <div className="bg-slate-950/70 p-3 rounded border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-bold">DGCA MAX ALTITUDE LOCK</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  altInput <= 400 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {altInput <= 400 ? 'DGCA COMPLIANT' : 'EXCEEDS DGCA CAP'}
                </span>
              </div>
              <p className="text-[11px] font-sans text-slate-400">
                Rule 34(a) limits micro/small UAV operations to 400 ft (121.9 meters) AGL in Green Zones.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="number"
                  value={altInput}
                  onChange={handleAltChange}
                  className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 w-32 text-cyan-300 font-mono text-sm focus:outline-none focus:border-cyan-400"
                />
                <span className="text-slate-400">FEET ({Math.round(altInput * 0.3048)} m)</span>
              </div>
            </div>

            {/* Geofence Enforcement Toggle */}
            <div className="flex items-center justify-between bg-slate-950/70 p-3 rounded border border-slate-800">
              <div>
                <span className="text-slate-300 font-bold block">GEOFENCE ENFORCEMENT ENGINE</span>
                <span className="text-[11px] font-sans text-slate-400">Prevent entry into active No-Fly Zones</span>
              </div>
              <button
                onClick={() => updateFlightSafety({ geofenceEnforced: !flightSafety.geofenceEnforced })}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  flightSafety.geofenceEnforced 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/50'
                }`}
              >
                {flightSafety.geofenceEnforced ? 'ENFORCED' : 'DISABLED'}
              </button>
            </div>

            {/* Auto-Pilot / Fail-Safe Toggle */}
            <div className="flex items-center justify-between bg-slate-950/70 p-3 rounded border border-slate-800">
              <div>
                <span className="text-slate-300 font-bold block">AUTONOMOUS FAIL-SAFE & AUTO-PILOT</span>
                <span className="text-[11px] font-sans text-slate-400">Auto Return-to-Home on signal loss &gt; 5 sec</span>
              </div>
              <button
                onClick={() => updateFlightSafety({ autoPilotEnabled: !flightSafety.autoPilotEnabled })}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  flightSafety.autoPilotEnabled 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                }`}
              >
                {flightSafety.autoPilotEnabled ? 'ACTIVE' : 'MANUAL'}
              </button>
            </div>

            {/* RTH Battery Threshold */}
            <div className="bg-slate-950/70 p-3 rounded border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-bold">RTH BATTERY THRESHOLD</span>
                <span className="text-amber-400 font-bold">{flightSafety.rthBatteryThreshold}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="40"
                value={flightSafety.rthBatteryThreshold}
                onChange={(e) => updateFlightSafety({ rthBatteryThreshold: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Restricted & No-Fly Zones Manager */}
        <div className="glass-card p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 text-cyan-400 font-mono text-sm font-bold">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <h2>AUTOMATION & NO-FLY ZONES</h2>
            </div>
            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              {geofences.length} Active Zones
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {geofences.map(zone => (
              <div 
                key={zone.id}
                className="bg-slate-950/80 p-3 rounded border border-slate-800 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${zone.status === 'ACTIVE' ? 'bg-red-400 animate-pulse' : 'bg-slate-600'}`}></span>
                    <span className="font-bold text-slate-200">{zone.name}</span>
                  </div>
                  <div className="text-[11px] font-sans text-slate-400 mt-0.5">
                    Type: <span className="text-cyan-300 font-mono">{zone.type}</span> | Cap: {zone.maxAltFeet} ft AGL
                  </div>
                </div>

                <button
                  onClick={() => toggleGeofenceStatus(zone.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-all ${
                    zone.status === 'ACTIVE'
                      ? 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {zone.status === 'ACTIVE' ? 'ENFORCED' : 'INACTIVE'}
                </button>
              </div>
            ))}

            {/* Retention Setting */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2 text-slate-300 font-bold mb-2">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>TELEMETRY DATA RETENTION POLICY</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-[11px]">
                {['7 DAYS', '30 DAYS', '90 DAYS', 'UNLIMITED'].map(period => (
                  <button
                    key={period}
                    onClick={() => addAuditLog(`Retention policy changed to ${period}`, userRole, "POLICY")}
                    className={`py-1.5 text-center rounded border transition-all ${
                      period.includes('30')
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. Role-Based Access Control (RBAC) & DGCA Audit Logs */}
      <div className="glass-card p-5 rounded-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-700/60 font-mono">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
            <FileText className="w-4 h-4" />
            <h2>PERMISSIONS & COMPLIANCE AUDIT LOGS</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Search audit logs or DGCA code..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 w-64"
              />
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="py-2.5 px-3">LOG ID</th>
                <th className="py-2.5 px-3">TIMESTAMP</th>
                <th className="py-2.5 px-3">OPERATOR / USER</th>
                <th className="py-2.5 px-3">ACTION EXECUTED</th>
                <th className="py-2.5 px-3">CATEGORY</th>
                <th className="py-2.5 px-3">DGCA REF CODE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-cyan-400 font-bold">{log.id}</td>
                  <td className="py-2 px-3 text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-2 px-3 text-slate-200 font-semibold">{log.user}</td>
                  <td className="py-2 px-3 text-slate-300 font-sans">{log.action}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-emerald-400 text-[11px] font-bold">
                    {log.dgcaRef}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
