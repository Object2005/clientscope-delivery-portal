import React, { useState, useEffect } from 'react';
import { X, History, Clock, User, CheckCircle2, FolderGit2 } from 'lucide-react';
import { api } from '../utils/api';

export const ActivityDrawer = ({ isOpen, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchActivities();
    }
  }, [isOpen]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects/audit/activities');
      if (res.success && res.data) {
        setActivities(res.data);
      }
    } catch (err) {
      console.error('Failed to load audit trail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">System Audit & Activity Trail</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of audit logs */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <p className="text-center text-xs text-slate-400 py-10">Fetching live audit events...</p>
          ) : activities.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-10">No recent activity logged</p>
          ) : (
            activities.map((act) => (
              <div
                key={act.id}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700/80 transition-all text-xs"
              >
                <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
                  <span className="text-emerald-400">{act.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-300 text-xs mb-2 leading-relaxed">{act.description}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/60">
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1 text-slate-400" /> {act.user}
                  </span>
                  <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 text-center">
          <button
            onClick={fetchActivities}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            Refresh Logs
          </button>
        </div>

      </div>
    </div>
  );
};
