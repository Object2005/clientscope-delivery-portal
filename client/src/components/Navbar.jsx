import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Layers, Plus, UserCheck, Shield, Users, LogOut } from 'lucide-react';

export const Navbar = ({ onOpenCreateProject, onOpenClientModal }) => {
  const { user, loginAsDemo, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
              <Layers className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">ClientScope</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  v1.0 • 75WAY Special
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">IT Project Scope & Milestone Delivery Hub</p>
            </div>
          </div>

          {/* Quick Actions & Role Controls */}
          <div className="flex items-center space-x-3">
            {/* Quick Add Client */}
            <button
              onClick={onOpenClientModal}
              className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-medium rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all hover:text-white"
            >
              <Users className="w-4 h-4 mr-1.5 text-slate-400" />
              Clients
            </button>

            {/* Quick Add Project */}
            <button
              onClick={onOpenCreateProject}
              className="inline-flex items-center px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Project
            </button>

            {/* Current User Badge & Role Switcher */}
            <div className="hidden md:flex items-center pl-3 border-l border-slate-800 space-x-2">
              <div className="flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-200">{user?.name || 'Aashray Narang'}</span>
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">
                  {user?.role === 'admin' ? '🛡️ Administrator' : '👔 Project Manager'}
                </span>
              </div>

              {/* Demo Switch Button */}
              <button
                title="Toggle role to test RBAC authorization"
                onClick={() => loginAsDemo(user?.role === 'admin' ? 'manager' : 'admin')}
                className="p-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 rounded-md border border-slate-700"
              >
                Switch Role
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
