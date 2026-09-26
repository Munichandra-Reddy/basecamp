import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useWorkspace } from '../../context/WorkspaceContext';
import api from '../../services/api';
import { FolderKanban, Calendar, FileText } from 'lucide-react';

const saveCustomProject = (proj) => {
  if (typeof window === 'undefined') return;
  try {
    const existing = JSON.parse(localStorage.getItem('teamflow_custom_projects') || '[]');
    const updated = [proj, ...existing.filter(p => String(p.id) !== String(proj.id))];
    localStorage.setItem('teamflow_custom_projects', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save project to localStorage:', e);
  }
};

export default function NewProjectModal({ isOpen, onClose, onProjectCreated }) {
  const { activeWorkspace } = useWorkspace();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2026-10-30');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !name.trim()) return;
    setLoading(true);

    const rawName = name.trim();
    const rawDesc = description.trim();
    const formattedDueDate = dueDate ? (dueDate.length === 10 ? new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : dueDate) : 'Oct 30';

    const localProject = {
      id: Date.now(),
      name: rawName,
      description: rawDesc || 'New project initiative',
      progress: 0,
      member_count: 1,
      due_date: formattedDueDate,
      status: 'Active',
      workspace_id: activeWorkspace?.id || 1
    };

    let createdProject = localProject;

    try {
      const res = await api.post('/projects', {
        workspace_id: activeWorkspace?.id || 1,
        name: rawName,
        description: rawDesc,
        due_date: dueDate
      });
      if (res.data) {
        createdProject = {
          ...localProject,
          ...res.data,
          due_date: res.data.due_date || formattedDueDate
        };
      }
    } catch (err) {
      // Offline / serverless fallback
    }

    saveCustomProject(createdProject);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('project-created', { detail: createdProject }));
    }

    setLoading(false);
    setName('');
    setDescription('');
    onClose();

    if (onProjectCreated) {
      onProjectCreated(createdProject);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Project Name</label>
          <div className="relative">
            <FolderKanban className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium"
              placeholder="E-Commerce Website"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Description</label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium"
              placeholder="Brief description of project goals and deliverables..."
            ></textarea>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Target Due Date</label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md shadow-blue-500/20"
        >
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>
    </Modal>
  );
}
