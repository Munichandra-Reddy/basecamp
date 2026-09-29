import React, { useState, useEffect } from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import { FolderGit2, FileText, BookOpen, GitCommit, Plus, Download, Tag, Clock, CheckCircle2, Search } from 'lucide-react';

export default function ResourcesView() {
  const { activeTab, files, decisions, addDecision } = useWorkOrbit();

  const getInitialResourceTab = (tab) => {
    if (tab === 'docs') return 'decisions';
    if (tab === 'wiki') return 'wiki';
    return 'files';
  };

  const [resourceTab, setResourceTab] = useState(() => getInitialResourceTab(activeTab));

  useEffect(() => {
    if (activeTab === 'docs') {
      setResourceTab('decisions');
    } else if (activeTab === 'wiki') {
      setResourceTab('wiki');
    } else if (activeTab === 'files') {
      setResourceTab('files');
    }
  }, [activeTab]);
  const [newDecTitle, setNewDecTitle] = useState('');
  const [newDecReason, setNewDecReason] = useState('');
  const [isDecModalOpen, setIsDecModalOpen] = useState(false);

  const handleAddDecision = (e) => {
    e.preventDefault();
    if (!newDecTitle) return;
    addDecision({
      title: newDecTitle,
      reason: newDecReason || 'Team alignment'
    });
    setNewDecTitle('');
    setNewDecReason('');
    setIsDecModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-blue-600" />
            Resources, Knowledge Base & Decision Log
          </h2>
          <p className="text-xs text-slate-500">Document versioning, team wiki, and persistent architectural decision log</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setResourceTab('files')}
            className={`px-3 py-1.5 rounded-lg transition ${resourceTab === 'files' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
          >
            📂 Files & Versions
          </button>
          <button
            onClick={() => setResourceTab('wiki')}
            className={`px-3 py-1.5 rounded-lg transition ${resourceTab === 'wiki' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
          >
            📚 Team Wiki
          </button>
          <button
            onClick={() => setResourceTab('decisions')}
            className={`px-3 py-1.5 rounded-lg transition ${resourceTab === 'decisions' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
          >
            🧠 Decision Log (#{decisions.length + 22})
          </button>
        </div>
      </div>

      {/* RENDER FILES VIEW */}
      {resourceTab === 'files' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
            <span>Folder Hierarchy: Projects 📁 &gt; E-Commerce Website 🛍️ &gt; Designs</span>
            <span className="text-blue-600">Version History Control Active</span>
          </div>

          <div className="space-y-3">
            {files.map(f => (
              <div key={f.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 transition">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-blue-100 text-blue-600">📄</span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      {f.name}
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold font-mono">
                        {f.version} (Current)
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Project: <span className="font-medium text-slate-700">{f.project}</span> • Size: {f.size} • Updated: {f.updatedAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-[10px] font-semibold rounded-md bg-slate-200 text-slate-700">
                    #{f.tag}
                  </span>
                  <button className="p-2 rounded-lg bg-white hover:bg-slate-200 text-slate-700 border border-slate-200 transition">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RENDER TEAM WIKI */}
      {resourceTab === 'wiki' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="font-bold text-slate-900 text-sm">🚀 Getting Started & Onboarding</div>
            <p className="text-xs text-slate-500 leading-relaxed">Workspace setup guide, coding conventions, Git workflow rules, and deployment procedures.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="font-bold text-slate-900 text-sm">🎨 UI/UX Brand Guidelines</div>
            <p className="text-xs text-slate-500 leading-relaxed">Figma design system tokens, color palettes, button variants, and responsive layout guidelines.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="font-bold text-slate-900 text-sm">🔒 Security & Compliance SOW</div>
            <p className="text-xs text-slate-500 leading-relaxed">Data encryption protocols, GDPR compliance rules, and API key management policies.</p>
          </div>
        </div>
      )}

      {/* RENDER DECISION LOG */}
      {resourceTab === 'decisions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Architectural Decision Log</h3>
            <button
              onClick={() => setIsDecModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Log Decision
            </button>
          </div>

          <div className="space-y-4">
            {decisions.map(dec => (
              <div key={dec.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-blue-600">DECISION #{dec.number}</span>
                  <span className="text-slate-400">{dec.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{dec.title}</h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-800">Rationale: </span>
                  {dec.reason}
                </p>
                <div className="text-[11px] text-slate-500 pt-1">
                  Made by: <span className="font-semibold text-slate-700">{dec.madeBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DECISION MODAL */}
      {isDecModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Log Team Decision</h3>
            <form onSubmit={handleAddDecision} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Decision Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standardize on Next.js 14 App Router"
                  value={newDecTitle}
                  onChange={(e) => setNewDecTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rationale / Reason</label>
                <textarea
                  rows="3"
                  placeholder="Why was this decision chosen?"
                  value={newDecReason}
                  onChange={(e) => setNewDecReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDecModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
                >
                  Save Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
