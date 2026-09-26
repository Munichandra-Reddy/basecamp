import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useWorkspace } from '../../context/WorkspaceContext';
import api from '../../services/api';
import { CheckSquare, Calendar, User, Tag, Clock } from 'lucide-react';

export default function CreateTaskModal({ isOpen, onClose, onTaskCreated }) {
  const { activeProject } = useWorkspace();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('To Do');
  const [dueDate, setDueDate] = useState('2026-09-28');
  const [estHours, setEstHours] = useState(10);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setStatus('To Do');
    setDueDate('2026-09-28');
    setEstHours(10);
  };

  const saveTaskToLocalStorage = (task) => {
    try {
      const existing = JSON.parse(localStorage.getItem('teamflow_custom_tasks') || '[]');
      const updated = [task, ...existing.filter(t => t.id !== task.id)];
      localStorage.setItem('teamflow_custom_tasks', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save task to localStorage:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !title.trim()) return;
    setLoading(true);

    const taskPayload = {
      project_id: activeProject?.id || 1,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority,
      status,
      due_date: dueDate,
      estimated_hours: Number(estHours) || 10
    };

    let createdTask = null;

    try {
      const res = await api.post('/tasks', taskPayload);
      createdTask = res.data;
    } catch (err) {
      console.warn('API task creation notice: using fallback task object', err);
      const projName = activeProject?.name || 'E-Commerce Website';
      createdTask = {
        id: Date.now(),
        project_id: activeProject?.id || 1,
        title: title.trim(),
        description: description ? description.trim() : '',
        priority,
        status,
        due_date: dueDate,
        estimated_hours: Number(estHours) || 10,
        project: projName,
        project_name: projName,
        brand_logo: projName[0] ? projName[0].toUpperCase() : 'E',
        subtask_count: 0,
        subtasks_completed: 0,
        assignee_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      };
    } finally {
      setLoading(false);
      resetForm();
      onClose();

      if (createdTask) {
        saveTaskToLocalStorage(createdTask);
        window.dispatchEvent(new CustomEvent('task-created', { detail: createdTask }));
        if (onTaskCreated) onTaskCreated(createdTask);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Task" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Task Title</label>
          <div className="relative">
            <CheckSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium"
              placeholder="Design homepage UI"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium"
            placeholder="Describe acceptance criteria..."
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none bg-white"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none bg-white"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Est. Hours</label>
            <input
              type="number"
              value={estHours}
              onChange={(e) => setEstHours(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md shadow-blue-500/20"
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </Modal>
  );
}
