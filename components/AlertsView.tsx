
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, MapPin, ChevronRight, CheckCircle2, Siren } from 'lucide-react';
import { WaterNode, ZoneStatus } from '../types';
import { translations, Language } from '../translations';

interface AlertsViewProps {
  nodes: WaterNode[];
  lang: Language;
}

const AlertsView: React.FC<AlertsViewProps> = ({ nodes, lang }) => {
  const t = translations[lang];
  const anomalies = nodes.filter(n => n.status !== ZoneStatus.NORMAL).sort((a, b) => b.anomalyScore - a.anomalyScore);

  const getStatusText = (status: ZoneStatus) => {
    switch(status) {
      case ZoneStatus.CRITICAL: return t.statusCritical;
      case ZoneStatus.WARNING: return t.statusWarning;
      default: return t.statusNormal;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold">{t.alerts}</h2>
          <p className="text-slate-500 font-medium">SMC Solapur: {t.tailEndTitle}</p>
        </div>
        <div className="flex space-x-2">
          <span className="px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-xs font-bold dark:bg-red-500/20 border border-red-200 dark:border-red-800">
            {anomalies.filter(a => a.status === ZoneStatus.CRITICAL).length} {t.statusCritical}
          </span>
          <span className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-600 text-xs font-bold dark:bg-amber-500/20 border border-amber-200 dark:border-amber-800">
            {anomalies.filter(a => a.status === ZoneStatus.WARNING).length} {t.statusWarning}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {anomalies.length > 0 ? (
          anomalies.map((anomaly, i) => (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              key={anomaly.id}
              className={`glass-card p-6 rounded-3xl border-l-8 ${anomaly.status === ZoneStatus.CRITICAL ? 'border-l-red-500' : 'border-l-amber-500'}`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex space-x-4">
                  <div className={`p-4 rounded-2xl h-fit ${anomaly.status === ZoneStatus.CRITICAL ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    <Siren className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl">{anomaly.status === ZoneStatus.CRITICAL ? t.leakDetected : t.pressureDrop}</h4>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-2">
                      <div className="flex items-center font-bold">
                        <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                        {t[anomaly.nameKey as keyof typeof t]}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {lang === 'en' ? 'Detected 4m ago' : lang === 'mr' ? '४ मिनीटांपूर्वी आढळले' : '४ मिनट पहले पाया गया'}
                      </div>
                    </div>
                    <div className="mt-5 flex items-center space-x-8">
                       <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Score</span>
                          <span className="text-2xl font-mono font-bold">{anomaly.anomalyScore}%</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Pressure</span>
                          <span className="text-2xl font-mono font-bold text-red-500">-{ (14.2).toFixed(1) } PSI</span>
                       </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-start md:items-end">
                   <span className="text-xs font-mono font-bold p-1 px-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 tracking-tighter">#{anomaly.id}-AE-SMC</span>
                   <button className="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all mt-4 md:mt-0">
                      <span>{t.dispatchTeam}</span>
                      <ChevronRight className="h-4 w-4" />
                   </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="glass-card p-16 rounded-3xl flex flex-col items-center text-center">
            <CheckCircle2 className="h-20 w-20 text-green-500 mb-6" />
            <h3 className="text-2xl font-bold">{t.statusNormal}</h3>
            <p className="text-slate-500 mt-2 max-w-sm">{t.problemStatement}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsView;
