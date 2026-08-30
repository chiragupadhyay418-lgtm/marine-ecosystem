import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Waves, Shield, Users, Radio } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 z-50 sticky top-0">
      {/* Brand Logo and Title */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md shadow-blue-500/20">
          <Waves className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-wider text-blue-400">ORCA</span>
            <span className="text-[10px] bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
              <Radio className="h-2.5 w-2.5 animate-pulse text-blue-400" /> Live
            </span>
          </div>
          <p className="text-xs text-slate-400">Coastal Intelligence & Decision-Support System</p>
        </div>
      </div>

      {/* Switcher Controls */}
      <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 shadow-inner">
        <Link
          to="/government"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            currentPath.startsWith('/government')
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Government Dashboard</span>
        </Link>
        <Link
          to="/community"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            currentPath.startsWith('/community')
              ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Community / Fishermen</span>
        </Link>
      </div>
    </nav>
  );
}
