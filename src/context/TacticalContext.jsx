import React, { createContext, useContext, useState, useEffect } from 'react';
import { telemetrySimulator, INITIAL_MISSIONS, INITIAL_GEOFENCES } from '../services/telemetrySimulator';

const TacticalContext = createContext(null);

const INITIAL_AUDIT_LOGS = [
  {
    id: "LOG-98401",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: "Cmdr. Rajesh V. (Admin)",
    action: "DGCA Max Altitude Lock Enforced (400 ft / 121.9 m)",
    category: "COMPLIANCE",
    status: "APPROVED",
    dgcaRef: "DGCA-UTM-REG-2026-A"
  },
  {
    id: "LOG-98402",
    timestamp: new Date(Date.now() - 2400000).toISOString(),
    user: "Op. Priya Sharma (Field)",
    action: "Dispatched UAV-01 ALPHA for Search & Rescue Mission MIS-2026-SAR-01",
    category: "MISSION",
    status: "EXECUTED",
    dgcaRef: "DGCA-OPS-4412"
  },
  {
    id: "LOG-98403",
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    user: "SYSTEM (AI Core)",
    action: "AI Anomaly Triggered: Thermal Hotspot Identified Sector 4",
    category: "AI_INSIGHT",
    status: "FLAGGED",
    dgcaRef: "AI-DET-8831"
  },
  {
    id: "LOG-98404",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    user: "Cmdr. Rajesh V. (Admin)",
    action: "Geofence GEO-01 Airport Buffer Zone Status Verified Active",
    category: "SAFETY",
    status: "ENFORCED",
    dgcaRef: "DGCA-NFZ-0091"
  }
];

export const TacticalProvider = ({ children }) => {
  const [drones, setDrones] = useState([]);
  const [historyBuffer, setHistoryBuffer] = useState({});
  const [missions, setMissions] = useState(INITIAL_MISSIONS);
  const [geofences, setGeofences] = useState(INITIAL_GEOFENCES);
  const [alerts, setAlerts] = useState([
    {
      id: "ALT-SYS-INIT",
      title: "SYSTEM READY: AeroTactical Swarm Core",
      message: "DGCA Autonomous UAV Protocol initialized. 5 units active.",
      severity: "info",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }
  ]);
  const [activeTab, setActiveTab] = useState("mission"); // admin | mission | fleet | telemetry
  const [selectedDroneId, setSelectedDroneId] = useState("UAV-01 ALPHA");
  const [userRole, setUserRole] = useState("ADMIN"); // ADMIN | OPERATOR
  const [isOffline, setIsOffline] = useState(false);
  const [queuedCommands, setQueuedCommands] = useState([]);
  
  // Flight Safety Settings
  const [flightSafety, setFlightSafety] = useState({
    maxAltitudeFeet: 400, // DGCA limit
    geofenceEnforced: true,
    autoPilotEnabled: true,
    rthBatteryThreshold: 25,
    telemetryRetentionDays: 30
  });

  // Audit logs
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Subscribe to Telemetry Simulator
  useEffect(() => {
    telemetrySimulator.start();

    const unsubscribeTelemetry = telemetrySimulator.subscribe((updatedDrones, updatedHistory) => {
      setDrones(updatedDrones);
      setHistoryBuffer(updatedHistory);
    });

    const unsubscribeAlerts = telemetrySimulator.subscribeAlerts((newAlert) => {
      setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
    });

    return () => {
      unsubscribeTelemetry();
      unsubscribeAlerts();
      telemetrySimulator.stop();
    };
  }, []);

  // Update simulator offline state
  const toggleOfflineMode = () => {
    const nextOffline = !isOffline;
    setIsOffline(nextOffline);
    telemetrySimulator.setOffline(nextOffline);

    if (nextOffline) {
      addAlert({
        id: `ALT-OFFLINE-${Date.now()}`,
        title: "NETWORK DISCONNECTED (Offline Resilience Mode)",
        message: "Swarm telemetry locked in local cache. Commands will queue until link restored.",
        severity: "warning"
      });
      addAuditLog("Network disconnect simulated. System switched to Low-Bandwidth/Offline Mode.", userRole, "NETWORK");
    } else {
      addAlert({
        id: `ALT-ONLINE-${Date.now()}`,
        title: "NETWORK RE-ESTABLISHED",
        message: `${queuedCommands.length} queued commands uploaded to Swarm mesh network.`,
        severity: "info"
      });
      addAuditLog(`Network link restored. Processed ${queuedCommands.length} queued command(s).`, userRole, "NETWORK");
      setQueuedCommands([]);
    }
  };

  const addAlert = (alertObj) => {
    const fullAlert = {
      id: alertObj.id || `ALT-${Date.now()}`,
      timestamp: alertObj.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      ...alertObj
    };
    setAlerts(prev => [fullAlert, ...prev.slice(0, 9)]);
  };

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const addAuditLog = (action, user = userRole, category = "OPERATION") => {
    const newLog = {
      id: `LOG-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      user: user === "ADMIN" ? "Cmdr. Rajesh V. (Admin)" : "Op. Field Team (Operator)",
      action,
      category,
      status: "EXECUTED",
      dgcaRef: `DGCA-LOG-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Actions
  const dispatchMission = (missionId) => {
    if (isOffline) {
      setQueuedCommands(prev => [...prev, { action: 'DISPATCH_MISSION', missionId, timestamp: new Date().toISOString() }]);
      addAlert({
        title: "Command Queued (Offline)",
        message: `Dispatch command for ${missionId} queued for upload.`,
        severity: "warning"
      });
      return;
    }

    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, status: 'IN_PROGRESS', eta: '12 mins' } : m));
    const targetMission = missions.find(m => m.id === missionId);
    if (targetMission) {
      addAlert({
        title: "MISSION DISPATCHED",
        message: `Mission ${targetMission.id} launched with ${targetMission.droneId}`,
        severity: "info"
      });
      addAuditLog(`Dispatched Mission ${targetMission.id} (${targetMission.name})`, userRole, "MISSION");
    }
  };

  const abortMission = (missionId) => {
    if (isOffline) {
      setQueuedCommands(prev => [...prev, { action: 'ABORT_MISSION', missionId, timestamp: new Date().toISOString() }]);
      addAlert({
        title: "Abort Queued (Offline)",
        message: `Abort trigger for ${missionId} queued.`,
        severity: "critical"
      });
      return;
    }

    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, status: 'ABORTED', eta: 'ABORTED' } : m));
    const targetMission = missions.find(m => m.id === missionId);
    if (targetMission) {
      addAlert({
        title: "EMERGENCY MISSION ABORT",
        message: `Mission ${targetMission.id} aborted! UAV instructed to Return-To-Home immediately.`,
        severity: "critical"
      });
      addAuditLog(`Emergency Abort ordered for Mission ${targetMission.id} (${targetMission.droneId})`, userRole, "EMERGENCY");
    }
  };

  const triggerEmergencyShutdown = () => {
    addAlert({
      title: "🚨 EMERGENCY FLEET SHUTDOWN EXECUTED",
      message: "All airborne UAV units instructed to perform immediate controlled vertical touchdown.",
      severity: "critical"
    });
    setMissions(prev => prev.map(m => ({ ...m, status: 'ABORTED', eta: 'SHUTDOWN' })));
    addAuditLog("CRITICAL: Master Fleet Emergency Shutdown Executed by Administrator.", userRole, "EMERGENCY");
  };

  const updateFlightSafety = (newSettings) => {
    setFlightSafety(prev => ({ ...prev, ...newSettings }));
    addAuditLog(`Updated Flight Safety Parameters: Max Alt = ${newSettings.maxAltitudeFeet || flightSafety.maxAltitudeFeet} ft`, userRole, "SAFETY");
  };

  const createMission = (newMissionObj) => {
    const fullMission = {
      id: `MIS-2026-NEW-${Math.floor(100 + Math.random() * 900)}`,
      status: "IN_PROGRESS",
      eta: "15 mins",
      distance: "2.1 km",
      waypoints: [[28.6139, 77.2090], [28.6180, 77.2140]],
      ...newMissionObj
    };
    setMissions(prev => [fullMission, ...prev]);
    addAlert({
      title: "NEW MISSION CREATED",
      message: `Mission ${fullMission.id} created and assigned to ${fullMission.droneId}`,
      severity: "info"
    });
    addAuditLog(`Created new tactical mission ${fullMission.id} (${fullMission.name})`, userRole, "MISSION");
  };

  const toggleGeofenceStatus = (id) => {
    setGeofences(prev => prev.map(g => g.id === id ? { ...g, status: g.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : g));
    const target = geofences.find(g => g.id === id);
    addAuditLog(`Toggled Geofence Zone ${target?.name} status`, userRole, "SAFETY");
  };

  return (
    <TacticalContext.Provider value={{
      drones,
      historyBuffer,
      missions,
      geofences,
      alerts,
      activeTab,
      setActiveTab,
      selectedDroneId,
      setSelectedDroneId,
      userRole,
      setUserRole,
      isOffline,
      toggleOfflineMode,
      queuedCommands,
      flightSafety,
      updateFlightSafety,
      auditLogs,
      dispatchMission,
      abortMission,
      triggerEmergencyShutdown,
      createMission,
      toggleGeofenceStatus,
      dismissAlert,
      addAuditLog
    }}>
      {children}
    </TacticalContext.Provider>
  );
};

export const useTactical = () => {
  const context = useContext(TacticalContext);
  if (!context) {
    throw new Error('useTactical must be used within a TacticalProvider');
  }
  return context;
};
