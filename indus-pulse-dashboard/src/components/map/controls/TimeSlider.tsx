// Time slider control component

import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../../../lib/utils';

interface TimeSliderProps {
  timestamps: Date[];
  currentIndex: number;
  onTimeChange: (index: number) => void;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  className?: string;
}

/**
 * Time slider for temporal data visualization
 * TODO: Customize styling based on reference project
 */
export const TimeSlider: React.FC<TimeSliderProps> = ({
  timestamps,
  currentIndex,
  onTimeChange,
  isPlaying = false,
  onPlayPause,
  className,
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onTimeChange(parseInt(e.target.value));
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onTimeChange(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < timestamps.length - 1) {
      onTimeChange(currentIndex + 1);
    }
  };

  return (
    <div
      className={cn(
        'absolute bottom-8 left-1/2 -translate-x-1/2',
        'bg-gray-900 border border-gray-800 rounded-lg p-4 shadow-lg',
        'w-full max-w-2xl',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-2 hover:bg-gray-800 rounded-lg disabled:opacity-50"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            onClick={onPlayPause}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === timestamps.length - 1}
            className="p-2 hover:bg-gray-800 rounded-lg disabled:opacity-50"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Slider */}
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={timestamps.length - 1}
            value={currentIndex}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Time display */}
        <div className="text-sm font-medium whitespace-nowrap">
          {timestamps[currentIndex] &&
            format(timestamps[currentIndex], 'MMM dd, HH:mm')}
        </div>
      </div>
    </div>
  );
};

