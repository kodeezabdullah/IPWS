// Animated ripple circles for alert stations

import { ScatterplotLayer } from '@deck.gl/layers';
import { CompositeLayer } from '@deck.gl/core';
import type { Station } from '../../../types/station';

interface AlertRippleLayerProps {
  data: Station[];
  visible?: boolean;
  selectedArea?: string | null;
}

/**
 * Creates animated ripple effect for critical/alert stations
 */
class AnimatedAlertRippleLayer extends CompositeLayer<AlertRippleLayerProps> {
  static layerName = 'AnimatedAlertRippleLayer';

  declare state: {
    time: number;
  };

  initializeState() {
    this.setState({
      time: 0,
    });

    // Start animation loop
    this.startAnimation();
  }

  startAnimation() {
    let lastTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const newTime = this.state.time + deltaTime;
      this.setState({ time: newTime });

      // Trigger re-render
      this.setNeedsUpdate();

      // Continue animation
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  renderLayers() {
    const { data, visible = true, selectedArea } = this.props;
    const { time } = this.state;

    // Only show ripples when an area is selected
    if (!visible || !data || data.length === 0 || !selectedArea) return [];

    // Filter only alert stations (red and dark orange) in the selected area
    const alertStations = data.filter(
      s => (s.riskLevel === 'red' || s.riskLevel === 'darkOrange') &&
           (s.city === selectedArea || s.district === selectedArea)
    );

    if (alertStations.length === 0) return [];

    // Create data for ripples: 2 filled inner rings (indices 0 and 1)
    const filledRipples = alertStations.flatMap(station => 
      [0, 1].map(rippleIndex => ({
        station,
        rippleIndex,
      }))
    );

    // Create data for ripples: 1 hollow outer ring (index 2)
    const hollowRipples = alertStations.map(station => ({
      station,
      rippleIndex: 2,
    }));

    const animationTime = time / 1000; // Convert to seconds

    return [
      // Filled inner ripples (2 rings)
      new ScatterplotLayer({
        id: `${this.props.id}-ripples-filled`,
        data: filledRipples,
        getPosition: (d: any) => d.station.coordinates,
        getRadius: (d: any) => {
          // Each ripple expands at different time
          const rippleTime = animationTime - d.rippleIndex * 0.5;
          const expansion = (rippleTime % 2) * 15000; // Expanding radius (15km max)
          return expansion;
        },
        getFillColor: (d: any) => {
          const station = d.station;
          // Color based on risk level
          let color: [number, number, number];
          if (station.riskLevel === 'red') {
            color = [220, 38, 38]; // Red
          } else {
            color = [234, 88, 12]; // Dark orange
          }
          
          // Fade out as ripple expands
          const rippleTime = animationTime - d.rippleIndex * 0.5;
          const alpha = Math.max(0, 150 - ((rippleTime % 2) * 75));
          return [...color, alpha];
        },
        stroked: false,
        filled: true,
        radiusMinPixels: 20,
        radiusMaxPixels: 100,
        pickable: false,
        updateTriggers: {
          getRadius: time,
          getFillColor: time,
        },
      }),

      // Hollow outer ripple ring (1 ring)
      new ScatterplotLayer({
        id: `${this.props.id}-ripples-hollow`,
        data: hollowRipples,
        getPosition: (d: any) => d.station.coordinates,
        getRadius: (d: any) => {
          // Each ripple expands at different time
          const rippleTime = animationTime - d.rippleIndex * 0.5;
          const expansion = (rippleTime % 2) * 15000; // Expanding radius (15km max)
          return expansion;
        },
        stroked: true,
        filled: false,
        getLineColor: (d: any) => {
          const station = d.station;
          // Color based on risk level
          let color: [number, number, number];
          if (station.riskLevel === 'red') {
            color = [220, 38, 38]; // Red
          } else {
            color = [234, 88, 12]; // Dark orange
          }
          
          // Fade out as ripple expands
          const rippleTime = animationTime - d.rippleIndex * 0.5;
          const alpha = Math.max(0, 200 - ((rippleTime % 2) * 100));
          return [...color, alpha];
        },
        lineWidthMinPixels: 2,
        radiusMinPixels: 20,
        radiusMaxPixels: 100,
        pickable: false,
        updateTriggers: {
          getRadius: time,
          getLineColor: time,
        },
      }),
    ];
  }
}

/**
 * Create animated alert ripple layer
 */
export function createAlertRippleLayer({
  data,
  visible = true,
  selectedArea = null,
}: AlertRippleLayerProps) {
  if (!data || data.length === 0 || !visible) return null;

  return new AnimatedAlertRippleLayer({
    id: 'alert-ripple-layer',
    data,
    visible,
    selectedArea,
  });
}

