// Zoom controls component

import React from 'react';
import { Plus, Minus, Maximize } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  className?: string;
}

/**
 * Zoom control buttons for map
 * TODO: Customize styling based on reference project
 */
export const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  className,
}) => {
  return (
    <div
      className={cn(
        'absolute bottom-8 right-4',
        'bg-gray-900 border border-gray-800 rounded-lg shadow-lg',
        'flex flex-col',
        className
      )}
    >
      <button
        onClick={onZoomIn}
        className="p-3 hover:bg-gray-800 border-b border-gray-800 rounded-t-lg"
        title="Zoom In"
      >
        <Plus className="w-5 h-5" />
      </button>
      <button
        onClick={onZoomOut}
        className="p-3 hover:bg-gray-800 border-b border-gray-800"
        title="Zoom Out"
      >
        <Minus className="w-5 h-5" />
      </button>
      <button
        onClick={onResetView}
        className="p-3 hover:bg-gray-800 rounded-b-lg"
        title="Reset View"
      >
        <Maximize className="w-5 h-5" />
      </button>
    </div>
  );
};

