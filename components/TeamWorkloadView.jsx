import React from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import { Users, BarChart3, AlertTriangle, CheckCircle2, Clock, MapPin, Mail, Sparkles } from 'lucide-react';

export default function TeamWorkloadView() {
  const { teamMembers } = useWorkOrbit();

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Employee Workload & Capacity Planner
          </h2>
          <p className="text-xs text-slate-500">Resource allocation, daily capacity heatmaps, and overload detection for managers</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200">
            ⚠ 1 Overload Detected (Priya 94%)
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
            ✓ 1 Available (Suresh 40%)
          </span>
        </div>
      </div>

      {/* Mon-Fri Capacity Grid Heatmap */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Weekly Daily Capacity Schedule</h3>
          <span className="text-xs text-slate-500 font-mono">Sep 28 - Oct 02, 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                <th className="p-3 w-48">Team Member</th>
                <th className="p-3">Role & Workload</th>
                {daysOfWeek.map(d => (
                  <th key={d} className="p-3 text-center w-24">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {teamMembers.map(m => {
                const isOverloaded = m.workload >= 85;

                return (
                  <tr key={m.id} className="hover:bg-slate-50 transition">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img src={m.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-slate-900">{m.name}</div>
                          <div className="text-[10px] text-slate-500">{m.department}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="space-y-1">
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>{m.role}</span>
                          <span className={isOverloaded ? 'text-rose-600' : 'text-blue-600'}>{m.workload}%</span>
                        </div>
                        <div className="w-36 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${isOverloaded ? 'bg-rose-500' : 'bg-blue-600'}`}
                            style={{ width: `${m.workload}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {m.dailyCapacity.map((cap, i) => (
                      <td key={i} className="p-3 text-center">
                        <div className={`p-2 rounded-lg font-mono font-bold text-xs ${
                          cap >= 90
                            ? 'bg-rose-500 text-white'
                            : cap >= 70
                            ? 'bg-blue-500 text-white'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {cap}%
                        </div>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roster Profiles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teamMembers.map(member => (
          <div key={member.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img src={member.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border border-slate-200" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    {member.name}
                    <span className={`w-2 h-2 rounded-full ${member.availability === 'Online' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  </h3>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="font-mono font-bold text-slate-800">{member.hoursLoggedThisWeek} hrs</div>
                <div className="text-[10px] text-slate-400">Logged this week</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center pt-3 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-2 rounded-xl">
                <div className="font-bold text-slate-900 font-mono text-base">{member.activeTasksCount}</div>
                <div className="text-[10px] text-slate-500">Active Tasks</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <div className="font-bold text-emerald-600 font-mono text-base">{member.completedTasksCount}</div>
                <div className="text-[10px] text-slate-500">Completed</div>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl">
                <div className="font-bold text-rose-600 font-mono text-base">{member.overdueTasksCount}</div>
                <div className="text-[10px] text-slate-500">Overdue</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              {member.skills.map(s => (
                <span key={s} className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-blue-50 text-blue-700">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
