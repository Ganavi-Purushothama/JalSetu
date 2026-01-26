
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { WaterNode, ZoneStatus } from '../types';
import { translations, Language } from '../translations';

interface MapViewProps {
  nodes: WaterNode[];
  center: [number, number];
  lang: Language;
}

const MapView: React.FC<MapViewProps> = ({ nodes, center, lang }) => {
  const [mounted, setMounted] = useState(false);
  const t = translations[lang];

  useEffect(() => {
    setMounted(true);
  }, []);

  const getMarkerIcon = (status: ZoneStatus) => {
    let color = '#3b82f6';
    if (status === ZoneStatus.CRITICAL) color = '#ef4444';
    if (status === ZoneStatus.WARNING) color = '#f59e0b';

    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color};" class="${status === ZoneStatus.CRITICAL ? 'pulse-leak' : ''}"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });
  };

  if (!mounted) return <div className="h-full w-full bg-slate-900 animate-pulse rounded-2xl" />;

  return (
    <div className="h-[calc(100vh-220px)] w-full relative group">
      <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
        <div className="glass-card bg-white/95 dark:bg-slate-950/95 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl min-w-[180px]">
          <p className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">{t.sysStatus}</p>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.statusNormal}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.statusWarning}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 rounded-full bg-red-500 pulse-leak shadow-[0_0_8px_#ef4444]" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t.statusCritical}</span>
            </div>
          </div>
        </div>
      </div>

      <MapContainer center={center} zoom={14} scrollWheelZoom={true} zoomControl={false}>
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {nodes.map(node => (
          <React.Fragment key={node.id}>
            <Marker position={[node.lat, node.lng]} icon={getMarkerIcon(node.status)}>
              <Popup className="custom-popup">
                <div className="p-2 min-w-[180px]">
                  <h5 className="font-bold border-b dark:border-slate-700 pb-2 mb-2 text-slate-800 dark:text-slate-100 flex justify-between">
                    <span>{t[node.nameKey as keyof typeof t]}</span>
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-900/40 px-1.5 rounded">{node.id}</span>
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold">{t.totalFlow}:</span>
                      <span className="font-mono font-bold text-blue-600">{node.flowRate.toFixed(0)} L/m</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold">{t.avgPressure}:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{node.pressure.toFixed(1)} PSI</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t dark:border-slate-800">
                      <span className="text-slate-500 font-bold">Valve:</span>
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${node.valveOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {node.valveOpen ? t.open.toUpperCase() : t.close.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </Popup>
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={node.status === ZoneStatus.CRITICAL}>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded shadow-sm border ${
                  node.status === ZoneStatus.CRITICAL ? 'bg-red-600 text-white border-red-400 animate-pulse' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'
                }`}>
                  {node.status === ZoneStatus.CRITICAL ? t.statusCritical : t[node.nameKey as keyof typeof t].split(' - ')[1]}
                </span>
              </Tooltip>
            </Marker>
            
            {node.status === ZoneStatus.CRITICAL && (
              <Circle 
                center={[node.lat, node.lng]} 
                radius={250} 
                pathOptions={{ fillColor: 'red', color: 'red', fillOpacity: 0.15, weight: 1 }} 
              />
            )}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
