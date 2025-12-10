// General Map Page - Shows the river GeoJSON and Pakistan boundaries

import React, { useState, useEffect } from 'react';
import { DeckGLMap } from '../components/map/DeckGLMap';
import { createAnimatedRiverLayer } from '../components/map/layers/AnimatedRiverLayer';
import { createPakistanLayer, getDistrictName, getProvinceName } from '../components/map/layers/PakistanLayer';
import { Loader } from '../components/common/Loader';

/**
 * General Map Page - First page showing Indus River
 * TODO: Add animation for river flow
 */
export const GeneralMapPage: React.FC = () => {
  const [riverData, setRiverData] = useState<any>(null);
  const [pakistanData, setPakistanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  useEffect(() => {
    // Load both GeoJSON files
    Promise.all([
      fetch('/data/geojson/indus-river.geojson').then((res) => res.json()),
      fetch('/data/geojson/pakistan-boundaries.geojson').then((res) => res.json()),
    ])
      .then(([river, pakistan]) => {
        console.log('GeoJSON data loaded');
        setRiverData(river);
        setPakistanData(pakistan);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);


  const layers = riverData && pakistanData
    ? [
        createPakistanLayer({
          data: pakistanData,
          visible: true,
          onHover: (info: any) => {
            if (info.object) {
              const district = getDistrictName(info.object);
              const province = getProvinceName(info.object);
              setHoveredDistrict(`${district}, ${province}`);
            } else {
              setHoveredDistrict(null);
            }
          },
        }),
        createAnimatedRiverLayer({
          data: riverData,
          visible: true,
          animationSpeed: 3.0, // Animation speed
          particleCount: 200, // More pearls
          particleSpeed: 1.75, // Reduced speed (2.5 * 0.7 = 1.75)
        }),
      ].filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader size="lg" />
          <p className="mt-4 text-gray-400">Loading River Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-500 text-lg">Error: {error}</p>
          <p className="text-gray-400 mt-2">Failed to load river GeoJSON</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Map */}
      <DeckGLMap layers={layers} />

      {/* Info Panel - Top Right - Portrait Layout */}
      <div
        className="absolute top-4 right-4 rounded-lg p-4 shadow-2xl"
        style={{
          backgroundColor: 'rgba(10, 22, 40, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(100, 150, 200, 0.2)',
          width: '220px'
        }}
      >
        <h2 className="text-lg font-bold text-white mb-2 text-center border-b pb-2" style={{ borderColor: 'rgba(100, 150, 200, 0.2)' }}>
          Indus River Basin
        </h2>
        <p className="text-xs mb-3 text-center leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.65)' }}>
          Real-time flood monitoring and early warning system for the Indus River basin in Pakistan.
        </p>
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-xs mb-0.5" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Total Length:</p>
            <p className="text-xl font-semibold text-white">3,180 km</p>
          </div>
          <div className="text-center">
            <p className="text-xs mb-0.5" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Basin Area:</p>
            <p className="text-lg font-semibold text-white">1,165,000 km²</p>
          </div>
          <div className="text-center">
            <p className="text-xs mb-0.5" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Countries:</p>
            <p className="text-xl font-semibold text-white">4</p>
          </div>
        </div>

        {/* Hovered District Info */}
        {hoveredDistrict && (
          <div
            className="mt-3 pt-3 text-center"
            style={{ borderTop: '1px solid rgba(100, 150, 200, 0.2)' }}
          >
            <p className="text-xs mb-1" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>Hovering:</p>
            <p className="text-xs font-medium" style={{ color: '#4A90E2' }}>{hoveredDistrict}</p>
          </div>
        )}
      </div>

      {/* Legend - Bottom Right */}
      <div
        className="absolute bottom-6 right-4 rounded-lg p-3 shadow-2xl"
        style={{
          backgroundColor: 'rgba(10, 22, 40, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(100, 150, 200, 0.2)',
          width: '160px'
        }}
      >
        <h3 className="text-xs font-semibold text-white mb-2">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-2.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded opacity-60 flex-shrink-0"></div>
            <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Districts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-1 bg-blue-500 rounded flex-shrink-0"></div>
            <span className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>River</span>
          </div>
        </div>
      </div>
    </div>
  );
};

