// Main DeckGL map component

import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import Map from 'react-map-gl';
import { INITIAL_VIEW_STATE, MAPBOX_STYLE, MAPBOX_STYLE_LIGHT } from '../../lib/constants';
import { cn } from '../../lib/utils';

// Import Mapbox CSS
import 'mapbox-gl/dist/mapbox-gl.css';

interface DeckGLMapProps {
  layers?: any[];
  children?: React.ReactNode;
  className?: string;
  viewState?: any;
  onViewStateChange?: (viewState: any) => void;
}

/**
 * Main map component using Deck.gl and Mapbox
 */
export const DeckGLMap: React.FC<DeckGLMapProps> = ({
  layers = [],
  children,
  className,
  viewState: externalViewState,
  onViewStateChange,
}) => {
  const [internalViewState, setInternalViewState] = useState(INITIAL_VIEW_STATE);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  // Listen for theme changes
  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
    setCurrentTheme(theme || 'dark');

    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
      setCurrentTheme(newTheme || 'dark');
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  // Use external viewState if provided, otherwise use internal
  const currentViewState = externalViewState || internalViewState;

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'your_mapbox_token_here';

  // Select map style based on theme
  const mapStyle = currentTheme === 'light' ? MAPBOX_STYLE_LIGHT : MAPBOX_STYLE;

  const handleViewStateChange = ({ viewState }: any) => {
    if (onViewStateChange) {
      onViewStateChange(viewState);
    } else {
      setInternalViewState(viewState);
    }
  };

  return (
    <div className={cn('relative w-full h-full', className)}>
      <DeckGL
        viewState={currentViewState}
        onViewStateChange={handleViewStateChange}
        controller={{
          touchRotate: true,
          touchZoom: true,
          scrollZoom: true,
          dragRotate: true,
          dragPan: true,
          keyboard: true,
          doubleClickZoom: true
        }}
        layers={layers}
      >
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle={mapStyle}
          maxZoom={INITIAL_VIEW_STATE.maxZoom}
          minZoom={INITIAL_VIEW_STATE.minZoom}
        />
      </DeckGL>
      {children}
    </div>
  );
};

