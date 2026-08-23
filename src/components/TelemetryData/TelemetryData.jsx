import React, { useState } from 'react';
import { useTactical } from '../../context/TacticalContext';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  Activity, 
  BatteryCharging, 
  Wifi, 
  Compass, 
  Thermometer, 
  Zap, 
  MapPin, 
  Download, 
  Filter, 
  FileText,
  Search
} from 'lucide-react';

export const TelemetryData = () => {
  const { drones, historyBuffer, selectedDroneId, setSelectedDroneId, auditLogs } = useTactical();
  const [logFilterSeverity, setLogFilterSeverity] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const activeDrone = drones.find(d => d.id === selectedDroneId) || drones[0];
  const activeHistory = historyBuffer[activeDrone?.id] || [];

  // Generate downloadable CSV string
  const handleExportCSV = () => {
    const headers = ["Log ID", "Timestamp", "User/Operator", "Action/Event", "Category", "DGCA Ref Code"];
    const rows = auditLogs.map(log => [
      log.id,
      `"${log.timestamp}"`,
      `"${log.user}"`,
      `"${log.action.replace(/"/g, '""')}"`,
      log.category,
      log.dgcaRef
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AeroTactical_Telemetry_Logs_${activeDrone?.id}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-3 pt-4 font-mono">
      
      {/* Header & Drone Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-xl border border-cyan-500/30">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
            TELEMETRY ANALYTICS & FLIGHT DATA LOGS
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            High-frequency sensor stream processing & real-time telemetry diagnostics.
          </p>
        </div>

        {/* Drone Selector Dropdown */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 pl-2">FOCUS UNIT:</span>
          <select
            value={selectedDroneId}
            onChange={(e) => setSelectedDroneId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded px-3 py-1 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
          >
            {drones.map(d => (
              <option key={d.id} value={d.id}>{d.id} ({d.name})</option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. Real-Time Telemetry Gauges Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* Gauge 1: Battery % */}
        <div className={`p-4 rounded-xl border text-center glass-card space-y-1 ${
          activeDrone.battery <= 20 ? 'border-red-500/60 shadow-danger-glow' : 'border-cyan-500/30'
        }`}>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <BatteryCharging className={`w-4 h-4 ${activeDrone.battery <= 20 ? 'text-red-400 animate-bounce' : 'text-cyan-400'}`} />
            <span>BATTERY</span>
          </div>
          <div className={`text-2xl font-bold font-mono ${
            activeDrone.battery <= 20 ? 'text-red-400' : 'text-emerald-400'
          }`}>
            {activeDrone.battery}%
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className={`h-full transition-all ${activeDrone.battery <= 20 ? 'bg-red-500' : 'bg-emerald-400'}`}
              style={{ width: `${activeDrone.battery}%` }}
            ></div>
          </div>
        </div>

        {/* Gauge 2: Signal Strength % */}
        <div className="p-4 rounded-xl border border-cyan-500/30 text-center glass-card space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>SIGNAL LINK</span>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300">
            {activeDrone.signal}%
          </div>
          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-cyan-400 transition-all"
              style={{ width: `${activeDrone.signal}%` }}
            ></div>
          </div>
        </div>

        {/* Gauge 3: Altitude (m) */}
        <div className="p-4 rounded-xl border border-cyan-500/30 text-center glass-card space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>ALTITUDE</span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300">
            {activeDrone.altitude} <span className="text-xs">m</span>
          </div>
          <div className="text-[10px] text-slate-400 font-sans">
            AGL: {Math.round(activeDrone.altitude * 3.28084)} ft (Cap 400ft)
          </div>
        </div>

        {/* Gauge 4: Speed (m/s) */}
        <div className="p-4 rounded-xl border border-cyan-500/30 text-center glass-card space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>AIR SPEED</span>
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300">
            {activeDrone.speed} <span className="text-xs">m/s</span>
          </div>
          <div className="text-[10px] text-slate-400 font-sans">
            ~{Math.round(activeDrone.speed * 3.6)} km/h
          </div>
        </div>

        {/* Gauge 5: Core Temp */}
        <div className="p-4 rounded-xl border border-cyan-500/30 text-center glass-card space-y-1 col-span-2 md:col-span-1">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Thermometer className="w-4 h-4 text-rose-400" />
            <span>CORE TEMP</span>
          </div>
          <div className={`text-2xl font-bold font-mono ${
            activeDrone.temp > 55 ? 'text-red-400' : 'text-slate-100'
          }`}>
            {activeDrone.temp}°C
          </div>
          <div className="text-[10px] text-slate-400 font-sans">
            Rotor RPM: {activeDrone.status === 'AIRBORNE' ? '5,400' : '0'}
          </div>
        </div>

      </div>

      {/* 2. GPS & Coordinates Readout Card */}
      <div className="glass-card p-4 rounded-xl border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/40 text-cyan-400">
            <MapPin className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-slate-400">PRECISION GPS FIX</div>
            <div className="text-sm font-bold text-slate-100 font-mono">
              LAT: <span className="text-cyan-300">{activeDrone.lat.toFixed(5)}° N</span> | LNG: <span className="text-cyan-300">{activeDrone.lng.toFixed(5)}° E</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-300">
          <div>SATELLITES: <span className="text-emerald-400 font-bold">{activeDrone.satellites} FIXED</span></div>
          <div>HDOP: <span className="text-cyan-300 font-bold">{activeDrone.hdop}</span></div>
          <div>MODE: <span className="text-amber-300 font-bold">{activeDrone.mode}</span></div>
        </div>
      </div>

      {/* 3. Recharts Telemetry Trend Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Battery Drain Curve Chart */}
        <div className="glass-card p-5 rounded-xl border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-bold border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <h2>BATTERY DRAIN RATE OVER TIME</h2>
            </div>
            <span className="text-[10px] text-slate-400">UNIT: {activeDrone.id}</span>
          </div>

          <div className="w-full h-56 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activeHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#00d4ff', color: '#e2e8f0' }} />
                <Line type="monotone" dataKey="battery" stroke="#00e676" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Signal Strength & Altitude Trend Chart */}
        <div className="glass-card p-5 rounded-xl border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs text-cyan-400 font-bold border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-cyan-400" />
              <h2>SIGNAL STRENGTH VS ALTITUDE</h2>
            </div>
            <span className="text-[10px] text-slate-400">UNIT: {activeDrone.id}</span>
          </div>

          <div className="w-full h-56 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activeHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 150]} stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#00d4ff', color: '#e2e8f0' }} />
                <Area type="monotone" dataKey="signal" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.15} />
                <Area type="monotone" dataKey="altitude" stroke="#ffb020" fill="#ffb020" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4. Session & Flight Logs Table + Export CSV */}
      <div className="glass-card p-5 rounded-xl space-y-4 border border-cyan-500/30">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold">
            <FileText className="w-4 h-4" />
            <h2>FLIGHT SESSION LOGS & EXPORT</h2>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg shadow-success-glow flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT TELEMETRY CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="py-2.5 px-3">LOG ID</th>
                <th className="py-2.5 px-3">TIMESTAMP</th>
                <th className="py-2.5 px-3">AUTHOR / EVENT</th>
                <th className="py-2.5 px-3">ACTION DESCRIPTION</th>
                <th className="py-2.5 px-3">CATEGORY</th>
                <th className="py-2.5 px-3">COMPLIANCE REF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 text-cyan-400 font-bold">{log.id}</td>
                  <td className="py-2 px-3 text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-2 px-3 text-slate-200">{log.user}</td>
                  <td className="py-2 px-3 text-slate-300 font-sans">{log.action}</td>
                  <td className="py-2 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-cyan-300 border border-slate-700">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-emerald-400 font-bold">{log.dgcaRef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
