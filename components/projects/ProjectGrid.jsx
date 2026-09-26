import React, { useState, useEffect } from 'react';
import { Search, Plus, FolderKanban, Users, Calendar, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function ProjectGrid({ onOpenNewProject }) {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'E-Commerce Website',
      description: 'Web Development full-stack online store with payment gateway',
      progress: 75,
      member_count: 4,
      due_date: 'Oct 30',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Mobile App Redesign',
      description: 'iOS & Android native UI overhaul and onboarding flow',
      progress: 40,
      member_count: 5,
      due_date: 'Nov 15',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Design System Audit',
      description: 'Comprehensive UI audit across web and mobile tokens',
      progress: 90,
      member_count: 3,
      due_date: 'Sep 28',
      status: 'Active'
    }
  ]);

  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/projects')
      .then(res => {
        if (res.data && res.data.length > 0) setProjects(res.data);
      })
      .catch(() => {});
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === 'All' ? true : p.status === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-xs text-slate-500 mt-1">Manage and track progress across all team initiatives.</p>
        </div>

        <button
          onClick={onOpenNewProject}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md shadow-blue-500/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Project</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Active', 'Completed', 'Archived', 'My Projects'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                filter === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="🔍 Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-xs font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            onClick={() => navigate(`/projects/${p.id}`)}
            className="card-atlas p-6 cursor-pointer hover:border-blue-400 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-50 text-blue-600">
                  {p.status || 'Active'}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Due: {p.due_date}
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition flex items-center justify-between">
                <span>{p.name}</span>
                <ArrowRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition" />
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-600">Progress</span>
                  <span className="text-blue-600">{p.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${p.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pt-1">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.member_count || 4} Members</span>
                </div>
                <span className="text-blue-600 font-bold hover:underline">Open Project →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
