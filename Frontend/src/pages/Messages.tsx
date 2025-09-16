import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  X,
  Filter,
  Search
} from 'lucide-react';
import { useCommandStore } from '@/stores/commandStore';
import { CommandSidebar } from '@/components/Sidebar/CommandSidebar';

const Messages: React.FC = () => {
  const { alerts, resolveAlert } = useCommandStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = alerts.filter(alert => alert.resolved);

  const getFilteredAlerts = () => {
    let filtered = alerts;
    
    if (filter === 'active') filtered = activeAlerts;
    if (filter === 'resolved') filtered = resolvedAlerts;
    
    if (searchTerm) {
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.location.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getAlertColor = (category: string) => {
    switch (category) {
      case 'critical': return 'text-red-400 border-red-400/20 bg-red-400/10';
      case 'warning': return 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10';
      case 'info': return 'text-blue-400 border-blue-400/20 bg-blue-400/10';
      case 'success': return 'text-green-400 border-green-400/20 bg-green-400/10';
      default: return 'text-gray-400 border-gray-400/20 bg-gray-400/10';
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 0.8) return 'text-red-500';
    if (severity >= 0.6) return 'text-yellow-500';
    if (severity >= 0.4) return 'text-blue-500';
    return 'text-green-500';
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
              <h1 className="text-2xl r font-bold text-white">Messages</h1>
              <p className="text-white/70 text-sm">Emergency alerts and communications</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {activeAlerts.length} Active
              </Badge>
              <Badge variant="outline" className="text-xs">
                {resolvedAlerts.length} Resolved
              </Badge>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-neutral-900/95 border-b border-white/10 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-white/70" />
              <div className="flex space-x-1">
                {(['all', 'active', 'resolved'] as const).map((filterType) => (
                  <Button
                    key={filterType}
                    size="sm"
                    variant={filter === filterType ? 'default' : 'ghost'}
                    onClick={() => setFilter(filterType)}
                    className="text-xs capitalize"
                  >
                    {filterType}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {getFilteredAlerts().map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                >
                  <Card className={`bg-neutral-900/95 border border-white/10 shadow-lg hover:bg-neutral-800/95 transition-all duration-300 ${getAlertColor(alert.category)}`}>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {alert.resolved ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white text-lg mb-1">
                              {alert.title}
                            </h3>
                            <p className="text-white/80 text-sm mb-2 line-clamp-2">
                              {alert.description}
                            </p>
                          </div>
                        </div>
                        
                        {!alert.resolved && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resolveAlert(alert.id)}
                            className="ml-4 flex-shrink-0"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4 text-white/70">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{alert.location.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{alert.timestamp.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getSeverityColor(alert.severity)}`}
                          >
                            {Math.round(alert.severity * 100)}% severity
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className="text-xs capitalize"
                          >
                            {alert.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {getFilteredAlerts().length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white/70 mb-2">
                  {searchTerm ? 'No alerts found' : 'No alerts available'}
                </h3>
                <p className="text-white/50 text-sm">
                  {searchTerm ? 'Try adjusting your search terms' : 'All alerts have been resolved'}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Messages;


