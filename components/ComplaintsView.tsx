
import React from 'react';
import { MessageCircle, Search, Filter, MoreVertical, MapPin } from 'lucide-react';
import { Complaint } from '../types';
import { translations, Language } from '../translations';

interface ComplaintsViewProps {
  complaints: Complaint[];
  lang: Language;
}

const ComplaintsView: React.FC<ComplaintsViewProps> = ({ complaints, lang }) => {
  const t = translations[lang];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t.complaintHeader}</h2>
          <p className="text-slate-500 font-medium">{t.complaintSub}</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-700 transition-all hover:bg-slate-200 dark:hover:bg-slate-700">
            <Filter className="h-4 w-4" />
            <span>{t.filter}</span>
          </button>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
            {t.logTicket}
          </button>
        </div>
      </div>

      <div className="glass-card rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100/50 dark:bg-slate-800/50 border-b dark:border-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Complaint Info</th>
                <th className="px-8 py-5">Ward</th>
                <th className="px-8 py-5">Priority</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800">
              {complaints.map(complaint => (
                <tr key={complaint.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-base">{complaint.type}</span>
                      <span className="text-xs text-slate-500 font-mono">#{complaint.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center text-sm font-semibold">
                      <MapPin className="h-3.5 w-3.5 mr-2 text-blue-500" />
                      {complaint.ward}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${
                      complaint.priority === 'High' ? 'bg-red-500/10 text-red-500' : 
                      complaint.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center text-sm font-bold uppercase">
                      <div className={`h-2 w-2 rounded-full mr-3 ${
                        complaint.status === 'Open' ? 'bg-red-500 animate-pulse' : 
                        complaint.status === 'Assigned' ? 'bg-amber-500' : 'bg-green-500'
                      }`} />
                      {complaint.status}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500">
                    {new Date(complaint.timestamp).toLocaleDateString(lang)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                      <MoreVertical className="h-5 w-5 text-slate-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {complaints.length === 0 && (
          <div className="p-20 text-center text-slate-500 font-bold">
            No active complaints found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsView;
