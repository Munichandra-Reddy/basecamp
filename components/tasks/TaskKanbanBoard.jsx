import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, LayoutGrid, List, Clock, CheckSquare, MessageSquare, Paperclip, AlertCircle, Play, Pause } from 'lucide-react';
import api from '../../services/api';
import TaskDetailModal from './TaskDetailModal';
import TaskListView from './TaskListView';

const initialDemoTasks = [
  { id: 1, title: 'Copywriting Review', project: 'Google Dashboard', brand_logo: 'G', due_date: '24 Jan 2026', priority: 'Medium', status: 'To Do', subtask_count: 4, subtasks_completed: 2, assignee_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 2, title: 'UX Audit', project: 'Grab Map App', brand_logo: 'G', due_date: '25 Jan 2026', priority: 'Medium', status: 'To Do', subtask_count: 3, subtasks_completed: 1, assignee_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 3, title: 'Sprint Planning', project: 'Dribbble', brand_logo: 'D', due_date: '30 Jan 2026', priority: 'Medium', status: 'To Do', subtask_count: 5, subtasks_completed: 0, assignee_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 4, title: 'Wireframe v2 Upload', project: 'Netflix', brand_logo: 'N', due_date: '17 Jan 2026', priority: 'Low', status: 'In Progress', subtask_count: 4, subtasks_completed: 2, assignee_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 5, title: 'QA Testing', project: 'Nvidia', brand_logo: 'N', due_date: '17 Jan 2026', priority: 'Low', status: 'In Progress', subtask_count: 6, subtasks_completed: 3, assignee_avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
  { id: 6, title: 'Prototype Review', project: 'Behance', brand_logo: 'B', due_date: '18 Jan 2026', priority: 'Medium', status: 'In Progress', subtask_count: 2, subtasks_completed: 1, assignee_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 7, title: 'Design System Audit', project: 'Amazon Dashboard', brand_logo: 'a', due_date: '10 Jan 2026', priority: 'High', status: 'Completed', subtask_count: 4, subtasks_completed: 4, assignee_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 8, title: 'Landing Page Copywriting', project: 'Microsoft', brand_logo: 'M', due_date: '12 Jan 2026', priority: 'High', status: 'Completed', subtask_count: 3, subtasks_completed: 3, assignee_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 9, title: 'Mobile App Redesign', project: 'Apple', brand_logo: 'A', due_date: '14 Jan 2026', priority: 'High', status: 'Completed', subtask_count: 5, subtasks_completed: 5, assignee_avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
  { id: 10, title: 'Review Landing Page', project: 'Lego', brand_logo: 'L', due_date: '04 Jan 2026', priority: 'Medium', status: 'Completed', subtask_count: 2, subtasks_completed: 2, assignee_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 11, title: 'Database Schema', project: 'E-Commerce Website', brand_logo: 'E', due_date: '02 Jan 2026', priority: 'Medium', status: 'Completed', subtask_count: 4, subtasks_completed: 4, assignee_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 12, title: '16 Jan 2026 API Key Security Audit', project: 'Facebook Dashboard', brand_logo: 'f', due_date: '10 Jan 2026', priority: 'Low', status: 'Overdue', subtask_count: 2, subtasks_completed: 0, assignee_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 13, title: 'Complete API Integration', project: 'E-Commerce Website', brand_logo: 'E', due_date: '12 Jan 2026', priority: 'High', status: 'Overdue', subtask_count: 5, subtasks_completed: 2, assignee_avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
  { id: 14, title: 'SSL Certificate Renewal', project: 'Google Dashboard', brand_logo: 'G', due_date: '15 Jan 2026', priority: 'High', status: 'Overdue', subtask_count: 1, subtasks_completed: 0, assignee_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }
];

const loadCustomTasks = () => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('teamflow_custom_tasks') || '[]');
  } catch (e) {
    return [];
  }
};

const getMergedTasks = (fetchedTasks = []) => {
  const customTasks = loadCustomTasks();
  const customMap = new Map();
  customTasks.forEach(t => customMap.set(String(t.id), t));

  const baseList = fetchedTasks.length > 0 ? fetchedTasks : initialDemoTasks;
  const combined = [...customTasks];
  
  baseList.forEach(t => {
    if (!customMap.has(String(t.id))) {
      combined.push(t);
    }
  });

  return combined;
};

export default function TaskKanbanBoard({ onOpenCreateTask }) {
  const [viewMode, setViewMode] = useState('kanban');
  const [selectedTask, setSelectedTask] = useState(null);
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [tasks, setTasks] = useState(() => getMergedTasks());

  useEffect(() => {
    api.get('/tasks')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setTasks(getMergedTasks(res.data));
        }
      })
      .catch(() => {});

    const handleTaskCreated = (e) => {
      if (e.detail) {
        setTasks(prev => {
          if (prev.some(t => String(t.id) === String(e.detail.id))) return prev;
          return [e.detail, ...prev];
        });
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('task-created', handleTaskCreated);
      return () => window.removeEventListener('task-created', handleTaskCreated);
    }
  }, []);

  const columns = [
    { title: 'To Do', status: 'To Do', color: 'bg-slate-700 text-white' },
    { title: 'In Progress', status: 'In Progress', color: 'bg-blue-600 text-white' },
    { title: 'Completed', status: 'Completed', color: 'bg-emerald-600 text-white' },
    { title: 'Overdue', status: 'Overdue', color: 'bg-red-600 text-white' }
  ];

  const filteredTasks = tasks.filter(t => {
    const matchesPriority = priorityFilter === 'All' ? true : t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' ? true : t.status === statusFilter;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || (t.project && t.project.toLowerCase().includes(search.toLowerCase()));
    return matchesPriority && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Tasks</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage tasks across projects with interactive Kanban status columns.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-200/80 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'kanban' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenCreateTask}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md shadow-blue-500/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New Task</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <select className="px-3 py-1.5 rounded-xl border border-slate-200 font-semibold text-slate-700 outline-none bg-slate-50">
            <option>All Project</option>
            <option>Google Dashboard</option>
            <option>Netflix</option>
            <option>Amazon Dashboard</option>
            <option>Facebook Dashboard</option>
          </select>

          <select className="px-3 py-1.5 rounded-xl border border-slate-200 font-semibold text-slate-700 outline-none bg-slate-50">
            <option>All Time</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 font-semibold text-slate-700 outline-none bg-slate-50"
          >
            <option value="All">All Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 font-semibold text-slate-700 outline-none bg-slate-50"
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search task / project"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter(t => t.status === col.status);
            return (
              <div key={col.status} className="kanban-column space-y-3">
                <div className="flex items-center justify-between mb-1 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${col.color}`}>
                      {col.title}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {colTasks.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded-lg hover:bg-slate-200 text-slate-400">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    <button onClick={onOpenCreateTask} className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 font-bold">
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTask(t)}
                      className="card-atlas p-4 cursor-pointer hover:border-blue-400 transition space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                          <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-200 font-bold text-[10px] flex items-center justify-center text-slate-700">
                            {t.brand_logo || 'P'}
                          </span>
                          <span className="text-[11px] text-slate-500">{t.project || t.project_name || 'Project'}</span>
                        </div>
                        <MoreHorizontal className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition" />
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 leading-snug group-hover:text-blue-600 transition">
                        {t.title}
                      </h4>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-slate-400 font-medium">{t.due_date}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          t.priority === 'High' ? 'badge-priority-high' :
                          t.priority === 'Medium' ? 'badge-priority-medium' : 'badge-priority-low'
                        }`}>
                          {t.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <TaskListView tasks={filteredTasks} onSelectTask={setSelectedTask} />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={(updated) => {
            setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
          }}
        />
      )}
    </div>
  );
}
