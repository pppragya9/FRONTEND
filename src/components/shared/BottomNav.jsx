import React from 'react';
import { useTactical } from '../../context/TacticalContext';
import { 
  ShieldCheck, 
  Compass, 
  Radar, 
  BarChart3 
} from 'lucide-react';

export const BottomNav = () => {
  const { activeTab, setActiveTab } = useTactical();

  const tabs = [
    {
      id: 'admin',
      label: 'Admin Command',
      shortLabel: 'Admin',
      icon: ShieldCheck,
      badge: 'DGCA Rules'
    },
    {
      id: 'mission',
      label: 'Mission Control',
      shortLabel: 'Missions',
      icon: Compass,
      badge: 'Live Map'
    },
    {
      id: 'fleet',
      label: 'Fleet Tracking',
      shortLabel: 'Fleet HUD',
      icon: Radar,
      badge: 'Video Feeds'
    },
    {
      id: 'telemetry',
      label: 'Telemetry Data',
      shortLabel: 'Telemetry',
      icon: BarChart3,
      badge: 'Gauges & Logs'
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-tactical-dark/95 backdrop-blur-lg border-t border-tactical-border px-2 py-1 select-none">
      <div className="max-w-5xl mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 min-w-[72px] sm:min-w-[110px] rounded-lg transition-all ${
                isActive
                  ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 shadow-cyan-glow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 bg-cyan-400 rounded-full shadow-cyan-glow"></span>
              )}

              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'animate-pulse text-cyan-300' : ''}`} />
              <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-tight">
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="inline sm:hidden">{tab.shortLabel}</span>
              </span>

              {/* Mobile badge */}
              <span className="hidden md:inline text-[9px] font-mono text-slate-500 mt-0.5">
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
