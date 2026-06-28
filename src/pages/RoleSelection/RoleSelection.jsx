import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Eye, 
  Award, 
  Shield, 
  BrainCircuit, 
  ArrowRight,
  UserCheck 
} from 'lucide-react';
import { usePlatform, ROLES } from '../../context/PlatformContext';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';

const RoleIcon = ({ name, className }) => {
  switch (name) {
    case 'Brain':
      return <Brain className={className} />;
    case 'Eye':
      return <Eye className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    default:
      return <BrainCircuit className={className} />;
  }
};

const RoleSelection = () => {
  const { user, selectRole } = usePlatform();
  const navigate = useNavigate();

  const handleRoleSelect = (roleId) => {
    selectRole(roleId);
    navigate('/dashboard');
  };

  // Color mappings for roles
  const colors = {
    blue: {
      border: 'hover:border-blue-500/80',
      bg: 'bg-blue-500/10 text-blue-600',
      text: 'text-blue-700',
      pill: 'bg-blue-500'
    },
    indigo: {
      border: 'hover:border-indigo-500/80',
      bg: 'bg-indigo-500/10 text-indigo-600',
      text: 'text-indigo-700',
      pill: 'bg-indigo-500'
    },
    sky: {
      border: 'hover:border-sky-500/80',
      bg: 'bg-sky-500/10 text-sky-600',
      text: 'text-sky-700',
      pill: 'bg-sky-500'
    },
    slate: {
      border: 'hover:border-slate-500/80',
      bg: 'bg-slate-500/10 text-slate-600',
      text: 'text-slate-700',
      pill: 'bg-slate-500'
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-50 flex flex-col justify-between p-6 md:p-12 text-slate-700">
      {/* Top Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl text-white">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">Apex Decision</h1>
            <p className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase">Governance Center</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold">
            <UserCheck className="h-4 w-4 text-emerald-500" />
            <span>Active Session: <strong className="text-slate-900">{user.name}</strong></span>
          </div>
        )}
      </div>

      {/* Middle Grid */}
      <div className="max-w-5xl mx-auto w-full my-12 text-center">
        <div className="space-y-3 mb-10">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold">
            Identity Authorization
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Select Your Access Persona
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            Choose a dashboard role to customize the platform interfaces, security clearances, and command centers.
          </p>
        </div>

        {/* Roles Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-left">
          {Object.values(ROLES).map((role) => {
            const style = colors[role.color] || colors.slate;
            return (
              <div 
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`
                  cursor-pointer bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs 
                  transition-all duration-200 hover:-translate-y-1 hover:shadow-md
                  flex flex-col justify-between gap-6 group relative overflow-hidden
                  ${style.border}
                `}
              >
                {/* Active hover overlay */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${style.pill}`}></div>

                <div>
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl ${style.bg}`}>
                      <RoleIcon name={role.icon} className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50 px-2 py-1 rounded">
                      Clearance: L{role.id === 'admin' ? '3' : role.id === 'executive' ? '3' : '2'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-950 mt-5 group-hover:text-blue-600 transition-colors">
                    {role.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 group-hover:text-blue-600 transition-colors pt-4 border-t border-slate-100">
                  <span>Enter console</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full text-center text-xs text-slate-400">
        Apex Decision Intelligence Governance Center • Session expires in 8 hours • Secure Socket IP: 192.168.10.15
      </div>
    </div>
  );
};

export default RoleSelection;
