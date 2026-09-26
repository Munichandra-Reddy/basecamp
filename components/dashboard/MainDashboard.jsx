import React, { useState, useEffect } from 'react';
import { FolderKanban, CheckSquare, Clock, Users, CheckCircle2, Circle, ArrowUpRight, Calendar as CalendarIcon } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const getMergedTeamCount = (activeUser, fetchedMembers = []) => {
  if (typeof window === 'undefined') return 1;
  try {
    const customMembers = JSON.parse(localStorage.getItem('teamflow_custom_members') || '[]');
    const registeredUsers = JSON.parse(localStorage.getItem('teamflow_registered_users') || '[]');

    const memberMap = new Map();

    if (activeUser && activeUser.email) {
      memberMap.set(String(activeUser.email).toLowerCase(), activeUser);
    }
    registeredUsers.forEach(u => {
      if (u && u.email) {
        memberMap.set(String(u.email).toLowerCase(), u);
      }
    });
    customMembers.forEach(m => {
      if (m && m.email) {
        memberMap.set(String(m.email).toLowerCase(), m);
      }
    });

    if (fetchedMembers && fetchedMembers.length > 0) {
      fetchedMembers.forEach(m => {
        if (m && m.email && !m.email.includes('@abctechnologies.com')) {
          memberMap.set(String(m.email).toLowerCase(), m);
        }
      });
    }

    if (memberMap.size > 0) {
      return memberMap.size;
    }
  } catch (e) {}

  return 1;
};

export default function MainDashboard({ onOpenCreateTask }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = user?.name ? (user.name.split(' ')[0] || user.name) : 'there';

  const [stats, setStats] = useState({
    projects: { total: 12, active: 8, completed: 3 },
    tasks: { total: 120, completed: 45, in_progress: 35, pending: 32, overdue: 8 },
    due_soon: 8,
    team_online: 1
  });

  const getInitialTodos = () => {
    const defaultTodos = [
      { id: 1, title: 'Design homepage', project: 'E-Commerce Website', is_completed: false },
      { id: 2, title: 'Complete API integration', project: 'E-Commerce Website', is_completed: false },
      { id: 3, title: 'Create database schema', project: 'E-Commerce Website', is_completed: true },
      { id: 4, title: 'Prepare documentation', project: 'Design System Audit', is_completed: false },
      { id: 5, title: 'Wireframe v2 Upload', project: 'Mobile App Redesign', is_completed: false }
    ];
    if (typeof window === 'undefined') return defaultTodos;
    try {
      const customTasks = JSON.parse(localStorage.getItem('teamflow_custom_tasks') || '[]');
      const customTodos = customTasks.map(t => ({
        id: t.id,
        title: t.title,
        project: t.project || t.project_name || 'Project',
        is_completed: t.status === 'Completed'
      }));
      const customMap = new Set(customTodos.map(t => String(t.id)));
      const filteredDefaults = defaultTodos.filter(t => !customMap.has(String(t.id)));
      return [...customTodos, ...filteredDefaults];
    } catch (e) {
      return defaultTodos;
    }
  };

  const [myTodos, setMyTodos] = useState(() => getInitialTodos());

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, user: 'Rahul Kumar', action: 'completed "Login API"', time: '10 min ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: 2, user: 'Priya Sharma', action: 'uploaded design.pdf', time: '25 min ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: 3, user: 'Chandra Reddy', action: 'created "E-Commerce Website"', time: '1 hour ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    { id: 4, user: 'Suresh Babu', action: 'commented on Homepage UI', time: '2 hours ago', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' }
  ]);

  useEffect(() => {
    let currentTeamCount = getMergedTeamCount(user, []);
    setStats(prev => ({ ...prev, team_online: currentTeamCount }));

    api.get('/team/members')
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          const count = getMergedTeamCount(user, res.data);
          currentTeamCount = count;
          setStats(prev => ({ ...prev, team_online: count }));
        }
      })
      .catch(() => {});

    api.get('/reports/dashboard-stats')
      .then(res => {
        if (res.data) {
          setStats(prev => ({
            ...res.data,
            team_online: currentTeamCount
          }));
        }
      })
      .catch(() => {});

    const handleTaskCreated = (e) => {
      if (e.detail) {
        const newTask = e.detail;
        setMyTodos(prev => [{
          id: newTask.id,
          title: newTask.title,
          project: newTask.project || newTask.project_name || 'Project',
          is_completed: newTask.status === 'Completed'
        }, ...prev]);
        setStats(prev => ({
          ...prev,
          tasks: {
            ...prev.tasks,
            total: (prev.tasks?.total || 0) + 1,
            in_progress: newTask.status === 'In Progress' ? (prev.tasks?.in_progress || 0) + 1 : (prev.tasks?.in_progress || 0),
            pending: newTask.status === 'To Do' ? (prev.tasks?.pending || 0) + 1 : (prev.tasks?.pending || 0)
          }
        }));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('task-created', handleTaskCreated);
      return () => window.removeEventListener('task-created', handleTaskCreated);
    }
  }, []);

  const toggleTodo = (id) => {
    setMyTodos(prev => prev.map(t => t.id === id ? { ...t, is_completed: !t.is_completed } : t));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Good day, {userName}!</h1>
          <p className="text-blue-100 text-sm mt-1">Here is what is happening across your workspace today.</p>
        </div>
        <button
          onClick={onOpenCreateTask}
          className="px-4 py-2.5 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm transition shadow-md flex items-center gap-2"
        >
          <span>+ Add New Task</span>
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-atlas p-5 flex items-center justify-between cursor-pointer hover:border-blue-300" onClick={() => navigate('/projects')}>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projects</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.projects.total}</div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-1">{stats.projects.active} Active</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        <div className="card-atlas p-5 flex items-center justify-between cursor-pointer hover:border-blue-300" onClick={() => navigate('/tasks')}>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">To-dos</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.tasks.total}</div>
            <div className="text-[11px] font-semibold text-blue-600 mt-1">{stats.tasks.in_progress} In Progress</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="card-atlas p-5 flex items-center justify-between cursor-pointer hover:border-amber-300" onClick={() => navigate('/calendar')}>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Due Soon</div>
            <div className="text-3xl font-extrabold text-amber-600 mt-1">{stats.due_soon}</div>
            <div className="text-[11px] font-semibold text-amber-600 mt-1">This Week</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="card-atlas p-5 flex items-center justify-between cursor-pointer hover:border-emerald-300" onClick={() => navigate('/team')}>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Team Online</div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-1">{stats.team_online}</div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-1">🟢 Active Now</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-atlas p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-lg text-slate-900">My Work / My To-dos</h2>
                <p className="text-xs text-slate-500">Tasks assigned specifically to you across all active projects.</p>
              </div>
              <button onClick={() => navigate('/tasks')} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                <span>View All Tasks</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {myTodos.map((todo) => (
                <div
                  key={todo.id}
                  onClick={() => toggleTodo(todo.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    todo.is_completed
                      ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                      : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {todo.is_completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 shrink-0 hover:text-blue-500" />
                    )}
                    <span className="font-semibold text-sm">{todo.title}</span>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-500">
                    {todo.project}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-atlas p-6">
            <h2 className="font-bold text-lg text-slate-900 mb-4">Active Projects Overview</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-800">E-Commerce Website</span>
                  <span className="text-blue-600">75%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[75%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-800">Mobile App Redesign</span>
                  <span className="text-indigo-600">40%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-[40%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-800">Design System Audit</span>
                  <span className="text-emerald-600">90%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[90%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-atlas p-6">
            <h2 className="font-bold text-lg text-slate-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5">
                    {act.user ? act.user[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="text-slate-800 leading-snug">
                      <span className="font-bold text-slate-900">{act.user}</span> {act.action}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-atlas p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-slate-900">Upcoming</h2>
              <CalendarIcon className="w-4 h-4 text-blue-600" />
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                <div className="text-[11px] font-bold text-blue-600 uppercase">Today</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">API Architecture Review</div>
                <div className="text-xs text-slate-500 mt-0.5">10:00 AM - 11:30 AM</div>
              </div>

              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                <div className="text-[11px] font-bold text-purple-600 uppercase">Tomorrow</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">Team Sync & Planning</div>
                <div className="text-xs text-slate-500 mt-0.5">2:00 PM - 3:00 PM</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                <div className="text-[11px] font-bold text-amber-600 uppercase">Sep 27</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">Project Delivery Deadline</div>
                <div className="text-xs text-slate-500 mt-0.5">6:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
