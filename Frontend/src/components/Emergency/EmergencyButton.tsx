import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Send, Zap, Phone, MapPin } from 'lucide-react';
import { useCommandStore } from '../../stores/commandStore';
import { useToast } from '@/hooks/use-toast';

export const EmergencyButton: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    city: '',
    area: '',
    alertType: 'yellow' as 'yellow' | 'red',
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high',
  });
  
  const { addAlert } = useCommandStore();
  const { toast } = useToast();

  // Fallback cities data
  const fallbackCities = [
    "Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Mohali", 
    "Chandigarh", "Firozpur", "Batala", "Moga", "Abohar", "Malout", 
    "Muktsar", "Faridkot", "Mansa", "Barnala", "Sangrur", "Sunam", 
    "Rajpura", "Nabha"
  ];

  const fallbackAreas: Record<string, string[]> = {
    "Amritsar": ["Golden Temple Area", "Hall Bazaar", "Lawrence Road", "Mall Road", "Cantonment", "Ranjit Avenue", "Green Avenue", "Batala Road", "Majitha Road", "Tarn Taran Road"],
    "Ludhiana": ["Model Town", "Sarabha Nagar", "Civil Lines", "Gill Road", "Ferozepur Road", "Dugri", "Kitchlu Nagar", "BRS Nagar", "Punjabi Bagh", "Jalandhar Bypass"],
    "Jalandhar": ["Model Town", "Nakodar Road", "Kapurthala Road", "Adampur", "Cantonment", "Basti Sheikh", "Guru Teg Bahadur Nagar", "Urban Estate", "Ladowali Road", "Nakodar Road"],
    "Patiala": ["Leela Bhawan", "Model Town", "Rajindra Hospital", "Tripuri", "Adalat Bazaar", "Anardana Chowk", "Baradari Garden", "Dharampura Bazaar", "Ghalori Gate", "Sheranwala Gate"],
    "Bathinda": ["Model Town", "Guru Nanak Dev Thermal Plant", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar", "Rose Garden", "Mall Road", "Bibiwala Road", "Goniana Road"],
    "Mohali": ["Phase 1", "Phase 2", "Phase 3A", "Phase 3B", "Phase 4", "Phase 5", "Phase 6", "Phase 7", "Phase 8", "Phase 9", "Phase 10", "Sector 70", "Sector 71", "Sector 72"],
    "Chandigarh": ["Sector 1-10", "Sector 11-20", "Sector 21-30", "Sector 31-40", "Sector 41-50", "Sector 51-60", "Sector 61-70", "Sector 71-80", "Sector 81-90", "Sector 91-100"],
    "Firozpur": ["Cantonment", "Model Town", "Guru Teg Bahadur Nagar", "Civil Lines", "Railway Road", "Basti Sheikh", "Mall Road", "Ferozepur Road", "Abohar Road"],
    "Batala": ["Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar", "Railway Road", "Mall Road", "Batala Road", "Qadian Road", "Gurdaspur Road"],
    "Moga": ["Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar", "Railway Road", "Mall Road", "Moga Road", "Barnala Road", "Ferozepur Road"],
    "Abohar": ["Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar", "Railway Road", "Mall Road", "Abohar Road", "Fazilka Road", "Sri Ganganagar Road"],
    "Malout": ["Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar", "Railway Road", "Mall Road", "Malout Road", "Muktsar Road", "Bathinda Road"],
    "Muktsar": ["Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar", "Railway Road", "Mall Road", "Muktsar Road", "Malout Road", "Bathinda Road"],
    "Faridkot": ["Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar", "Railway Road", "Mall Road", "Faridkot Road", "Muktsar Road", "Bathinda Road"],
    "Mansa": ["Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar", "Railway Road", "Mall Road", "Mansa Road", "Bathinda Road", "Barnala Road"],
    "Barnala": ["Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar", "Railway Road", "Mall Road", "Barnala Road", "Mansa Road", "Sangrur Road"],
    "Sangrur": ["Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar", "Railway Road", "Mall Road", "Sangrur Road", "Barnala Road", "Patiala Road"],
    "Sunam": ["Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar", "Railway Road", "Mall Road", "Sunam Road", "Sangrur Road", "Patiala Road"],
    "Rajpura": ["Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar", "Railway Road", "Mall Road", "Rajpura Road", "Patiala Road", "Chandigarh Road"],
    "Nabha": ["Model Town", "Cantonment", "Civil Lines", "Guru Teg Bahadur Nagar", "Railway Road", "Mall Road", "Nabha Road", "Patiala Road", "Rajpura Road"]
  };

  // Fetch cities on component mount
  useEffect(() => {
    fetchCities();
  }, []);

  // Fetch areas when city changes
  useEffect(() => {
    console.log('City changed to:', formData.city);
    if (formData.city) {
      fetchAreas(formData.city);
    } else {
      setAreas([]);
    }
  }, [formData.city]);

  // Debug areas state
  useEffect(() => {
    console.log('Areas state updated:', areas);
  }, [areas]);

  const fetchCities = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cities');
      const data = await response.json();
      if (data.success) {
        setCities(data.cities);
      } else {
        // Use fallback if API fails
        setCities(fallbackCities);
      }
    } catch (error) {
      console.error('Error fetching cities, using fallback:', error);
      // Use fallback cities if API is not available
      setCities(fallbackCities);
    }
  };

  const fetchAreas = async (city: string) => {
    console.log('Fetching areas for city:', city);
    try {
      const response = await fetch(`http://localhost:5000/api/cities/${encodeURIComponent(city)}/areas`);
      const data = await response.json();
      console.log('API response for areas:', data);
      if (data.success) {
        setAreas(data.areas);
        console.log('Areas set from API:', data.areas);
      } else {
        // Use fallback if API fails
        const fallbackAreasForCity = fallbackAreas[city] || [];
        setAreas(fallbackAreasForCity);
        console.log('Areas set from fallback:', fallbackAreasForCity);
      }
    } catch (error) {
      console.error('Error fetching areas, using fallback:', error);
      // Use fallback areas if API is not available
      const fallbackAreasForCity = fallbackAreas[city] || [];
      setAreas(fallbackAreasForCity);
      console.log('Areas set from fallback (error):', fallbackAreasForCity);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phoneNumber || !formData.city || !formData.area || !formData.alertType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Try to submit to backend API first
      const response = await fetch('http://localhost:5000/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          console.log('Alert submitted to backend successfully');
        } else {
          console.warn('Backend returned error:', data.error);
        }
      } else {
        console.warn('Backend not available, using local storage fallback');
      }
    } catch (error) {
      console.warn('Backend not available, using local storage fallback:', error);
    }

    // Always add to local store and show success (works with or without backend)
    const mockCoords = {
      lat: 30.7333 + (Math.random() - 0.5) * 2, // Punjab coordinates
      lng: 76.7794 + (Math.random() - 0.5) * 2,
    };

    addAlert({
      title: `${formData.alertType.toUpperCase()} Alert - ${formData.area}`,
      category: formData.alertType === 'red' ? 'critical' : 'warning',
      location: {
        lat: mockCoords.lat,
        lng: mockCoords.lng,
        name: `${formData.area}, ${formData.city}`,
      },
      severity: formData.alertType === 'red' ? 0.9 : 0.6,
      description: formData.description || `Emergency alert from ${formData.area}, ${formData.city}`,
      resolved: false,
    });

    // Store in localStorage as backup
    try {
      const existingAlerts = JSON.parse(localStorage.getItem('emergencyAlerts') || '[]');
      const newAlert = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        ...formData,
        coordinates: mockCoords
      };
      existingAlerts.unshift(newAlert);
      localStorage.setItem('emergencyAlerts', JSON.stringify(existingAlerts.slice(0, 50))); // Keep last 50
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }

    toast({
      title: "Safety Alert Submitted",
      description: `${formData.alertType.toUpperCase()} alert has been submitted for ${formData.area}, ${formData.city}`,
    });

    // Reset form
    setFormData({
      phoneNumber: '',
      city: '',
      area: '',
      alertType: 'yellow',
      description: '',
      severity: 'medium',
    });
    
    setIsDialogOpen(false);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: 0.5, 
              type: 'spring', 
              stiffness: 200, 
              damping: 10 
            }}
            className="relative"
          >
            <Button
              size="lg"
              className="w-16 h-16 rounded-full bg-gradient-alert hover:scale-110 transition-all duration-300 shadow-alert animate-pulse-alert shadow-lg"
            >
              <AlertTriangle className="w-6 h-6" />
            </Button>
            
            {/* Pulsing Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-alert-critical animate-ping"></div>
            <div className="absolute inset-0 rounded-full border border-alert-critical opacity-75"></div>
          </motion.div>
        </DialogTrigger>
        
        <DialogContent className="bg-neutral-900 border border-white/10 shadow-lg rounded-lg max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-foreground">
              <Zap className="w-5 h-5 text-primary" />
              <span>PUNJAB SAFETY ALERT</span>
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="phoneNumber" className="text-sm font-medium text-foreground flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                Phone Number *
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="e.g., 9876543210"
                className="mt-1 bg-input border-input-border text-foreground"
                maxLength={10}
              />
            </div>
            
            <div>
              <Label htmlFor="city" className="text-sm font-medium text-foreground flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                City *
              </Label>
              <Select 
                value={formData.city} 
                onValueChange={(value) => setFormData({ ...formData, city: value, area: '' })}
              >
                <SelectTrigger className="mt-1 bg-input border-input-border">
                  <SelectValue placeholder="Select a city in Punjab" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border border-white/10 shadow-lg rounded-lg max-h-60">
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="area" className="text-sm font-medium text-foreground">
                Area * {areas.length > 0 && `(${areas.length} areas available)`}
              </Label>
              <Select 
                value={formData.area} 
                onValueChange={(value) => setFormData({ ...formData, area: value })}
                disabled={!formData.city}
              >
                <SelectTrigger className="mt-1 bg-input border-input-border">
                  <SelectValue placeholder={formData.city ? "Select an area" : "Select city first"} />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border border-white/10 shadow-lg rounded-lg max-h-60">
                  {areas.length > 0 ? (
                    areas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-areas" disabled>
                      No areas available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="alertType" className="text-sm font-medium text-foreground">
                Alert Type *
              </Label>
              <Select 
                value={formData.alertType} 
                onValueChange={(value: 'yellow' | 'red') => setFormData({ ...formData, alertType: value })}
              >
                <SelectTrigger className="mt-1 bg-input border-input-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border border-white/10 shadow-lg rounded-lg">
                  <SelectItem value="yellow">🟡 Yellow Alert (Warning)</SelectItem>
                  <SelectItem value="red">🔴 Red Alert (Critical)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="severity" className="text-sm font-medium text-foreground">
                Severity Level
              </Label>
              <Select 
                value={formData.severity} 
                onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({ ...formData, severity: value })}
              >
                <SelectTrigger className="mt-1 bg-input border-input-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border border-white/10 shadow-lg rounded-lg">
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="high">🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the emergency situation in detail..."
                className="mt-1 bg-input border-input-border text-foreground resize-none"
                rows={3}
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-alert hover:scale-105 transition-transform"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Alert
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};