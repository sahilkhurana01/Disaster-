import { useEffect, useRef } from 'react';
import { useCommandStore } from '../stores/commandStore';

const mockScenarios = [
  {
    title: 'Earthquake Detected - Magnitude 6.2',
    category: 'critical' as const,
    location: { lat: 28.7041, lng: 77.1025, name: 'Delhi NCR, India' },
    severity: 0.95,
    description: 'Seismic activity detected. Buildings may be damaged. Immediate evacuation protocols activated.',
  },
  {
    title: 'Cyclone Alert - Coastal Areas',
    category: 'warning' as const,
    location: { lat: 13.0827, lng: 80.2707, name: 'Chennai, Tamil Nadu' },
    severity: 0.8,
    description: 'Category 3 cyclone approaching coast. Wind speeds 180+ kmh. Mass evacuation required.',
  },
  {
    title: 'Medical Emergency - Mass Casualty',
    category: 'critical' as const,
    location: { lat: 19.0760, lng: 72.8777, name: 'Mumbai Central, Maharashtra' },
    severity: 0.9,
    description: 'Multiple casualties reported at industrial accident. All available medical units dispatched.',
  },
  {
    title: 'Fire Outbreak - Industrial Zone',
    category: 'warning' as const,
    location: { lat: 22.5726, lng: 88.3639, name: 'Kolkata, West Bengal' },
    severity: 0.7,
    description: 'Chemical plant fire spreading rapidly. Toxic smoke plume detected. Evacuation zone 2km radius.',
  },
  {
    title: 'Landslide Warning - Hill Station',
    category: 'warning' as const,
    location: { lat: 11.4064, lng: 76.6932, name: 'Ooty, Tamil Nadu' },
    severity: 0.6,
    description: 'Heavy rainfall triggering landslide risk. Tourist areas being evacuated as precaution.',
  },
  {
    title: 'Supply Drop Successful',
    category: 'success' as const,
    location: { lat: 26.9124, lng: 75.7873, name: 'Jaipur, Rajasthan' },
    severity: 0.3,
    description: 'Emergency supplies successfully delivered to flood-affected region. 500 families assisted.',
  },
  {
    title: 'Rescue Operation Complete',
    category: 'success' as const,
    location: { lat: 15.2993, lng: 74.1240, name: 'Goa, India' },
    severity: 0.2,
    description: 'Stranded tourists successfully rescued from flooding area. All 127 persons safe.',
  },
];

export const useSimulation = () => {
  const { isSimulationMode, addAlert, updateStatistics, statistics } = useCommandStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scenarioIndexRef = useRef(0);

  useEffect(() => {
    if (isSimulationMode) {
      // Add new scenario every 15-30 seconds
      intervalRef.current = setInterval(() => {
        const scenario = mockScenarios[scenarioIndexRef.current % mockScenarios.length];
        
        // Add some randomization to coordinates
        const randomLat = scenario.location.lat + (Math.random() - 0.5) * 0.1;
        const randomLng = scenario.location.lng + (Math.random() - 0.5) * 0.1;
        
        addAlert({
          ...scenario,
          location: {
            ...scenario.location,
            lat: randomLat,
            lng: randomLng,
          },
          // Add some randomization to severity
          severity: Math.max(0.1, Math.min(1, scenario.severity + (Math.random() - 0.5) * 0.2)),
          resolved: false,
        });

        // Update statistics
        updateStatistics({
          activeAlerts: statistics.activeAlerts + 1,
          rescueTeamsActive: statistics.rescueTeamsActive + (Math.random() > 0.7 ? 1 : 0),
          reliefDispatched: statistics.reliefDispatched + (Math.random() > 0.8 ? 1 : 0),
          peopleEvacuated: statistics.peopleEvacuated + Math.floor(Math.random() * 100) + 20,
        });
        
        scenarioIndexRef.current++;
      }, 15000 + Math.random() * 15000); // 15-30 seconds

      // Also update statistics periodically during simulation
      const statsInterval = setInterval(() => {
        updateStatistics({
          rescueTeamsActive: Math.max(8, Math.min(20, statistics.rescueTeamsActive + (Math.random() > 0.5 ? 1 : -1))),
          peopleEvacuated: statistics.peopleEvacuated + Math.floor(Math.random() * 50) + 10,
        });
      }, 8000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        clearInterval(statsInterval);
      };
    } else {
      // Clear interval when simulation is turned off
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isSimulationMode, addAlert, updateStatistics, statistics]);

  return { isSimulationMode };
};