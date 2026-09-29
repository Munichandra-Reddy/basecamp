import React, { useState } from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import {
  FolderKanban,
  KanbanSquare,
  GanttChartSquare,
  Map,
  List,
  Plus,
  Star,
  Pin,
  Clock,
  DollarSign,
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export default function ProjectsView() {
  const { projects, tasks, toggleProjectFavorite, toggleProjectPinned, addProject, setSelectedProjectId } = useWorkOrbit();
  const [viewMode, setViewMode] = useState('grid'); // grid, list, kanban, gantt, roadmap
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Project state
  const [newProjName, setNewProjName] = useState('');
  const [newProjClient, setNewProjClient] = useState('');
  const [newProjBudget, setNewProjBudget] = useState(500000);
  const [newProjPriority, setNewProjPriority] = useState('Medium');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchFilter.toLowerCase()) || p.client.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!newProjName) return;
    addProject({
      name: newProjName,
      client: newProjClient || 'Internal Client',
      budget: Number(newProjBudget),
      priority: newProjPriority,
      projectManager: 'Karthik Raja',
      logo: ''
    });
    setNewProjName('');
    setNewProjClient('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-blue-600" />
            Projects Workspace
          </h2>
          <p className="text-xs text-slate-500">Manage all client projects, project health, timelines, and budgets</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Selector Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <FolderKanban className="w-3.5 h-3.5" /> Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${viewMode === 'kanban' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <KanbanSquare className="w-3.5 h-3.5" /> Kanban
            </button>
            <button
              onClick={() => setViewMode('gantt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${viewMode === 'gantt' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <GanttChartSquare className="w-3.5 h-3.5" /> Gantt
            </button>
            <button
              onClick={() => setViewMode('roadmap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${viewMode === 'roadmap' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Map className="w-3.5 h-3.5" /> Roadmap
            </button>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Filter projects by name or client..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full text-xs bg-transparent outline-none text-slate-800 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="At Risk">At Risk</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* RENDER VIEW MODES */}

      {/* 1. GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map(proj => (
            <div key={proj.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {proj.logo ? <span className="text-3xl p-2 rounded-xl bg-slate-100">{proj.logo}</span> : null}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{proj.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        proj.health === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {proj.health}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{proj.client}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleProjectFavorite(proj.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition"
                  >
                    <Star className={`w-4 h-4 ${proj.favorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                  <button
                    onClick={() => toggleProjectPinned(proj.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-500 transition"
                  >
                    <Pin className={`w-4 h-4 ${proj.pinned ? 'fill-blue-500 text-blue-500' : ''}`} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">{proj.description}</p>

              {/* Progress & Budget bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Task Progress</span>
                  <span className="font-mono">{proj.completion}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${proj.completion}%` }}></div>
                </div>
              </div>

              {/* Finance metrics */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Budget vs Spent</div>
                  <div className="font-bold font-mono text-slate-800 mt-0.5">
                    ₹{proj.spent.toLocaleString()} / ₹{proj.budget.toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Deadline</div>
                  <div className="font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{proj.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {proj.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. LIST VIEW */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4">Project</th>
                <th className="p-4">Client</th>
                <th className="p-4">Status</th>
                <th className="p-4">Health</th>
                <th className="p-4">Progress</th>
                <th className="p-4">Budget</th>
                <th className="p-4 text-right">Deadline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {filteredProjects.map(proj => (
                <tr key={proj.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                    {proj.logo ? <span>{proj.logo}</span> : null}
                    <span>{proj.name}</span>
                  </td>
                  <td className="p-4 text-slate-600">{proj.client}</td>
                  <td className="p-4 font-semibold text-blue-600">{proj.status}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      proj.health === 'Healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {proj.health}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-semibold">{proj.completion}%</td>
                  <td className="p-4 font-mono font-semibold">₹{proj.budget.toLocaleString()}</td>
                  <td className="p-4 text-right font-medium text-slate-600">{proj.deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Planning', 'In Progress', 'At Risk', 'Completed'].map(col => (
            <div key={col} className="bg-slate-100 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between font-bold text-xs uppercase text-slate-600 tracking-wider">
                <span>{col}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-mono">
                  {projects.filter(p => p.status === col).length}
                </span>
              </div>

              <div className="space-y-3">
                {projects.filter(p => p.status === col).map(proj => (
                  <div key={proj.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                      {proj.logo ? <span>{proj.logo}</span> : null}
                      <span>{proj.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{proj.client}</p>
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 pt-2 border-t border-slate-100">
                      <span>{proj.completion}% Complete</span>
                      <span className="text-blue-600">₹{proj.budget.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. GANTT CHART VIEW */}
      {viewMode === 'gantt' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <GanttChartSquare className="w-4 h-4 text-blue-600" />
              Project Gantt Timeline
            </h3>
            <span className="text-xs text-slate-500 font-mono">Sep 2026 - Nov 2026</span>
          </div>

          <div className="space-y-4">
            {projects.map((proj, idx) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span className="flex items-center gap-2">
                    {proj.logo ? <span>{proj.logo}</span> : null}
                    <span>{proj.name}</span>
                  </span>
                  <span className="font-mono text-slate-500">{proj.startDate} ➔ {proj.deadline}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-lg h-6 p-1 relative overflow-hidden flex items-center">
                  <div
                    className="h-full rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-[10px] font-bold flex items-center px-2 shadow-sm"
                    style={{
                      width: `${Math.max(30, proj.completion)}%`,
                      marginLeft: `${idx * 15}%`
                    }}
                  >
                    {proj.name} ({proj.completion}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ROADMAP VIEW */}
      {viewMode === 'roadmap' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Map className="w-4 h-4 text-blue-600" />
            Product Strategy Roadmap (Q4 2026)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
              <div className="font-bold text-xs uppercase text-blue-700 tracking-wider">Phase 1 — Core PM & Launch</div>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm">
                  ✓ E-Commerce Web Storefront
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm">
                  ✓ Stripe Payment Integration
                </div>
              </div>
            </div>

            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-3">
              <div className="font-bold text-xs uppercase text-indigo-700 tracking-wider">Phase 2 — Automation & AI</div>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm">
                  → WorkOrbit AI Risk Detection Engine
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm">
                  → IF / THEN Automation Rules
                </div>
              </div>
            </div>

            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-3">
              <div className="font-bold text-xs uppercase text-emerald-700 tracking-wider">Phase 3 — Enterprise Portals</div>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm">
                  ○ WhatsApp Integration & Client Portal
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm">
                  ○ Custom Fields & API Keys
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Customer Service Portal"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Client Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Global Financial"
                  value={newProjClient}
                  onChange={(e) => setNewProjClient(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Budget (₹)</label>
                  <input
                    type="number"
                    value={newProjBudget}
                    onChange={(e) => setNewProjBudget(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newProjPriority}
                    onChange={(e) => setNewProjPriority(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none font-semibold"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
