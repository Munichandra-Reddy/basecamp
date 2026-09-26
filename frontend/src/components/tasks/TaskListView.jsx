import React from 'react';
import { CheckCircle2, Circle, Clock, MessageSquare, Paperclip, MoreHorizontal } from 'lucide-react';

export default function TaskListView({ tasks, onSelectTask }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="divide-y divide-slate-100">
        {tasks.map((t) => (
          <div
            key={t.id}
            onClick={() => onSelectTask(t)}
            className="p-4 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-3">
              {t.status === 'Completed' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 shrink-0 group-hover:text-blue-500" />
              )}
              <div>
                <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition">
                  {t.title}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>{t.project || 'E-Commerce Website'}</span>
                  <span>•</span>
                  <span>Due {t.due_date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                t.priority === 'High' ? 'badge-priority-high' :
                t.priority === 'Medium' ? 'badge-priority-medium' : 'badge-priority-low'
              }`}>
                {t.priority}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                {t.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
