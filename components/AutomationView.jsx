import React, { useState } from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import { Zap, Plus, CheckCircle2, MessageSquare, Mail, Globe, Code, Key, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AutomationView() {
  const { automations, addAutomationRule } = useWorkOrbit();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerInput, setTriggerInput] = useState('WHEN Task becomes Overdue');
  const [actionInput, setActionInput] = useState('Notify Assignee & Set Priority to Urgent');
  const [ruleName, setRuleName] = useState('');

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!ruleName) return;
    addAutomationRule({
      name: ruleName,
      trigger: triggerInput,
      action: actionInput
    });
    setRuleName('');
    setIsModalOpen(false);
  };

  const integrations = [
    { name: 'WhatsApp Business API', category: 'Messaging', desc: 'Send automatic WhatsApp task dispatch notifications to team members.', status: 'Connected', icon: '💬' },
    { name: 'GitHub / GitLab Webhooks', category: 'Developer', desc: 'Auto-close tasks when git commits mention issue numbers.', status: 'Connected', icon: '🐙' },
    { name: 'Google Calendar & Outlook', category: 'Calendar', desc: 'Sync project deadlines and meetings with your Google Calendar.', status: 'Connected', icon: '📅' },
    { name: 'Stripe Payments', category: 'Finance', desc: 'Automatically generate invoices when client milestones are approved.', status: 'Connected', icon: '💳' },
    { name: 'n8n & Zapier', category: 'Automation', desc: 'Trigger 5,000+ app workflows via custom webhooks.', status: 'Available', icon: '⚡' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            WorkOrbit Automation Engine & Integrations
          </h2>
          <p className="text-xs text-slate-500">Configure IF → THEN rules, WhatsApp dispatch, webhooks, and third-party tools</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Automation Rule
        </button>
      </div>

      {/* Active Rules Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Active Automation Rules ({automations.length})</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {automations.map(aut => (
            <div key={aut.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  {aut.name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                  {aut.status}
                </span>
              </div>

              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div className="font-mono font-bold text-slate-700">{aut.trigger}</div>
                <div className="text-slate-500 font-bold flex items-center gap-1">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                  {aut.action}
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono text-right">
                Executed {aut.runsCount} times automatically
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations Marketplace */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="font-bold text-slate-900 text-sm">Integrations Hub & WhatsApp API</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {integrations.map(integ => (
            <div key={integ.name} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl">{integ.icon}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  integ.status === 'Connected' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {integ.status}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">{integ.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{integ.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Add Automation Rule</h3>
            <form onSubmit={handleCreateRule} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Notify Manager when high priority task is created"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">IF (Trigger)</label>
                <select
                  value={triggerInput}
                  onChange={(e) => setTriggerInput(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none font-semibold"
                >
                  <option value="WHEN Task becomes Overdue">WHEN Task becomes Overdue</option>
                  <option value="WHEN Task Status becomes Completed">WHEN Task Status becomes Completed</option>
                  <option value="WHEN New Project Created">WHEN New Project Created</option>
                  <option value="WHEN Task Assigned to Team Member">WHEN Task Assigned to Team Member</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">THEN (Action)</label>
                <input
                  type="text"
                  value={actionInput}
                  onChange={(e) => setActionInput(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 outline-none font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm"
                >
                  Save Automation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
