import React from 'react';
import { useTactical } from '../../context/TacticalContext';
import { AlertTriangle, Info, BellOff, X } from 'lucide-react';

export const GlobalAlertBanner = () => {
  const { alerts, dismissAlert } = useTactical();

  if (!alerts || alerts.length === 0) return null;

  // Show top active 3 alerts
  const displayAlerts = alerts.slice(0, 3);

  return (
    <div className="fixed top-14 right-3 z-50 flex flex-col gap-2 max-w-md w-full px-2 pointer-events-none">
      {displayAlerts.map(alert => {
        const isCritical = alert.severity === 'critical';
        const isWarning = alert.severity === 'warning';

        return (
          <div
            key={alert.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3 rounded-lg border text-xs font-mono backdrop-blur-md shadow-lg transition-all animate-bounce-once ${
              isCritical
                ? 'bg-red-950/90 border-red-500 text-red-200 shadow-danger-glow'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500 text-amber-200 shadow-warning-glow'
                : 'bg-slate-900/90 border-cyan-500/50 text-cyan-200 shadow-cyan-glow'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5">
                {isCritical ? (
                  <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                ) : isWarning ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                ) : (
                  <Info className="w-5 h-5 text-cyan-400" />
                )}
              </div>

              <div>
                <div className="font-bold tracking-wide uppercase flex items-center gap-2">
                  <span>{alert.title}</span>
                  <span className="text-[9px] opacity-75 font-normal">[{alert.timestamp}]</span>
                </div>
                <p className="text-[11px] mt-0.5 opacity-90 leading-relaxed font-sans">
                  {alert.message}
                </p>
                {alert.droneId && (
                  <span className="inline-block mt-1 px-1.5 py-0.5 bg-black/40 rounded text-[10px] font-mono border border-white/10">
                    TARGET: {alert.droneId}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => dismissAlert(alert.id)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10"
              title="Dismiss Alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
