import React, { useState } from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import {
  CheckSquare,
  Clock,
  Play,
  Pause,
  AlertCircle,
  Plus,
  CheckCircle2,
  ListTodo,
  Tag,
  User,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  Layers,
  Filter
} from 'lucide-react';

export default function TasksView() {
  const { tasks, updateTaskStatus, updateTaskPriority, toggleSubtask, toggleTimer, addTask, selectedTaskId, setSelectedTaskId } = useWorkOrbit();
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTaskDrawer, setActiveTaskDrawer] = useState(selectedTaskId ? tasks.find(t => t.id === selectedTaskId) : null);

  const filteredTasks = tasks.filter(t => {
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesPriority && matchesStatus;
  });

  const activeTask = activeTaskDrawer || tasks[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            Advanced Task Management
          </h2>
          <p className="text-xs text-slate-500">Track task priorities, subtasks, dependencies, and time logs</p>
        </div>

        {/* Priority & Status Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-white p-1.5 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent font-semibold outline-none text-slate-700"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">🔴 Urgent</option>
              <option value="High">🟠 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs bg-white p-1.5 rounded-xl border border-slate-200">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-semibold outline-none text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Blocked">Blocked</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Two-Column Tasks Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Tasks List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredTasks.map(task => {
            const completedSubtasksCount = task.subtasks.filter(st => st.completed).length;
            const subtaskPercentage = task.subtasks.length > 0
              ? Math.round((completedSubtasksCount / task.subtasks.length) * 100)
              : 0;

            const isBlocked = task.status === 'Blocked' || task.blockedBy.length > 0;
            const isSelected = activeTask?.id === task.id;

            return (
              <div
                key={task.id}
                onClick={() => setActiveTaskDrawer(task)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-400 shadow-md ring-1 ring-blue-400'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {task.projectName}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{task.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.priority === 'Urgent'
                        ? 'bg-rose-100 text-rose-700 border border-rose-300'
                        : task.priority === 'High'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {task.priority === 'Urgent' ? '🔴 Urgent' : task.priority === 'High' ? '🟠 High' : task.priority === 'Medium' ? '🟡 Medium' : '🟢 Low'}
                    </span>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      task.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : task.status === 'Blocked'
                        ? 'bg-rose-100 text-rose-700 border border-rose-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>

                {/* Subtask Progress indicator */}
                {task.subtasks.length > 0 && (
                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-slate-500" />
                        Subtasks: {completedSubtasksCount} / {task.subtasks.length} completed
                      </span>
                      <span className="font-mono text-blue-600">{subtaskPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${subtaskPercentage}%` }}></div>
                    </div>
                  </div>
                )}

                {/* Dependency Warning */}
                {isBlocked && (
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-medium flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>⚠️ Blocked by: {task.blockedBy.join(', ') || 'Prerequisite Task'}</span>
                  </div>
                )}

                {/* Timer Control & Assignee */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <img src={task.assigneeAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                    <span className="font-medium text-slate-700">{task.assigneeName}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{task.actualHours}h / {task.estimatedHours}h</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTimer(task.id);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-sm transition ${
                        task.isTimerRunning
                          ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {task.isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{task.isTimerRunning ? 'Pause Timer' : 'Start Timer'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Task Inspector Drawer */}
        {activeTask && (
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-lg space-y-5 sticky top-6">
            <div className="pb-4 border-b border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono uppercase font-bold text-blue-600">{activeTask.id}</span>
                <span>Created by Karthik Raja</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">{activeTask.title}</h3>
              <p className="text-xs text-slate-600">{activeTask.description}</p>
            </div>

            {/* Quick Status / Priority Pickers */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Status</label>
                <select
                  value={activeTask.status}
                  onChange={(e) => updateTaskStatus(activeTask.id, e.target.value)}
                  className="w-full bg-slate-50 p-2 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none"
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Priority</label>
                <select
                  value={activeTask.priority}
                  onChange={(e) => updateTaskPriority(activeTask.id, e.target.value)}
                  className="w-full bg-slate-50 p-2 rounded-xl border border-slate-200 font-bold text-slate-800 outline-none"
                >
                  <option value="Urgent">🔴 Urgent</option>
                  <option value="High">🟠 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>
            </div>

            {/* Interactive Subtasks Checklist */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>🧩 Subtask Checklist ({activeTask.subtasks.filter(s => s.completed).length} / {activeTask.subtasks.length})</span>
                <span className="text-[10px] text-blue-600">Basecamp 5 Style</span>
              </div>

              <div className="space-y-2">
                {activeTask.subtasks.map(st => (
                  <label
                    key={st.id}
                    onClick={() => toggleSubtask(activeTask.id, st.id)}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer transition text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => {}}
                      className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                    />
                    <span className={st.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                      {st.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Built-in Task Timer & Log */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Built-in Time Tracker</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {activeTask.isTimerRunning ? '⏱️ TIMER ACTIVE' : 'PAUSED'}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-black font-mono tracking-wider">{activeTask.actualHours}h</div>
                  <div className="text-[10px] text-slate-400">Estimated: {activeTask.estimatedHours}h</div>
                </div>

                <button
                  onClick={() => toggleTimer(activeTask.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTask.isTimerRunning
                      ? 'bg-rose-500 hover:bg-rose-600 text-white'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {activeTask.isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{activeTask.isTimerRunning ? 'Pause' : 'Start Timer'}</span>
                </button>
              </div>
            </div>

            {/* Comments Feed */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Comments & Activity ({activeTask.commentsCount})
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Rahul Kumar</span>
                    <span className="text-[10px] font-normal text-slate-400">10:45 AM</span>
                  </div>
                  <p className="text-slate-600">Updated Stripe API keys and verified sandbox environment.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
