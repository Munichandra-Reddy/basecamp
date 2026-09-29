import React, { useState } from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import { LineChart, PieChart, Target, DollarSign, TrendingUp, Users, Award, ShieldCheck } from 'lucide-react';

export default function InsightsView() {
  const { projects, teamMembers, goals } = useWorkOrbit();
  const [insightTab, setInsightTab] = useState('reports'); // reports, goals, finance

  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const totalRevenue = projects.reduce((acc, p) => acc + p.revenue, 0);
  const totalProfit = totalRevenue - totalSpent;
  const marginPercentage = Math.round((totalProfit / totalRevenue) * 100);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-600" />
            Insights, OKRs & Financial Margin
          </h2>
          <p className="text-xs text-slate-500">Executive analytics, team velocity, project profitability, and OKR tracker</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setInsightTab('reports')}
            className={`px-3 py-1.5 rounded-lg transition ${insightTab === 'reports' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
          >
            📊 Reports & Velocity
          </button>
          <button
            onClick={() => setInsightTab('finance')}
            className={`px-3 py-1.5 rounded-lg transition ${insightTab === 'finance' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
          >
            💰 Financials & Profit
          </button>
          <button
            onClick={() => setInsightTab('goals')}
            className={`px-3 py-1.5 rounded-lg transition ${insightTab === 'goals' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'}`}
          >
            🎯 Company Goals / OKRs
          </button>
        </div>
      </div>

      {/* RENDER REPORTS */}
      {insightTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs font-semibold text-slate-500">Average On-Time Completion</div>
              <div className="text-2xl font-black text-slate-900 font-mono">82%</div>
              <div className="text-[11px] text-emerald-600 font-semibold">+4% vs last month</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs font-semibold text-slate-500">Sprint Velocity (Tasks / Week)</div>
              <div className="text-2xl font-black text-slate-900 font-mono">24 Tasks</div>
              <div className="text-[11px] text-blue-600 font-semibold">Peak efficiency</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="text-xs font-semibold text-slate-500">Active Blocked Bottlenecks</div>
              <div className="text-2xl font-black text-amber-500 font-mono">3 Issues</div>
              <div className="text-[11px] text-slate-500">Stripe API & Wireframe approval</div>
            </div>
          </div>

          {/* Team Performance Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Team Member Performance Breakdown</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                  <th className="p-3">Member</th>
                  <th className="p-3">Department</th>
                  <th className="p-3 text-center">Completed Tasks</th>
                  <th className="p-3 text-center">Overdue Tasks</th>
                  <th className="p-3 text-right">Hours Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {teamMembers.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {m.name ? m.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span>{m.name}</span>
                    </td>
                    <td className="p-3 text-slate-600">{m.department}</td>
                    <td className="p-3 text-center font-bold text-emerald-600 font-mono">{m.completedTasksCount}</td>
                    <td className="p-3 text-center font-bold text-rose-600 font-mono">{m.overdueTasksCount}</td>
                    <td className="p-3 text-right font-mono font-semibold">{m.hoursLoggedThisWeek}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RENDER FINANCIALS */}
      {insightTab === 'finance' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl space-y-4">
            <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Project Portfolio Profitability</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                <div className="text-[11px] text-slate-400">Total Contract Value</div>
                <div className="text-xl font-black text-white font-mono mt-1">₹{totalRevenue.toLocaleString()}</div>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                <div className="text-[11px] text-slate-400">Total Expenses & Spent</div>
                <div className="text-xl font-black text-slate-300 font-mono mt-1">₹{totalSpent.toLocaleString()}</div>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                <div className="text-[11px] text-slate-400">Net Profit</div>
                <div className="text-xl font-black text-emerald-400 font-mono mt-1">₹{totalProfit.toLocaleString()}</div>
              </div>
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
                <div className="text-[11px] text-slate-400">Profit Margin</div>
                <div className="text-xl font-black text-emerald-400 font-mono mt-1">{marginPercentage}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER GOALS / OKRs */}
      {insightTab === 'goals' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Company Q4 OKRs & Strategic Goals</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {goals.map(g => (
              <div key={g.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                    {g.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{g.deadline}</span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{g.title}</h4>

                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700 font-mono">
                    <span>Target: {g.target}</span>
                    <span className="text-blue-600">{g.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${g.percentage}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
