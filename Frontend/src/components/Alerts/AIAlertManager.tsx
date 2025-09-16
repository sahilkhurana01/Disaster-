import React, { useState, useEffect } from 'react';
import { AIAlertPopup } from './AIAlertPopup';
import { useAIAlerts } from '../../hooks/useAIAlerts';

export const AIAlertManager: React.FC = () => {
  const { alerts, loading, error } = useAIAlerts(8000); // 8-second intervals
  const [displayedAlerts, setDisplayedAlerts] = useState<Set<string>>(new Set());
  const [currentAlert, setCurrentAlert] = useState<AIAlert | null>(null);
  const [alertQueue, setAlertQueue] = useState<AIAlert[]>([]);

  // Process new alerts and add to queue
  useEffect(() => {
    if (alerts.length === 0) return;

    const newAlerts = alerts.filter(alert => 
      !displayedAlerts.has(alert.id) && !alert.resolved
    );

    if (newAlerts.length > 0) {
      setAlertQueue(prev => [...prev, ...newAlerts]);
      setDisplayedAlerts(prev => new Set([...prev, ...newAlerts.map(a => a.id)]));
    }
  }, [alerts, displayedAlerts]);

  // Process alert queue
  useEffect(() => {
    if (alertQueue.length > 0 && !currentAlert) {
      const nextAlert = alertQueue[0];
      setCurrentAlert(nextAlert);
      setAlertQueue(prev => prev.slice(1));
    }
  }, [alertQueue, currentAlert]);

  const handleAlertClose = () => {
    setCurrentAlert(null);
  };

  if (loading && alerts.length === 0) {
    return (
      <div className="fixed top-20 right-4 z-40 w-80">
        <div className="bg-neutral-900/95 border border-white/10 shadow-lg rounded-lg p-4 text-center">
          <div className="text-muted-foreground text-sm">
            Loading AI alerts...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-20 right-4 z-40 w-80">
        <div className="bg-neutral-900/95 border border-red-500/50 shadow-lg rounded-lg p-4 text-center">
          <div className="text-red-400 text-sm">
            Error loading AI alerts: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentAlert && (
        <AIAlertPopup
          alert={currentAlert}
          onClose={handleAlertClose}
          autoCloseDelay={8000}
        />
      )}
      
      {/* Queue indicator */}
      {alertQueue.length > 0 && (
        <div className="fixed top-20 right-4 z-40 w-80">
          <div className="bg-neutral-900/95 border border-white/10 shadow-lg rounded-lg p-3 text-center">
            <div className="text-muted-foreground text-sm">
              {alertQueue.length} alert{alertQueue.length !== 1 ? 's' : ''} in queue
            </div>
          </div>
        </div>
      )}
    </>
  );
};
