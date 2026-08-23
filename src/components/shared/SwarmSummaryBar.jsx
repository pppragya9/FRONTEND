import React from 'react';
import { useTactical } from '../../context/TacticalContext';
import { 
  ShieldAlert, 
  Wifi, 
  WifiOff, 
  Radio, 
  BatteryCharging, 
  UserCheck, 
  AlertTriangle,
  Flame,
  Activity,
  Zap
} from 'lucide-react';

export const SwarmSummaryBar = () => {
  const { 
    drones, 
    missions, 
    alerts, 
    userRole, 
    setUserRole, 
    isOffline, 
    toggleOfflineMode,
    queuedCommands,
    triggerEmergencyShutdown
  } = useTactical();

  const totalDrones = drones.length;
  const activeAirborne = drones.filter(d => d.status === 'AIRBORNE' || d.status === 'LOW_BATTERY').length;
  const activeMissionsCount = missions.filter(m => m.status === 'IN_PROGRESS').length;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'critical' || a.severity === 'warning').length;
  const lowBatteryCount = drones.filter(d => d.battery <= 20).length;

  return (
    <header className="w-full bg-tactical-dark/90 backdrop-blur-md border-b border-tactical-border px-3 py-2 text-xs font-mono select-none sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        {/* Brand & Swarm Ident */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-cyan-500/10 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-cyan-glow">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-slate-100 tracking-wider flex items-center gap-1.5 text-sm">
                AEROTACTICAL <span className="text-cyan-400 font-extrabold">COMMAND</span>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/30">UTM-v2.6</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-2">
                <span>DGCA SWARM MESH</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                  LIVE TELEMETRY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Swarm High-Level Metrics Strip */}
        <div className="hidden sm:flex items-center gap-4 bg-tactical-card/70 px-3 py-1.5 rounded border border-tactical-border/60">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">UNITS:</span>
            <span className="font-bold text-cyan-300">{activeAirborne}/{totalDrones} AIRBORNE</span>
          </div>

          <div className="h-3 w-px bg-slate-700"></div>

          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">MISSIONS:</span>
            <span className="font-bold text-amber-300">{activeMissionsCount} ACTIVE</span>
          </div>

          <div className="h-3 w-px bg-slate-700"></div>

          <div className="flex items-center gap-1.5">
            <BatteryCharging className={`w-3.5 h-3.5 ${lowBatteryCount > 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
            <span className="text-slate-400">LOW BATT:</span>
            <span className={`font-bold ${lowBatteryCount > 0 ? 'text-red-400 font-extrabold' : 'text-slate-200'}`}>
              {lowBatteryCount}
            </span>
          </div>

          <div className="h-3 w-px bg-slate-700"></div>

          <div className="flex items-center gap-1.5">
            <AlertTriangle className={`w-3.5 h-3.5 ${criticalAlertsCount > 0 ? 'text-red-400' : 'text-slate-400'}`} />
            <span className="text-slate-400">ALERTS:</span>
            <span className={`font-bold ${criticalAlertsCount > 0 ? 'text-red-400' : 'text-slate-300'}`}>
              {criticalAlertsCount}
            </span>
          </div>
        </div>

        {/* Tactical Control Toggles (Offline Simulator & Persona Switcher) */}
        <div className="flex items-center gap-2">
          
          {/* Offline Mode Toggle Button */}
          <button
            onClick={toggleOfflineMode}
            title={isOffline ? "Click to Reconnect Swarm Link" : "Click to Simulate Patchy/Offline Connectivity"}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all border ${
              isOffline
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-warning-glow animate-pulse'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-cyan-500/50 hover:text-cyan-300'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold">OFFLINE</span>
                {queuedCommands.length > 0 && (
                  <span className="bg-amber-500 text-slate-950 font-black rounded-full px-1.5 py-0.2 text-[10px]">
                    {queuedCommands.length}
                  </span>
                )}
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">LINK: ONLINE</span>
              </>
            )}
          </button>

          {/* User Persona Switcher (Admin vs Field Operator) */}
          <div className="flex items-center bg-slate-900/90 rounded border border-slate-800 p-0.5">
            <button
              onClick={() => setUserRole("ADMIN")}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                userRole === "ADMIN" 
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ADMIN
            </button>
            <button
              onClick={() => setUserRole("OPERATOR")}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                userRole === "OPERATOR" 
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/50" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              OPERATOR
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
