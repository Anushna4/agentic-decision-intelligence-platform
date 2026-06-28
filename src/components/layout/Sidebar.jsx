import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cpu, 
  FileCheck, 
  BarChart3, 
  LogOut, 
  BrainCircuit,
  Sliders,
  HelpCircle
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

const Sidebar = () => {
  const { logout, selectedRole } = usePlatform();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Agent Pipeline', path: '/processing', icon: Cpu, badge: 'Live' },
    { name: 'Decision Results', path: '/results', icon: FileCheck },
    { name: 'Evaluation Summary', path: '/evaluation', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 h-screen sticky top-0">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-2.5">
        <div className="p-1.5 bg-blue-600 rounded-lg text-white">
          <BrainCircuit className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight leading-none">Antigravity ADIP</h1>
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Agentic Decision Platform</span>
        </div>
      </div>

      {/* Selected Persona Indicator */}
      {selectedRole && (
        <div className="mx-4 my-4 p-3 bg-slate-800/50 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Persona</div>
          <div className="text-xs font-semibold text-white mt-0.5 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
            {selectedRole.name}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive 
                  ? 'bg-blue-600/95 text-white font-semibold' 
                  : 'hover:bg-slate-800/80 hover:text-white text-slate-400'}
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-500/25 text-blue-400 border border-blue-500/20 rounded">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-800 space-y-1">
        <NavLink
          to="/role-selection"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors"
        >
          <Sliders className="h-4 w-4" />
          <span>Switch Persona</span>
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
