import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Users, 
  Truck, 
  Heart, 
  Home, 
  School,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Navigation
} from 'lucide-react';
import { useCommandStore } from '@/stores/commandStore';
import { CommandSidebar } from '@/components/Sidebar/CommandSidebar';

const Resources: React.FC = () => {
  const { safetyPlaces, resources, userLocation } = useCommandStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'hospital' | 'shelter' | 'school'>('all');

  const countNearbyAmbulances = (lat: number, lng: number) =>
    resources.filter(r => r.type === 'ambulance')
      .filter(r => Math.hypot(r.location.lat - lat, r.location.lng - lng) < 0.1).length;

  const getDistance = (lat: number, lng: number) => {
    if (!userLocation) return 'Unknown';
    const R = 6371; // Earth's radius in km
    const dLat = (lat - userLocation.lat) * Math.PI / 180;
    const dLng = (lng - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1) + ' km';
  };

  const getPlaceIcon = (type: string) => {
    switch (type) {
      case 'hospital': return <Heart className="w-5 h-5 text-red-400" />;
      case 'shelter': return <Home className="w-5 h-5 text-green-400" />;
      case 'school': return <School className="w-5 h-5 text-blue-400" />;
      default: return <MapPin className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPlaceColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'border-red-400/20 bg-red-400/10';
      case 'shelter': return 'border-green-400/20 bg-green-400/10';
      case 'school': return 'border-blue-400/20 bg-blue-400/10';
      default: return 'border-gray-400/20 bg-gray-400/10';
    }
  };

  const filteredPlaces = safetyPlaces.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || place.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getCapacityPercentage = (place: any) => {
    if (!place.capacity || !place.available) return 0;
    return (place.available / place.capacity) * 100;
  };

  return (
    <div className="relative h-screen w-full bg-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      
      {/* Command Sidebar */}
      <CommandSidebar />
      
      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="bg-neutral-900/95 border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className='relative left-14'>
              <h1 className="text-2xl font-bold text-white">Resources</h1>
              <p className="text-white/70 text-sm">Safety places and emergency resources</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {safetyPlaces.length} Places
              </Badge>
              <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-neutral-900/95 border-b border-white/10 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-white/70" />
              <div className="flex space-x-1">
                {(['all', 'hospital', 'shelter', 'school'] as const).map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={filterType === type ? 'default' : 'ghost'}
                    onClick={() => setFilterType(type)}
                    className="text-xs capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search places..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resources List */}
        <ScrollArea className="flex-1 p-4">
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredPlaces.map((place, index) => (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                >
                  <Card className={`bg-neutral-900/95 border border-white/10 shadow-lg hover:bg-neutral-800/95 transition-all duration-300 ${getPlaceColor(place.type)}`}>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {getPlaceIcon(place.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-lg mb-1">
                              {place.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-white/70">
                              <Badge variant="outline" className="text-xs capitalize">
                                {place.type}
                              </Badge>
                              <span className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{getDistance(place.location.lat, place.location.lng)} away</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <Navigation className="w-4 h-4 mr-1" />
                            Navigate
                          </Button>
                        </div>
                      </div>

                      {/* Resource Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Ambulances */}
                        <div className="bg-neutral-800/50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Truck className="w-4 h-4 text-red-400" />
                            <span className="text-sm font-medium text-white">Ambulances</span>
                          </div>
                          <div className="text-2xl font-bold text-red-400">
                            {countNearbyAmbulances(place.location.lat, place.location.lng)}
                          </div>
                          <div className="text-xs text-white/70">Nearby available</div>
                        </div>

                        {/* Capacity */}
                        {place.capacity && (
                          <div className="bg-neutral-800/50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <Users className="w-4 h-4 text-blue-400" />
                              <span className="text-sm font-medium text-white">Capacity</span>
                            </div>
                            <div className="text-2xl font-bold text-blue-400">
                              {place.available || 0}/{place.capacity}
                            </div>
                            <div className="mt-2">
                              <Progress 
                                value={getCapacityPercentage(place)} 
                                className="h-2"
                              />
                              <div className="text-xs text-white/70 mt-1">
                                {Math.round(getCapacityPercentage(place))}% occupied
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Food Supplies */}
                        {place.food !== undefined && (
                          <div className="bg-neutral-800/50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <Heart className="w-4 h-4 text-green-400" />
                              <span className="text-sm font-medium text-white">Food</span>
                            </div>
                            <div className="text-2xl font-bold text-green-400">
                              {place.food}
                            </div>
                            <div className="text-xs text-white/70">Units available</div>
                          </div>
                        )}
                      </div>

                      {/* Emergency Contact Info */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="text-xs text-white/70">
                          <div className="grid grid-cols-2 gap-2">
                            <div>Emergency Contact: +91-XXX-XXXX</div>
                            <div>Last Updated: {new Date().toLocaleTimeString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredPlaces.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white/70 mb-2">
                  {searchTerm ? 'No places found' : 'No safety places detected'}
                </h3>
                <p className="text-white/50 text-sm">
                  {searchTerm ? 'Try adjusting your search terms' : 'Allow location access and refresh to find nearby safety places'}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Resources;


