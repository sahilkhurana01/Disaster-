import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon,
  Moon,
  Sun,
  Type,
  Volume2,
  Bell,
  Shield,
  Info,
  Save,
  RotateCcw
} from 'lucide-react';
import { CommandSidebar } from '@/components/Sidebar/CommandSidebar';

const Settings: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [fontSize, setFontSize] = useState(1);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [simulationMode, setSimulationMode] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'dark';
    const savedFontSize = parseFloat(localStorage.getItem('fontSize') || '1');
    const savedNotifications = localStorage.getItem('notifications') !== 'false';
    const savedSound = localStorage.getItem('soundEnabled') !== 'false';
    const savedAutoRefresh = localStorage.getItem('autoRefresh') !== 'false';
    const savedSimulation = localStorage.getItem('simulationMode') === 'true';

    setTheme(savedTheme);
    setFontSize(savedFontSize);
    setNotifications(savedNotifications);
    setSoundEnabled(savedSound);
    setAutoRefresh(savedAutoRefresh);
    setSimulationMode(savedSimulation);
  }, []);

  // Apply font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}rem`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSave = () => {
    localStorage.setItem('notifications', notifications.toString());
    localStorage.setItem('soundEnabled', soundEnabled.toString());
    localStorage.setItem('autoRefresh', autoRefresh.toString());
    localStorage.setItem('simulationMode', simulationMode.toString());
    
    // Show save confirmation
    const button = document.querySelector('[data-save-button]') as HTMLButtonElement;
    if (button) {
      const originalText = button.textContent;
      button.textContent = 'Saved!';
      button.classList.add('bg-green-600');
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('bg-green-600');
      }, 2000);
    }
  };

  const handleReset = () => {
    setTheme('dark');
    setFontSize(1);
    setNotifications(true);
    setSoundEnabled(true);
    setAutoRefresh(true);
    setSimulationMode(false);
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
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-white/70 text-sm">Customize your experience</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
              <Button size="sm" variant="default" onClick={handleSave} data-save-button>
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Appearance */}
            <Card className="bg-neutral-900/95 border border-white/10 shadow-lg">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <SettingsIcon className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-white">Appearance</h2>
                </div>
                
                <div className="space-y-4">
                  {/* Theme Selection */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-white">Theme</label>
                      <p className="text-xs text-white/70">Choose your preferred color scheme</p>
                    </div>
                    <div className="flex space-x-2">
                      {(['light', 'dark', 'system'] as const).map((themeOption) => (
                        <Button
                          key={themeOption}
                          size="sm"
                          variant={theme === themeOption ? 'default' : 'outline'}
                          onClick={() => setTheme(themeOption)}
                          className="capitalize"
                        >
                          {themeOption === 'light' && <Sun className="w-4 h-4 mr-1" />}
                          {themeOption === 'dark' && <Moon className="w-4 h-4 mr-1" />}
                          {themeOption === 'system' && <SettingsIcon className="w-4 h-4 mr-1" />}
                          {themeOption}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Font Size */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Type className="w-4 h-4 text-white/70" />
                      <label className="text-sm font-medium text-white">Font Size</label>
                    </div>
                    <div className="px-4">
                      <Slider
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                        min={0.8}
                        max={1.5}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-white/70 mt-2">
                        <span>Small</span>
                        <span className="font-medium">{fontSize}x</span>
                        <span>Large</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="bg-neutral-900/95 border border-white/10 shadow-lg">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-lg font-semibold text-white">Notifications</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-white">Push Notifications</label>
                      <p className="text-xs text-white/70">Receive alerts for emergency situations</p>
                    </div>
                    <Switch
                      checked={notifications}
                      onCheckedChange={setNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-white">Sound Alerts</label>
                      <p className="text-xs text-white/70">Play sounds for important notifications</p>
                    </div>
                    <Switch
                      checked={soundEnabled}
                      onCheckedChange={setSoundEnabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-white">Auto Refresh</label>
                      <p className="text-xs text-white/70">Automatically update data every 30 seconds</p>
                    </div>
                    <Switch
                      checked={autoRefresh}
                      onCheckedChange={setAutoRefresh}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* System */}
            <Card className="bg-neutral-900/95 border border-white/10 shadow-lg">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className="w-5 h-5 text-green-400" />
                  <h2 className="text-lg font-semibold text-white">System</h2>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-white">Simulation Mode</label>
                      <p className="text-xs text-white/70">Enable training scenarios and test data</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={simulationMode}
                        onCheckedChange={setSimulationMode}
                      />
                      {simulationMode && (
                        <Badge variant="secondary" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* About */}
            <Card className="bg-neutral-900/95 border border-white/10 shadow-lg">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Info className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-white">About</h2>
                </div>
                
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <span className="text-white">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Build:</span>
                    <span className="text-white">2024.01.15</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant="secondary" className="text-xs">Operational</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;


