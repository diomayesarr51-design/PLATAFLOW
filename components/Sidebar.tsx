import React from 'react';
import { LayoutDashboard, FileText, Users, PieChart, Settings, LogOut } from 'lucide-react';
import { useTranslation } from '../lib/i18n';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { t } = useTranslation();

  const menuItems = [
    { id: 'dashboard', label: t.common.dashboard, icon: LayoutDashboard },
    { id: 'invoices', label: t.common.invoices, icon: FileText },
    { id: 'clients', label: t.common.clients, icon: Users },
    { id: 'reports', label: t.common.reports, icon: PieChart },
    { id: 'settings', label: t.common.settings, icon: Settings },
  ];

  return (
    <div className="hidden md:flex w-64 bg-slate-900 text-white flex-col h-full shadow-xl transition-all duration-300">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/30">
            P
          </div>
          <span className="text-xl font-bold tracking-tight">PlataFlow</span>
        </div>
        <p className="text-xs text-slate-400 mt-2 font-medium tracking-wide opacity-70">SaaS B2B Edition</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-1'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
            }`}
          >
            <item.icon size={20} className={`${currentView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'} transition-colors`} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;