
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, Info, Sliders, Clock, Wifi, Battery, Activity, RefreshCcw, PlayCircle, StopCircle } from 'lucide-react';
import { WaterNode } from '../types';
import { translations, Language } from '../translations';

interface ControlsViewProps {
  nodes: WaterNode[];
  onToggle: (id: string) => void;
  lang: Language;
}

const ControlsView: React.FC<ControlsViewProps> = ({ nodes, onToggle, lang }) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const t = translations[lang];

  const handleToggle = (id: string) => {
    setProcessingId(id);
    setTimeout(() => {
      onToggle(id);
      setProcessingId(null);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t.valves}</h2>
          <p className="text-slate-500 font-medium">{t.solapurGrid}</p>
        </div>
        <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/20 active:scale-95 transition-all text-sm uppercase tracking-wider">
          {t.emergencyShutdown}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node) => (
          <div key={node.id} className={`glass-card rounded-3xl p-6 border-2 relative transition-all duration-300 ${node.valveOpen ? 'border-blue-500/30 shadow-xl' : 'border-slate-800'}`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-xl font-bold">{t[node.nameKey as keyof typeof t]}</h4>
                <div className="flex items-center space-x-2 mt-1">
                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${node.isTailEnd ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'}`}>
                      {node.isTailEnd ? t.tailEndLabel : 'HEAD-END'}
                   </span>
                   <span className="text-[10px] text-slate-500 font-mono">#{node.id}</span>
                </div>
              </div>
              <div className={`p-2 rounded-full ${node.valveOpen ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                {node.valveOpen ? <PlayCircle className="h-5 w-5" /> : <StopCircle className="h-5 w-5" />}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-2xl text-center border dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{t.avgPressure}</p>
                <p className="text-xl font-mono font-bold text-blue-500">{node.pressure.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-2xl text-center border dark:border-slate-800">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{t.totalFlow}</p>
                <p className="text-xl font-mono font-bold text-indigo-500">{Math.floor(node.flowRate)}</p>
              </div>
            </div>

            <button 
              onClick={() => handleToggle(node.id)}
              disabled={processingId === node.id}
              className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 transition-all active:scale-95 ${
                node.valveOpen ? 'bg-red-600/10 text-red-500 border border-red-500/20' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              }`}
            >
              {processingId === node.id ? (
                <RefreshCcw className="h-6 w-6 animate-spin" />
              ) : node.valveOpen ? (
                <>
                  <Power className="h-5 w-5" />
                  <span>{t.close}</span>
                </>
              ) : (
                <>
                  <Power className="h-5 w-5" />
                  <span>{t.open}</span>
                </>
              )}
            </button>
            
            <div className="mt-4 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
               <div className="flex items-center space-x-2">
                  <Wifi className="h-3 w-3" />
                  <span>{t.signalExcellent}</span>
               </div>
               <span>{t.batteryHigh}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ControlsView;
