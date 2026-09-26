import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Bell, ChevronDown, Building2, User, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar({ onOpenSearch, onOpenCreateTask, onOpenCreateWorkspace, onOpenPricing }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { workspaces, activeWorkspace, switchWorkspace } = useWorkspace();
  const [showWsDropdown, setShowWsDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 font-bold text-xl text-blue-600 tracking-tight cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-blue-500/20">
            W
          </div>
          <span className="hidden sm:inline-block text-slate-900">WorkOrbit</span>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

        <div className="relative">
          <button
            onClick={() => setShowWsDropdown(!showWsDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition text-sm font-semibold text-slate-700"
          >
            <Building2 className="w-4 h-4 text-blue-600" />
            <span className="max-w-[140px] truncate">{activeWorkspace?.name || 'Workspace'}</span>
            <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold bg-blue-50 text-blue-600 rounded">
              {activeWorkspace?.subscription_plan || 'Pro'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showWsDropdown && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                My Workspaces
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    switchWorkspace(ws);
                    setShowWsDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-slate-50 transition ${
                    activeWorkspace?.id === ws.id ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🏢</span>
                    <span>{ws.name}</span>
                  </div>
                  {activeWorkspace?.id === ws.id && <CheckCircle className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
              <div className="border-t border-slate-100 mt-1 pt-1 px-2">
                <button
                  onClick={() => {
                    setShowWsDropdown(false);
                    onOpenCreateWorkspace();
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Create Workspace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100/80 transition text-sm text-slate-400 cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400" />
            <span>Search projects, tasks, people, files...</span>
          </div>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md shadow-2xs">
            ⌘F / Ctrl+K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenPricing}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition"
        >
          <span>Upgrade Plan</span>
        </button>

        <button
          onClick={onOpenCreateTask}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm shadow-blue-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create New</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition relative text-slate-600"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
          </button>
          {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-50 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-sm ring-2 ring-slate-100">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</div>
              <div className="text-[11px] text-slate-500">{user?.role || 'Lead Product'}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="text-sm font-bold text-slate-800">{user?.name}</div>
                <div className="text-xs text-slate-500 truncate">{user?.email}</div>
              </div>
              <div className="py-1">
                <div className="px-4 py-1.5 text-xs text-slate-600 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Role: {user?.role || 'Admin'}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
