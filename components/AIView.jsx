import React, { useState } from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import { Bot, Sparkles, AlertTriangle, CheckCircle2, MessageSquare, Send, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

export default function AIView() {
  const { projects, teamMembers, tasks } = useWorkOrbit();
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(null);

  const samplePrompts = [
    "What is delaying the Mobile Banking App project?",
    "Which team member is overloaded right now?",
    "Summarize project risks across all active clients",
    "Convert this meeting transcript into tasks: Rahul will fix login button by Friday",
    "Write a weekly client status update for E-Commerce Website"
  ];

  const handleRunAI = (promptText) => {
    const q = promptText || aiQuery;
    if (!q) return;

    if (q.toLowerCase().includes('delaying') || q.toLowerCase().includes('mobile banking') || q.toLowerCase().includes('risk')) {
      setAiResponse({
        title: '🤖 PROJECT RISK ANALYSIS: Mobile Banking App',
        status: 'HIGH RISK DETECTED',
        findings: [
          '1. Payment API integration is 2 days overdue (Assignee: Rahul Kumar).',
          '2. Priya Sharma is at 94% capacity workload across 14 active tasks.',
          '3. Frontend component development is blocked by Homepage UI wireframe review.'
        ],
        recommendations: [
          '• Reassign OTP testing task from Priya to Suresh V (currently at 40% capacity).',
          '• Escalate Payment API blocker with Stripe technical support.',
          '• Adjust Mobile Banking App launch deadline by 3 business days if necessary.'
        ]
      });
    } else if (q.toLowerCase().includes('overloaded')) {
      setAiResponse({
        title: '🤖 WORKLOAD INTELLIGENCE REPORT',
        status: 'RESOURCE IMBALANCE',
        findings: [
          '• Priya Sharma is overloaded at 94% capacity (14 active tasks, 42.0 hours logged).',
          '• Suresh V has free capacity at 40% workload (3 active tasks, 28.0 hours logged).'
        ],
        recommendations: [
          '• Recommended Action: Reassign 3 design task reviews from Priya to Suresh.'
        ]
      });
    } else {
      setAiResponse({
        title: '🤖 WORKORBIT AI SUMMARY & ACTION ITEMS',
        status: 'TASKS CREATED SUCCESSFULLY',
        findings: [
          '• Task Created: "Fix Login Button Bug" -> Assigned to Rahul Kumar (Due: Friday)'
        ],
        recommendations: [
          '• Milestone updated in project calendar.'
        ]
      });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-600" />
            WorkOrbit AI Assistant & Risk Intelligence
          </h2>
          <p className="text-xs text-slate-500">Basecamp 5 companion AI that understands project context, workload bottlenecks, and risk detection</p>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Antigravity AI Engine 2026
        </span>
      </div>

      {/* AI Risk Radar Alert Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm tracking-wide">Automated AI Project Risk Detection</span>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 border border-rose-500/30">
            3 Risks Detected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-1">
            <div className="font-bold text-amber-400">Mobile Banking App</div>
            <p className="text-slate-300 text-[11px]">7 overdue tasks, Payment API blocked, Priya at 94% workload.</p>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-1">
            <div className="font-bold text-amber-400">Enterprise CRM Migration</div>
            <p className="text-slate-300 text-[11px]">Schema migration failed validation checks; requires database re-alignment.</p>
          </div>
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 text-xs space-y-1">
            <div className="font-bold text-emerald-400">E-Commerce Website</div>
            <p className="text-slate-300 text-[11px]">Healthy 74% completion. Final payment gateway sandbox testing active.</p>
          </div>
        </div>
      </div>

      {/* Interactive AI Query Box & Prompt Buttons */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-600" />
          Ask WorkOrbit AI Anything
        </h3>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask AI e.g., 'What is delaying the project?' or 'Who is overloaded?'"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="flex-1 text-xs p-3 rounded-xl border border-slate-300 outline-none focus:border-indigo-500 font-medium"
          />
          <button
            onClick={() => handleRunAI()}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> Run AI Query
          </button>
        </div>

        {/* Quick Sample Prompt Chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-semibold text-[11px]">Suggested Commands:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setAiQuery(p);
                handleRunAI(p);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium transition text-[11px] border border-slate-200"
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>

      {/* AI Response Card */}
      {aiResponse && (
        <div className="bg-white rounded-2xl p-6 border border-indigo-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
            <h4 className="font-bold text-indigo-950 text-sm">{aiResponse.title}</h4>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
              {aiResponse.status}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800">Findings:</div>
            <div className="space-y-1">
              {aiResponse.findings.map((f, i) => (
                <div key={i} className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-indigo-700">Recommended Actions:</div>
            <div className="space-y-1">
              {aiResponse.recommendations.map((r, i) => (
                <div key={i} className="text-xs text-indigo-900 bg-indigo-50/60 p-2 rounded-lg border border-indigo-100 font-medium">
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
