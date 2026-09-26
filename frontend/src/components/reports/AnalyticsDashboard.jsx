import React from 'react';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function AnalyticsDashboard() {
  const workload = [
    { name: 'Chandra Reddy', percentage: 85, tasks: 12, color: 'bg-blue-600' },
    { name: 'Rahul Kumar', percentage: 65, tasks: 10, color: 'bg-indigo-600' },
    { name: 'Priya Sharma', percentage: 50, tasks: 8, color: 'bg-emerald-600' },
    { name: 'Suresh Babu', percentage: 40, tasks: 6, color: 'bg-amber-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 font-extrabold flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reports & Analytics</h1>
            <p className="text-xs text-slate-500 mt-0.5">Real-time productivity insights, task completion metrics, and team workload capacity.</p>
          </div>
        </div>
      </div>

      {/* Overview Metric Blocks (Requirement 16 format) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Project Progress */}
        <div className="card-atlas p-6 space-y-3">
          <h2 className="font-bold text-base text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
            <span>Project Progress</span>
            <span className="text-xs text-blue-600 font-bold">12 Total</span>
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600 font-medium">Total Projects</span>
              <span className="font-bold text-slate-900">12</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600 font-medium">Active Projects</span>
              <span className="font-bold text-blue-600">8</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600 font-medium">Completed Projects</span>
              <span className="font-bold text-emerald-600">3</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600 font-medium">Overdue Projects</span>
              <span className="font-bold text-red-600">1</span>
            </div>
          </div>
        </div>

        {/* Tasks Breakdown */}
        <div className="card-atlas p-6 space-y-3">
          <h2 className="font-bold text-base text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
            <span>Tasks Breakdown</span>
            <span className="text-xs text-indigo-600 font-bold">205 Total</span>
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600 font-medium">Completed</span>
              <span className="font-bold text-emerald-600">120</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600 font-medium">In Progress</span>
              <span className="font-bold text-blue-600">35</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600 font-medium">Pending</span>
              <span className="font-bold text-amber-600">42</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600 font-medium">Overdue</span>
              <span className="font-bold text-red-600">8</span>
            </div>
          </div>
        </div>

        {/* Time Tracking Summary */}
        <div className="card-atlas p-6 space-y-3">
          <h2 className="font-bold text-base text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
            <span>Time Tracking</span>
            <span className="text-xs text-amber-600 font-bold">This Month</span>
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600 font-medium">Estimated Time</span>
              <span className="font-bold text-slate-900">320 Hours</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-600 font-medium">Tracked Duration</span>
              <span className="font-bold text-blue-600">245h 40m</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600 font-medium">Productivity Rate</span>
              <span className="font-bold text-emerald-600">92%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Workload Bars (Requirement 16 format) */}
      <div className="card-atlas p-6">
        <h2 className="font-bold text-lg text-slate-900 mb-6">Team Workload Capacity</h2>
        <div className="space-y-5">
          {workload.map((w, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-800">{w.name} ({w.tasks} tasks)</span>
                <span className="text-blue-600">{w.percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  className={`${w.color} h-full rounded-full transition-all duration-700`}
                  style={{ width: `${w.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
