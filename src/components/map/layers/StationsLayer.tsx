// Stations layer for Deck.gl

import { ScatterplotLayer } from '@deck.gl/layers';
import type { Station } from '../../../types/station';
import { getRiskColor } from '../../../lib/utils';

interface StationsLayerProps {
  data: Station[];
  visible?: boolean;
  onHover?: (info: any) => void;
  onClick?: (info: any) => void;
}

/**
 * Create a stations layer for Deck.gl
 * TODO: Customize styling based on reference project
 */
export function createStationsLayer({
  data,
  visible = true,
  onHover,
  onClick,
}: StationsLayerProps) {
  if (!data || data.length === 0 || !visible) return null;

  return new ScatterplotLayer({
    id: 'stations-layer',
    data,
    pickable: true,
    opacity: 0.8,
    stroked: true,
    filled: true,
    radiusMinPixels: 3,
    radiusMaxPixels: 8,
    getPosition: (d: Station) => d.coordinates,
    getRadius: (d: Station) => {
      // Much smaller radius - reduced by 70%
      const riskMultipliers: Record<string, number> = { 
        yellow: 0.8, 
        orange: 1.0, 
        darkOrange: 1.2, 
        red: 1.5 
      };
      return 6 * (riskMultipliers[d.riskLevel] || 1);
    },
    getFillColor: (d: Station) => {
      // Convert hex color to RGB array
      const hex = getRiskColor(d.riskLevel).replace('#', '');
      return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16),
      ];
    },
    getLineColor: [255, 255, 255],
    lineWidthMinPixels: 2,
    onHover,
    onClick,
  });
}

