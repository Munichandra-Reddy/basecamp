import React, { useState } from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import {
  Zap,
  Plus,
  CheckCircle2,
  MessageSquare,
  Mail,
  Globe,
  Code,
  Key,
  ShieldCheck,
  ArrowRight,
  Boxes,
  Webhook,
  Copy,
  Check,
  Play,
  RefreshCw
} from 'lucide-react';

export default function AutomationView() {
  const { activeTab, automations, addAutomationRule } = useWorkOrbit();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerInput, setTriggerInput] = useState('WHEN Task becomes Overdue');
  const [actionInput, setActionInput] = useState('Notify Assignee & Set Priority to Urgent');
  const [ruleName, setRuleName] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [testSent, setTestSent] = useState(false);

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

  const handleCopyKey = () => {
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleTestWebhook = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const integrations = [
    { name: 'WhatsApp Business API', category: 'Messaging', desc: 'Send automatic WhatsApp task dispatch notifications to team members.', status: 'Connected', icon: '💬' },
    { name: 'GitHub / GitLab Webhooks', category: 'Developer', desc: 'Auto-close tasks when git commits mention issue numbers.', status: 'Connected', icon: '🐙' },
    { name: 'Google Calendar & Outlook', category: 'Calendar', desc: 'Sync project deadlines and meetings with your Google Calendar.', status: 'Connected', icon: '📅' },
    { name: 'Stripe Payments', category: 'Finance', desc: 'Automatically generate invoices when client milestones are approved.', status: 'Connected', icon: '💳' },
    { name: 'n8n & Zapier', category: 'Automation', desc: 'Trigger 5,000+ app workflows via custom webhooks.', status: 'Available', icon: '⚡' }
  ];

  // ----------------------------------------------------
  // 1. RENDER INTEGRATIONS HUB VIEW
  // ----------------------------------------------------
  if (activeTab === 'integrations') {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-blue-600" />
              Integrations Hub & Connected Apps
            </h2>
            <p className="text-xs text-slate-500">Connect third-party developer platforms, calendar sync, payment gateways, and WhatsApp dispatch</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              4 Apps Connected
            </span>
          </div>
        </div>

        {/* Integrations Marketplace Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {integrations.map(integ => (
            <div key={integ.name} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2.5 rounded-xl bg-slate-100">{integ.icon}</span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    integ.status === 'Connected' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {integ.status}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{integ.name}</h3>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">{integ.category}</span>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{integ.desc}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition">
                  {integ.status === 'Connected' ? 'Configure Integration' : 'Connect App'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. RENDER WEBHOOKS & API VIEW
  // ----------------------------------------------------
  if (activeTab === 'webhooks') {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Webhook className="w-5 h-5 text-blue-600" />
              Developer Webhooks & REST API Console
            </h2>
            <p className="text-xs text-slate-500">Manage HTTP event listeners, generate API bearer tokens, and inspect webhook delivery logs</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestWebhook}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
            >
              {testSent ? <Check className="w-4 h-4 text-emerald-300" /> : <Play className="w-4 h-4" />}
              <span>{testSent ? 'Test Webhook Sent (200 OK)' : 'Send Test Webhook'}</span>
            </button>
          </div>
        </div>

        {/* API Token Box */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Live Production API Secret Key</h3>
            </div>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">Bearer Token</span>
          </div>

          <div className="flex items-center gap-3 bg-slate-900 text-white p-3 rounded-xl font-mono text-xs">
            <span className="flex-1 text-slate-300 truncate">wo_live_sk_9482910481290384712093847</span>
            <button
              onClick={handleCopyKey}
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-sans font-bold flex items-center gap-1 shrink-0"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? 'Copied!' : 'Copy Key'}</span>
            </button>
          </div>
        </div>

        {/* Active Webhook Listeners */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Active Webhook Listeners (2)</h3>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="font-mono font-bold text-blue-600">POST https://api.workorbit.io/v1/webhooks/task-events</div>
                <div className="text-[11px] text-slate-500">Subscribed Events: <span className="font-mono font-semibold text-slate-700">task.created, task.completed, task.overdue</span></div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 font-mono font-bold text-[10px]">200 OK (Active)</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="font-mono font-bold text-blue-600">POST https://api.workorbit.io/v1/webhooks/payments</div>
                <div className="text-[11px] text-slate-500">Subscribed Events: <span className="font-mono font-semibold text-slate-700">invoice.paid, payment.failed</span></div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-700 font-mono font-bold text-[10px]">200 OK (Active)</span>
            </div>
          </div>
        </div>

        {/* JSON Payload Inspector */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-3 shadow-md font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Sample Webhook Event JSON Payload</span>
            <span>Content-Type: application/json</span>
          </div>
          <pre className="bg-slate-950 p-4 rounded-xl text-emerald-400 overflow-x-auto text-[11px]">
{`{
  "event": "task.overdue",
  "timestamp": "2026-09-29T15:35:00Z",
  "data": {
    "task_id": "tsk-101",
    "title": "Complete Payment API Integration",
    "project": "E-Commerce Website",
    "assignee": "Rahul Kumar",
    "status": "In Progress",
    "priority": "Urgent"
  }
}`}
          </pre>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. DEFAULT: RENDER WORKFLOWS & RULES ENGINE VIEW
  // ----------------------------------------------------
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            WorkOrbit Automation Engine & Rules
          </h2>
          <p className="text-xs text-slate-500">Configure IF → THEN rules, trigger conditions, and automated task escalations</p>
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
