
import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, ChevronUp, ChevronDown, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from '@google/genai';
import { WaterNode } from '../types';
import { translations, Language } from '../translations';

interface AIInsightsPanelProps {
  nodes: WaterNode[];
  lang: Language;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({ nodes, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const t = translations[lang];

  const fetchInsight = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Act as an expert Smart Water Grid AI analyst for Solapur Municipal Corporation (SMC). 
      Analyze this real-time node data and provide a 3-point actionable summary IN ${lang === 'mr' ? 'MARATHI' : lang === 'hi' ? 'HINDI' : 'ENGLISH'}. 
      Focus on equitable distribution, tail-end pressure drops, and infrastructure aging issues mentioned in SMC's brief.
      Nodes: ${JSON.stringify(nodes.map(n => ({ ward: n.id, flow: n.flowRate, pressure: n.pressure, status: n.status, elevation: n.elevation, tailEnd: n.isTailEnd })))}
      Keep it professional and concise for municipal officials.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setInsight(response.text || (lang === 'en' ? 'Unable to generate insights.' : 'अंतर्दृष्टी निर्माण करण्यात अक्षम.'));
    } catch (error) {
      console.error('Gemini error:', error);
      setInsight(lang === 'en' ? 'Error connecting to AI Grid Engine.' : 'AI इंजिनशी कनेक्ट करताना त्रुटी.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !insight) {
      fetchInsight();
    }
  }, [isOpen]);

  // Clear insight when language changes to force re-fetch in new language
  useEffect(() => {
    if (isOpen) fetchInsight();
  }, [lang]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="mb-4 w-80 md:w-96 glass-card rounded-3xl shadow-2xl overflow-hidden bg-white/95 dark:bg-slate-900/95 border border-blue-500/20"
          >
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 flex justify-between items-center text-white">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5" />
                <span className="font-bold tracking-tight">{t.aiInsights}</span>
              </div>
              <button onClick={() => fetchInsight()} disabled={loading} className="p-1.5 hover:bg-white/20 rounded-xl transition-colors">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="p-6 max-h-[450px] overflow-y-auto">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-5/6" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-1/2" />
                </div>
              ) : (
                <div className="text-sm prose dark:prose-invert">
                  <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed font-bold">
                    {insight}
                  </p>
                </div>
              )}
              
              <div className="mt-8 flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
                <AlertCircle className="h-6 w-6 mr-3 shrink-0" />
                <p className="text-[11px] font-bold leading-tight">{lang === 'en' ? 'Predictive models show high demand surge in Ward 1 (High Elevation) within 3 hours.' : 'भाकीत मॉडेल दर्शवितात की ३ तासांत वॉर्ड १ (उच्च उंची) मध्ये जास्त मागणी वाढेल.'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-8 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 group ring-8 ring-blue-500/10"
      >
        <BrainCircuit className={`h-6 w-6 group-hover:rotate-12 transition-transform ${loading ? 'animate-pulse' : ''}`} />
        <span className="font-bold tracking-wide">{t.aiInsights}</span>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default AIInsightsPanel;
