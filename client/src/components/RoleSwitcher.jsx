import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, UserCog, Check, Sparkles } from 'lucide-react';

export const RoleSwitcher = () => {
  const { user, loginAsDemo } = useAuth();
  const [switching, setSwitching] = useState(false);

  const currentRole = user?.role || 'admin';

  const handleSwitch = async (newRole) => {
    if (newRole === currentRole || switching) return;
    setSwitching(true);
    await loginAsDemo(newRole);
    setTimeout(() => {
      setSwitching(false);
    }, 350);
  };

  return (
    <div className="flex items-center">
      {/* Segmented Sliding Pill Container */}
      <div className="relative flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner">
        
        {/* Animated Sliding Background Highlight */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-out shadow-sm ${
            currentRole === 'admin'
              ? 'left-1 bg-emerald-500 shadow-emerald-500/25'
              : 'left-[calc(50%)] bg-sky-500 shadow-sky-500/25'
          }`}
        />

        {/* Admin Option Button */}
        <button
          type="button"
          onClick={() => handleSwitch('admin')}
          className={`relative z-10 flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors duration-200 ${
            currentRole === 'admin'
              ? 'text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Switch to Administrator (Full access & deletion enabled)"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>

        {/* Manager Option Button */}
        <button
          type="button"
          onClick={() => handleSwitch('manager')}
          className={`relative z-10 flex items-center space-x-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors duration-200 ${
            currentRole === 'manager'
              ? 'text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Switch to Project Manager (Sprint & Milestone delivery mode)"
        >
          <UserCog className="w-3.5 h-3.5" />
          <span>Manager</span>
        </button>

      </div>
    </div>
  );
};
