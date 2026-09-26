import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import {
  CheckSquare,
  Clock,
  User,
  Calendar,
  Tag,
  Paperclip,
  MessageSquare,
  Play,
  Pause,
  Plus,
  Send,
  CheckCircle2,
  Circle,
  FileText
} from 'lucide-react';
import api from '../../services/api';

export default function TaskDetailModal({ task, isOpen, onClose, onTaskUpdated }) {
  const { user } = useAuth();
  if (!task) return null;

  const [subtasks, setSubtasks] = useState([
    { id: 1, title: 'Header section layout', is_completed: 1 },
    { id: 2, title: 'Hero section components', is_completed: 1 },
    { id: 3, title: 'Feature grid responsiveness', is_completed: 0 },
    { id: 4, title: 'Footer links & CTA', is_completed: 0 }
  ]);

  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const [comments, setComments] = useState([
    { id: 1, user_name: 'Rahul Kumar', user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', content: 'Please update the mobile layout to match Figma breakpoints.', created_at: '2 hours ago' },
    { id: 2, user_name: 'Priya Sharma', user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', content: "Sure! I'll update the grid breakpoints today.", created_at: '1 hour ago' }
  ]);
  const [newComment, setNewComment] = useState('');

  const [attachments, setAttachments] = useState([
    { id: 1, filename: 'homepage.fig', size: '12.4 MB' },
    { id: 2, filename: 'requirements.pdf', size: '3.4 MB' },
    { id: 3, filename: 'logo.png', size: '850 KB' }
  ]);

  const [timerRunning, setTimerRunning] = useState(false);
  const [trackedSeconds, setTrackedSeconds] = useState(14 * 3600 + 35 * 60);

  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTrackedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const toggleSubtask = (id) => {
    setSubtasks(prev => prev.map(s => s.id === id ? { ...s, is_completed: s.is_completed ? 0 : 1 } : s));
  };

  const addSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks(prev => [...prev, { id: Date.now(), title: newSubtaskTitle, is_completed: 0 }]);
    setNewSubtaskTitle('');
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments(prev => [...prev, {
      id: Date.now(),
      user_name: user?.name || 'Workspace Admin',
      user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      content: newComment,
      created_at: 'Just now'
    }]);
    setNewComment('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.title} maxWidth="max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details, Subtasks, Comments, Attachments */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              {task.description || 'Create responsive homepage design following brand token specifications and mobile breakpoints.'}
            </p>
          </div>

          {/* Subtasks Section (Requirement 8 format) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Subtasks</span>
              </h4>
              <span className="text-xs font-bold text-blue-600">
                {subtasks.filter(s => s.is_completed).length} / {subtasks.length}
              </span>
            </div>

            <div className="space-y-2 mb-3">
              {subtasks.map((s) => (
                <div
                  key={s.id}
                  onClick={() => toggleSubtask(s.id)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center gap-2.5 text-xs font-semibold ${
                    s.is_completed ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300'
                  }`}
                >
                  {s.is_completed ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <Circle className="w-4 h-4 text-slate-300 shrink-0" />}
                  <span>{s.title}</span>
                </div>
              ))}
            </div>

            <form onSubmit={addSubtask} className="flex gap-2">
              <input
                type="text"
                placeholder="+ Add a subtask..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-blue-500"
              />
              <button type="submit" className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs">Add</button>
            </form>
          </div>

          {/* Attachments (Requirement 8 format) */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-blue-600" />
              <span>Attachments ({attachments.length})</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {attachments.map((att) => (
                <div key={att.id} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div className="truncate font-semibold text-slate-700">📎 {att.filename}</div>
                  <span className="text-[10px] text-slate-400">{att.size}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comments Stream (Requirement 8 format) */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>Comments</span>
            </h4>
            <div className="space-y-3 mb-4">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {c.user_name ? c.user_name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{c.user_name}</span>
                      <span className="text-[10px] text-slate-400">{c.created_at}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-blue-500"
              />
              <button type="submit" className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1">
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right 1 Col: Metadata & Time Tracking Widget */}
        <div className="space-y-6">
          {/* Time Tracking Widget (Requirement 17 format) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Time Tracking
              </span>
              <span className="text-blue-400">Est: 20h</span>
            </div>

            <div className="text-2xl font-extrabold tracking-tight font-mono text-center py-1">
              {formatTime(trackedSeconds)}
            </div>

            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                timerRunning
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-900'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{timerRunning ? 'Pause Timer' : '▶ Start Timer'}</span>
            </button>
          </div>

          {/* Task Attributes */}
          <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-400 block font-bold mb-1">Assigned to</span>
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">P</div>
                <span>Priya Sharma</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block font-bold mb-1">Status</span>
              <span className="font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 inline-block">
                {task.status}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-bold mb-1">Priority</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-block ${
                task.priority === 'High' ? 'badge-priority-high' :
                task.priority === 'Medium' ? 'badge-priority-medium' : 'badge-priority-low'
              }`}>
                {task.priority}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block font-bold mb-1">Start Date</span>
              <span className="font-semibold text-slate-800">Sep 23, 2026</span>
            </div>

            <div>
              <span className="text-slate-400 block font-bold mb-1">Due Date</span>
              <span className="font-semibold text-slate-800">{task.due_date}</span>
            </div>

            {/* Tags (Requirement 18 format) */}
            <div>
              <span className="text-slate-400 block font-bold mb-1.5">Tags</span>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-bold text-[10px]">#frontend</span>
                <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-600 font-bold text-[10px]">#design</span>
                <span className="px-2 py-0.5 rounded bg-red-50 text-red-600 font-bold text-[10px]">#urgent</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
