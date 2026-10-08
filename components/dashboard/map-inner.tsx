"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNodes } from "@/hooks/use-nodes";




export default function MapInner() {
  const { nodes, isLoading } = useNodes();
  // DTU Main Gate coordinates as default
  const center: [number, number] = [28.7499, 77.1165];

  if (isLoading) return <div className="w-full h-full bg-neutral-900 animate-pulse rounded-xl border border-white/10" />;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 relative z-0">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: "100%", width: "100%", background: "#0a0a0a" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {nodes.map(node => (
          <CircleMarker
            key={node.id}
            center={[node.lat, node.lng]}
            radius={node.fri.score > 0.85 ? 12 : 8}
            pathOptions={{ 
              color: node.fri.score > 0.85 ? "#ef4444" : 
                     node.fri.score > 0.65 ? "#f97316" : 
                     node.fri.score > 0.35 ? "#eab308" : "#22c55e",
              fillOpacity: 0.8,
              weight: node.fri.score > 0.85 ? 4 : 2
            }}
          >
            <Popup className="bg-neutral-900 border-none">
              <div className="p-2 text-neutral-200">
                <h4 className="font-bold">{node.name}</h4>
                <p className="text-sm">FRI: {node.fri.score.toFixed(2)}</p>
                <p className="text-xs text-neutral-400">{node.drainStatus}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
