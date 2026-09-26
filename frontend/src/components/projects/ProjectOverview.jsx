import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, MessageSquare, Calendar, FileText, Users, CheckCircle2, Clock, Activity, Flag } from 'lucide-react';
import TaskKanbanBoard from '../tasks/TaskKanbanBoard';
import ProjectChatRoom from '../chat/ProjectChatRoom';
import ScheduleCalendar from '../calendar/ScheduleCalendar';
import FileManager from '../files/FileManager';
import TeamDirectory from '../team/TeamDirectory';
import api from '../../services/api';

export default function ProjectOverview({ onOpenCreateTask }) {
  const { id } = useParams();
  const projectId = id || 1;

  const [activeTab, setActiveTab] = useState('Overview');
  const [project, setProject] = useState({
    id: 1,
    name: 'E-Commerce Website',
    description: 'Full-stack online store with payment gateway and product management.',
    owner_name: 'Rahul Kumar',
    start_date: 'Sep 01, 2026',
    due_date: 'Oct 30, 2026',
    status: 'Active',
    progress: 75,
    taskStats: { completed: 45, remaining: 15, total: 60 }
  });

  const [activity, setActivity] = useState([
    { id: 1, text: 'Rahul completed API Integration', time: '10 min ago' },
    { id: 2, text: 'Priya uploaded homepage design', time: '1 hour ago' },
    { id: 3, text: 'Chandra created testing task', time: '3 hours ago' }
  ]);

  useEffect(() => {
    api.get(`/projects/${projectId}`)
      .then(res => {
        if (res.data) setProject(res.data);
      })
      .catch(() => {});
  }, [projectId]);

  const tabs = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'To-dos', icon: CheckSquare },
    { label: 'Chat', icon: MessageSquare },
    { label: 'Schedule', icon: Calendar },
    { label: 'Files', icon: FileText },
    { label: 'People', icon: Users }
  ];

  return (
    <div className="space-y-6">
      {/* Project Title Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-extrabold bg-blue-50 text-blue-600 rounded">
                {project.status}
              </span>
              <span className="text-xs text-slate-400">Due {project.due_date}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">{project.name}</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">{project.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCreateTask}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-sm"
            >
              + Add Task
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Requirement 6 format) */}
        <div className="flex items-center gap-1 border-t border-slate-100 pt-4 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.label;
            return (
              <button
                key={t.label}
                onClick={() => setActiveTab(t.label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Rendering */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info & Progress (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Card (Requirement 6 Format) */}
            <div className="card-atlas p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-slate-900">Project Progress</h3>
                <span className="font-extrabold text-blue-600 text-lg">{project.progress}%</span>
              </div>

              {/* Visual Progress Bar (Requirement 6: ██████████████░░░░ 75%) */}
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900">{project.taskStats?.completed || 45}</div>
                    <div className="text-xs font-semibold text-emerald-700">Completed Tasks</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-3">
                  <Clock className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900">{project.taskStats?.remaining || 15}</div>
                    <div className="text-xs font-semibold text-blue-700">Remaining Tasks</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestones Stepper */}
            <div className="card-atlas p-6">
              <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
                <Flag className="w-4 h-4 text-blue-600" />
                <span>Project Milestones</span>
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <div className="font-bold text-sm text-slate-900">Planning & Architecture</div>
                      <div className="text-[11px] text-slate-400">Due Sep 05 • 100% Completed</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Done</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <div>
                      <div className="font-bold text-sm text-slate-900">UI/UX Wireframes</div>
                      <div className="text-[11px] text-slate-400">Due Sep 15 • 100% Completed</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">Done</span>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/40 border border-blue-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">Beta Release Candidate</div>
                      <div className="text-[11px] text-blue-600">Due Oct 15 • 65% Progress</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2.5 py-1 rounded-md">In Progress</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Info & Activity (1 col) */}
          <div className="space-y-6">
            {/* Project Details Box */}
            <div className="card-atlas p-6 space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">Project Details</h3>
              <div className="flex justify-between">
                <span className="text-slate-400">Owner</span>
                <span className="font-bold text-slate-800">{project.owner_name || 'Rahul Kumar'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Start Date</span>
                <span className="font-semibold text-slate-800">{project.start_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Deadline</span>
                <span className="font-semibold text-slate-800">{project.due_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="font-bold text-blue-600">{project.status}</span>
              </div>
            </div>

            {/* Recent Activity Stream */}
            <div className="card-atlas p-6">
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Recent Activity</span>
              </h3>
              <div className="space-y-3">
                {activity.map((a) => (
                  <div key={a.id} className="text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="font-semibold text-slate-800">{a.text}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'To-dos' && <TaskKanbanBoard onOpenCreateTask={onOpenCreateTask} />}
      {activeTab === 'Chat' && <ProjectChatRoom projectId={projectId} />}
      {activeTab === 'Schedule' && <ScheduleCalendar />}
      {activeTab === 'Files' && <FileManager projectId={projectId} />}
      {activeTab === 'People' && <TeamDirectory />}
    </div>
  );
}
