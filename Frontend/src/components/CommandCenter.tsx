import React from 'react';
import { MapContainer } from './MapContainer';
import { HUDOverlay } from './HUD/HUDOverlay';
import { CommandSidebar } from './Sidebar/CommandSidebar';
import { AlertStack } from './Alerts/AlertStack';
import { AIAlertManager } from './Alerts/AIAlertManager';
import { EmergencyButton } from './Emergency/EmergencyButton';
import { StatisticsPanel } from './Statistics/StatisticsPanel';
import { useSimulation } from '../hooks/useSimulation';

export const CommandCenter: React.FC = () => {
  // Initialize simulation system
  useSimulation();

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      {/* Main Map Layer */}
      <MapContainer />
      
      {/* HUD Overlay */}
      <HUDOverlay />
      
      
     <CommandSidebar />
   
      
      {/* AI Alerts Stack - Top Right */}
      <AlertStack />
      
      {/* AI Alert Manager - Real-time popups */}
      <AIAlertManager />
      
      {/* Statistics Panel - Center Left */}
      <div className='fixed left-4 top-40 -translate-y-1/2 z-30 w-72'>
      <StatisticsPanel  />
      </div>
      
      {/* Emergency Button - Bottom Right */}
      <EmergencyButton />
    </div>
  );
};