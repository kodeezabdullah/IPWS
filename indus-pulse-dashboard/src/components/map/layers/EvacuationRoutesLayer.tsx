// Evacuation routes layer for Deck.gl

import { PathLayer } from '@deck.gl/layers';
import type { EvacuationRoute } from '../../../types/route';

interface EvacuationRoutesLayerProps {
  data: EvacuationRoute[];
  visible?: boolean;
}

/**
 * Create evacuation routes layer for Deck.gl
 * TODO: Customize styling based on reference project
 */
export function createEvacuationRoutesLayer({
  data,
  visible = true,
}: EvacuationRoutesLayerProps) {
  if (!data || data.length === 0 || !visible) return null;

  return new PathLayer({
    id: 'evacuation-routes-layer',
    data,
    pickable: true,
    widthScale: 2,
    widthMinPixels: 2,
    getPath: (d: EvacuationRoute) => [d.startPoint, ...d.waypoints, d.endPoint],
    getColor: (d: EvacuationRoute): [number, number, number] => {
      // Color based on route status
      const statusColors: Record<string, [number, number, number]> = {
        open: [16, 185, 129],    // Green
        congested: [251, 191, 36], // Yellow
        blocked: [239, 68, 68],   // Red
        unsafe: [156, 163, 175],  // Gray
      };
      return statusColors[d.status] || statusColors.open;
    },
    getWidth: 3,
  });
}

