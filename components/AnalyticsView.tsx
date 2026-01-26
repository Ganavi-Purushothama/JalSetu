
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { translations, Language } from '../translations';

const data = [
  { name: 'Mon', usage: 4000, loss: 2400 },
  { name: 'Tue', usage: 3000, loss: 1398 },
  { name: 'Wed', usage: 2000, loss: 9800 },
  { name: 'Thu', usage: 2780, loss: 3908 },
  { name: 'Fri', usage: 1890, loss: 4800 },
  { name: 'Sat', usage: 2390, loss: 3800 },
  { name: 'Sun', usage: 3490, loss: 4300 },
];

interface AnalyticsViewProps {
  lang: Language;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl shadow-xl">
          <h4 className="text-xl font-bold mb-8">{t.usageHeader}</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} 
                  labelStyle={{ fontWeight: 'bold', color: '#fff' }}
                />
                <Area type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl shadow-xl">
          <h4 className="text-xl font-bold mb-8">{t.nrwHeader}</h4>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }}
                   labelStyle={{ fontWeight: 'bold', color: '#fff' }}
                />
                <Bar dataKey="loss" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card p-10 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between mb-10">
          <h4 className="text-2xl font-black tracking-tight">{t.predictiveHeader}</h4>
          <div className="flex space-x-6">
            <span className="flex items-center space-x-3 text-xs font-bold uppercase tracking-wider text-slate-500">
               <div className="h-3 w-3 rounded-full bg-blue-500" />
               <span>{t.expected}</span>
            </span>
            <span className="flex items-center space-x-3 text-xs font-bold uppercase tracking-wider text-slate-500">
               <div className="h-3 w-3 rounded-full bg-indigo-500" />
               <span>{t.simulated}</span>
            </span>
          </div>
        </div>
        <div className="h-[400px]">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={data}>
                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#fff' }}
                />
                <Area type="step" dataKey="usage" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.05} strokeWidth={2} />
                <Area type="monotone" dataKey="loss" stroke="#6366f1" fill="#6366f1" fillOpacity={0.05} strokeWidth={2} />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
