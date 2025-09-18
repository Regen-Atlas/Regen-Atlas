import { Source, Layer, useMap } from "react-map-gl";
import { useEffect, useRef, useMemo, useState } from "react";
import type { MapRef } from "react-map-gl";
import type { MapboxGeoJSONFeature, MapMouseEvent } from "mapbox-gl";
import type { Point } from "geojson";
import { Org } from "../types";

interface Coordinates {
  longitude: number;
  latitude: number;
}

interface ClusteredOrgsLayerProps {
  orgs: Org[];
  onOrgClick: ({
    orgId,
    lng,
    lat,
  }: {
    orgId: number;
    lng: number;
    lat: number;
  }) => void;
}

function lngLatToPixel({ longitude, latitude }: Coordinates, map: MapRef) {
  return map.project([longitude, latitude]);
}

function pixelToLngLat(
  pixel: { x: number; y: number },
  map: MapRef
): Coordinates {
  const { lng, lat } = map.unproject([pixel.x, pixel.y]);
  return { longitude: lng, latitude: lat };
}

function spiderfyFeatures(orgs: Org[], map: MapRef, pixelRadius = 5): Org[] {
  const features: Org[] = [];
  const pixelThreshold = pixelRadius * 1.2;

  const pixelOrgs = orgs
    .map((org) => {
      const lng = org?.coordinates?.longitude;
      const lat = org?.coordinates?.latitude;

      if (
        typeof lng !== "number" ||
        typeof lat !== "number" ||
        isNaN(lng) ||
        isNaN(lat)
      ) {
        return null;
      }

      const pixel = lngLatToPixel({ longitude: lng, latitude: lat }, map);
      return { org, pixel };
    })
    .filter(Boolean) as { org: Org; pixel: { x: number; y: number } }[];

  const visited = new Set<number>();

  for (let i = 0; i < pixelOrgs.length; i++) {
    if (visited.has(i)) continue;

    const group = [pixelOrgs[i]];
    visited.add(i);

    for (let j = i + 1; j < pixelOrgs.length; j++) {
      if (visited.has(j)) continue;

      const dx = pixelOrgs[i].pixel.x - pixelOrgs[j].pixel.x;
      const dy = pixelOrgs[i].pixel.y - pixelOrgs[j].pixel.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < pixelThreshold) {
        group.push(pixelOrgs[j]);
        visited.add(j);
      }
    }

    if (group.length > 1) {
      const center = group[0].pixel;
      group.forEach((entry, idx) => {
        const angle = (idx / group.length) * Math.PI * 2;
        const x = center.x + pixelRadius * Math.cos(angle);
        const y = center.y + pixelRadius * Math.sin(angle);
        const offset = pixelToLngLat({ x, y }, map);

        features.push({
          ...entry.org,
          coordinates: {
            longitude: offset.longitude,
            latitude: offset.latitude,
          },
        });
      });
    } else {
      features.push(group[0].org);
    }
  }

  return features;
}

export function ClusteredOrgsLayer({
  orgs,
  onOrgClick,
}: ClusteredOrgsLayerProps) {
  const { current: map } = useMap(); // ✅ moved to top
  const hoveredStateIdRef = useRef<string | number | null>(null);
  const hoveredClusterIdRef = useRef<string | number | null>(null);
  const [zoom, setZoom] = useState(0);
  const clusterMaxZoom = 15;

  // Detect mobile device
  const isMobile = useMemo(() => {
    return window.innerWidth < 768;
  }, []);

  useEffect(() => {
    if (!map) return () => {};
    setZoom(map.getZoom());

    const updateZoom = () => setZoom(map.getZoom());
    map.on("zoom", updateZoom);
    return () => map.off("zoom", updateZoom);
  }, [map]);

  const geojson = useMemo(() => {
    if (!map) return { type: "FeatureCollection", features: [] };
    const filteredOrgs =
      zoom > clusterMaxZoom ? spiderfyFeatures(orgs, map, 20) : orgs;

    return {
      type: "FeatureCollection" as const,
      features: filteredOrgs.map((org, index) => {
        const ecosystemType = org.ecosystems.join(", ");
        const type_id = ecosystemType;
        const issuer_name = org.name;
        const lng = org.coordinates?.longitude ?? 0;
        const lat = org.coordinates?.latitude ?? 0;

        return {
          type: "Feature" as const,
          id: org.id ?? index,
          properties: {
            id: org.id,
            type_id,
            issuer_name,
            lng,
            lat,
          },
          geometry: {
            type: "Point" as const,
            coordinates: [lng, lat] as [number, number],
          },
        };
      }),
    };
  }, [orgs, map, zoom]);

  useEffect(() => {
    if (!map) return;

    const handleClick = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["unclustered-point", "clusters"],
      }) as MapboxGeoJSONFeature[];

      if (!features.length) return;
      const feature = features[0];

      if (feature.layer?.id === "unclustered-point") {
        const orgId = feature.properties?.id ?? null;
        onOrgClick({
          orgId,
          lng: feature.properties?.lng ?? 0,
          lat: feature.properties?.lat ?? 0,
        });
      }

      if (
        feature.layer?.id === "clusters" &&
        feature.geometry?.type === "Point"
      ) {
        const coords = (feature.geometry as Point).coordinates;
        if (Array.isArray(coords) && coords.length === 2) {
          const clusterId = feature.properties?.cluster_id;
          const source = map.getSource("orgs") as any;

          if (source && "getClusterExpansionZoom" in source) {
            source.getClusterExpansionZoom(
              clusterId,
              (err: any, newZoom: number) => {
                if (err || newZoom == null) return;
                map.easeTo({
                  center: coords as [number, number],
                  zoom: newZoom,
                  duration: 500,
                });
              }
            );
          }
        }
      }
    };

    const handleMouseMove = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["unclustered-point", "clusters"],
      }) as MapboxGeoJSONFeature[];

      if (hoveredStateIdRef.current !== null) {
        map.setFeatureState(
          { source: "orgs", id: hoveredStateIdRef.current },
          { hover: false }
        );
        hoveredStateIdRef.current = null;
      }
      if (hoveredClusterIdRef.current !== null) {
        map.setFeatureState(
          { source: "orgs", id: hoveredClusterIdRef.current },
          { hover: false }
        );
        hoveredClusterIdRef.current = null;
      }

      if (!features.length) return;
      const feature = features[0];

      if (feature.layer?.id === "unclustered-point" && feature.id != null) {
        hoveredStateIdRef.current = feature.id;
        map.setFeatureState(
          { source: "orgs", id: feature.id },
          { hover: true }
        );
      } else if (feature.layer?.id === "clusters" && feature.id != null) {
        hoveredClusterIdRef.current = feature.id;
        map.setFeatureState(
          { source: "orgs", id: feature.id },
          { hover: true }
        );
      }
    };

    const handleMouseLeave = () => {
      if (hoveredStateIdRef.current !== null) {
        map.setFeatureState(
          { source: "orgs", id: hoveredStateIdRef.current },
          { hover: false }
        );
        hoveredStateIdRef.current = null;
      }
      if (hoveredClusterIdRef.current !== null) {
        map.setFeatureState(
          { source: "orgs", id: hoveredClusterIdRef.current },
          { hover: false }
        );
        hoveredClusterIdRef.current = null;
      }
      map.getCanvas().style.cursor = "";
    };

    const disableCursor = () => {
      map.getCanvas().style.cursor = "default";
    };

    map.on("click", "unclustered-point", handleClick);
    map.on("click", "clusters", handleClick);
    map.on("mousemove", "unclustered-point", handleMouseMove);
    map.on("mousemove", "clusters", handleMouseMove);
    map.on("mouseleave", "unclustered-point", handleMouseLeave);
    map.on("mouseleave", "clusters", handleMouseLeave);
    map.on("mouseenter", "unclustered-point", disableCursor);
    map.on("mouseenter", "clusters", disableCursor);

    return () => {
      map.off("click", "unclustered-point", handleClick);
      map.off("click", "clusters", handleClick);
      map.off("mousemove", "unclustered-point", handleMouseMove);
      map.off("mousemove", "clusters", handleMouseMove);
      map.off("mouseleave", "unclustered-point", handleMouseLeave);
      map.off("mouseleave", "clusters", handleMouseLeave);
      map.off("mouseenter", "unclustered-point", disableCursor);
      map.off("mouseenter", "clusters", disableCursor);
    };
  }, [map]);

  return (
    <Source
      id="orgs"
      type="geojson"
      data={geojson as any}
      cluster={true}
      clusterMaxZoom={clusterMaxZoom}
      clusterRadius={50}
      generateId={true}
    >
      <Layer
        id="clusters"
        type="circle"
        source="orgs"
        filter={["has", "point_count"]}
        paint={{
          "circle-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "#ffffff",
            "#5eadf7",
          ],
          "circle-radius": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            24,
            20,
          ],
          "circle-stroke-color": "#5eadf7",
          "circle-stroke-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            2,
            0,
          ],
        }}
      />
      <Layer
        id="cluster-count"
        type="symbol"
        source="orgs"
        filter={["has", "point_count"]}
        layout={{
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        }}
      />
      <Layer
        id="unclustered-point"
        type="circle"
        source="orgs"
        filter={["!", ["has", "point_count"]]}
        paint={{
          "circle-color": "#177fe0",
          "circle-radius": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            10, // Hover radius (same for all devices)
            isMobile ? 12 : 8, // Mobile vs Desktop normal radius
          ],
          "circle-stroke-width": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            2,
            1,
          ],
          "circle-stroke-color": [
            "case",
            ["boolean", ["feature-state", "hover"], false],
            "#5eadf7",
            "#fff",
          ],
        }}
      />
      <Layer
        id="unclustered-label"
        type="symbol"
        source="orgs"
        filter={["!", ["has", "point_count"]]}
        layout={{
          "text-field": ["get", "issuer_name"],
          "text-size": 10,
          "text-anchor": "top",
          "text-offset": [0, 1.2],
          "text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
        }}
        paint={{
          "text-color": "#000000",
        }}
      />
    </Source>
  );
}
