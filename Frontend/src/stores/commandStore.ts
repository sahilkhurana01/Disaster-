import { create } from 'zustand';

export interface Alert {
  id: string;
  title: string;
  category: 'critical' | 'warning' | 'info' | 'success';
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  severity: number; // 0-1
  timestamp: Date;
  description: string;
  resolved: boolean;
}

export interface Resource {
  id: string;
  type: 'ambulance' | 'firetruck' | 'police' | 'hospital' | 'shelter' | 'supply';
  name: string;
  status: 'active' | 'deployed' | 'standby' | 'maintenance';
  location: {
    lat: number;
    lng: number;
  };
  capacity?: number;
  available?: number;
}

export interface Statistics {
  activeAlerts: number;
  resolvedToday: number;
  rescueTeamsActive: number;
  reliefDispatched: number;
  sheltersOpen: number;
  peopleEvacuated: number;
}

export interface SafetyPlace {
  id: string;
  type: 'hospital' | 'shelter' | 'school' | 'college' | 'community';
  name: string;
  location: { lat: number; lng: number };
  capacity?: number;
  food?: number;
  availableAmbulances?: number;
}

export interface HazardArea {
  id: string;
  center: { lat: number; lng: number };
  radiusMeters: number;
  label?: string;
}

interface CommandStore {
  // State
  alerts: Alert[];
  resources: Resource[];
  statistics: Statistics;
  isSimulationMode: boolean;
  selectedAlert: Alert | null;
  userLocation: { lat: number; lng: number; accuracy?: number } | null;
  safetyPlaces: SafetyPlace[];
  hazardAreas: HazardArea[];
  
  // Actions
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  resolveAlert: (id: string) => void;
  selectAlert: (alert: Alert | null) => void;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  toggleSimulation: () => void;
  updateStatistics: (updates: Partial<Statistics>) => void;
  updateUserLocation: (loc: { lat: number; lng: number; accuracy?: number } | null) => void;
  setSafetyPlaces: (places: SafetyPlace[]) => void;
  addHazardArea: (area: Omit<HazardArea, 'id'>) => void;
  removeHazardArea: (id: string) => void;
}

// Mock data for demo
const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Flood Emergency - Sector 7',
    category: 'critical',
    location: { lat: 28.6139, lng: 77.2090, name: 'New Delhi, India' },
    severity: 0.9,
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    description: 'Severe flooding reported in residential area. 150+ families need immediate evacuation.',
    resolved: false,
  },
  {
    id: '2',
    title: 'Medical Emergency - Urban Hospital',
    category: 'warning',
    location: { lat: 19.0760, lng: 72.8777, name: 'Mumbai, India' },
    severity: 0.7,
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    description: 'Hospital at capacity. Additional medical support required.',
    resolved: false,
  },
  {
    id: '3',
    title: 'Supply Drop Completed',
    category: 'success',
    location: { lat: 13.0827, lng: 80.2707, name: 'Chennai, India' },
    severity: 0.2,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    description: 'Emergency supplies successfully delivered to affected area.',
    resolved: true,
  },
];

const mockResources: Resource[] = [
  {
    id: 'r1',
    type: 'ambulance',
    name: 'AMB-001',
    status: 'active',
    location: { lat: 28.6139, lng: 77.2090 },
  },
  {
    id: 'r2',
    type: 'firetruck',
    name: 'FIRE-012',
    status: 'deployed',
    location: { lat: 19.0760, lng: 72.8777 },
  },
  {
    id: 'r3',
    type: 'hospital',
    name: 'Emergency Medical Center',
    status: 'active',
    location: { lat: 28.7041, lng: 77.1025 },
    capacity: 200,
    available: 45,
  },
  {
    id: 'r4',
    type: 'shelter',
    name: 'Emergency Shelter Alpha',
    status: 'active',
    location: { lat: 28.5355, lng: 77.3910 },
    capacity: 500,
    available: 320,
  },
];

const mockStatistics: Statistics = {
  activeAlerts: 7,
  resolvedToday: 23,
  rescueTeamsActive: 12,
  reliefDispatched: 8,
  sheltersOpen: 5,
  peopleEvacuated: 1247,
};

export const useCommandStore = create<CommandStore>((set) => ({
  // Initial state
  alerts: mockAlerts,
  resources: mockResources,
  statistics: mockStatistics,
  isSimulationMode: false,
  selectedAlert: null,
  userLocation: null,
  safetyPlaces: [],
  hazardAreas: [],
  
  // Actions
  addAlert: (alert) => set((state) => ({
    alerts: [
      {
        ...alert,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
      },
      ...state.alerts,
    ],
  })),
  
  resolveAlert: (id) => set((state) => ({
    alerts: state.alerts.map(alert =>
      alert.id === id ? { ...alert, resolved: true } : alert
    ),
    statistics: {
      ...state.statistics,
      activeAlerts: state.statistics.activeAlerts - 1,
      resolvedToday: state.statistics.resolvedToday + 1,
    },
  })),
  
  selectAlert: (alert) => set({ selectedAlert: alert }),
  
  updateResource: (id, updates) => set((state) => ({
    resources: state.resources.map(resource =>
      resource.id === id ? { ...resource, ...updates } : resource
    ),
  })),
  
  toggleSimulation: () => set((state) => ({
    isSimulationMode: !state.isSimulationMode,
  })),
  
  updateStatistics: (updates) => set((state) => ({
    statistics: { ...state.statistics, ...updates },
  })),

  updateUserLocation: (loc) => set(() => ({ userLocation: loc })),
  setSafetyPlaces: (places) => set(() => ({ safetyPlaces: places })),
  addHazardArea: (area) => set((state) => ({
    hazardAreas: [
      {
        ...area,
        id: Math.random().toString(36).substr(2, 9),
      },
      ...state.hazardAreas,
    ],
  })),
  removeHazardArea: (id) => set((state) => ({
    hazardAreas: state.hazardAreas.filter(h => h.id !== id),
  })),
}));