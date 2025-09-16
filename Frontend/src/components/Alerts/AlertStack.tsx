import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, MapPin, X } from 'lucide-react';
import { useCommandStore } from '../../stores/commandStore';

export const AlertStack: React.FC = () => {
  const { alerts, resolveAlert } = useCommandStore();
  const activeAlerts = alerts.filter(alert => !alert.resolved).slice(0, 5); // Show top 5

  const getAlertColor = (category: string) => {
    switch (category) {
      case 'critical': return 'text-alert-critical border-alert-critical bg-alert-critical/10';
      case 'warning': return 'text-alert-warning border-alert-warning bg-alert-warning/10';
      case 'info': return 'text-alert-info border-alert-info bg-alert-info/10';
      case 'success': return 'text-alert-success border-alert-success bg-alert-success/10';
      default: return 'text-muted-foreground border-border bg-card';
    }
  };

  return (
    <div className="fixed top-20 right-4 z-40 w-80 max-h-96 space-y-2">
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-neutral-900/95 border border-white/10 shadow-lg rounded-lg p-3"
      >
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm tracking-wider uppercase text-foreground">AI ALERTS</span>
          <Badge variant="secondary" className="text-xs">
            {activeAlerts.length}
          </Badge>
        </div>
      </motion.div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {activeAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ x: 400, opacity: 0, scale: 0.8 }}
              animate={{ 
                x: 0, 
                opacity: 1, 
                scale: 1,
                transition: { delay: 0.1 * (index + 1) }
              }}
              exit={{ 
                x: 400, 
                opacity: 0, 
                scale: 0.8,
                transition: { duration: 0.2 }
              }}
              layout
              className={`bg-neutral-900/95 border border-white/10 shadow-lg rounded-lg p-3 ${getAlertColor(alert.category)} ${
                alert.category === 'critical' ? 'shadow-alert' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                    <span className="text-xs font-medium truncate">
                      {alert.title}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {alert.description}
                  </p>
                  
                  <div className="flex flex-col space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{alert.location.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{alert.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="text-xs px-1 py-0"
                      >
                        {Math.round(alert.severity * 100)}%
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => resolveAlert(alert.id)}
                  className="ml-2 p-1 h-auto text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs h-7"
                  onClick={() => resolveAlert(alert.id)}
                >
                  Resolve
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="flex-1 text-xs h-7"
                >
                  Respond
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {activeAlerts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-neutral-900/95 border border-white/10 shadow-lg rounded-lg p-4 text-center"
        >
          <div className="text-muted-foreground text-sm">
            No active alerts
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            All systems operational
          </div>
        </motion.div>
      )}
    </div>
  );
};