import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Shield, Zap, Users, Layout, Calendar, MessageSquare, FileText, BarChart, ChevronDown, CheckSquare, Clock, FolderKanban } from 'lucide-react';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

export default function LandingPage({ onNavigateDashboard }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    { q: 'What is WorkOrbit?', a: 'WorkOrbit is an all-in-one project management and team collaboration workspace combining tasks, campfire chat, docs, calendar, and reports in a unified interface.' },
    { q: 'Can I switch between multiple workspaces?', a: 'Yes! WorkOrbit supports multi-workspace management. You can create or join separate workspaces for different companies, clients, or personal projects.' },
    { q: 'Is there a free trial or free tier?', a: 'Yes, our Free plan includes up to 3 projects and 5 team members with basic tasks, calendar, and docs.' },
    { q: 'How does real-time chat work?', a: 'Each project gets its own Campfire chat room powered by Socket.IO with instant message delivery, reactions, @mentions, and file attachments.' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* 1. Public Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 font-extrabold text-2xl text-blue-600 tracking-tight cursor-pointer" onClick={onNavigateDashboard}>
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">
            W
          </div>
          <span>WorkOrbit</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition">Features</a>
          <a href="#solutions" className="hover:text-blue-600 transition">Solutions</a>
          <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
          <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLogin(true)}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={() => setShowRegister(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-md shadow-blue-500/20 cursor-pointer"
          >
            Get Started Free
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-16 pb-16 px-6 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Organize your team’s work. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Everything your team needs in one simple workspace.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Manage projects, automate to-do lists, chat in real-time, share files, and track progress effortlessly without complicated enterprise tools.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setShowRegister(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Everything your team needs to collaborate</h2>
            <p className="mt-3 text-slate-600 text-base">Replace 5 fragmented apps with one unified project management workspace.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Project Management</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Visual Kanban boards, list views, progress indicators, and milestones to keep projects on schedule.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Campfire Real-time Chat</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Project-specific chat channels with Socket.IO instant messaging, @mentions, and file attachments.</p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition group">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition">
                <BarChart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Reports & Analytics</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Overdue alerts, team workload distribution bars, completion metrics, and time tracking logs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pricing Section */}
      <section id="pricing" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Simple, predictable pricing</h2>
          <p className="mt-3 text-slate-600 text-base">Start for free, upgrade when your team grows.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="font-bold text-slate-900 text-xl mb-1">Free</div>
              <div className="text-sm text-slate-500 mb-4">For small teams getting started</div>
              <div className="text-4xl font-extrabold text-slate-900 mb-6">$0 <span className="text-sm font-normal text-slate-400">/mo</span></div>
              <ul className="space-y-3 text-sm text-slate-600 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 3 Projects</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 5 Team Members</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Basic Tasks & Kanban</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Interactive Calendar</li>
              </ul>
            </div>
            <button onClick={() => setShowRegister(true)} className="w-full py-3 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition text-sm cursor-pointer">
              Get Started
            </button>
          </div>

          {/* Pro */}
          <div className="p-8 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 flex flex-col justify-between relative md:scale-105">
            <div className="absolute -top-3 right-6 bg-amber-400 text-slate-900 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
              Most Popular
            </div>
            <div>
              <div className="font-bold text-xl mb-1">Pro</div>
              <div className="text-sm text-blue-100 mb-4">For growing productive teams</div>
              <div className="text-4xl font-extrabold mb-6">$29 <span className="text-sm font-normal text-blue-200">/mo</span></div>
              <ul className="space-y-3 text-sm text-blue-50 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> Unlimited Projects</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> 25 Members</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> Advanced Reports & Analytics</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white" /> Time Tracking & Timer</li>
              </ul>
            </div>
            <button onClick={onNavigateDashboard} className="w-full py-3 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition text-sm shadow-md cursor-pointer">
              Start Free Trial
            </button>
          </div>

          {/* Business */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="font-bold text-slate-900 text-xl mb-1">Business</div>
              <div className="text-sm text-slate-500 mb-4">For large organizations</div>
              <div className="text-4xl font-extrabold text-slate-900 mb-6">$99 <span className="text-sm font-normal text-slate-400">/mo</span></div>
              <ul className="space-y-3 text-sm text-slate-600 mb-8">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Unlimited Members</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Custom Workspace URLs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> RBAC & Audit Logs</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 24/7 Dedicated Support</li>
              </ul>
            </div>
            <button onClick={onNavigateDashboard} className="w-full py-3 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition text-sm cursor-pointer">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section id="faq" className="py-20 bg-slate-100/60 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-6 text-left font-bold text-slate-900 flex items-center justify-between cursor-pointer"
                >
                  <span>{f.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-slate-600 border-t border-slate-100 pt-4 leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-sm border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 font-bold text-xl text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-base">W</div>
            <span>WorkOrbit</span>
          </div>
          <div>© 2026 WorkOrbit SaaS Platform. All rights reserved.</div>
        </div>
      </footer>

      {showLogin && (
        <LoginModal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          onSuccess={onNavigateDashboard}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      {showRegister && (
        <RegisterModal
          isOpen={showRegister}
          onClose={() => setShowRegister(false)}
          onSuccess={onNavigateDashboard}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
}
