import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, X, TrendingUp } from 'lucide-react';
import { AIAlert } from '../../hooks/useAIAlerts';

interface AIAlertPopupProps {
  alert: AIAlert;
  onClose: () => void;
  autoCloseDelay?: number;
}

export const AIAlertPopup: React.FC<AIAlertPopupProps> = ({ 
  alert, 
  onClose, 
  autoCloseDelay = 8000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(autoCloseDelay / 1000);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsVisible(false);
          setTimeout(onClose, 300); // Allow animation to complete
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, onClose, autoCloseDelay]);

  const getAlertColor = (riskPercentage: number) => {
    if (riskPercentage >= 80) return 'text-red-500 border-red-500 bg-red-500/10';
    if (riskPercentage >= 60) return 'text-orange-500 border-orange-500 bg-orange-500/10';
    if (riskPercentage >= 40) return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
    return 'text-blue-500 border-blue-500 bg-blue-500/10';
  };

  const getSeverityLevel = (riskPercentage: number) => {
    if (riskPercentage >= 80) return 'CRITICAL';
    if (riskPercentage >= 60) return 'HIGH';
    if (riskPercentage >= 40) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            x: 400, 
            opacity: 0, 
            scale: 0.8,
            y: -50
          }}
          animate={{ 
            x: 0, 
            opacity: 1, 
            scale: 1,
            y: 0
          }}
          exit={{ 
            x: 400, 
            opacity: 0, 
            scale: 0.8,
            y: -50,
            transition: { duration: 0.3 }
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.5
          }}
          className={`fixed top-20 right-4 z-50 w-80 max-w-sm bg-neutral-900/95 border-2 shadow-2xl rounded-lg p-4 ${getAlertColor(alert.riskPercentage)}`}
          style={{
            boxShadow: `0 0 20px ${alert.riskPercentage >= 80 ? 'rgba(239, 68, 68, 0.5)' : 
                        alert.riskPercentage >= 60 ? 'rgba(249, 115, 22, 0.5)' : 
                        'rgba(59, 130, 246, 0.5)'}`
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <span className="font-mono text-sm font-bold tracking-wider uppercase">
                AI ALERT
              </span>
              <Badge 
                variant="secondary" 
                className={`text-xs font-bold ${
                  alert.riskPercentage >= 80 ? 'bg-red-500 text-white' :
                  alert.riskPercentage >= 60 ? 'bg-orange-500 text-white' :
                  alert.riskPercentage >= 40 ? 'bg-yellow-500 text-black' :
                  'bg-blue-500 text-white'
                }`}
              >
                {getSeverityLevel(alert.riskPercentage)}
              </Badge>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="p-1 h-auto text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Alert Content */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                {alert.titleName}
              </h3>
              <p className="text-xs text-muted-foreground">
                Published: {new Date(alert.pubDate).toLocaleString()}
              </p>
            </div>

            {/* Risk Percentage */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Risk Level</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-neutral-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${
                      alert.riskPercentage >= 80 ? 'bg-red-500' :
                      alert.riskPercentage >= 60 ? 'bg-orange-500' :
                      alert.riskPercentage >= 40 ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${alert.riskPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <span className="text-sm font-bold">
                  {alert.riskPercentage}%
                </span>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Auto-close in {timeLeft}s</span>
              </div>
              <div className="text-xs">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs h-8"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
            >
              Dismiss
            </Button>
            <Button
              size="sm"
              variant="default"
              className="flex-1 text-xs h-8"
              onClick={() => {
                // Handle alert response
                console.log('Responding to alert:', alert.id);
              }}
            >
              Respond
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
