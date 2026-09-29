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
  Volume2,
  Video,
  Plus,
  Clock,
  ArrowRight,
  FileText
} from 'lucide-react';

export default function CommunicationView() {
  const { activeTab, chatMessages, addChatMessage, meetings, teamMembers } = useWorkOrbit();
  const [activeChannel, setActiveChannel] = useState('#general');
  const [activeDmUser, setActiveDmUser] = useState('Rahul Kumar');
  const [messageInput, setMessageInput] = useState('');
  const [showVoiceSim, setShowVoiceSim] = useState(false);

  // Direct Message history store
  const [dmHistory, setDmHistory] = useState([
    { id: 'dm-1', sender: 'Rahul Kumar', senderInit: 'R', text: 'Hey Muni! Ready to sync on the Stripe webhook sandbox tests?', time: '09:45 AM' },
    { id: 'dm-2', sender: 'muni', senderInit: 'M', text: 'Yes Rahul! Go ahead with the sandbox triggers.', time: '09:48 AM' },
    { id: 'dm-3', sender: 'Rahul Kumar', senderInit: 'R', text: 'Awesome, tests passed 100%! Ready for production deployment.', time: '10:02 AM' }
  ]);

  const channelMessages = chatMessages.filter(m => m.channel === activeChannel);

  const handleSendChannelMsg = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    addChatMessage(messageInput, activeChannel);
    setMessageInput('');
  };

  const handleSendDm = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setDmHistory(prev => [
      ...prev,
      {
        id: `dm-${Date.now()}`,
        sender: 'muni',
        senderInit: 'M',
        text: messageInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setMessageInput('');
  };

  // ----------------------------------------------------
  // 1. RENDER DIRECT MESSAGES VIEW
  // ----------------------------------------------------
  if (activeTab === 'messages') {
    return (
      <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-5rem)] flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              Direct 1-on-1 Messages
            </h2>
            <p className="text-xs text-slate-500">Private end-to-end messaging with workspace team members</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Encrypted Direct Socket Active
            </span>
          </div>
        </div>

        {/* Main DM Interface */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex overflow-hidden">
          {/* DM Contacts List */}
          <div className="w-64 border-r border-slate-200 bg-slate-50 p-4 space-y-4 flex flex-col shrink-0">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Team Direct Messages</div>
            <div className="space-y-1">
              {['Rahul Kumar', 'Priya Sharma', 'Suresh V'].map(name => {
                const isSelected = activeDmUser === name;
                const initial = name.charAt(0).toUpperCase();

                return (
                  <button
                    key={name}
                    onClick={() => setActiveDmUser(name)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      isSelected ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-blue-800' : 'bg-blue-600'
                    }`}>
                      {initial}
                    </div>
                    <div className="text-left truncate">
                      <div className="truncate">{name}</div>
                      <div className={`text-[9px] ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>Online</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DM Chat Feed Area */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Header with active contact */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {activeDmUser.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{activeDmUser}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Now
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {dmHistory.map(msg => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${msg.sender === 'muni' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 ${
                    msg.sender === 'muni' ? 'bg-slate-800' : 'bg-blue-600'
                  }`}>
                    {msg.sender === 'muni' ? 'M' : msg.senderInit}
                  </div>

                  <div className={`space-y-1 max-w-md ${msg.sender === 'muni' ? 'text-right' : ''}`}>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {msg.sender} • {msg.time}
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed inline-block ${
                      msg.sender === 'muni'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Send DM Form */}
            <form onSubmit={handleSendDm} className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
              <input
                type="text"
                placeholder={`Message ${activeDmUser}...`}
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

  // ----------------------------------------------------
  // 2. RENDER MEETINGS VIEW
  // ----------------------------------------------------
  if (activeTab === 'meetings') {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-600" />
              Video Meetings & Conference Rooms
            </h2>
            <p className="text-xs text-slate-500">Schedule video syncs, launch instant huddles, and view AI meeting transcription notes</p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://meet.workorbit.io/instant-huddle"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
            >
              <Video className="w-4 h-4" />
              <span>Launch Instant Huddle</span>
            </a>
          </div>
        </div>

        {/* Meetings Grid List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Today&apos;s Scheduled Meetings ({meetings.length})</h3>
            <span className="text-xs font-mono text-slate-500">Sep 29, 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {meetings.map(mtg => (
              <div key={mtg.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold font-mono">
                      ⏰ {mtg.time}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{mtg.project}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{mtg.title}</h4>
                </div>

                {/* Attendees */}
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendees</div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {mtg.attendees.map(name => (
                      <span key={name} className="px-2 py-1 rounded-lg bg-slate-100 text-slate-800 text-[11px] font-semibold flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <span>{name}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={mtg.link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 mt-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Video Call</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* AI Meeting Transcriber Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              AI Meeting Transcripts & Action Items
            </h3>
            <span className="text-xs text-indigo-600 font-bold">Auto-Generated</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>Transcript: ABC Tech Client Sprint Sync (10:30 AM)</span>
              <span className="text-[10px] text-slate-400">Duration: 28 mins</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              &quot;Rahul agreed to complete end-to-end sandbox testing for the Stripe payment integration today. Priya will share updated wireframes by EOD. Karthik will coordinate client sign-off.&quot;
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. DEFAULT: RENDER CAMPFIRE TEAM CHAT VIEW
  // ----------------------------------------------------
  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-5rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Campfire Team Chat & Project Channels
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
                <button
                  key={name}
                  onClick={() => setActiveDmUser(name)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-200 transition"
                >
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
          <form onSubmit={handleSendChannelMsg} className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
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
