
import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, AlertTriangle, Activity, Zap, TrendingUp, TrendingDown, Layers, Scale, TrendingDown as DownIcon } from 'lucide-react';
import { TelemetryData, WaterNode, ZoneStatus } from '../types';
import { translations, Language } from '../translations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface DashboardViewProps {
  telemetry: TelemetryData;
  nodes: WaterNode[];
  lang: Language;
}

const DashboardView: React.FC<DashboardViewProps> = ({ telemetry, nodes, lang }) => {
  const t = translations[lang];

  const StatCard = ({ title, value, sub, icon: Icon, color, trend }: any) => (
    <motion.div whileHover={{ scale: 1.02 }} className="glass-card p-6 rounded-2xl relative overflow-hidden group">
      <div className={`absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full opacity-10 bg-${color}-500 blur-2xl`} />
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          <div className="flex items-center mt-2">
            {trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-500 mr-1" /> : <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
            <span className={`text-xs font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>{sub}</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}><Icon className="h-6 w-6" /></div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t.totalFlow} value={`${Math.floor(telemetry.totalFlow)} L/min`} sub="Optimal" icon={Droplets} color="blue" trend="up" />
        <StatCard title={t.equitability} value={`${telemetry.equitabilityScore}%`} sub="Target 90%" icon={Scale} color="indigo" trend="up" />
        <StatCard title={t.avgPressure} value={`${telemetry.avgPressure.toFixed(1)} PSI`} sub={t.tailEndWarning} icon={Activity} color="emerald" trend="down" />
        <StatCard title={t.nrwLoss} value={`${telemetry.nrwLoss}%`} sub="Aging Impact" icon={AlertTriangle} color="red" trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-lg font-bold">{t.tailEndTitle}</h4>
            <div className="flex space-x-2">
               {nodes.filter(n => n.isTailEnd).map(n => (
                 <span key={n.id} className={`px-2 py-1 rounded text-[10px] font-bold ${n.pressure < 30 ? 'bg-red-500 text-white animate-pulse' : 'bg-green-500/10 text-green-500'}`}>
                    {n.id}
                 </span>
               ))}
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={nodes.map(n => ({ name: n.id, pressure: n.pressure, elevation: n.elevation }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="pressure" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <h4 className="text-lg font-bold mb-6">{t.infraHealth}</h4>
          <div className="space-y-4">
            {nodes.map(node => (
              <div key={node.id} className="p-3 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between border border-transparent hover:border-blue-500/30 transition-all">
                <div className="flex items-center">
                  <div className={`h-2.5 w-2.5 rounded-full mr-3 ${node.status === 'CRITICAL' ? 'bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]' : 'bg-green-500 shadow-[0_0_8px_#10b981]'}`} />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{t[node.nameKey as keyof typeof t]}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">{t.elevationLabel}: {t[node.elevation.toLowerCase() as keyof typeof t]}</span>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-xs font-mono font-bold text-blue-500">{node.pressure.toFixed(1)} PSI</div>
                   <div className="text-[10px] text-slate-400 font-bold">AGE: {node.infraAge}Y</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
