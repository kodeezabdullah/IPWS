// Layer toggle control component

import React from 'react';
import { Layers, MapPin, Home, Navigation, Shield } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface LayerToggleProps {
  layers: {
    river: boolean;
    stations: boolean;
    villages: boolean;
    bufferZones: boolean;
    evacuationRoutes: boolean;
    shelters: boolean;
  };
  onLayerToggle: (layer: string) => void;
  className?: string;
}

/**
 * Control for toggling map layers
 * TODO: Customize styling based on reference project
 */
export const LayerToggle: React.FC<LayerToggleProps> = ({
  layers,
  onLayerToggle,
  className,
}) => {
  const layerConfig = [
    { key: 'river', label: 'River', icon: Layers },
    { key: 'stations', label: 'Stations', icon: MapPin },
    { key: 'villages', label: 'Villages', icon: Home },
    { key: 'bufferZones', label: 'Buffer Zones', icon: Shield },
    { key: 'evacuationRoutes', label: 'Routes', icon: Navigation },
    { key: 'shelters', label: 'Shelters', icon: Home },
  ];

  return (
    <div
      className={cn(
        'absolute top-4 right-4 bg-gray-900 border border-gray-800 rounded-lg p-3 shadow-lg',
        className
      )}
    >
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Layers className="w-4 h-4" />
        Layers
      </h3>
      <div className="space-y-2">
        {layerConfig.map(({ key, label, icon: Icon }) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={layers[key as keyof typeof layers]}
              onChange={() => onLayerToggle(key)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <Icon className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

