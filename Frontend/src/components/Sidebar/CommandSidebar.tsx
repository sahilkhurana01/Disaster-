import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  MessageSquare, 
  Users, 
  Settings,
  Activity,
  X,
  Home
} from 'lucide-react';
import { useCommandStore } from '../../stores/commandStore';
import { useLocation, useNavigate } from 'react-router-dom';

export const CommandSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { alerts } = useCommandStore();
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarVariants = {
    closed: { x: '-100%', opacity: 0 },
    open: { x: 0, opacity: 1 },
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 bg-neutral-900/95 border border-white/10 shadow-lg rounded-lg p-3 shadow-glow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Menu className="w-5 h-5 text-primary" />
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Panel */}
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-80 z-50 bg-neutral-900/95 border border-white/10 shadow-lg rounded-lg border-r border-white/10"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-primary" />
                    <span className="font-mono text-sm tracking-wider uppercase text-foreground">COMMAND TOOLS</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Navigation Buttons */}
                <div className="p-4">
                  <div className="space-y-3">
                    <Button 
                      size="lg" 
                      variant={location.pathname === '/' ? 'default' : 'ghost'} 
                      onClick={() => {
                        navigate('/');
                        setIsOpen(false);
                      }}
                      className="w-full justify-start"
                    >
                      <Home className="w-5 h-5 mr-3" /> 
                      Home
                    </Button>
                    
                    <Button 
                      size="lg" 
                      variant={location.pathname.startsWith('/messages') ? 'default' : 'ghost'} 
                      onClick={() => {
                        navigate('/messages');
                        setIsOpen(false);
                      }}
                      className="w-full justify-start"
                    >
                      <MessageSquare className="w-5 h-5 mr-3" /> 
                      Messages
                      <Badge variant="secondary" className="ml-auto">{activeAlerts.length}</Badge>
                    </Button>
                    
                    <Button 
                      size="lg" 
                      variant={location.pathname.startsWith('/resources') ? 'default' : 'ghost'} 
                      onClick={() => {
                        navigate('/resources');
                        setIsOpen(false);
                      }}
                      className="w-full justify-start"
                    >
                      <Users className="w-5 h-5 mr-3" /> 
                      Resources
                    </Button>
                    
                    <Button 
                      size="lg" 
                      variant={location.pathname.startsWith('/settings') ? 'default' : 'ghost'} 
                      onClick={() => {
                        navigate('/settings');
                        setIsOpen(false);
                      }}
                      className="w-full justify-start"
                    >
                      <Settings className="w-5 h-5 mr-3" /> 
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};