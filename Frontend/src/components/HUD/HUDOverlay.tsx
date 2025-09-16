import React from 'react';
import { motion } from 'framer-motion';

export const HUDOverlay: React.FC = () => {
  return (
    <>
      {/* Top HUD Bar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 right-0 z-30 p-4"
      >
        <div className="bg-neutral-900/95 border border-white/10 shadow-lg rounded-lg p-4 mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-alert-success rounded-full animate-pulse"></div>
                <span className="font-mono text-sm tracking-wider uppercase text-foreground">DRMS ONLINE</span>
              </div>
              <div className="font-mono text-xs tabular-nums text-muted-foreground">
                {new Date().toLocaleTimeString()} UTC
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="font-mono text-xs tabular-nums text-muted-foreground">
                SECTOR: INDIA-CENTRAL
              </div>
              <div className="font-mono text-xs tabular-nums text-muted-foreground">
                THREAT LEVEL: <span className="text-alert-warning">ELEVATED</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Status Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 z-30 p-4"
      >
        <div className="bg-neutral-900/95 border border-white/10 shadow-lg rounded-lg p-3 mx-auto max-w-6xl">
          <div className="flex items-center justify-between font-mono text-xs tabular-nums">
            <div className="flex items-center space-x-8">
              <div className="text-muted-foreground">
                SYS STATUS: <span className="text-alert-success">OPERATIONAL</span>
              </div>
              <div className="text-muted-foreground">
                CONN: <span className="text-alert-success">SECURE</span>
              </div>
              <div className="text-muted-foreground">
                AI ENGINE: <span className="text-accent">GEMINI-1.5-PRO</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="text-muted-foreground">
                LAT/LNG: 20.5937, 78.9629
              </div>
              <div className="text-muted-foreground">
                ZOOM: L5
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Corner Decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/50 z-20"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/50 z-20"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/50 z-20"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/50 z-20"></div>
    </>
  );
};