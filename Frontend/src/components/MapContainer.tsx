import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCommandStore } from '../stores/commandStore';

// Fix for default markers in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MAPTILER_KEY = "xanBpghmk4MnYRATZ0Jd";

export const MapContainer: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { alerts, resources, selectedAlert, selectAlert, userLocation, updateUserLocation, safetyPlaces, setSafetyPlaces } = useCommandStore();
  const { hazardAreas, addHazardArea, removeHazardArea } = useCommandStore();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629], // Center of India
      zoom: 5,
      zoomControl: false,
      attributionControl: false,
    });

    // Revert to original MapTiler satellite layer
    L.tileLayer(
      `https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=${MAPTILER_KEY}`,
      {
        attribution: '© MapTiler © OpenStreetMap contributors',
        maxZoom: 18,
      }
    ).addTo(map);

    // Add zoom control to bottom left
    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    mapInstanceRef.current = map;

    // Interaction: Shift+Click to add hazard circle (disaster-prone area)
    const onMapClick = (e: L.LeafletMouseEvent) => {
      // Only add when shift key is pressed
      if ((e.originalEvent as MouseEvent).shiftKey) {
        addHazardArea({ center: { lat: e.latlng.lat, lng: e.latlng.lng }, radiusMeters: 500 });
      }
    };
    map.on('click', onMapClick);

    // Education POIs layer group (schools/colleges)
    const educationLayer = L.layerGroup().addTo(map);

    const fetchEducationPOIs = async () => {
      if (!mapInstanceRef.current) return;
      const currentZoom = mapInstanceRef.current.getZoom();
      if (currentZoom < 14) {
        educationLayer.clearLayers();
        return;
      }

      const bounds = mapInstanceRef.current.getBounds();
      const south = bounds.getSouth();
      const west = bounds.getWest();
      const north = bounds.getNorth();
      const east = bounds.getEast();

      // Overpass API query for schools and colleges within current bbox
      const query = `[
        out:json][timeout:25];(
          node["amenity"="school"](${south},${west},${north},${east});
          node["amenity"="college"](${south},${west},${north},${east});
          way["amenity"="school"](${south},${west},${north},${east});
          way["amenity"="college"](${south},${west},${north},${east});
        );out center 200;`;

      try {
        const res = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query,
          headers: { 'Content-Type': 'text/plain' },
        });
        const data = await res.json();
        educationLayer.clearLayers();
        data.elements.forEach((el: any) => {
          const lat = el.lat || el.center?.lat;
          const lon = el.lon || el.center?.lon;
          if (!lat || !lon) return;
          const label = el.tags?.name || (el.tags?.amenity === 'school' ? 'School' : 'College');
          const isSchool = el.tags?.amenity === 'school';
          const color = isSchool ? '#a3e635' : '#86efac';
          const marker = L.circleMarker([lat, lon], {
            radius: 4,
            color,
            weight: 1,
            fillColor: color,
            fillOpacity: 0.8,
          });
          marker.bindTooltip(`<span style="color:${color}">${label}</span>`, { permanent: true, direction: 'top', offset: [0, -6], className: 'edu-tooltip' });
          (marker as any).addTo(educationLayer);
        });
      } catch (e) {
        // Swallow errors silently to avoid console noise if rate-limited
      }
    };

    // Fetch when zoomed/moved and at init if zoom >=14
    map.on('moveend zoomend', fetchEducationPOIs);
    fetchEducationPOIs();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('click', onMapClick);
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when alerts/resources change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Remove red alert areas per requirement (no alert circles)

    // Add resource markers
    resources.forEach((resource) => {
      const getResourceIcon = (type: string, status: string) => {
        const iconColor = 
          status === 'active' ? '#22c55e' :
          status === 'deployed' ? '#ffa500' :
          status === 'standby' ? '#4fb3d9' :
          '#666';

        const iconMap: Record<string, string> = {
          ambulance: '🚑',
          firetruck: '🚒', 
          police: '🚓',
          hospital: '🏥',
          shelter: '🏠',
          supply: '📦',
        };

        return L.divIcon({
          html: `<div style="color: ${iconColor}; font-size: 20px; text-shadow: 0 0 4px rgba(0,0,0,0.5);">${iconMap[type] || '📍'}</div>`,
          className: 'resource-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
      };

      const marker = L.marker([resource.location.lat, resource.location.lng], {
        icon: getResourceIcon(resource.type, resource.status),
      });

      marker.bindPopup(`
        <div class="p-3">
          <h3 class="font-bold text-sm mb-2">${resource.name}</h3>
          <div class="text-xs space-y-1">
            <div>Type: ${resource.type}</div>
            <div>Status: <span class="capitalize">${resource.status}</span></div>
            ${resource.capacity ? `<div>Capacity: ${resource.available}/${resource.capacity}</div>` : ''}
          </div>
        </div>
      `);

      marker.addTo(map);
    });
  }, [alerts, resources, selectAlert]);

  // Geolocation and safety places
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Request geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          updateUserLocation({ lat: latitude, lng: longitude, accuracy });
          mapInstanceRef.current!.setView([latitude, longitude], 13, { animate: true });
        },
        () => {
          // silent fail
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }

    // Render user marker and accuracy circle
    const map = mapInstanceRef.current;
    let userMarker: L.CircleMarker | null = null;
    let accuracyCircle: L.Circle | null = null;

    const renderUser = () => {
      if (!map || !userLocation) return;
      if (!userMarker) {
        userMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
          radius: 6,
          color: '#3b82f6',
          weight: 2,
          fillColor: '#3b82f6',
          fillOpacity: 0.9,
        }).addTo(map);
      } else {
        userMarker.setLatLng([userLocation.lat, userLocation.lng]);
      }

      if (userLocation.accuracy) {
        if (!accuracyCircle) {
          accuracyCircle = L.circle([userLocation.lat, userLocation.lng], {
            radius: userLocation.accuracy,
            color: '#60a5fa',
            weight: 1,
            fillColor: '#60a5fa',
            fillOpacity: 0.1,
          }).addTo(map);
        } else {
          accuracyCircle.setLatLng([userLocation.lat, userLocation.lng]);
          accuracyCircle.setRadius(userLocation.accuracy);
        }
      }
    };

    renderUser();

    // Cleanup
    return () => {
      if (userMarker) map.removeLayer(userMarker);
      if (accuracyCircle) map.removeLayer(accuracyCircle);
    };
  }, [userLocation, updateUserLocation]);

  // Safety places around user (hospitals, shelters, schools)
  useEffect(() => {
    const fetchSafetyPlaces = async () => {
      if (!mapInstanceRef.current || !userLocation) return;
      const { lat, lng } = userLocation;
      const radiusKm = 5; // 5km radius
      const delta = radiusKm / 111; // rough degree distance
      const south = lat - delta, north = lat + delta, west = lng - delta, east = lng + delta;
      const query = `[
        out:json][timeout:25];(
          node["amenity"="hospital"](${south},${west},${north},${east});
          node["amenity"="shelter"](${south},${west},${north},${east});
          node["amenity"="school"](${south},${west},${north},${east});
        );out center 200;`;
      try {
        const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: query, headers: { 'Content-Type': 'text/plain' } });
        const data = await res.json();
        const places = data.elements
          .map((el: any) => ({
            id: String(el.id),
            type: el.tags?.amenity === 'hospital' ? 'hospital' : el.tags?.amenity === 'shelter' ? 'shelter' : 'school',
            name: el.tags?.name || (el.tags?.amenity || 'Place'),
            location: { lat: el.lat || el.center?.lat, lng: el.lon || el.center?.lon },
            capacity: undefined,
            food: undefined,
          }))
          .filter((p: any) => p.location.lat && p.location.lng);
        setSafetyPlaces(places);
      } catch (_) {
        // ignore
      }
    };
    fetchSafetyPlaces();
  }, [userLocation, setSafetyPlaces]);

  // Render safety places and nearby ambulances data binding
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const layer = L.layerGroup().addTo(map);
    safetyPlaces.forEach((p) => {
      const color = p.type === 'hospital' ? '#60a5fa' : p.type === 'shelter' ? '#16a34a' : '#a3e635';
      const marker = L.circleMarker([p.location.lat, p.location.lng], {
        radius: 5,
        color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.9,
      });
      // compute nearby ambulances from resources list
      const nearbyAmbulances = resources.filter(r => r.type === 'ambulance')
        .filter(r => Math.hypot(r.location.lat - p.location.lat, r.location.lng - p.location.lng) < 0.1).length; // ~11km threshold rough
      marker.bindPopup(`
        <div class="p-2 text-xs">
          <div class="font-bold mb-1">${p.name}</div>
          <div>Type: ${p.type}</div>
          <div>Nearby ambulances: ${nearbyAmbulances}</div>
        </div>
      `);
      (marker as any).addTo(layer);
    });
    return () => { map.removeLayer(layer); };
  }, [safetyPlaces, resources]);

  // Render hazard areas
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const layer = L.layerGroup().addTo(map);

    hazardAreas.forEach((area) => {
      const circle = L.circle([area.center.lat, area.center.lng], {
        radius: area.radiusMeters,
        color: '#ef4444',
        weight: 2,
        fillColor: '#ef4444',
        fillOpacity: 0.15,
      }).addTo(layer);
      circle.bindTooltip('Hazard area', { direction: 'top' });
      circle.on('click', () => removeHazardArea(area.id));
    });

    return () => { map.removeLayer(layer); };
  }, [hazardAreas, removeHazardArea]);

  // Focus on selected alert
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedAlert) return;

    mapInstanceRef.current.setView(
      [selectedAlert.location.lat, selectedAlert.location.lng],
      10,
      { animate: true, duration: 1 }
    );
  }, [selectedAlert]);

  return (
    <div 
      ref={mapRef} 
      className="absolute inset-0 z-0"
      style={{ height: '100vh', width: '100vw' }}
    />
  );
};