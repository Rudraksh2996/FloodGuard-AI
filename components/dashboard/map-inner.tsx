"use client";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl } from "react-leaflet";
import { useMap } from "react-leaflet/hooks";
import "leaflet/dist/leaflet.css";
import { useNodes } from "@/hooks/use-nodes";
import { useSimulatorStore } from "@/store/simulator-store";
import { DELHI_NODES } from "@/lib/mock-data";
import { NodeDrawer } from "./node-drawer";
import { WeatherCard } from "./weather-card";

function BoundsHelper() {
  const map = useMap();
  useEffect(() => {
    if (DELHI_NODES.length > 0) {
      const lats = DELHI_NODES.map(n => n.lat);
      const lngs = DELHI_NODES.map(n => n.lng);
      map.fitBounds([
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)]
      ], { padding: [50, 50] });
    }
  }, [map]);
  return null;
}

export default function MapInner() {
  const { nodes, isLoading } = useNodes();
  const { weatherData } = useSimulatorStore();
  const [mapStyle, setMapStyle] = useState<"dark" | "satellite">("dark");
  const [showRadar, setShowRadar] = useState(false);
  const [radarPath, setRadarPath] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then(r => r.json())
      .then(data => {
        if (data.host && data.radar && data.radar.past && data.radar.past.length > 0) {
          const latest = data.radar.past[data.radar.past.length - 1];
          setRadarPath(`${data.host}${latest.path}/256/{z}/{x}/{y}/2/1_1.png`);
        }
      })
      .catch(() => {}); // quietly ignore failures
  }, []);

  if (isLoading) return <div className="w-full h-full bg-neutral-900 animate-pulse rounded-xl border border-white/10" />;

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;
  const weather = selectedNode ? weatherData[selectedNode.id] : undefined;

  return (
    <div className={cn("w-full h-full rounded-xl overflow-hidden border border-white/10 relative z-0", mapStyle === "dark" ? "dark-map-tiles" : "")}>
      <MapContainer
        center={[28.6139, 77.2090]} // default, will be fit
        zoom={11}
        style={{ height: "100%", width: "100%", background: "#0a0a0a" }}
        zoomControl={false}
      >
        <BoundsHelper />
        <ZoomControl position="bottomright" />
        
        {mapStyle === "dark" ? (
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={19}
          />
        ) : (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri"
            maxZoom={19}
          />
        )}

        {showRadar && radarPath && (
          <TileLayer url={radarPath} opacity={0.6} />
        )}

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
            eventHandlers={{ click: () => setSelectedNodeId(node.id) }}
          >
            <Tooltip className="bg-neutral-900 border border-white/10 text-white rounded p-2" direction="top">
              <div className="text-center">
                <div className="font-bold text-sm">{node.name}</div>
                <div className="text-xs text-neutral-400">FRI: {node.fri.score.toFixed(2)}</div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <div className="bg-neutral-900/80 backdrop-blur rounded p-1 flex shadow-lg border border-white/10">
          <button 
            className={`px-3 py-1 text-xs rounded transition ${mapStyle === "dark" ? "bg-white text-black font-bold" : "text-neutral-300 hover:text-white"}`}
            onClick={() => setMapStyle("dark")}
          >
            Dark Street
          </button>
          <button 
            className={`px-3 py-1 text-xs rounded transition ${mapStyle === "satellite" ? "bg-white text-black font-bold" : "text-neutral-300 hover:text-white"}`}
            onClick={() => setMapStyle("satellite")}
          >
            Satellite
          </button>
        </div>

        {radarPath && (
          <div className="bg-neutral-900/80 backdrop-blur rounded p-1 flex items-center gap-2 shadow-lg border border-white/10 px-3 py-1.5">
            <input 
              type="checkbox" 
              id="radar-toggle" 
              checked={showRadar} 
              onChange={e => setShowRadar(e.target.checked)}
              className="accent-cyan-500"
            />
            <label htmlFor="radar-toggle" className="text-xs text-neutral-300 cursor-pointer select-none">Live Rain Radar</label>
          </div>
        )}
      </div>

      <WeatherCard />
      <NodeDrawer node={selectedNode} weather={weather} onClose={() => setSelectedNodeId(null)} />
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
