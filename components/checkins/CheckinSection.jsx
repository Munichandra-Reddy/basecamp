import React, { useState } from 'react';
import { ClipboardCheck, CheckCircle2, AlertTriangle, XCircle, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CheckinSection() {
  const { user } = useAuth();
  const [statusChoice, setStatusChoice] = useState('On track');
  const [completedWork, setCompletedWork] = useState('');
  const [nextPlan, setNextPlan] = useState('');
  const [blockers, setBlockers] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [pastCheckins, setPastCheckins] = useState([
    {
      id: 1,
      user_name: 'Rahul Kumar',
      user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'On track',
      completed: 'Completed Login API & workspace middleware integration.',
      next: 'Working on real-time web socket broadcasting.',
      blockers: 'None at present.',
      date: 'Last Friday 5:00 PM'
    },
    {
      id: 2,
      user_name: 'Priya Sharma',
      user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      status: 'On track',
      completed: 'Finished Figma wireframe exports for homepage and mobile navigation.',
      next: 'Designing dashboard UI tokens.',
      blockers: 'Awaiting copy approval.',
      date: 'Last Friday 4:30 PM'
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPastCheckins(prev => [
      {
        id: Date.now(),
        user_name: user?.name || 'Workspace Admin',
        user_avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        status: statusChoice,
        completed: completedWork || 'Completed sprint reviews.',
        next: nextPlan || 'Deploying production builds.',
        blockers: blockers || 'None.',
        date: 'Just now'
      },
      ...prev
    ]);
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 font-extrabold flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Automatic Weekly Check-ins</h1>
            <p className="text-xs text-slate-500 mt-0.5">Automated Friday status updates for remote team alignment.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card-atlas p-6 space-y-4">
          <h2 className="font-bold text-lg text-slate-900">Weekly Check-in</h2>

          {submitted ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Check-in Submitted!</span>
              </div>
              <p>Thank you for submitting your Friday update. Your project manager can view your response.</p>
              <button onClick={() => setSubmitted(false)} className="text-blue-600 underline text-[11px] font-bold">
                Edit submission
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-2">How is the project going?</label>
                <div className="space-y-2">
                  {['On track', 'At risk', 'Off track'].map((st) => (
                    <label key={st} className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 cursor-pointer font-semibold text-slate-800 hover:bg-slate-50">
                      <input
                        type="radio"
                        name="statusChoice"
                        value={st}
                        checked={statusChoice === st}
                        onChange={(e) => setStatusChoice(e.target.value)}
                        className="text-blue-600"
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">What did you complete?</label>
                <textarea
                  rows={2}
                  required
                  value={completedWork}
                  onChange={(e) => setCompletedWork(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs font-medium"
                  placeholder="Write your update..."
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">What are you working on next?</label>
                <textarea
                  rows={2}
                  required
                  value={nextPlan}
                  onChange={(e) => setNextPlan(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs font-medium"
                  placeholder="Write your update..."
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Any blockers?</label>
                <input
                  type="text"
                  value={blockers}
                  onChange={(e) => setBlockers(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none text-xs font-medium"
                  placeholder="Write blockers if any..."
                />
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>Submit Check-in</span>
              </button>
            </form>
          )}
        </div>

        <div className="lg:col-span-2 card-atlas p-6 space-y-4">
          <h2 className="font-bold text-lg text-slate-900">Team Responses Summary</h2>
          <div className="space-y-4">
            {pastCheckins.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {c.user_name ? c.user_name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="font-bold text-slate-900 text-sm">{c.user_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      c.status === 'On track' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {c.status}
                    </span>
                    <span className="text-[10px] text-slate-400">{c.date}</span>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700">Completed: </span>
                  <span className="text-slate-600">{c.completed}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Next Plan: </span>
                  <span className="text-slate-600">{c.next}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-700">Blockers: </span>
                  <span className="text-slate-600">{c.blockers}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
