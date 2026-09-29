import React from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Video,
  Users,
  Flame,
  AlertCircle,
  ArrowRight,
  Sparkles,
  DollarSign,
  Briefcase
} from 'lucide-react';

export default function DashboardView() {
  const { user } = useAuth();
  const { projects, tasks, teamMembers, meetings, setActiveTab, setSelectedTaskId, setSelectedProjectId } = useWorkOrbit();

  const userName = user?.name ? user.name.split(' ')[0] : 'muni';

  // Metrics calculation
  const totalProjects = projects.length;
  const healthyProjectsCount = projects.filter(p => p.health === 'Healthy').length;
  const atRiskProjectsCount = projects.filter(p => p.health === 'At Risk').length;
  const delayedProjectsCount = projects.filter(p => p.health === 'Delayed').length;

  const overdueTasks = tasks.filter(t => t.dueDate === '2026-09-28' || t.status === 'Blocked');
  const todayTasks = tasks.filter(t => t.dueDate === '2026-09-29');
  const urgentTasks = tasks.filter(t => t.priority === 'Urgent');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner with Executive Summary */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/30 text-blue-300 border border-blue-400/30">
                WorkOrbit 2026 Dashboard
              </span>
              <span className="text-slate-400 text-xs">ABC Technologies Workspace</span>
            </div>
            <h2 className="text-2xl font-black text-white">Welcome back, {userName}!</h2>
            <p className="text-slate-300 text-xs mt-1 max-w-xl">
              Here is your project health overview, team workload metrics, and priority task radar for today.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('project-insights')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-lg shadow-blue-600/30"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Run AI Risk Analysis</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="text-[11px] text-slate-400 font-medium">Active Projects</div>
            <div className="text-xl font-bold text-white mt-1 flex items-baseline justify-between">
              <span>{totalProjects}</span>
              <span className="text-xs text-emerald-400 font-normal">🟢 {healthyProjectsCount} Healthy</span>
            </div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="text-[11px] text-slate-400 font-medium">Projects at Risk</div>
            <div className="text-xl font-bold text-amber-400 mt-1 flex items-baseline justify-between">
              <span>{atRiskProjectsCount + delayedProjectsCount}</span>
              <span className="text-xs text-rose-400 font-normal">🔴 {delayedProjectsCount} Delayed</span>
            </div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="text-[11px] text-slate-400 font-medium">Overdue & Blocked Tasks</div>
            <div className="text-xl font-bold text-rose-400 mt-1 flex items-baseline justify-between">
              <span>{overdueTasks.length}</span>
              <span className="text-xs text-slate-400 font-normal">Action Required</span>
            </div>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
            <div className="text-[11px] text-slate-400 font-medium">Total Portfolio Profit</div>
            <div className="text-xl font-bold text-emerald-400 mt-1 flex items-baseline justify-between">
              <span>₹12,45,000</span>
              <span className="text-xs text-emerald-400 font-normal">Margin 36%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout for Roadmap Sections 1.A, 1.B, 1.C, 1.D */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* SECTION A: Project Health Widget */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Project Health Radar
              </h3>
              <p className="text-xs text-slate-500">Auto-calculated using task velocity, workload, and deadlines</p>
            </div>
            <button
              onClick={() => setActiveTab('all-projects')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All ({projects.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {projects.map(proj => {
              const isHealthy = proj.health === 'Healthy';
              const isAtRisk = proj.health === 'At Risk';
              const isDelayed = proj.health === 'Delayed';

              return (
                <div
                  key={proj.id}
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    setActiveTab('all-projects');
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition cursor-pointer bg-slate-50/50 hover:bg-white"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{proj.logo}</span>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          {proj.name}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isHealthy
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                              : isAtRisk
                              ? 'bg-amber-100 text-amber-700 border border-amber-300'
                              : 'bg-rose-100 text-rose-700 border border-rose-300'
                          }`}>
                            {isHealthy ? '🟢 Healthy' : isAtRisk ? '🟡 At Risk' : '🔴 Delayed'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Client: <span className="font-medium text-slate-700">{proj.client}</span> • Deadline: <span className="font-medium text-slate-700">{proj.deadline}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-800">{proj.completion}% Completed</div>
                      <div className="w-28 bg-slate-200 rounded-full h-2 mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isHealthy ? 'bg-emerald-500' : isAtRisk ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${proj.completion}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {proj.healthReason && (
                    <div className="mt-2 text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/60 flex items-center justify-between">
                      <span className="truncate">⚠️ {proj.healthReason}</span>
                      <span className="text-[10px] font-bold text-blue-600 shrink-0 ml-2">Manager: {proj.projectManager}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION B: Today's Focus Widget */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              Today&apos;s Focus
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
              High Priority
            </span>
          </div>

          <div className="space-y-3">
            {todayTasks.concat(urgentTasks).slice(0, 4).map(task => (
              <div
                key={task.id}
                onClick={() => {
                  setSelectedTaskId(task.id);
                  setActiveTab('my-tasks');
                }}
                className="p-3 rounded-xl border border-slate-200 hover:border-amber-400 bg-amber-50/20 hover:bg-amber-50/40 transition cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      {task.projectName}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs mt-1 line-clamp-1">{task.title}</h4>
                  </div>
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                    task.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <img src={task.assigneeAvatar} alt="" className="w-4 h-4 rounded-full" />
                    <span>{task.assigneeName}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-slate-700">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{task.actualHours}h / {task.estimatedHours}h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION C: Upcoming Meetings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Video className="w-4 h-4 text-indigo-600" />
              Upcoming Meetings
            </h3>
            <span className="text-xs text-indigo-600 font-semibold">{meetings.length} Scheduled</span>
          </div>

          <div className="space-y-3">
            {meetings.map(m => (
              <div key={m.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono font-bold text-indigo-600">{m.time}</div>
                  <div className="font-bold text-slate-900 text-xs mt-0.5">{m.title}</div>
                  <div className="text-[10px] text-slate-500">{m.project}</div>
                </div>
                <a
                  href={m.link}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm shrink-0"
                >
                  Join Meeting
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION D: Team Workload Visualizer */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Team Workload Planner
              </h3>
              <p className="text-xs text-slate-500">Live capacity analysis across active tasks</p>
            </div>
            <button
              onClick={() => setActiveTab('workload')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Detailed Planner <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamMembers.map(member => {
              const isOverloaded = member.workload >= 85;
              const hasCapacity = member.workload <= 50;

              return (
                <div key={member.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{member.name}</div>
                        <div className="text-[10px] text-slate-500">{member.role}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isOverloaded
                        ? 'bg-rose-100 text-rose-700 border border-rose-300'
                        : hasCapacity
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {isOverloaded ? '⚠ Overloaded' : hasCapacity ? 'Capacity Available' : 'Normal'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-medium text-slate-700">
                      <span>Capacity Allocation</span>
                      <span className="font-bold font-mono">{member.workload}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isOverloaded ? 'bg-rose-500' : hasCapacity ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{ width: `${member.workload}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
