import React, { useState } from 'react';
import {
  Calendar,
  DollarSign,
  Globe2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProjectCard = ({ project, onToggleMilestone, onDeleteProject }) => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(true);

  const milestones = project.milestones || [];
  const completedCount = milestones.filter((m) => m.status === 'completed').length;
  const totalCount = milestones.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return { text: 'Delivered', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'in-progress':
        return { text: 'In Progress', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'in-review':
        return { text: 'Client Review', bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30' };
      default:
        return { text: 'Planning', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
    }
  };

  const statusBadge = getStatusBadge(project.status);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm transition-all hover:border-slate-700/80">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
            <h4 className="text-lg font-bold text-white tracking-tight">{project.title}</h4>
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${statusBadge.bg}`}>
              {statusBadge.text}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">{project.description}</p>
        </div>

        {/* Client & Budget Badges */}
        <div className="flex items-center space-x-4 self-start">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Contract Value</span>
            <span className="text-lg font-extrabold text-emerald-400">
              ${Number(project.budget || 0).toLocaleString()}
            </span>
          </div>

          {user?.role === 'admin' && (
            <button
              onClick={() => onDeleteProject(project._id)}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Delete Project (Admin only)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Meta Bar: Client info, Deadline & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-xs text-slate-300">
        <div className="flex items-center space-x-2">
          <Globe2 className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong className="text-white">{project.clientName}</strong> • {project.clientCountry || 'International'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            Target Delivery: <strong className="text-white">{project.deadline || 'Q4 2026'}</strong>
          </span>
        </div>

        <div className="flex items-center justify-between md:justify-end space-x-3">
          <span className="font-semibold text-slate-300">
            {completedCount}/{totalCount} Milestones Done ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Milestone Toggle Collapse */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <span>Delivery Milestones & Payments ({totalCount})</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
          </button>
          <span className="text-[11px] text-slate-400">Click circle to toggle status</span>
        </div>

        {expanded && (
          <div className="space-y-2">
            {milestones.map((m) => {
              const isDone = m.status === 'completed';
              return (
                <div
                  key={m.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                      : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0 pr-3">
                    {/* Toggle Status Button */}
                    <button
                      onClick={() =>
                        onToggleMilestone(
                          project._id,
                          m.id,
                          isDone ? 'in-progress' : 'completed'
                        )
                      }
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-transform active:scale-90 ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-slate-600 hover:border-slate-400 bg-slate-900'
                      }`}
                      title={isDone ? 'Mark as In-Progress' : 'Mark as Delivered'}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="truncate">
                      <span className={`text-sm font-medium ${isDone ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {m.title}
                      </span>
                    </div>
                  </div>

                  {/* Milestone Price & Date */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      ${Number(m.amount || 0).toLocaleString()}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
