import React, { useState } from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import {
  Building2,
  CheckCircle2,
  ShieldAlert,
  Link as LinkIcon,
  Plus,
  FileSpreadsheet,
  ThumbsUp,
  MessageCircle,
  Settings,
  Shield,
  CreditCard,
  Key,
  Users,
  Copy,
  Check,
  AlertCircle,
  Clock,
  Download,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function ClientPortalView() {
  const { activeTab, projects, teamMembers, tasks, addTask } = useWorkOrbit();

  // Client Portal State
  const [approvalStatus, setApprovalStatus] = useState('Pending Client Approval');
  const [clientComment, setClientComment] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Forms & Bug Reports State
  const [activeFormTab, setActiveFormTab] = useState('bug');
  const [bugTitle, setBugTitle] = useState('');
  const [bugCategory, setBugCategory] = useState('UI Bug');
  const [bugPriority, setBugPriority] = useState('High');
  const [bugDesc, setBugDesc] = useState('');
  const [submittedBugs, setSubmittedBugs] = useState([
    {
      id: 'BUG-101',
      title: 'Shopping cart fails to calculate tax on checkout',
      category: 'Payment Gateway',
      priority: 'Urgent',
      status: 'In Progress',
      assignee: 'Rahul Kumar',
      initial: 'R',
      bgColor: 'bg-blue-600',
      date: 'Today 11:30 AM'
    },
    {
      id: 'BUG-102',
      title: 'Mobile navigation drawer locks on iOS Safari',
      category: 'UI Bug',
      priority: 'High',
      status: 'Open',
      assignee: 'Priya Sharma',
      initial: 'P',
      bgColor: 'bg-purple-600',
      date: 'Yesterday'
    },
    {
      id: 'BUG-103',
      title: 'Database connection pool timeout during load test',
      category: 'Database error',
      priority: 'Medium',
      status: 'Resolved',
      assignee: 'Suresh V',
      initial: 'S',
      bgColor: 'bg-emerald-600',
      date: '2 days ago'
    }
  ]);

  // Workspace Settings State
  const [settingsTab, setSettingsTab] = useState('general');
  const [workspaceName, setWorkspaceName] = useState('ABC Technologies');
  const [timezone, setTimezone] = useState('UTC-5 (Eastern Time)');
  const [twoFactor, setTwoFactor] = useState(true);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  const ecomProj = projects.find((p) => p.id === 'proj-1') || projects[0] || { name: 'E-Commerce Website', progress: 74 };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleApprove = () => {
    setApprovalStatus('✓ Approved by Client');
  };

  const handleRequestChanges = () => {
    if (!clientComment) return;
    setApprovalStatus('⚠️ Changes Requested');
    addTask({
      title: `Client Feedback: ${clientComment}`,
      projectId: ecomProj.id,
      projectName: ecomProj.name,
      priority: 'Urgent',
      status: 'To Do',
      assignee: 'Priya Sharma'
    });
    setClientComment('');
  };

  const handleReportBug = (e) => {
    e.preventDefault();
    if (!bugTitle) return;

    const newBug = {
      id: `BUG-${100 + submittedBugs.length + 1}`,
      title: bugTitle,
      category: bugCategory,
      priority: bugPriority,
      status: 'Open',
      assignee: 'Rahul Kumar',
      initial: 'R',
      bgColor: 'bg-blue-600',
      date: 'Just Now'
    };

    setSubmittedBugs([newBug, ...submittedBugs]);
    addTask({
      title: `[${bugCategory}] ${bugTitle}`,
      description: bugDesc,
      projectId: ecomProj.id,
      projectName: ecomProj.name,
      priority: bugPriority,
      status: 'To Do',
      assignee: 'Rahul Kumar'
    });

    setBugTitle('');
    setBugDesc('');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  // -------------------------------------------------------------
  // 1. CLIENT PORTAL VIEW (id: client-portal)
  // -------------------------------------------------------------
  const renderClientPortalView = () => (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Client Portal & Public Approval Hub</h3>
              <p className="text-xs text-slate-300">Dedicated client-facing workspace with milestone approvals, file sharing, and project status transparency.</p>
            </div>
          </div>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition shrink-0"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <LinkIcon className="w-4 h-4" />}
            {copiedLink ? 'Link Copied!' : 'Copy Public Share Link'}
          </button>
        </div>
      </div>

      {/* Project Overview Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Client View: ABC Technologies</span>
            <h3 className="text-lg font-bold text-slate-900">{ecomProj.name || 'E-Commerce Website'} Progress: 74%</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Active Project
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: '74%' }}></div>
        </div>

        {/* Milestone Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs space-y-1">
            <div className="font-bold text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Milestone 1: Requirements
            </div>
            <p className="text-slate-600 text-[11px]">100% Completed • Approved by Client</p>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs space-y-1">
            <div className="font-bold text-amber-800 flex items-center gap-1">
              <Clock className="w-4 h-4 text-amber-600" /> Milestone 2: Figma Wireframes
            </div>
            <p className="text-slate-600 text-[11px]">90% Complete • Pending Final Signoff</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="font-bold text-slate-700 flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" /> Milestone 3: Payment Sandbox
            </div>
            <p className="text-slate-600 text-[11px]">In Progress • Target: Oct 12</p>
          </div>
        </div>
      </div>

      {/* Interactive Approval Deliverables Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Homepage Wireframe Deliverable Approval</h3>
          <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
            approvalStatus.includes('Approved') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {approvalStatus}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Please review the interactive Figma wireframes and click <span className="font-bold text-slate-800">Approve Deliverable</span> or submit feedback changes below.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            onClick={handleApprove}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 shrink-0"
          >
            <ThumbsUp className="w-4 h-4" /> Approve Deliverable
          </button>

          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              placeholder="Write feedback e.g., 'Change hero banner image to blue theme'"
              value={clientComment}
              onChange={(e) => setClientComment(e.target.value)}
              className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 outline-none focus:border-blue-500"
            />
            <button
              onClick={handleRequestChanges}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition shrink-0"
            >
              Request Changes
            </button>
          </div>
        </div>
      </div>

      {/* Shared Client Vault Files */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Shared Deliverables & Shared Documents</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">PDF</div>
              <div>
                <div className="font-bold text-slate-900">System_Architecture_V2.pdf</div>
                <div className="text-[11px] text-slate-400">2.4 MB • Uploaded Sep 26</div>
              </div>
            </div>
            <button className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition">
              <Download className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">FIG</div>
              <div>
                <div className="font-bold text-slate-900">Homepage_UI_Wireframes_Export.fig</div>
                <div className="text-[11px] text-slate-400">14.8 MB • Uploaded Sep 28</div>
              </div>
            </div>
            <button className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // 2. FORMS & BUG REPORTS VIEW (id: forms)
  // -------------------------------------------------------------
  const renderFormsView = () => (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Forms & Bug Reports Center</h3>
              <p className="text-xs text-slate-300">Collect client intake requests, track software bug submissions, and automatically route issues to developers.</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition">
            <Plus className="w-4 h-4" /> Create Custom Form
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Forms</div>
            <div className="text-lg font-bold text-white mt-0.5">4 Forms</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-rose-400 uppercase font-semibold">Open Bugs</div>
            <div className="text-lg font-bold text-rose-400 mt-0.5">{submittedBugs.filter(b => b.status !== 'Resolved').length} Open</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-emerald-400 uppercase font-semibold">Resolved Bugs</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">{submittedBugs.filter(b => b.status === 'Resolved').length} Solved</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-indigo-400 uppercase font-semibold">Avg Resolution</div>
            <div className="text-lg font-bold text-indigo-300 mt-0.5">4.2 Hours</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Generator & Submissions List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Submitter */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" />
              Submit Bug / Intake Request
            </h4>
          </div>

          <form onSubmit={handleReportBug} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Issue / Bug Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Shopping cart fails to calculate tax on checkout"
                value={bugTitle}
                onChange={(e) => setBugTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={bugCategory}
                  onChange={(e) => setBugCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-none focus:border-indigo-500 font-medium bg-white"
                >
                  <option value="UI Bug">UI Bug</option>
                  <option value="Payment Gateway">Payment Gateway</option>
                  <option value="Database error">Database Error</option>
                  <option value="API Failure">API Failure</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Priority</label>
                <select
                  value={bugPriority}
                  onChange={(e) => setBugPriority(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-none focus:border-indigo-500 font-medium bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Description & Steps</label>
              <textarea
                rows="3"
                placeholder="Provide reproduction steps..."
                value={bugDesc}
                onChange={(e) => setBugDesc(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-none focus:border-indigo-500 font-medium"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" /> Submit to WorkOrbit Tasks
            </button>
          </form>
        </div>

        {/* Right Column: Submitted Bugs Queue */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm">Reported Issues & Bug Queue</h4>
            <span className="text-xs text-slate-400 font-medium">{submittedBugs.length} Total Submissions</span>
          </div>

          <div className="space-y-3">
            {submittedBugs.map((bug) => (
              <div key={bug.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-200">
                      {bug.id}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">{bug.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    bug.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : bug.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {bug.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <div className="flex items-center gap-3">
                    <span>Category: <strong className="text-slate-700">{bug.category}</strong></span>
                    <span>Priority: <strong className={bug.priority === 'Urgent' ? 'text-rose-600 font-bold' : 'text-slate-700'}>{bug.priority}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full ${bug.bgColor} text-white font-bold text-[10px] flex items-center justify-center`}>
                      {bug.initial}
                    </div>
                    <span className="text-slate-700 font-medium">{bug.assignee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // 3. SETTINGS & WORKSPACE VIEW (id: settings)
  // -------------------------------------------------------------
  const renderSettingsView = () => (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Workspace & Global Settings</h3>
              <p className="text-xs text-slate-300">Manage organization credentials, subscription plan, team security permissions, and API tokens.</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
            Enterprise Plan Active
          </span>
        </div>
      </div>

      {/* Settings Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setSettingsTab('general')}
          className={`px-4 py-2 rounded-xl transition ${
            settingsTab === 'general' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          General Workspace
        </button>
        <button
          onClick={() => setSettingsTab('roles')}
          className={`px-4 py-2 rounded-xl transition ${
            settingsTab === 'roles' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Roles & Permissions
        </button>
        <button
          onClick={() => setSettingsTab('billing')}
          className={`px-4 py-2 rounded-xl transition ${
            settingsTab === 'billing' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Billing & Subscription
        </button>
        <button
          onClick={() => setSettingsTab('api')}
          className={`px-4 py-2 rounded-xl transition ${
            settingsTab === 'api' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          API & Security
        </button>
      </div>

      {/* Save Notification */}
      {savedSettingsNotice && (
        <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Workspace settings saved successfully!
        </div>
      )}

      {/* Tab 1: General Workspace */}
      {settingsTab === 'general' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 max-w-2xl">
          <h4 className="font-bold text-slate-900 text-sm">Workspace Profile</h4>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Workspace Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Organization Domain</label>
              <input
                type="text"
                disabled
                value="abctechnologies.workorbit.com"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Primary Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 outline-none focus:border-blue-500 font-medium bg-white"
              >
                <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                <option value="UTC+0 (GMT/London)">UTC+0 (GMT/London)</option>
                <option value="UTC+5:30 (India Standard Time)">UTC+5:30 (India Standard Time)</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
            >
              Save General Changes
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Roles & Permissions */}
      {settingsTab === 'roles' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm">Team Roles & Access Control List</h4>
            <span className="text-xs text-slate-400">4 Active Workspace Users</span>
          </div>

          <div className="space-y-3">
            {/* User 1 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  M
                </div>
                <div>
                  <div className="font-bold text-slate-900">muni</div>
                  <div className="text-[11px] text-slate-400">muni@abctechnologies.com</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                Workspace Admin
              </span>
            </div>

            {/* User 2 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                  R
                </div>
                <div>
                  <div className="font-bold text-slate-900">Rahul Kumar</div>
                  <div className="text-[11px] text-slate-400">rahul@abctechnologies.com</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-200 text-slate-800 font-bold text-[10px]">
                Senior Developer
              </span>
            </div>

            {/* User 3 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-600 text-white font-bold text-xs flex items-center justify-center">
                  P
                </div>
                <div>
                  <div className="font-bold text-slate-900">Priya Sharma</div>
                  <div className="text-[11px] text-slate-400">priya@abctechnologies.com</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-200 text-slate-800 font-bold text-[10px]">
                Lead UI Designer
              </span>
            </div>

            {/* User 4 */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  S
                </div>
                <div>
                  <div className="font-bold text-slate-900">Suresh V</div>
                  <div className="text-[11px] text-slate-400">suresh@abctechnologies.com</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-200 text-slate-800 font-bold text-[10px]">
                QA Engineer
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Billing & Subscription */}
      {settingsTab === 'billing' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 max-w-2xl">
          <h4 className="font-bold text-slate-900 text-sm">Subscription & Billing Overview</h4>

          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">Enterprise Plan</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20">ANNUAL BILLING</span>
            </div>
            <div className="text-2xl font-bold">$299 / month</div>
            <p className="text-xs text-blue-100">Unlimited workspaces, custom client portals, and AI Meeting Transcriber.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Next Renewal Date</span>
              <span className="font-semibold text-slate-600">October 15, 2026</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Payment Method</span>
              <span className="font-semibold text-slate-600">Visa ending in •••• 4242</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: API & Security */}
      {settingsTab === 'api' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 max-w-2xl">
          <h4 className="font-bold text-slate-900 text-sm">API Tokens & Security Controls</h4>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <div className="font-bold text-slate-900">Enforce 2-Factor Authentication (2FA)</div>
              <div className="text-[11px] text-slate-500">Require all workspace admins to authenticate with 2FA</div>
            </div>
            <button
              onClick={() => setTwoFactor(!twoFactor)}
              className={`w-11 h-6 rounded-full transition-colors relative ${twoFactor ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${twoFactor ? 'left-6' : 'left-1'}`}></div>
            </button>
          </div>

          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-800">Active API Token</div>
            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs flex items-center justify-between">
              <span>wk_live_9f82a731...489c</span>
              <button onClick={handleCopyLink} className="text-blue-400 font-bold hover:underline text-[11px]">
                Copy Secret Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------------
  // MAIN RENDER SWITCH
  // -------------------------------------------------------------
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            {activeTab === 'forms' ? (
              <>
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                Forms & Bug Tracker
              </>
            ) : activeTab === 'settings' ? (
              <>
                <Settings className="w-5 h-5 text-slate-700" />
                Workspace Settings
              </>
            ) : (
              <>
                <Building2 className="w-5 h-5 text-blue-600" />
                Client Portal & Approval Workflow
              </>
            )}
          </h2>
          <p className="text-xs text-slate-500">
            {activeTab === 'forms'
              ? 'Intake forms, issue collection, and automated developer bug reporting queue'
              : activeTab === 'settings'
              ? 'Global workspace configuration, team access roles, billing, and API tokens'
              : 'Dedicated external client interface with granular visibility controls and approval triggers'}
          </p>
        </div>
      </div>

      {/* Render selected view */}
      {activeTab === 'forms' && renderFormsView()}
      {activeTab === 'settings' && renderSettingsView()}
      {(activeTab === 'client-portal' || (!activeTab.includes('forms') && !activeTab.includes('settings'))) && renderClientPortalView()}
    </div>
  );
}
