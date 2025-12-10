// Area selector dropdown for filtering by city/district

import React from 'react';
import { MapPin } from 'lucide-react';

interface AreaSelectorProps {
  areas: string[];
  selectedArea: string | null;
  onAreaChange: (area: string | null) => void;
}

export const AreaSelector: React.FC<AreaSelectorProps> = ({
  areas,
  selectedArea,
  onAreaChange,
}) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-xl border border-gray-800">
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-blue-400" />
        <h3 className="text-sm font-semibold text-white">Select Area</h3>
      </div>
      
      <select
        value={selectedArea || ''}
        onChange={(e) => onAreaChange(e.target.value || null)}
        className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">All Areas (Show All Sensors)</option>
        <optgroup label="Major Cities">
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </optgroup>
      </select>

      {selectedArea && (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <p className="text-xs text-gray-400 mb-1">Buffer Zones Shown:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 opacity-40"></div>
              <span className="text-gray-300">Red (2km)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-600 opacity-40"></div>
              <span className="text-gray-300">Dark Orange (1.5km)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-400 opacity-40"></div>
              <span className="text-gray-300">Orange (1km)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-40"></div>
              <span className="text-gray-300">Yellow (500m)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

