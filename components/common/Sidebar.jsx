import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Calendar,
  BarChart3,
  Users,
  FileText,
  MessageSquare,
  ClipboardCheck,
  Settings,
  Globe
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', badge: null },
    { label: 'My Tasks', icon: CheckSquare, path: '/tasks', badge: '6' },
    { label: 'Projects', icon: FolderKanban, path: '/projects', badge: null },
    { label: 'Calendar', icon: Calendar, path: '/calendar', badge: null },
    { label: 'Campfire Chat', icon: MessageSquare, path: '/chat', badge: '3' },
    { label: 'Files', icon: FileText, path: '/files', badge: null },
    { label: 'People', icon: Users, path: '/team', badge: null },
    { label: 'Check-ins', icon: ClipboardCheck, path: '/checkins', badge: null },
    { label: 'Reports', icon: BarChart3, path: '/reports', badge: null },
    { label: 'Settings', icon: Settings, path: '/settings', badge: null },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none">
      <div className="p-4 space-y-6 overflow-y-auto">
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Workspace
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <NavLink
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition"
          >
            <Globe className="w-4 h-4 text-slate-400" />
            <span>🏠 Public Website</span>
          </NavLink>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
          <span>Workspace Plan</span>
          <span className="text-blue-600 font-bold">Pro Plan</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-3/4 rounded-full"></div>
        </div>
        <div className="mt-1.5 text-[10px] text-slate-400 font-medium">
          7.5 GB of 10 GB storage used
        </div>
      </div>
    </aside>
  );
}
