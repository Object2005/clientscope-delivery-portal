import React from 'react';
import { FolderGit2, CheckCircle2, DollarSign, TrendingUp } from 'lucide-react';

export const StatsOverview = ({ stats }) => {
  const cards = [
    {
      label: 'Total Enterprise Projects',
      value: stats?.totalProjects ?? 3,
      subtext: `${stats?.deliveredProjects ?? 1} Delivered / Closed`,
      icon: FolderGit2,
      gradient: 'from-blue-500/10 to-indigo-500/10',
      border: 'border-blue-500/20',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Active Development',
      value: stats?.activeProjects ?? 2,
      subtext: 'Live milestone sprints',
      icon: TrendingUp,
      gradient: 'from-amber-500/10 to-orange-500/10',
      border: 'border-amber-500/20',
      iconColor: 'text-amber-400',
    },
    {
      label: 'Pipeline Contract Value',
      value: `$${(stats?.totalPipelineValue ?? 56500).toLocaleString()}`,
      subtext: 'Billed international accounts',
      icon: DollarSign,
      gradient: 'from-emerald-500/10 to-teal-500/10',
      border: 'border-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      label: 'Milestone Completion Rate',
      value: `${stats?.completionRate ?? 65}%`,
      subtext: `${stats?.completedMilestones ?? 6} of ${stats?.totalMilestones ?? 10} delivered`,
      icon: CheckCircle2,
      gradient: 'from-purple-500/10 to-pink-500/10',
      border: 'border-purple-500/20',
      iconColor: 'text-purple-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-5 rounded-2xl bg-gradient-to-br ${card.gradient} bg-slate-900/60 border ${card.border} backdrop-blur-sm transition-all hover:translate-y-[-2px] hover:shadow-xl`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{card.label}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-slate-800/80 border border-slate-700/50 ${card.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center">
              <span className="text-xs text-slate-400">{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
