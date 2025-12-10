// Animated river layer with flowing particles for Indus River visualization

import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import { CompositeLayer } from '@deck.gl/core';
import type { Feature } from 'geojson';

interface AnimatedRiverLayerProps {
  data: any;
  visible?: boolean;
  animationSpeed?: number; // 0.1 to 5.0
  particleCount?: number; // Number of flowing particles
  particleSpeed?: number; // Speed multiplier for particles
}

interface Particle {
  position: [number, number];
  progress: number;
  lineIndex: number;
  segmentIndex: number;
}

export class AnimatedRiverLayer extends CompositeLayer<AnimatedRiverLayerProps> {
  static layerName = 'AnimatedRiverLayer';
  
  declare state: {
    time: number;
    particles: Particle[];
    riverPaths: [number, number][][];
  };

  initializeState() {
    this.setState({
      time: 0,
      particles: [],
      riverPaths: [],
    });

    // Extract paths from GeoJSON
    if (this.props.data) {
      const paths = this.extractPaths(this.props.data);
      this.setState({ riverPaths: paths });
      
      // Initialize particles
      const particles = this.initializeParticles(paths, this.props.particleCount || 150);
      this.setState({ particles });
    }

    // Start animation loop
    this.startAnimation();
  }

  /**
   * Extract coordinate paths from GeoJSON
   */
  extractPaths(geojson: any): [number, number][][] {
    const paths: [number, number][][] = [];

    const processFeature = (feature: Feature) => {
      if (feature.geometry.type === 'LineString') {
        paths.push(feature.geometry.coordinates as [number, number][]);
      } else if (feature.geometry.type === 'MultiLineString') {
        feature.geometry.coordinates.forEach((line: any) => {
          paths.push(line as [number, number][]);
        });
      } else if (feature.geometry.type === 'Polygon') {
        feature.geometry.coordinates.forEach((ring: any) => {
          paths.push(ring as [number, number][]);
        });
      }
    };

    if (geojson.type === 'FeatureCollection') {
      geojson.features.forEach(processFeature);
    } else if (geojson.type === 'Feature') {
      processFeature(geojson);
    }

    return paths;
  }

  /**
   * Initialize particles at random positions along river paths
   */
  initializeParticles(paths: [number, number][][], count: number): Particle[] {
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const lineIndex = Math.floor(Math.random() * paths.length);
      const line = paths[lineIndex];
      
      if (line && line.length > 1) {
        const segmentIndex = Math.floor(Math.random() * (line.length - 1));
        const progress = Math.random(); // 0 to 1 within segment

        particles.push({
          position: this.interpolatePosition(line[segmentIndex], line[segmentIndex + 1], progress),
          progress: Math.random(), // Overall progress along entire path (0-1)
          lineIndex,
          segmentIndex,
        });
      }
    }

    return particles;
  }

  /**
   * Interpolate position between two points
   */
  interpolatePosition(
    start: [number, number],
    end: [number, number],
    t: number
  ): [number, number] {
    return [
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t,
    ];
  }

  /**
   * Update particle positions based on animation time
   */
  updateParticles(deltaTime: number) {
    const { particles, riverPaths } = this.state;
    const particleSpeed = (this.props.particleSpeed || 1.5) * 0.001 * 0.7; // Base speed reduced by 30%

    const updatedParticles = particles.map((particle) => {
      const path = riverPaths[particle.lineIndex];
      if (!path || path.length < 2) return particle;

      // Update progress along the path
      let newProgress = particle.progress + deltaTime * particleSpeed;

      // Loop back to start when reaching end
      if (newProgress >= 1) {
        newProgress = newProgress % 1;
      }

      // Calculate segment index based on progress
      const totalSegments = path.length - 1;
      const segmentFloat = newProgress * totalSegments;
      const segmentIndex = Math.floor(segmentFloat);
      const segmentProgress = segmentFloat - segmentIndex;

      // Get position
      const actualSegmentIndex = Math.min(segmentIndex, totalSegments - 1);
      const start = path[actualSegmentIndex];
      const end = path[Math.min(actualSegmentIndex + 1, path.length - 1)];

      return {
        position: this.interpolatePosition(start, end, segmentProgress),
        progress: newProgress,
        lineIndex: particle.lineIndex,
        segmentIndex: actualSegmentIndex,
      };
    });

    this.setState({ particles: updatedParticles });
  }

  /**
   * Start animation loop
   */
  startAnimation() {
    let lastTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const newTime = this.state.time + deltaTime;
      this.setState({ time: newTime });

      // Update particles
      this.updateParticles(deltaTime);

      // Trigger re-render
      this.setNeedsUpdate();

      // Continue animation
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  renderLayers() {
    const { data, visible = true } = this.props;
    const { particles, time } = this.state;

    if (!visible || !data) return [];

    return [
      // Base river layer (static, darker)
      new GeoJsonLayer({
        id: `${this.props.id}-base`,
        data,
        filled: true,
        stroked: true,
        lineWidthMinPixels: 3,
        getFillColor: [30, 80, 150, 120], // Dark blue with transparency
        getLineColor: [40, 100, 180, 180],
        getLineWidth: 3,
        pickable: false,
      }),

      // Animated flow layer (lighter, moving dashes)
      new GeoJsonLayer({
        id: `${this.props.id}-flow`,
        data,
        filled: false,
        stroked: true,
        lineWidthMinPixels: 4,
        getLineColor: [59, 130, 246, 255], // Bright blue
        getLineWidth: 4,
        getDashArray: [20, 10], // Dash pattern
        dashJustified: true,
        dashGapPickable: false,
        extensions: [],
        updateTriggers: {
          getLineColor: time,
        },
      }),

      // Flowing particles (pearls) - 30% smaller
      new ScatterplotLayer({
        id: `${this.props.id}-particles`,
        data: particles,
        getPosition: (d: Particle) => d.position,
        getRadius: 560, // Reduced by 30% (800 * 0.7 = 560)
        getFillColor: [255, 255, 255, 220], // White pearls
        getLineColor: [100, 180, 255, 255], // Blue glow
        lineWidthMinPixels: 1,
        stroked: true,
        filled: true,
        radiusMinPixels: 1.4, // Reduced by 30% (2 * 0.7 = 1.4)
        radiusMaxPixels: 5.6, // Reduced by 30% (8 * 0.7 = 5.6)
        pickable: false,
        updateTriggers: {
          getPosition: time,
        },
      }),

      // Particle glow effect - 30% smaller
      new ScatterplotLayer({
        id: `${this.props.id}-particles-glow`,
        data: particles,
        getPosition: (d: Particle) => d.position,
        getRadius: 840, // Reduced by 30% (1200 * 0.7 = 840)
        getFillColor: [100, 180, 255, 80], // Transparent blue glow
        radiusMinPixels: 2.8, // Reduced by 30% (4 * 0.7 = 2.8)
        radiusMaxPixels: 8.4, // Reduced by 30% (12 * 0.7 = 8.4)
        pickable: false,
        updateTriggers: {
          getPosition: time,
        },
      }),
    ];
  }
}

/**
 * Helper function to create AnimatedRiverLayer
 */
export function createAnimatedRiverLayer({
  data,
  visible = true,
  animationSpeed = 2.5,
  particleCount = 150,
  particleSpeed = 1.8,
}: AnimatedRiverLayerProps) {
  if (!data || !visible) return null;

  return new AnimatedRiverLayer({
    id: 'animated-river-layer',
    data,
    visible,
    animationSpeed,
    particleCount,
    particleSpeed,
  });
}
