// Constants for Indus Pulse Warning System

/**
 * Risk tier colors - 4-Tier Warning System for IPWS
 * Based on water level percentage of danger level
 */
export const RISK_COLORS = {
  yellow: '#fbbf24',      // Yellow - Mild alert (60-80%)
  orange: '#f97316',      // Orange - Moderate/high threat (80-90%)
  darkOrange: '#ea580c',  // Dark Orange - Very dangerous (90-95%)
  red: '#dc2626',         // Red - Critical/inevitable threat (>95%)
} as const;

// Legacy support (maps to new system)
export const RISK_COLORS_LEGACY = {
  low: '#fbbf24',      // Maps to yellow
  medium: '#f97316',   // Maps to orange
  high: '#ea580c',     // Maps to darkOrange
  critical: '#dc2626', // Maps to red
} as const;

/**
 * Map initial viewport for Indus River, Pakistan
 * Centered on the Indus River basin with 3D perspective
 */
export const INITIAL_VIEW_STATE = {
  longitude: 72.5,
  latitude: 29.0,
  zoom: 4.7,        // Initial zoom level (lower = more zoomed out)
  pitch: 25,        // 3D angle view (0 = flat, 60 = max tilt)
  bearing: 0,
  maxZoom: 16,      // Maximum zoom in level
  minZoom: 4,       // Minimum zoom out level
} as const;

/**
 * Map style URLs - CartoDB styles for dark and light themes
 */
export const MAPBOX_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
export const MAPBOX_STYLE_LIGHT = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

/**
 * Water level thresholds (percentage of danger level)
 */
export const RISK_THRESHOLDS = {
  yellow: 60,      // 60-80% of danger level
  orange: 80,      // 80-90% of danger level
  darkOrange: 90,  // 90-95% of danger level
  red: 95,         // >95% of danger level
} as const;

/**
 * Buffer zone distances based on risk tier (in km)
 */
export const RISK_BUFFER_ZONES = {
  yellow: 0.5,      // 500m
  orange: 1.0,      // 1km
  darkOrange: 1.5,  // 1.5km
  red: 2.0,         // 2km
} as const;

/**
 * Refresh intervals (in milliseconds)
 */
export const REFRESH_INTERVALS = {
  realtime: 30000,  // 30 seconds
  normal: 60000,    // 1 minute
  slow: 300000,     // 5 minutes
} as const;

/**
 * Chart colors
 */
export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
} as const;

/**
 * Buffer zone distances (in km)
 */
export const BUFFER_ZONES = {
  inner: 5,
  middle: 10,
  outer: 20,
} as const;

/**
 * Station status
 */
export const STATION_STATUS = {
  active: 'active',
  inactive: 'inactive',
  maintenance: 'maintenance',
  warning: 'warning',
  alert: 'alert',
} as const;

/**
 * Layer visibility defaults
 */
export const DEFAULT_LAYER_VISIBILITY = {
  river: true,
  stations: true,
  villages: true,
  bufferZones: false,
  evacuationRoutes: false,
  shelters: false,
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

