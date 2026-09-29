import React from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar as CalendarIcon,
  Inbox,
  FolderKanban,
  KanbanSquare,
  GanttChartSquare,
  Map,
  Users,
  UserCheck,
  BarChart3,
  MessageSquare,
  MessageCircle,
  Video,
  FileText,
  BookOpen,
  FolderGit2,
  PieChart,
  Target,
  LineChart,
  Zap,
  Boxes,
  Webhook,
  Bot,
  Mic,
  Settings,
  Star,
  PlusCircle,
  Search,
  ChevronDown,
  Building2,
  ShieldAlert,
  FileSpreadsheet,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { activeTab, setActiveTab, projects, setIsSearchOpen, setIsQuickTaskOpen, notifications } = useWorkOrbit();
  const { activeWorkspace, workspaces, switchWorkspace } = useWorkspace();
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = React.useState(false);

  const unreadNotifCount = notifications.filter(n => !n.read).length;
  const favoriteProjects = projects.filter(p => p.favorite);

  const userAvatar = (user && typeof user.avatar_url === 'string') ? user.avatar_url : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80';
  const userName = (user && typeof user.name === 'string') ? user.name : 'muni';
  const userRole = (user && typeof user.role === 'string') ? user.role : 'Workspace Admin';

  const navCategories = [
    {
      groupLabel: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null }
      ]
    },
    {
      groupLabel: 'MY WORK',
      items: [
        { id: 'my-tasks', label: 'My Tasks', icon: CheckSquare, badge: '5' },
        { id: 'my-calendar', label: 'My Calendar', icon: CalendarIcon, badge: null },
        { id: 'inbox', label: 'Inbox', icon: Inbox, badge: unreadNotifCount > 0 ? unreadNotifCount : null }
      ]
    },
    {
      groupLabel: 'PROJECTS',
      items: [
        { id: 'all-projects', label: 'All Projects', icon: FolderKanban, badge: projects.length },
        { id: 'kanban', label: 'Kanban Board', icon: KanbanSquare, badge: null },
        { id: 'gantt', label: 'Gantt Chart', icon: GanttChartSquare, badge: null },
        { id: 'roadmap', label: 'Roadmap', icon: Map, badge: null }
      ]
    },
    {
      groupLabel: 'TEAM',
      items: [
        { id: 'people', label: 'People', icon: Users, badge: null },
        { id: 'teams', label: 'Teams', icon: UserCheck, badge: null },
        { id: 'workload', label: 'Workload Planner', icon: BarChart3, badge: 'Overload Alert' }
      ]
    },
    {
      groupLabel: 'COMMUNICATION',
      items: [
        { id: 'chat', label: 'Campfire Chat', icon: MessageSquare, badge: 'Live' },
        { id: 'messages', label: 'Direct Messages', icon: MessageCircle, badge: null },
        { id: 'meetings', label: 'Meetings', icon: Video, badge: '3 Today' }
      ]
    },
    {
      groupLabel: 'RESOURCES',
      items: [
        { id: 'files', label: 'Files & Storage', icon: FolderGit2, badge: null },
        { id: 'docs', label: 'Docs & Notes', icon: FileText, badge: null },
        { id: 'wiki', label: 'Knowledge Base', icon: BookOpen, badge: null }
      ]
    },
    {
      groupLabel: 'INSIGHTS',
      items: [
        { id: 'reports', label: 'Reports', icon: PieChart, badge: null },
        { id: 'goals', label: 'Goals / OKRs', icon: Target, badge: null },
        { id: 'analytics', label: 'Financials & Profit', icon: LineChart, badge: null }
      ]
    },
    {
      groupLabel: 'AUTOMATION',
      items: [
        { id: 'workflows', label: 'Workflows & Rules', icon: Zap, badge: '4 Rules' },
        { id: 'integrations', label: 'Integrations', icon: Boxes, badge: null },
        { id: 'webhooks', label: 'Webhooks & API', icon: Webhook, badge: null }
      ]
    },
    {
      groupLabel: 'INTELLIGENCE & RISK',
      items: [
        { id: 'ai-assistant', label: 'Assistant', icon: Bot, badge: null },
        { id: 'project-insights', label: 'Risk Intelligence', icon: ShieldAlert, badge: '3 Risks' },
        { id: 'meeting-ai', label: 'Meeting Transcriber', icon: Mic, badge: null }
      ]
    },
    {
      groupLabel: 'ADMIN & PORTALS',
      items: [
        { id: 'client-portal', label: 'Client Portal', icon: Building2, badge: 'Client' },
        { id: 'forms', label: 'Forms & Bug Reports', icon: FileSpreadsheet, badge: null },
        { id: 'settings', label: 'Settings & Workspace', icon: Settings, badge: null }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col h-screen border-r border-slate-800 select-none shrink-0">
      {/* Brand Header & Workspace Switcher */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
              W
            </div>
            <div>
              <span className="font-bold text-white tracking-wide text-lg">WorkOrbit</span>
            </div>
          </div>
          <button
            onClick={() => setIsQuickTaskOpen(true)}
            className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            title="Quick Task Creation"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs font-medium text-slate-200 transition"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
              <span className="truncate">{activeWorkspace?.name || 'ABC Technologies'}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {isWorkspaceMenuOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
              <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Switch Workspace</div>
              {workspaces.map(ws => (
                <button
                  key={ws.id}
                  onClick={() => {
                    switchWorkspace(ws);
                    setIsWorkspaceMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-700/70 transition ${activeWorkspace?.id === ws.id ? 'text-blue-400 font-semibold' : 'text-slate-300'}`}
                >
                  <span className="truncate">{ws.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">{ws.subscription_plan}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Global Quick Actions Bar */}
      <div className="px-4 py-2 border-b border-slate-800 flex items-center gap-2">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex-1 flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 hover:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700/50 transition"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Search (Ctrl+K)</span>
        </button>
      </div>

      {/* Navigation Links Scroll Container */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 custom-scrollbar">
        {/* Favorite Projects Quick Access */}
        {favoriteProjects.length > 0 && (
          <div>
            <div className="px-2 mb-1 text-[10px] font-semibold uppercase text-amber-400/80 tracking-wider flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Favorites
            </div>
            <div className="space-y-0.5">
              {favoriteProjects.map(proj => (
                <button
                  key={proj.id}
                  onClick={() => {
                    setActiveTab('all-projects');
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-slate-300 hover:bg-slate-800 transition group"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{proj.logo}</span>
                    <span className="truncate">{proj.name}</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${proj.health === 'Healthy' ? 'bg-emerald-500' : proj.health === 'At Risk' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Grouped Category Navigation */}
        {navCategories.map(cat => (
          <div key={cat.groupLabel}>
            <div className="px-2 mb-1.5 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              {cat.groupLabel}
            </div>
            <div className="space-y-0.5">
              {cat.items.map(item => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                        item.badge === 'Overload Alert' || item.badge === '3 Risks'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : item.badge === 'Live'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={userAvatar}
            alt={userName}
            className="w-8 h-8 rounded-full border border-blue-500/40 object-cover"
          />
          <div className="text-left leading-tight truncate">
            <div className="text-xs font-semibold text-white truncate">{userName}</div>
            <div className="text-[10px] text-slate-400 truncate">{userRole}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={logout}
            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
