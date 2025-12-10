// Pakistan boundaries layer for Deck.gl

import { GeoJsonLayer } from '@deck.gl/layers';

interface PakistanLayerProps {
  data: any; // GeoJSON data
  visible?: boolean;
  onHover?: (info: any) => void;
  onClick?: (info: any) => void;
}

// Beautiful color palette for different regions
const PROVINCE_COLORS: Record<string, [number, number, number]> = {
  'Punjab': [220, 38, 127],           // Pink/Magenta
  'Sindh': [79, 70, 229],             // Indigo
  'Balochistan': [249, 115, 22],      // Orange
  'Khyber Pakhtunkhwa': [16, 185, 129], // Emerald
  'Azad Kashmir': [139, 92, 246],     // Purple
  'Gilgit-Baltistan': [59, 130, 246], // Blue
  'Islamabad': [251, 191, 36],        // Amber
  'FATA': [244, 63, 94],              // Rose
};

// Fallback colors for districts
const DISTRICT_COLORS = [
  [99, 102, 241],   // Indigo
  [139, 92, 246],   // Violet
  [236, 72, 153],   // Pink
  [239, 68, 68],    // Red
  [249, 115, 22],   // Orange
  [251, 146, 60],   // Orange Light
  [251, 191, 36],   // Amber
  [245, 158, 11],   // Yellow
  [132, 204, 22],   // Lime
  [34, 197, 94],    // Green
  [16, 185, 129],   // Emerald
  [20, 184, 166],   // Teal
  [6, 182, 212],    // Cyan
  [14, 165, 233],   // Sky
  [59, 130, 246],   // Blue
  [99, 102, 241],   // Indigo
];

/**
 * Create Pakistan boundaries layer with beautiful colors
 */
export function createPakistanLayer({
  data,
  visible = true,
  onHover,
  onClick,
}: PakistanLayerProps) {
  if (!data || !visible) return null;

  return new GeoJsonLayer({
    id: 'pakistan-layer',
    data,
    filled: true,
    stroked: true,
    pickable: true,
    
    // Fill color based on province/region
    getFillColor: (feature: any): [number, number, number, number] => {
      const provinceName = feature.properties?.NAME_1 || '';
      const districtName = feature.properties?.NAME_3 || '';

      // Try to get province color (low opacity for subtle background)
      if (PROVINCE_COLORS[provinceName]) {
        return [...PROVINCE_COLORS[provinceName], 40] as [number, number, number, number];
      }

      // Fallback: use district hash for consistent colors (low opacity for subtle background)
      const hash = districtName.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const colorIndex = hash % DISTRICT_COLORS.length;
      return [...DISTRICT_COLORS[colorIndex], 40] as [number, number, number, number];
    },
    
    // Border color
    getLineColor: [255, 255, 255, 180], // White borders with transparency
    getLineWidth: 2,
    lineWidthMinPixels: 1,
    lineWidthMaxPixels: 3,
    
    // Highlight on hover
    autoHighlight: true,
    highlightColor: [255, 255, 255, 100],
    
    // Transition effects
    transitions: {
      getFillColor: 300,
      getLineWidth: 300,
    },
    
    // Update triggers
    updateTriggers: {
      getFillColor: [data],
    },
    
    onHover,
    onClick,
  });
}

/**
 * Get readable district name from feature
 */
export function getDistrictName(feature: any): string {
  return feature.properties?.NAME_3 || feature.properties?.NAME_2 || 'Unknown';
}

/**
 * Get province name from feature
 */
export function getProvinceName(feature: any): string {
  return feature.properties?.NAME_1 || 'Unknown';
}

