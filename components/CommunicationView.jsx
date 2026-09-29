import React, { useState } from 'react';
import { useWorkOrbit } from '../context/WorkOrbitContext';
import {
  MessageSquare,
  MessageCircle,
  Hash,
  Send,
  Pin,
  Paperclip,
  Smile,
  Mic,
  Code,
  CheckCircle2,
  Users,
  Search,
  Volume2
} from 'lucide-react';

export default function CommunicationView() {
  const { chatMessages, addChatMessage } = useWorkOrbit();
  const [activeChannel, setActiveChannel] = useState('#general');
  const [messageInput, setMessageInput] = useState('');
  const [showVoiceSim, setShowVoiceSim] = useState(false);

  const channelMessages = chatMessages.filter(m => m.channel === activeChannel);

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    addChatMessage(messageInput, activeChannel);
    setMessageInput('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-5rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Campfire Team Chat & Direct Messaging
          </h2>
          <p className="text-xs text-slate-500">Real-time Basecamp 5 communication system with voice notes, threads, and polls</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Realtime Socket Active
          </span>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex overflow-hidden">

        {/* Sidebar Channels List */}
        <div className="w-64 border-r border-slate-200 bg-slate-50 p-4 space-y-5 flex flex-col shrink-0">
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Project Channels</div>
            <div className="space-y-1">
              {['#general', '#engineering', '#design', '#announcements'].map(ch => (
                <button
                  key={ch}
                  onClick={() => setActiveChannel(ch)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    activeChannel === ch ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  <span>{ch.replace('#', '')}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Direct Messages</div>
            <div className="space-y-1 text-xs font-medium text-slate-700">
              {['Rahul Kumar', 'Priya Sharma', 'Suresh V'].map(name => (
                <button key={name} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-200 transition">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Feed Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Channel Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-blue-600" />
              <span className="font-bold text-slate-900 text-sm">{activeChannel}</span>
              <span className="text-xs text-slate-400">| 5 Team Members Online</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowVoiceSim(!showVoiceSim)}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 flex items-center gap-1.5"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Basecamp 5 Voice Note</span>
              </button>
            </div>
          </div>

          {/* Messages Scroll Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {showVoiceSim && (
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-indigo-600" />
                    Priya Sharma recorded a voice note (0:24)
                  </span>
                  <span className="text-[10px] text-indigo-600">Just now</span>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-indigo-100">
                  <button className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">▶</button>
                  <div className="flex-1 h-2 bg-indigo-100 rounded-full overflow-hidden">
                    <div className="w-1/3 bg-indigo-600 h-full"></div>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-600 font-bold">0:08 / 0:24</span>
                </div>
              </div>
            )}

            {channelMessages.map(msg => (
              <div key={msg.id} className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                  {msg.sender.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{msg.sender}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.time}</span>
                    {msg.pinned && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold flex items-center gap-0.5">
                        <Pin className="w-2.5 h-2.5" /> Pinned
                      </span>
                    )}
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-100 text-slate-800 text-xs leading-relaxed">
                    {msg.text}
                  </div>

                  {msg.fileAttachment && (
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold flex items-center gap-2">
                      <Paperclip className="w-4 h-4" />
                      <span>{msg.fileAttachment}</span>
                    </div>
                  )}

                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1">
                      {msg.reactions.map((r, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-700 border border-slate-200">
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
            <input
              type="text"
              placeholder={`Message ${activeChannel}... (Use @mention or markdown)`}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 shadow-sm"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
