import React, { useState } from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import {
  Bot,
  ShieldAlert,
  Mic,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Play,
  Pause,
  Upload,
  Clock,
  ArrowRight,
  RefreshCw,
  Zap,
  TrendingDown,
  ChevronRight,
  Plus
} from 'lucide-react';

export default function AIView() {
  const { activeTab, projects, teamMembers, tasks, addTask } = useWorkOrbit();

  // Assistant View State
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState(null);

  // Meeting Transcriber State
  const [selectedMeeting, setSelectedMeeting] = useState('weekly-sync');
  const [isRecording, setIsRecording] = useState(false);
  const [addedTasks, setAddedTasks] = useState([]);

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
        title: 'PROJECT RISK ANALYSIS: Mobile Banking App',
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
        title: 'WORKLOAD INTELLIGENCE REPORT',
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
        title: 'WORKORBIT SUMMARY & ACTION ITEMS',
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

  const handleAddMeetingTask = (taskTitle, assigneeName, dueDate) => {
    addTask({
      title: taskTitle,
      assignee: assigneeName,
      dueDate: dueDate,
      status: 'To Do',
      priority: 'High',
      project: 'Mobile Banking App'
    });
    setAddedTasks((prev) => [...prev, taskTitle]);
  };

  // -------------------------------------------------------------
  // 1. ASSISTANT VIEW (id: ai-assistant)
  // -------------------------------------------------------------
  const renderAssistantView = () => (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">WorkOrbit Intelligent Assistant</h3>
              <p className="text-xs text-slate-300">Natural language AI engine for project insights, resource optimization, and quick task creation.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> AI v4.2 Active
          </span>
        </div>
      </div>

      {/* Query Input Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-600" />
          Ask WorkOrbit Assistant Anything
        </h3>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask e.g., 'What is delaying the project?' or 'Who is overloaded?'"
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

        {/* Quick Sample Prompts */}
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
              &quot;{p}&quot;
            </button>
          ))}
        </div>
      </div>

      {/* AI Response Box */}
      {aiResponse && (
        <div className="bg-white rounded-2xl p-6 border border-indigo-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
            <h4 className="font-bold text-indigo-950 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              {aiResponse.title}
            </h4>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
              {aiResponse.status}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800">Findings:</div>
            <div className="space-y-1">
              {aiResponse.findings.map((f, i) => (
                <div key={i} className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-indigo-700">Recommended Actions:</div>
            <div className="space-y-1">
              {aiResponse.recommendations.map((r, i) => (
                <div key={i} className="text-xs text-indigo-900 bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100 font-medium flex items-center justify-between">
                  <span>{r}</span>
                  <button className="px-2.5 py-1 rounded bg-indigo-600 text-white text-[10px] font-bold hover:bg-indigo-700 transition shrink-0 ml-2">
                    Execute
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent AI Queries History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Recent Assistant Queries</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-800">Summarize project risks across all active clients</span>
            </div>
            <span className="text-[10px] text-slate-400">10 mins ago</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-800">Which team member is overloaded right now?</span>
            </div>
            <span className="text-[10px] text-slate-400">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // 2. RISK INTELLIGENCE VIEW (id: project-insights)
  // -------------------------------------------------------------
  const renderRiskIntelligenceView = () => (
    <div className="space-y-6">
      {/* Radar Header Alert */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">WorkOrbit Risk Intelligence Radar</h3>
              <p className="text-xs text-slate-300">Continuous AI monitoring of milestone delays, workload imbalances, and technical dependencies.</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-rose-500/30 text-rose-300 border border-rose-500/30">
            3 Active Risk Alerts
          </span>
        </div>

        {/* High-Level Risk Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Projects</div>
            <div className="text-lg font-bold text-white mt-0.5">8 Projects</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-rose-400 uppercase font-semibold">High Risk Alerts</div>
            <div className="text-lg font-bold text-rose-400 mt-0.5">2 Critical</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-emerald-400 uppercase font-semibold">Workspace Health</div>
            <div className="text-lg font-bold text-emerald-400 mt-0.5">84% Score</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
            <div className="text-[10px] text-indigo-400 uppercase font-semibold">AI Mitigations</div>
            <div className="text-lg font-bold text-indigo-300 mt-0.5">5 Suggested</div>
          </div>
        </div>
      </div>

      {/* Detailed Risk Breakdown Cards */}
      <div className="space-y-4">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Active Risk Detections & Automated Recommendations
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Mobile Banking App</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                HIGH RISK
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Payment API integration is 2 days overdue. Assignee <span className="font-bold text-slate-800">Rahul Kumar</span> is blocked on Stripe verification. Workload overload on Priya Sharma (94%).
            </p>
            <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 text-[11px] text-rose-900 space-y-1">
              <div className="font-bold flex items-center gap-1 text-rose-700">
                <Zap className="w-3.5 h-3.5" /> AI Mitigation Strategy:
              </div>
              <p>Reassign OTP testing task to Suresh V to free 8.5 hours for Priya.</p>
            </div>
            <button className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-sm transition">
              Apply Reassignment Fix
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Enterprise CRM Migration</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                MEDIUM RISK
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Database schema migration failed automated validation checks. Needs database re-alignment before stage 2 deployment.
            </p>
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-[11px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1 text-amber-800">
                <Zap className="w-3.5 h-3.5" /> AI Mitigation Strategy:
              </div>
              <p>Run schema auto-repair diagnostic script on test environment.</p>
            </div>
            <button className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-sm transition">
              Run Diagnostic Script
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">E-Commerce Website</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                HEALTHY
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Healthy 74% completion rate. Final payment gateway sandbox testing active. All team members within safe workload thresholds.
            </p>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-[11px] text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" /> Next AI Step:
              </div>
              <p>Schedule client UAT demo for Friday afternoon.</p>
            </div>
            <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition">
              View Project Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Preventative AI Rules */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Automated Risk Prevention Rules Active</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="font-semibold text-slate-800">Workload Overload Alert Rule</span>
              <span className="text-slate-500 text-[11px]">(Triggers if team member capacity exceeds 85%)</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="font-semibold text-slate-800">Overdue Task Escalation Rule</span>
              <span className="text-slate-500 text-[11px]">(Notifies manager when task is &gt;48h overdue)</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">ACTIVE</span>
          </div>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // 3. MEETING TRANSCRIBER VIEW (id: meeting-ai)
  // -------------------------------------------------------------
  const renderMeetingTranscriberView = () => (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">AI Meeting Transcriber & Audio Summarizer</h3>
              <p className="text-xs text-slate-300">Automatically record, transcribe, and extract actionable WorkOrbit tasks from team meetings.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center gap-2 shadow-sm ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
              {isRecording ? 'Stop Recording' : 'Start Live Audio Transcribe'}
            </button>
            <button className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition">
              <Upload className="w-4 h-4" /> Upload .mp3 / .wav
            </button>
          </div>
        </div>
      </div>

      {/* Meeting Selector & Summary Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Transcripts List */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">Meeting Recordings</h4>
          <div className="space-y-2">
            <button
              onClick={() => setSelectedMeeting('weekly-sync')}
              className={`w-full text-left p-3 rounded-xl border transition ${
                selectedMeeting === 'weekly-sync'
                  ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-semibold'
                  : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold">Weekly Engineering Sync</span>
                <span className="text-[10px] text-slate-400 font-mono">42:15</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Today 10:00 AM • 4 Attendees</p>
            </button>

            <button
              onClick={() => setSelectedMeeting('client-demo')}
              className={`w-full text-left p-3 rounded-xl border transition ${
                selectedMeeting === 'client-demo'
                  ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-semibold'
                  : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold">Mobile App Release Review</span>
                <span className="text-[10px] text-slate-400 font-mono">28:40</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Yesterday 3:30 PM • 3 Attendees</p>
            </button>
          </div>
        </div>

        {/* Right Column: AI Extracted Summary & Action Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Weekly Engineering Sync</h4>
                <p className="text-xs text-slate-500">Transcript AI Analysis & Task Extraction</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                88% Positive Discussion
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Executive Summary
              </div>
              <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed font-medium">
                The team discussed Stripe Payment API delays on the Mobile Banking App. <span className="font-bold text-slate-900">Rahul Kumar</span> agreed to complete Stripe sandbox testing by Friday. <span className="font-bold text-slate-900">Priya Sharma</span> will finalize Homepage UI wireframes by Thursday. <span className="font-bold text-slate-900">Suresh V</span> offered to support OTP automated test suite setup.
              </p>
            </div>
          </div>

          {/* Extracted Tasks from Transcript */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                AI Extracted Action Items
              </h4>
              <span className="text-xs text-slate-400 font-medium">3 Tasks Detected</span>
            </div>

            <div className="space-y-3">
              {/* Task 1 */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    R
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Complete Stripe Payment API Integration</div>
                    <div className="text-[11px] text-slate-500">Assignee: Rahul Kumar • Due: Friday</div>
                  </div>
                </div>
                {addedTasks.includes('Complete Stripe Payment API Integration') ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-lg">
                    Task Created
                  </span>
                ) : (
                  <button
                    onClick={() => handleAddMeetingTask('Complete Stripe Payment API Integration', 'Rahul Kumar', 'Friday')}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Task
                  </button>
                )}
              </div>

              {/* Task 2 */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    P
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Finalize Homepage UI Wireframe Reviews</div>
                    <div className="text-[11px] text-slate-500">Assignee: Priya Sharma • Due: Thursday</div>
                  </div>
                </div>
                {addedTasks.includes('Finalize Homepage UI Wireframe Reviews') ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-lg">
                    Task Created
                  </span>
                ) : (
                  <button
                    onClick={() => handleAddMeetingTask('Finalize Homepage UI Wireframe Reviews', 'Priya Sharma', 'Thursday')}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Task
                  </button>
                )}
              </div>

              {/* Task 3 */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    S
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Setup OTP Automated Test Suite</div>
                    <div className="text-[11px] text-slate-500">Assignee: Suresh V • Due: Next Monday</div>
                  </div>
                </div>
                {addedTasks.includes('Setup OTP Automated Test Suite') ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-lg">
                    Task Created
                  </span>
                ) : (
                  <button
                    onClick={() => handleAddMeetingTask('Setup OTP Automated Test Suite', 'Suresh V', 'Next Monday')}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg transition flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Task
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // MAIN RENDER SWITCH
  // -------------------------------------------------------------
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            {activeTab === 'project-insights' ? (
              <>
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                WorkOrbit Risk Intelligence
              </>
            ) : activeTab === 'meeting-ai' ? (
              <>
                <Mic className="w-5 h-5 text-indigo-600" />
                Meeting Transcriber & Audio AI
              </>
            ) : (
              <>
                <Bot className="w-5 h-5 text-indigo-600" />
                WorkOrbit Intelligent Assistant
              </>
            )}
          </h2>
          <p className="text-xs text-slate-500">
            {activeTab === 'project-insights'
              ? 'Automated project health detection, risk analysis radar, and preventative action plans'
              : activeTab === 'meeting-ai'
              ? 'Transcribe meeting recordings, generate executive summaries, and extract tasks'
              : 'Automated assistant that analyzes project context, workload bottlenecks, and risk detection'}
          </p>
        </div>
      </div>

      {/* Render selected view */}
      {activeTab === 'project-insights' && renderRiskIntelligenceView()}
      {activeTab === 'meeting-ai' && renderMeetingTranscriberView()}
      {(activeTab === 'ai-assistant' || (!activeTab.includes('project-insights') && !activeTab.includes('meeting-ai'))) && renderAssistantView()}
    </div>
  );
}
