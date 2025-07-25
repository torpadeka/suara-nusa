"use client";

import { useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    GeoJSON,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Kingdom, MarkerData } from "./types";

// Initialize Leaflet icons only on client side
if (typeof window !== "undefined") {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
}

interface MapControllerProps {
    center: [number, number];
    zoom: number;
}

const MapController: React.FC<MapControllerProps> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (map) {
            map.flyTo(center, zoom, { animate: true, duration: 1.5 });
        }
    }, [center, zoom, map]);
    return null;
};

interface MapComponentProps {
    mapCenter: [number, number];
    mapZoom: number;
    selectedShape: Kingdom | null;
    visibleMarkers: MarkerData[];
    onMarkerClick: (item: MarkerData) => void;
}

const polygonStyle = {
    color: "#0ea5e9",
    weight: 2,
    opacity: 0.6,
    fillColor: "#67e8f9",
    fillOpacity: 0.2,
};

export const MapComponent: React.FC<MapComponentProps> = ({
    mapCenter,
    mapZoom,
    selectedShape,
    visibleMarkers,
    onMarkerClick,
}) => {
    // Filter out markers with undefined or missing id
    const validMarkers = visibleMarkers;

    return (
        <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: "100%", width: "100%" }}
        >
            <MapController center={mapCenter} zoom={mapZoom} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {selectedShape && selectedShape.wilayah && (
                <GeoJSON
                    key={`geojson-${selectedShape.id}`}
                    data={selectedShape.wilayah}
                    style={polygonStyle}
                />
            )}
            {validMarkers.map((item, index) => (
                <Marker
                    key={`marker-${index}`}
                    position={[item.lat, item.lng]}
                    eventHandlers={{ click: () => onMarkerClick(item) }}
                >
                    <Popup>
                        {item.provinsi ||
                            item.nama ||
                            item.peristiwa ||
                            "Unknown"}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};
