import React, { useState } from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import {
  Users,
  UserCheck,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Mail,
  ArrowLeft,
  Search,
  Building2,
  Briefcase
} from 'lucide-react';

export default function TeamWorkloadView() {
  const { activeTab, teamMembers, projects, goBack } = useWorkOrbit();
  const [peopleSearch, setPeopleSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

  // ----------------------------------------------------
  // 1. RENDER PEOPLE VIEW (TEAM ROSTER)
  // ----------------------------------------------------
  if (activeTab === 'people') {
    const filteredMembers = teamMembers.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(peopleSearch.toLowerCase()) || m.role.toLowerCase().includes(peopleSearch.toLowerCase());
      const matchesDept = deptFilter === 'All' || m.department === deptFilter;
      return matchesSearch && matchesDept;
    });

    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 shadow-sm transition"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
              <span>Back</span>
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Employees Roster & Directory
              </h2>
              <p className="text-xs text-slate-500">Complete employee list, skills matrix, location, and individual task metrics</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold border border-blue-200">
              Total Members: {teamMembers.length}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
              Online Now: {teamMembers.filter(m => m.availability === 'Online').length}
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 flex-1 w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 ml-2" />
            <input
              type="text"
              placeholder="Search employees by name or role..."
              value={peopleSearch}
              onChange={(e) => setPeopleSearch(e.target.value)}
              className="w-full text-xs bg-transparent outline-none text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
            <span className="text-slate-500 font-medium">Department:</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
            </select>
          </div>
        </div>

        {/* Roster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMembers.map(member => (
            <div key={member.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-lg flex items-center justify-center shrink-0 border border-slate-200 shadow-xs">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      {member.name}
                      <span className={`w-2.5 h-2.5 rounded-full ${member.availability === 'Online' ? 'bg-emerald-500' : 'bg-amber-500'}`} title={member.availability}></span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{member.role}</p>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {member.location}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="font-mono font-bold text-slate-800">{member.hoursLoggedThisWeek} hrs</div>
                  <div className="text-[10px] text-slate-400">Logged this week</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center pt-3 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-900 font-mono text-base">{member.activeTasksCount}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Active Tasks</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="font-bold text-emerald-600 font-mono text-base">{member.completedTasksCount}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Completed</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="font-bold text-rose-600 font-mono text-base">{member.overdueTasksCount}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Overdue</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {member.skills.map(s => (
                  <span key={s} className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                    #{s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. RENDER TEAMS VIEW (DEPARTMENT STRUCTURE)
  // ----------------------------------------------------
  if (activeTab === 'teams') {
    const departments = [
      {
        name: 'Engineering & Technology',
        lead: 'Karthik Raja',
        leadInit: 'K',
        members: teamMembers.filter(m => m.department === 'Engineering'),
        projectsCount: 3,
        avgWorkload: 57,
        desc: 'Core architecture, Next.js storefront, React Native mobile apps, and cloud backend databases.'
      },
      {
        name: 'Product Design & UI/UX',
        lead: 'Priya Sharma',
        leadInit: 'P',
        members: teamMembers.filter(m => m.department === 'Design'),
        projectsCount: 3,
        avgWorkload: 94,
        desc: 'Design systems, Figma wireframes, user experience research, and asset creation.'
      },
      {
        name: 'DevOps & Infrastructure',
        lead: 'Suresh V',
        leadInit: 'S',
        members: teamMembers.filter(m => m.id === 'usr-4'),
        projectsCount: 1,
        avgWorkload: 40,
        desc: 'Database schema migration, Docker containerization, AWS cloud deployment, and API integrations.'
      }
    ];

    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 shadow-sm transition"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
              <span>Back</span>
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Department Teams & Structure
              </h2>
              <p className="text-xs text-slate-500">Organizational hierarchy, department leads, active projects, and team capacity</p>
            </div>
          </div>
        </div>

        {/* Department Teams List */}
        <div className="space-y-6">
          {departments.map(dept => (
            <div key={dept.name} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{dept.desc}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right text-xs">
                    <span className="text-slate-400 block text-[10px]">Average Workload</span>
                    <span className={`font-mono font-bold ${dept.avgWorkload >= 85 ? 'text-rose-600' : 'text-blue-600'}`}>
                      {dept.avgWorkload}%
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                    {dept.members.length} Members
                  </span>
                </div>
              </div>

              {/* Members inside Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {dept.members.map(m => (
                  <div key={m.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-slate-900 text-xs truncate flex items-center gap-1.5">
                        {m.name}
                        {m.name === dept.lead && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                            Lead
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{m.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. DEFAULT: RENDER WORKLOAD PLANNER VIEW
  // ----------------------------------------------------
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 shadow-sm transition"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
            <span>Back</span>
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Employee Workload & Capacity Planner
            </h2>
            <p className="text-xs text-slate-500">Resource allocation, daily capacity heatmaps, and overload detection for managers</p>
          </div>
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
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
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
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shrink-0 border border-slate-200">
                  {member.name.charAt(0).toUpperCase()}
                </div>
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
