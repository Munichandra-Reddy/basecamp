import React, { useState, useEffect } from 'react';
import { Search, X, FolderKanban, CheckSquare, Users, FileText, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ projects: [], tasks: [], people: [], files: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults({
        projects: [
          { id: 1, name: 'E-Commerce Website', status: 'Active' },
          { id: 2, name: 'Mobile App Redesign', status: 'Active' }
        ],
        tasks: [
          { id: 1, title: 'Copywriting Review', priority: 'Medium', project_name: 'E-Commerce Website' },
          { id: 2, title: 'Complete API Integration', priority: 'High', project_name: 'E-Commerce Website' }
        ],
        people: [
          { id: 1, name: 'Rahul Kumar', role: 'Project Manager' },
          { id: 2, name: 'Priya Sharma', role: 'UI/UX Designer' }
        ],
        files: [
          { id: 1, name: 'API Documentation.pdf', file_size: 3450000 },
          { id: 2, name: 'homepage.fig', file_size: 12450000 }
        ]
      });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/notifications/search?query=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (err) {
        // keep fallback
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-20 p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, tasks, people, files..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-base outline-none text-slate-800 placeholder-slate-400 bg-transparent font-medium"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-5">
          {/* Projects */}
          {results.projects.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Projects</span>
              </div>
              <div className="space-y-1">
                {results.projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      navigate(`/projects/${p.id}`);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50/60 transition flex items-center justify-between group"
                  >
                    <span className="font-semibold text-slate-800 text-sm">{p.name}</span>
                    <ArrowRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {results.tasks.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Tasks</span>
              </div>
              <div className="space-y-1">
                {results.tasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      navigate('/tasks');
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50/60 transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{t.title}</div>
                      <div className="text-xs text-slate-400">{t.project_name || 'E-Commerce Website'}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* People */}
          {results.people.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>People</span>
              </div>
              <div className="space-y-1">
                {results.people.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      navigate('/team');
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50/60 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">{u.name}</div>
                        <div className="text-xs text-slate-400">{u.role}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {results.files.length > 0 && (
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Files</span>
              </div>
              <div className="space-y-1">
                {results.files.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      navigate('/files');
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50/60 transition flex items-center justify-between group"
                  >
                    <span className="font-semibold text-slate-800 text-sm">📎 {f.name}</span>
                    <ArrowRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
