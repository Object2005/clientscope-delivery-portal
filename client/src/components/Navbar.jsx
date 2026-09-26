import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Layers, Plus, Users, History, Download } from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';

export const Navbar = ({ onOpenCreateProject, onOpenClientModal, onOpenActivities, onExportCSV }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
              <Layers className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white">ClientScope</span>
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  Enterprise
                </span>
              </div>
            </div>
          </div>

          {/* Center / Right: Smooth Role Switcher & Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* SMOOTH SEGMENTED ROLE SWITCHER (Visible on all viewports) */}
            <div className="flex items-center space-x-2 pr-1 sm:pr-2 sm:border-r border-slate-800">
              <span className="text-[11px] text-slate-400 hidden xl:inline font-medium">Role:</span>
              <RoleSwitcher />
            </div>

            {/* Export CSV */}
            <button
              onClick={onExportCSV}
              title="Export all projects and budget data to CSV"
              className="hidden md:inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all hover:text-white"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              <span>Export CSV</span>
            </button>

            {/* Audit Activities */}
            <button
              onClick={onOpenActivities}
              title="View live system audit trail & change logs"
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all hover:text-white"
            >
              <History className="w-3.5 h-3.5 sm:mr-1.5 text-emerald-400" />
              <span className="hidden sm:inline">Audit Log</span>
            </button>

            {/* Quick Add Client */}
            <button
              onClick={onOpenClientModal}
              className="hidden sm:inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all hover:text-white"
            >
              <Users className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              <span>Clients</span>
            </button>

            {/* Quick Add Project */}
            <button
              onClick={onOpenCreateProject}
              className="inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 sm:mr-1" />
              <span className="hidden sm:inline">New Project</span>
            </button>

            {/* Active User Avatar / Name Indicator */}
            <div className="hidden lg:flex items-center pl-2 space-x-2">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400">
                {user?.name ? user.name[0] : 'A'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 leading-tight">{user?.name || 'Aashray'}</span>
                <span className="text-[10px] text-slate-400 leading-tight">{user?.role === 'admin' ? 'Full Access' : 'Delivery Mode'}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
