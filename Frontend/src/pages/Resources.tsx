import React, { useState, useEffect } from 'react';
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
  Navigation,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useCommandStore } from '@/stores/commandStore';
import { CommandSidebar } from '@/components/Sidebar/CommandSidebar';

interface SheetResource {
  id: string;
  name: string;
  type: 'hospital' | 'shelter' | 'school';
  ambulances: number;
  rescueTeamAvailable: number;
  capacity?: number;
  available?: number;
  food?: number;
  location: {
    lat: number;
    lng: number;
  };
}

const Resources: React.FC = () => {
  const { userLocation } = useCommandStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'hospital' | 'shelter' | 'school'>('all');
  const [sheetData, setSheetData] = useState<SheetResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Google Sheets ID and range
  const SHEET_ID = '1W82kmjNEDbnUPtyc1rjz24CjUn5V1RKZmlF6Ym9B2_A';
  const SHEET_NAME = 'Resources';
  
  // Convert Google Sheets to CSV URL
  const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;

  const fetchSheetData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(SHEET_CSV_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch sheet data');
      }
      
      const csvText = await response.text();
      const rows = csvText.split('\n').map(row => 
        row.split(',').map(cell => cell.replace(/"/g, '').trim())
      );
      
      // Skip header row and process data
      const dataRows = rows.slice(1).filter(row => row.length >= 3 && row[0]);
      
      const processedData: SheetResource[] = dataRows.map((row, index) => {
        const [name, ambulances, rescueTeam] = row;
        
        // Determine type based on name (you can modify this logic)
        const type = name.toLowerCase().includes('hospital') ? 'hospital' : 
                    name.toLowerCase().includes('shelter') ? 'shelter' : 'school';
        
        // Generate mock coordinates around India (you'd replace with real coordinates)
        const baseLat = 20.5937 + (Math.random() - 0.5) * 10;
        const baseLng = 78.9629 + (Math.random() - 0.5) * 10;
        
        return {
          id: `sheet-${index}`,
          name: name || 'Unknown',
          type,
          ambulances: parseInt(ambulances) || 0,
          rescueTeamAvailable: parseInt(rescueTeam) || 0,
          capacity: Math.floor(Math.random() * 100) + 50, // Mock data
          available: Math.floor(Math.random() * 50) + 10, // Mock data
          food: Math.floor(Math.random() * 200) + 50, // Mock data
          location: {
            lat: baseLat,
            lng: baseLng
          }
        };
      });
      
      setSheetData(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error fetching sheet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheetData();
  }, []);

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
      case 'shelter': return <Home className="w-5 h-5 text-yellow-400" />;
      case 'school': return <School className="w-5 h-5 text-yellow-400" />;
      default: return <MapPin className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPlaceColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'border-red-400/20 bg-red-400/10';
      case 'shelter': return 'border-yellow-400/20 bg-yellow-400/10';
      case 'school': return 'border-yellow-400/20 bg-yellow-400/10';
      default: return 'border-gray-400/20 bg-gray-400/10';
    }
  };

  const filteredPlaces = sheetData.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || place.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getCapacityPercentage = (place: SheetResource) => {
    if (!place.capacity || !place.available) return 0;
    return (place.available / place.capacity) * 100;
  };

  const handleRefresh = () => {
    fetchSheetData();
  };

  if (loading) {
    return (
      <div className="relative h-screen w-full bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <CommandSidebar />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Loading Resources</h2>
            <p className="text-white/70">Fetching data from Google Sheets...</p>
          </div>
        </div>
      </div>
    );
  }

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
              <p className="text-white/70 text-sm">Safety places and emergency resources from live data</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {sheetData.length} Places
              </Badge>
              <Button size="sm" variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-400/20 p-4 m-4 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error loading data:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

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
                            {place.ambulances}
                          </div>
                          <div className="text-xs text-white/70">Available</div>
                        </div>

                        {/* Rescue Team */}
                        <div className="bg-neutral-800/50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Users className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-white">Rescue Team</span>
                          </div>
                          <div className="text-2xl font-bold text-blue-400">
                            {place.rescueTeamAvailable}
                          </div>
                          <div className="text-xs text-white/70">Team members</div>
                        </div>

                        {/* Capacity */}
                        {place.capacity && (
                          <div className="bg-neutral-800/50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <Home className="w-4 h-4 text-green-400" />
                              <span className="text-sm font-medium text-white">Capacity</span>
                            </div>
                            <div className="text-2xl font-bold text-green-400">
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
                      </div>

                      {/* Food Supplies */}
                      {place.food !== undefined && (
                        <div className="mt-4">
                          <div className="bg-neutral-800/50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <Heart className="w-4 h-4 text-yellow-400" />
                              <span className="text-sm font-medium text-white">Food Supplies</span>
                            </div>
                            <div className="text-2xl font-bold text-yellow-400">
                              {place.food}
                            </div>
                            <div className="text-xs text-white/70">Units available</div>
                          </div>
                        </div>
                      )}

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

            {filteredPlaces.length === 0 && !loading && (
              <div className="text-center py-12">
                <MapPin className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white/70 mb-2">
                  {searchTerm ? 'No places found' : 'No resources available'}
                </h3>
                <p className="text-white/50 text-sm">
                  {searchTerm ? 'Try adjusting your search terms' : 'Check if the Google Sheet is accessible and has data'}
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