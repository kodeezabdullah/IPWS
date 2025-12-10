// Utility functions for Indus Pulse Warning System

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Calculate risk level based on water level (4-tier IPWS system)
 */
export function calculateRiskLevel(
  currentLevel: number,
  dangerLevel: number
): 'yellow' | 'orange' | 'darkOrange' | 'red' {
  const percentage = (currentLevel / dangerLevel) * 100;
  
  if (percentage >= 95) return 'red';           // >95%: Critical
  if (percentage >= 90) return 'darkOrange';    // 90-95%: Very dangerous
  if (percentage >= 80) return 'orange';        // 80-90%: Moderate/high threat
  if (percentage >= 60) return 'yellow';        // 60-80%: Mild alert
  return 'yellow'; // <60%: Still mild alert
}

/**
 * Get risk color based on risk level (4-tier IPWS system)
 */
export function getRiskColor(risk: string): string {
  const riskColors: Record<string, string> = {
    yellow: '#fbbf24',      // Yellow - Mild alert
    orange: '#f97316',      // Orange - Moderate/high threat
    darkOrange: '#ea580c',  // Dark Orange - Very dangerous
    red: '#dc2626',         // Red - Critical
    // Legacy support
    low: '#fbbf24',
    medium: '#f97316',
    high: '#ea580c',
    critical: '#dc2626',
  };
  
  return riskColors[risk] || riskColors.yellow;
}

/**
 * Get risk label for display
 */
export function getRiskLabel(risk: string): string {
  const labels: Record<string, string> = {
    yellow: 'Mild Alert',
    orange: 'Moderate Threat',
    darkOrange: 'Very Dangerous',
    red: 'Critical',
    // Legacy
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  };
  return labels[risk] || 'Unknown';
}

/**
 * Calculate distance between two coordinates (in km)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generate random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

