import React, { useState } from 'react';
import { Bell, Check, Clock, UserPlus, MessageSquare, FileUp, AlertTriangle } from 'lucide-react';

export default function NotificationDropdown({ onClose }) {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'task_assigned', title: 'Task assigned', message: 'Rahul assigned you a task.', time: '2 min ago', is_read: false },
    { id: 2, type: 'mention', title: 'Mentioned', message: 'Priya mentioned you in a comment.', time: '10 min ago', is_read: false },
    { id: 3, type: 'deadline', title: 'Deadline soon', message: 'Your task is due tomorrow.', time: '1 hour ago', is_read: false },
    { id: 4, type: 'file', title: 'File uploaded', message: 'New file homepage.fig uploaded.', time: '3 hours ago', is_read: true }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2">
      <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-800 text-sm">Notifications</span>
        </div>
        <button
          onClick={markAllRead}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <Check className="w-3.5 h-3.5" />
          Mark all as read
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 ${
              !n.is_read ? 'bg-blue-50/30' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              n.type === 'task_assigned' ? 'bg-blue-100 text-blue-600' :
              n.type === 'mention' ? 'bg-amber-100 text-amber-600' :
              n.type === 'deadline' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {n.type === 'task_assigned' && <UserPlus className="w-4 h-4" />}
              {n.type === 'mention' && <MessageSquare className="w-4 h-4" />}
              {n.type === 'deadline' && <AlertTriangle className="w-4 h-4" />}
              {n.type === 'file' && <FileUp className="w-4 h-4" />}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900">{n.title}</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {n.time}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
