// Buffer zones layer for stations with clustering

import { ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import { CompositeLayer } from '@deck.gl/core';
import type { Station } from '../../../types/station';
import { RISK_BUFFER_ZONES } from '../../../lib/constants';

// Clustering library integration
import Supercluster from 'supercluster';

interface BufferZoneLayerProps {
  data: Station[];
  visible?: boolean;
  selectedArea?: string | null;
  zoom?: number;
}

interface ClusterFeature {
  type: 'Feature';
  id: number;
  properties: {
    cluster: boolean;
    point_count?: number;
    cluster_id?: number;
    station?: Station;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

/**
 * Clustered Buffer Zone Layer
 * Groups nearby buffer zones when zoomed out, expands on zoom in
 */
class ClusteredBufferZoneLayer extends CompositeLayer<BufferZoneLayerProps> {
  static layerName = 'ClusteredBufferZoneLayer';

  initializeState() {
    const index = new Supercluster({
      radius: 100, // Cluster radius in pixels
      maxZoom: 16, // Max zoom to cluster points
      minZoom: 0,
    });
    
    this.setState({
      index,
    });
  }

  shouldUpdateState({ changeFlags }: any) {
    return changeFlags.somethingChanged;
  }

  updateState({ props, changeFlags }: any) {
    const rebuildIndex = changeFlags.dataChanged || props.selectedArea !== this.props.selectedArea;

    if (rebuildIndex) {
      const { data, selectedArea } = props;
      
      // Filter stations by selected area
      const filteredStations = selectedArea
        ? data.filter((s: Station) => s.city === selectedArea || s.district === selectedArea)
        : data;

      // Convert to GeoJSON features
      const features = filteredStations.map((station: Station, i: number) => ({
        type: 'Feature' as const,
        id: i,
        properties: {
          cluster: false,
          station,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [station.coordinates[0], station.coordinates[1]],
        },
      }));

      const index = new Supercluster({
        radius: 100,
        maxZoom: 16,
        minZoom: 0,
      });
      
      index.load(features);
      this.setState({ index });
    }
  }

  renderLayers() {
    const { data, visible, selectedArea } = this.props;
    
    if (!data || data.length === 0 || !visible) return [];

    // Filter stations
    const filteredStations = selectedArea
      ? data.filter((s: Station) => s.city === selectedArea || s.district === selectedArea)
      : data;

    if (filteredStations.length === 0) return [];

    const { index } = this.state as any;
    const zoom = Math.floor(this.context.viewport.zoom);

    // Get clusters at current zoom
    const bbox: [number, number, number, number] = [-180, -85, 180, 85]; // World bounds
    const clusters = index ? index.getClusters(bbox, zoom) : [];

    return [
      // Buffer zones for individual points (when zoomed in)
      new ScatterplotLayer({
        id: `${this.props.id}-buffers`,
        data: clusters.filter((f: ClusterFeature) => !f.properties.cluster),
        pickable: false,
        opacity: 0.15,
        stroked: true,
        filled: true,
        radiusScale: 1,
        radiusMinPixels: 1,
        radiusMaxPixels: 1000,
        getPosition: (d: ClusterFeature) => d.geometry.coordinates,
        getRadius: (d: ClusterFeature) => {
          const station = d.properties.station;
          if (!station) return 500;
          const bufferKm = RISK_BUFFER_ZONES[station.riskLevel] || 0.5;
          return bufferKm * 1000;
        },
        getFillColor: (d: ClusterFeature) => {
          const station = d.properties.station;
          if (!station) return [251, 191, 36, 25];
          switch (station.riskLevel) {
            case 'red':
              return [220, 38, 38, 40];
            case 'darkOrange':
              return [234, 88, 12, 35];
            case 'orange':
              return [249, 115, 22, 30];
            default:
              return [251, 191, 36, 25];
          }
        },
        getLineColor: (d: ClusterFeature) => {
          const station = d.properties.station;
          if (!station) return [251, 191, 36, 70];
          switch (station.riskLevel) {
            case 'red':
              return [220, 38, 38, 100];
            case 'darkOrange':
              return [234, 88, 12, 90];
            case 'orange':
              return [249, 115, 22, 80];
            default:
              return [251, 191, 36, 70];
          }
        },
        lineWidthMinPixels: 1,
        updateTriggers: {
          getPosition: zoom,
        },
      }),

      // Cluster circles (when zoomed out)
      new ScatterplotLayer({
        id: `${this.props.id}-clusters`,
        data: clusters.filter((f: ClusterFeature) => f.properties.cluster),
        pickable: true,
        opacity: 0.8,
        stroked: true,
        filled: true,
        radiusScale: 1,
        radiusMinPixels: 20,
        radiusMaxPixels: 80,
        getPosition: (d: ClusterFeature) => d.geometry.coordinates,
        getRadius: (d: ClusterFeature) => {
          const count = d.properties.point_count || 1;
          return Math.sqrt(count) * 15;
        },
        getFillColor: [59, 130, 246, 180], // Blue cluster
        getLineColor: [255, 255, 255, 255],
        lineWidthMinPixels: 2,
        updateTriggers: {
          getPosition: zoom,
        },
      }),

      // Cluster text labels
      new TextLayer({
        id: `${this.props.id}-cluster-text`,
        data: clusters.filter((f: ClusterFeature) => f.properties.cluster),
        pickable: false,
        getPosition: (d: ClusterFeature) => d.geometry.coordinates,
        getText: (d: ClusterFeature) => String(d.properties.point_count || 0),
        getSize: 14,
        getColor: [255, 255, 255, 255],
        getAlignmentBaseline: 'center',
        getTextAnchor: 'middle',
        fontWeight: 'bold',
        updateTriggers: {
          getPosition: zoom,
        },
      }),
    ];
  }
}

/**
 * Create clustered buffer zones around stations
 */
export function createBufferZoneLayer({
  data,
  visible = true,
  selectedArea = null,
  zoom = 6,
}: BufferZoneLayerProps) {
  if (!data || data.length === 0 || !visible) return null;

  return new ClusteredBufferZoneLayer({
    id: 'buffer-zone-layer',
    data,
    visible,
    selectedArea,
    zoom,
  });
}

