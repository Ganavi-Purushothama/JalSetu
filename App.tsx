
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, Map as MapIcon, AlertTriangle, BarChart3, Settings, 
  MessageSquare, Waves, Droplets, Activity, Zap, Bell, Search, User, 
  Menu, X, Cpu, Sun, Moon, ChevronDown, Globe, MapPin, Info, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TelemetryData, WaterNode, ZoneStatus, Complaint } from './types';
import { translations, Language } from './translations';
import DashboardView from './components/DashboardView';
import MapView from './components/MapView';
import AlertsView from './components/AlertsView';
import AnalyticsView from './components/AnalyticsView';
import ComplaintsView from './components/ComplaintsView';
import ControlsView from './components/ControlsView';
import AIInsightsPanel from './components/AIInsightsPanel';

const INITIAL_NODES: WaterNode[] = [
  { id: 'S1', nameKey: 'ward1', lat: 17.6500, lng: 75.9000, flowRate: 450, pressure: 52, status: ZoneStatus.NORMAL, anomalyScore: 5, valveOpen: true, elevation: 'HIGH', isTailEnd: false, infraAge: 12 },
  { id: 'S2', nameKey: 'ward12', lat: 17.6700, lng: 75.9100, flowRate: 820, pressure: 38, status: ZoneStatus.CRITICAL, anomalyScore: 88, valveOpen: true, elevation: 'MEDIUM', isTailEnd: true, infraAge: 25 },
  { id: 'S3', nameKey: 'ward4', lat: 17.6600, lng: 75.9200, flowRate: 310, pressure: 48, status: ZoneStatus.WARNING, anomalyScore: 42, valveOpen: true, elevation: 'LOW', isTailEnd: true, infraAge: 18 },
  { id: 'S4', nameKey: 'ward7', lat: 17.6800, lng: 75.9050, flowRate: 590, pressure: 55, status: ZoneStatus.NORMAL, anomalyScore: 12, valveOpen: true, elevation: 'MEDIUM', isTailEnd: false, infraAge: 8 },
  { id: 'S5', nameKey: 'ward9', lat: 17.6450, lng: 75.9250, flowRate: 120, pressure: 22, status: ZoneStatus.CRITICAL, anomalyScore: 92, valveOpen: false, elevation: 'HIGH', isTailEnd: true, infraAge: 30 },
];

const App: React.FC = () => {
  const [lang, setLang] = useState<Language | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [nodes, setNodes] = useState<WaterNode[]>(INITIAL_NODES);
  
  // Get translation safely
  const t = lang ? translations[lang] : translations['en'];

  const [telemetry, setTelemetry] = useState<TelemetryData>({
    totalFlow: 2345,
    activeLeaks: 3,
    avgPressure: 45.2,
    mqttRate: 128,
    timestamp: new Date().toISOString(),
    equitabilityScore: 78,
    nrwLoss: 24.5
  });

  const [complaints, setComplaints] = useState<Complaint[]>([
    { id: 'C1', type: 'Pipe Burst', ward: 'Ward 12', status: 'Open', priority: 'High', timestamp: '2023-10-24T10:30:00Z' },
    { id: 'C2', type: 'Low Pressure', ward: 'Ward 4', status: 'Assigned', priority: 'Medium', timestamp: '2023-10-24T11:15:00Z' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        flowRate: Math.max(0, node.flowRate + (Math.random() * 10 - 5)),
        pressure: Math.max(0, node.pressure + (Math.random() * 2 - 1)),
      })));

      setTelemetry(prev => ({
        ...prev,
        totalFlow: nodes.reduce((acc, curr) => acc + curr.flowRate, 0),
        avgPressure: nodes.reduce((acc, curr) => acc + curr.pressure, 0) / nodes.length,
        timestamp: new Date().toISOString()
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [nodes]);

  const toggleValve = (id: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, valveOpen: !n.valveOpen } : n));
  };

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'map', label: t.liveMap, icon: MapIcon },
    { id: 'alerts', label: t.alerts, icon: AlertTriangle },
    { id: 'analytics', label: t.analytics, icon: BarChart3 },
    { id: 'complaints', label: t.complaints, icon: MessageSquare },
    { id: 'controls', label: t.valves, icon: Zap },
  ];

  // Render Language Selection Screen if no language picked
  if (!lang) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full glass-card p-10 rounded-[3rem] shadow-2xl border-2 border-blue-500/20 text-center"
        >
          <Waves className="h-16 w-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-4xl font-black tracking-tight mb-2">JalSetu</h1>
          <p className="text-slate-500 font-medium mb-8">Smart Water Grid Control System</p>
          
          <div className="space-y-6 mb-10">
            <h2 className="text-xl font-bold">Select Language / भाषा निवडा</h2>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => setLang('en')}
                className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all text-left"
              >
                <div>
                  <div className="font-bold text-lg">English</div>
                  <div className="text-xs text-slate-500 font-medium">Continue in English</div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
              </button>
              
              <button 
                onClick={() => setLang('mr')}
                className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all text-left"
              >
                <div>
                  <div className="font-bold text-lg">मराठी</div>
                  <div className="text-xs text-slate-500 font-medium">मराठीत पुढे जा</div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
              </button>

              <button 
                onClick={() => setLang('hi')}
                className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all text-left"
              >
                <div>
                  <div className="font-bold text-lg">हिंदी</div>
                  <div className="text-xs text-slate-500 font-medium">हिंदी में जारी रखें</div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Solapur Municipal Corporation</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      <aside className={`fixed left-0 top-0 z-50 h-full w-64 flex flex-col transform border-r bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center px-6 border-b dark:border-slate-800 shrink-0">
          <Waves className="h-8 w-8 text-blue-500 mr-2" />
          <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">JalSetu</span>
        </div>
        
        {/* Navigation area - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex w-full items-center px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer area - Pushed to bottom but doesn't overlap */}
        <div className="shrink-0 p-4 space-y-3 border-t dark:border-slate-800">
          <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
             <div className="flex items-center justify-between text-xs font-bold mb-3 text-slate-500 px-1">
                <Globe className="h-3 w-3" />
                <span>भाषा / Language</span>
             </div>
             <div className="grid grid-cols-1 gap-1.5">
                <button onClick={() => setLang('en')} className={`py-1.5 rounded-lg text-xs font-bold flex justify-between px-3 transition-all ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-500 border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                   <span>English</span>
                   {lang === 'en' && <div className="h-1.5 w-1.5 rounded-full bg-white mt-1" />}
                </button>
                <button onClick={() => setLang('mr')} className={`py-1.5 rounded-lg text-xs font-bold flex justify-between px-3 transition-all ${lang === 'mr' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-500 border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                   <span>मराठी</span>
                   {lang === 'mr' && <div className="h-1.5 w-1.5 rounded-full bg-white mt-1" />}
                </button>
                <button onClick={() => setLang('hi')} className={`py-1.5 rounded-lg text-xs font-bold flex justify-between px-3 transition-all ${lang === 'hi' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-500 border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                   <span>हिंदी</span>
                   {lang === 'hi' && <div className="h-1.5 w-1.5 rounded-full bg-white mt-1" />}
                </button>
             </div>
          </div>
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800/50">
            <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">
              <Activity className="h-3 w-3 text-green-500" />
              <span>{t.sysStatus}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">MQTT</span>
              <span className="text-xs font-mono text-green-500">ONLINE</span>
            </div>
          </div>
        </div>
      </aside>

      <main className={`transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-0'}`}>
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b bg-white/80 px-8 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-center space-x-4">
            {!isSidebarOpen && <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg"><Menu className="h-5 w-5" /></button>}
            <div className="flex flex-col">
              <div className="flex items-center text-blue-600 dark:text-blue-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm font-bold uppercase tracking-widest">{t.solapurGrid}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{t.citizenCount}</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-900 rounded-full px-4 py-1.5 border border-slate-200 dark:border-slate-800">
               <Info className="h-3.5 w-3.5 mr-2 text-blue-500" />
               <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 italic">"{t.problemStatement}"</span>
            </div>
            
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:ring-2 hover:ring-blue-500 transition-all">
               {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="relative cursor-pointer group">
              <Bell className="h-5 w-5 text-slate-500 group-hover:text-blue-500 transition-colors" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white dark:ring-slate-950">3</span>
            </div>
            <div className="flex items-center space-x-3 pl-4 border-l dark:border-slate-800 text-right">
              <div className="flex flex-col">
                <span className="text-sm font-bold">{t.adminTitle}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-tighter">SMC Command Center</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20"><User className="h-6 w-6" /></div>
            </div>
          </div>
        </header>

        <div className="p-8 pb-32">
          <AnimatePresence mode="wait">
            <motion.div key={`${activeTab}-${lang}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {activeTab === 'dashboard' && <DashboardView telemetry={telemetry} nodes={nodes} lang={lang} />}
              {activeTab === 'map' && <MapView nodes={nodes} center={[17.6599, 75.9064]} lang={lang} />}
              {activeTab === 'alerts' && <AlertsView nodes={nodes} lang={lang} />}
              {activeTab === 'analytics' && <AnalyticsView lang={lang} />}
              {activeTab === 'complaints' && <ComplaintsView complaints={complaints} lang={lang} />}
              {activeTab === 'controls' && <ControlsView nodes={nodes} onToggle={toggleValve} lang={lang} />}
            </motion.div>
          </AnimatePresence>
        </div>
        <AIInsightsPanel nodes={nodes} lang={lang} />
      </main>
    </div>
  );
};

export default App;
