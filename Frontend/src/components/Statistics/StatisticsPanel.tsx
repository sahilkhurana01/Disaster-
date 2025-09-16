import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Shield, 
  Users, 
  Truck, 
  Home, 
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useCommandStore } from '../../stores/commandStore';

export const StatisticsPanel: React.FC = () => {
  const { statistics, isSimulationMode } = useCommandStore();

  const stats = [
    {
      label: 'Active Alerts',
      value: statistics.activeAlerts,
      icon: AlertCircle,
      color: 'text-alert-critical',
      bgColor: 'bg-alert-critical/10',
      change: '+3',
      trend: 'up'
    },
    {
      label: 'Resolved Today',
      value: statistics.resolvedToday,
      icon: CheckCircle,
      color: 'text-alert-success',
      bgColor: 'bg-alert-success/10',
      change: '+12',
      trend: 'up'
    },
    {
      label: 'Rescue Teams',
      value: statistics.rescueTeamsActive,
      icon: Users,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: '-1',
      trend: 'down'
    },
    {
      label: 'Relief Dispatched',
      value: statistics.reliefDispatched,
      icon: Truck,
      color: 'text-alert-warning',
      bgColor: 'bg-alert-warning/10',
      change: '+2',
      trend: 'up'
    },
    {
      label: 'Shelters Open',
      value: statistics.sheltersOpen,
      icon: Home,
      color: 'text-alert-info',
      bgColor: 'bg-alert-info/10',
      change: '0',
      trend: 'stable'
    },
    {
      label: 'People Evacuated',
      value: statistics.peopleEvacuated.toLocaleString(),
      icon: Shield,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+234',
      trend: 'up'
    },
  ];

  return (
    <motion.div
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-30 w-72"
    >
      <div className="bg-neutral-900/95 border border-white/10 shadow-lg rounded-lg p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="font-mono text-sm tracking-wider uppercase text-sm text-foreground">LIVE STATISTICS</span>
          </div>
          {isSimulationMode && (
            <Badge variant="secondary" className="text-xs animate-pulse-alert">
              SIM MODE
            </Badge>
          )}
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
              >
                <Card className={`bg-neutral-900/95 border border-white/10 shadow-lg rounded-lg hover:bg-neutral-900 transition-all duration-300 p-3 border ${stat.bgColor} border-white/10`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`p-1.5 rounded ${stat.bgColor}`}>
                      <Icon className={`w-3 h-3 ${stat.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-lg font-bold tabular-nums ${stat.color}`}>
                          {stat.value}
                        </span>
                        <div className={`flex items-center space-x-1 text-xs ${
                          stat.trend === 'up' ? 'text-alert-success' :
                          stat.trend === 'down' ? 'text-alert-critical' :
                          'text-muted-foreground'
                        }`}>
                          <TrendingUp className={`w-3 h-3 ${
                            stat.trend === 'down' ? 'rotate-180' : ''
                          }`} />
                          <span>{stat.change}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                  
                  {/* Mini progress bar for visual effect */}
                  <div className="w-full bg-muted/30 rounded-full h-1">
                    <motion.div
                      className={`h-1 rounded-full ${stat.bgColor.replace('/10', '/60')}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (parseInt(stat.value.toString()) / 50) * 100)}%` }}
                      transition={{ delay: 0.6 + (index * 0.1), duration: 1 }}
                    />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 pt-4 border-t border-card-border"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="text-muted-foreground">System Status</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-alert-success rounded-full animate-pulse"></div>
              <span className="text-alert-success font-medium">OPERATIONAL</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs mt-2">
            <div className="text-muted-foreground">Last Update</div>
            <div className="text-foreground font-mono">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};