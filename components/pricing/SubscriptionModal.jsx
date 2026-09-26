import React from 'react';
import Modal from '../common/Modal';
import { CheckCircle2 } from 'lucide-react';

export default function SubscriptionModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose your WorkOrbit SaaS Plan" maxWidth="max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-2">
        <div className="p-6 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between">
          <div>
            <div className="font-bold text-slate-900 text-lg">Free</div>
            <div className="text-3xl font-extrabold text-slate-900 my-3">$0 <span className="text-xs text-slate-400 font-normal">/mo</span></div>
            <ul className="space-y-2 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 3 Projects</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 5 Members</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Basic Tasks & Calendar</li>
            </ul>
          </div>
          <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50">
            Current Plan
          </button>
        </div>

        <div className="p-6 rounded-2xl border-2 border-blue-600 bg-blue-50/30 flex flex-col justify-between relative shadow-lg">
          <div className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
            Recommended
          </div>
          <div>
            <div className="font-bold text-slate-900 text-lg flex items-center gap-1.5">
              <span>Pro</span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 my-3">$29 <span className="text-xs text-slate-400 font-normal">/mo</span></div>
            <ul className="space-y-2 text-xs text-slate-700 mb-6">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Unlimited Projects</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> 25 Members</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Advanced Reports</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Time Tracking</li>
            </ul>
          </div>
          <button onClick={onClose} className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-md">
            Upgrade to Pro
          </button>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white flex flex-col justify-between">
          <div>
            <div className="font-bold text-slate-900 text-lg">Business</div>
            <div className="text-3xl font-extrabold text-slate-900 my-3">$99 <span className="text-xs text-slate-400 font-normal">/mo</span></div>
            <ul className="space-y-2 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Unlimited Members</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Custom Workspace URL</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-600" /> Audit Logs & RBAC</li>
            </ul>
          </div>
          <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50">
            Contact Sales
          </button>
        </div>
      </div>
    </Modal>
  );
}
