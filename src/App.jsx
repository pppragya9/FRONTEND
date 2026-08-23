import React from 'react';
import { TacticalProvider, useTactical } from './context/TacticalContext';
import { SwarmSummaryBar } from './components/shared/SwarmSummaryBar';
import { BottomNav } from './components/shared/BottomNav';
import { GlobalAlertBanner } from './components/shared/GlobalAlertBanner';
import { AdminCommand } from './components/AdminCommand/AdminCommand';
import { MissionControl } from './components/MissionControl/MissionControl';
import { FleetTracking } from './components/FleetTracking/FleetTracking';
import { TelemetryData } from './components/TelemetryData/TelemetryData';

const MainContent = () => {
  const { activeTab } = useTactical();

  return (
    <main className="min-h-screen bg-tactical-bg text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-300">
      <SwarmSummaryBar />
      <GlobalAlertBanner />

      <div className="pt-2">
        {activeTab === 'admin' && <AdminCommand />}
        {activeTab === 'mission' && <MissionControl />}
        {activeTab === 'fleet' && <FleetTracking />}
        {activeTab === 'telemetry' && <TelemetryData />}
      </div>

      <BottomNav />
    </main>
  );
};

export function App() {
  return (
    <TacticalProvider>
      <MainContent />
    </TacticalProvider>
  );
}

export default App;
