import React, { useState } from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import { Building2, CheckCircle2, ShieldAlert, Link as LinkIcon, Plus, FileSpreadsheet, ThumbsUp, MessageCircle } from 'lucide-react';

export default function ClientPortalView() {
  const { projects, addTask } = useWorkOrbit();
  const [approvalStatus, setApprovalStatus] = useState('Pending Client Approval');
  const [clientComment, setClientComment] = useState('');
  const [bugTitle, setBugTitle] = useState('');
  const [bugDesc, setBugDesc] = useState('');

  const ecomProj = projects.find(p => p.id === 'proj-1') || projects[0];

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
      status: 'Todo',
      assigneeName: 'Priya Sharma',
      assigneeAvatar: '',
      type: 'Bug'
    });
    setClientComment('');
  };

  const handleReportBug = (e) => {
    e.preventDefault();
    if (!bugTitle) return;
    addTask({
      title: `[Bug Report] ${bugTitle}`,
      description: bugDesc,
      projectId: ecomProj.id,
      projectName: ecomProj.name,
      priority: 'High',
      status: 'In Progress',
      assigneeName: 'Rahul Kumar',
      assigneeAvatar: '',
      type: 'Bug'
    });
    setBugTitle('');
    setBugDesc('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Client Portal & Approval Workflow
          </h2>
          <p className="text-xs text-slate-500">Dedicated external client interface with granular visibility controls and approval triggers</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
          <span>Public Link: workorbit.com/status/abc123</span>
        </div>
      </div>

      {/* Client Overview Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase">ABC Technologies Portal</span>
            <h3 className="text-lg font-bold text-slate-900">{ecomProj.name} Progress: 74%</h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
            🟢 Active Project
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div className="bg-blue-600 h-full rounded-full" style={{ width: '74%' }}></div>
        </div>
      </div>

      {/* Approval Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Homepage Wireframe Deliverable Approval</h3>
          <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
            approvalStatus.includes('Approved') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {approvalStatus}
          </span>
        </div>

        <p className="text-xs text-slate-600">Please review the interactive Figma wireframes and click Approve or Request Changes below.</p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleApprove}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <ThumbsUp className="w-4 h-4" /> Approve Deliverable
          </button>

          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              placeholder="Write feedback e.g., 'Change hero banner image to blue theme'"
              value={clientComment}
              onChange={(e) => setClientComment(e.target.value)}
              className="flex-1 text-xs p-2 rounded-lg border border-slate-300 outline-none"
            />
            <button
              onClick={handleRequestChanges}
              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm"
            >
              Request Changes
            </button>
          </div>
        </div>
      </div>

      {/* Forms & Bug Tracker Submission */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-blue-600" />
          Client Intake / Bug Report Form Generator
        </h3>

        <form onSubmit={handleReportBug} className="space-y-3 max-w-xl">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Issue / Bug Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Shopping cart fails to calculate tax on checkout"
              value={bugTitle}
              onChange={(e) => setBugTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Description & Reproduction Steps</label>
            <textarea
              rows="3"
              placeholder="Provide exact details..."
              value={bugDesc}
              onChange={(e) => setBugDesc(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm"
          >
            Submit Bug Task
          </button>
        </form>
      </div>
    </div>
  );
}
