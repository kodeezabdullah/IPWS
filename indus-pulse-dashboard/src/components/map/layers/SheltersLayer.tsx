// Shelters layer for Deck.gl

import { IconLayer } from '@deck.gl/layers';
import type { Shelter } from '../../../types/route';

interface SheltersLayerProps {
  data: Shelter[];
  visible?: boolean;
  onHover?: (info: any) => void;
  onClick?: (info: any) => void;
}

/**
 * Create shelters layer for Deck.gl
 * TODO: Add actual icons for shelters
 * TODO: Customize styling based on reference project
 */
export function createSheltersLayer({
  data,
  visible = true,
  onHover,
  onClick,
}: SheltersLayerProps) {
  if (!data || data.length === 0 || !visible) return null;

  return new IconLayer({
    id: 'shelters-layer',
    data,
    pickable: true,
    getPosition: (d: Shelter) => d.coordinates,
    getIcon: () => 'marker',
    getSize: 30,
    getColor: (d: Shelter): [number, number, number] => {
      // Color based on availability
      const statusColors: Record<string, [number, number, number]> = {
        available: [16, 185, 129],  // Green
        partial: [251, 191, 36],    // Yellow
        full: [239, 68, 68],        // Red
        closed: [156, 163, 175],    // Gray
      };
      return statusColors[d.status] || statusColors.available;
    },
    onHover,
    onClick,
  });
}

