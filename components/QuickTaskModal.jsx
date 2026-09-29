import React, { useState } from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import { PlusCircle, X } from 'lucide-react';

export default function QuickTaskModal() {
  const { isQuickTaskOpen, setIsQuickTaskOpen, addTask, projects } = useWorkOrbit();
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskProject, setTaskProject] = useState(projects[0]?.id || 'proj-1');

  if (!isQuickTaskOpen) return null;

  const handleQuickCreate = (e) => {
    e.preventDefault();
    if (!taskTitle) return;
    const projObj = projects.find(p => p.id === taskProject);
    addTask({
      title: taskTitle,
      projectId: taskProject,
      projectName: projObj ? projObj.name : 'E-Commerce Website',
      priority: taskPriority,
      assigneeName: 'Rahul Kumar',
      assigneeAvatar: ''
    });
    setTaskTitle('');
    setIsQuickTaskOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" />
            Quick Task Creation
          </h3>
          <button onClick={() => setIsQuickTaskOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleQuickCreate} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Task Title</label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Implement OTP login verification"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Project</label>
              <select
                value={taskProject}
                onChange={(e) => setTaskProject(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none font-semibold"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
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
              onClick={() => setIsQuickTaskOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
