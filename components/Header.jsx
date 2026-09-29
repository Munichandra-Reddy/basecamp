import React from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import { Search, Bell, Sparkles, Plus, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Header() {
  const { activeTab, setIsSearchOpen, setIsQuickTaskOpen, notifications, markNotificationsRead } = useWorkOrbit();
  const [showNotifDropdown, setShowNotifDropdown] = React.useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTitle = () => {
    const titles = {
      'dashboard': '🏠 Workspace Dashboard',
      'my-tasks': '📌 My Active Tasks',
      'my-calendar': '📅 Calendar Schedule',
      'inbox': '📥 Notifications & Inbox',
      'all-projects': '📁 Projects Overview',
      'kanban': '📊 Kanban Task Board',
      'gantt': '📈 Gantt Chart Timeline',
      'roadmap': '🗺️ Product Roadmap',
      'people': '👥 Team Roster',
      'teams': '🧑‍🤝‍🧑 Department Teams',
      'workload': '📊 Employee Workload Planner',
      'chat': '💬 Campfire Team Chat',
      'messages': '💬 Direct Messages',
      'meetings': '📹 Video Meetings',
      'files': '📂 Files & Document Tree',
      'docs': '📝 Documents & Knowledge Base',
      'wiki': '📚 Internal Wiki',
      'reports': '📈 Performance Analytics',
      'goals': '🎯 OKRs & Company Goals',
      'analytics': '💰 Budget & Financial Margin',
      'workflows': '⚡ Automation Engine',
      'integrations': '🔌 Integrations Hub',
      'webhooks': '🔗 Developer Webhooks',
      'ai-assistant': '🤖 WorkOrbit AI Assistant',
      'project-insights': '🧠 AI Risk Intelligence',
      'meeting-ai': '🎙️ AI Meeting Transcriber',
      'client-portal': '👨‍💼 Client Portal',
      'forms': '📝 Forms & Bug Tracker',
      'settings': '⚙️ Workspace Settings'
    };
    return titles[activeTab] || 'WorkOrbit';
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-sm z-20">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">{getTitle()}</h1>
        <span className="hidden md:inline-block px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Basecamp 2026 Edition
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Universal Search trigger button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium border border-slate-200 transition"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Search everything...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-slate-300 text-slate-400">Ctrl+K</kbd>
        </button>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={() => setIsQuickTaskOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifDropdown(!showNotifDropdown);
              if (!showNotifDropdown) markNotificationsRead();
            }}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline" onClick={markNotificationsRead}>Mark all read</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3 text-xs flex items-start gap-2.5 ${n.read ? 'bg-white' : 'bg-blue-50/50'}`}>
                    {n.type === 'urgent' ? (
                      <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">{n.title}</div>
                      <div className="text-slate-500 text-[11px]">{n.message}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
