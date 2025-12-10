// River layer for Deck.gl

import { GeoJsonLayer } from '@deck.gl/layers';

interface RiverLayerProps {
  data: any; // GeoJSON data
  visible?: boolean;
}

/**
 * Create a river layer for Deck.gl
 * Styled for Indus River visualization
 */
export function createRiverLayer({ data, visible = true }: RiverLayerProps) {
  if (!data || !visible) return null;

  return new GeoJsonLayer({
    id: 'river-layer',
    data,
    filled: true,
    stroked: true,
    lineWidthMinPixels: 3,
    lineWidthMaxPixels: 10,
    getFillColor: [59, 130, 246, 180], // Bright blue with transparency
    getLineColor: [96, 165, 250, 255], // Lighter blue for outline
    getLineWidth: () => {
      // Default line width for river
      return 3;
    },
    pickable: true,
    autoHighlight: true,
    highlightColor: [96, 165, 250, 200],
  });
}

