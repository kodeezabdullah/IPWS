// Villages layer for Deck.gl

import { ScatterplotLayer } from '@deck.gl/layers';
import type { Village } from '../../../types/village';
import { getRiskColor } from '../../../lib/utils';

interface VillagesLayerProps {
  data: Village[];
  visible?: boolean;
  onHover?: (info: any) => void;
  onClick?: (info: any) => void;
}

/**
 * Create a villages layer for Deck.gl
 * TODO: Customize styling based on reference project
 */
export function createVillagesLayer({
  data,
  visible = true,
  onHover,
  onClick,
}: VillagesLayerProps) {
  if (!data || data.length === 0 || !visible) return null;

  return new ScatterplotLayer({
    id: 'villages-layer',
    data,
    pickable: true,
    opacity: 0.6,
    stroked: true,
    filled: true,
    radiusMinPixels: 4,
    radiusMaxPixels: 15,
    getPosition: (d: Village) => d.coordinates,
    getRadius: (d: Village) => {
      // Size based on population
      return Math.sqrt(d.population) / 10;
    },
    getFillColor: (d: Village) => {
      const hex = getRiskColor(d.riskLevel).replace('#', '');
      return [
        parseInt(hex.substring(0, 2), 16),
        parseInt(hex.substring(2, 4), 16),
        parseInt(hex.substring(4, 6), 16),
        150, // Alpha
      ];
    },
    getLineColor: [255, 255, 255],
    lineWidthMinPixels: 1,
    onHover,
    onClick,
  });
}

