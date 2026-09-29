import React, { useEffect } from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import { Search, X, FolderKanban, CheckSquare, Users, FileText, MessageSquare } from 'lucide-react';

export default function UniversalSearchModal() {
  const { searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen, projects, tasks, teamMembers, files, chatMessages, setActiveTab, setSelectedTaskId } = useWorkOrbit();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = searchQuery.toLowerCase().trim();

  const matchedProjects = q ? projects.filter(p => p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q)) : projects.slice(0, 2);
  const matchedTasks = q ? tasks.filter(t => t.title.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q))) : tasks.slice(0, 3);
  const matchedPeople = q ? teamMembers.filter(m => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)) : teamMembers.slice(0, 2);
  const matchedFiles = q ? files.filter(f => f.name.toLowerCase().includes(q)) : [];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col space-y-3">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Universal Search across Projects, Tasks, People, Files, Messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-slate-900 placeholder-slate-400 font-medium"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Projects */}
          {matchedProjects.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <FolderKanban className="w-3.5 h-3.5 text-blue-500" /> Projects ({matchedProjects.length})
              </div>
              <div className="space-y-1">
                {matchedProjects.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setActiveTab('all-projects');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl hover:bg-blue-50 cursor-pointer flex items-center justify-between border border-slate-100 transition"
                  >
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span>{p.logo}</span>
                      <span>{p.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{p.client}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {matchedTasks.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <CheckSquare className="w-3.5 h-3.5 text-blue-500" /> Tasks ({matchedTasks.length})
              </div>
              <div className="space-y-1">
                {matchedTasks.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTaskId(t.id);
                      setActiveTab('my-tasks');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl hover:bg-blue-50 cursor-pointer flex items-center justify-between border border-slate-100 transition"
                  >
                    <div className="font-bold text-slate-900">{t.title}</div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-600">{t.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* People */}
          {matchedPeople.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-500" /> Team Members ({matchedPeople.length})
              </div>
              <div className="space-y-1">
                {matchedPeople.map(m => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setActiveTab('people');
                      setIsSearchOpen(false);
                    }}
                    className="p-2.5 rounded-xl hover:bg-blue-50 cursor-pointer flex items-center gap-2 border border-slate-100 transition"
                  >
                    <img src={m.avatar} alt="" className="w-5 h-5 rounded-full" />
                    <span className="font-bold text-slate-900">{m.name}</span>
                    <span className="text-[10px] text-slate-400">({m.role})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
