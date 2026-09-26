import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Building2, Link, AlertCircle } from 'lucide-react';

export default function WorkspaceModal({ isOpen, onClose }) {
  const { createWorkspace } = useWorkspace();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNameChange = (val) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !slug) return;
    setLoading(true);
    setError('');

    const res = await createWorkspace(name, slug);
    setLoading(false);
    if (res.success) {
      setName('');
      setSlug('');
      onClose();
    } else {
      setError(res.error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create your Workspace" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Workspace Name</label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium"
              placeholder="ABC Technologies"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Workspace URL Slug</label>
          <div className="relative">
            <Link className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium text-slate-700"
              placeholder="abc-technologies"
            />
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            https://workorbit.com/workspaces/<span className="font-bold text-slate-600">{slug || 'your-url'}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md shadow-blue-500/20"
        >
          {loading ? 'Creating...' : 'Create Workspace'}
        </button>
      </form>
    </Modal>
  );
}
