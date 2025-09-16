import React from 'react';
import { EmergencyButton } from '@/components/Emergency/EmergencyButton';

const SafetyAlert: React.FC = () => {
  return (
    <div className="relative h-screen w-full bg-background">
      <div className="p-4 text-white">Safety Alert</div>
      <EmergencyButton />
    </div>
  );
};

export default SafetyAlert;


