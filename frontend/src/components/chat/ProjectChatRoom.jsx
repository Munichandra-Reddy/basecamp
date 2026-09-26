import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Paperclip, MessageSquare, Search, Reply, ThumbsUp, Heart, Flame } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ProjectChatRoom({ projectId = 1 }) {
  const { socket } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    { id: 1, user_id: 2, user_name: 'Rahul Kumar', user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', content: 'API integration is completed for authentication and user sessions.', created_at: '10:15 AM', reactions: [{ emoji: '👍', count: 2 }] },
    { id: 2, user_id: 3, user_name: 'Priya Sharma', user_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', content: 'Awesome! I will start QA testing the login and workspace creation flows.', created_at: '10:18 AM', reactions: [{ emoji: '🔥', count: 3 }] },
    { id: 3, user_id: 4, user_name: 'Chandra Reddy', user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', content: 'Great progress team! Please finish testing before Friday check-in.', created_at: '10:20 AM', reactions: [] }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typingUser, setTypingUser] = useState('');

  useEffect(() => {
    if (socket) {
      socket.emit('join-project', projectId);

      socket.on('receive-message', (data) => {
        setMessages(prev => [...prev, data]);
      });

      socket.on('user-typing', (data) => {
        setTypingUser(data.username);
        setTimeout(() => setTypingUser(''), 3000);
      });

      return () => {
        socket.emit('leave-project', projectId);
        socket.off('receive-message');
        socket.off('user-typing');
      };
    }
  }, [socket, projectId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgObj = {
      id: Date.now(),
      project_id: projectId,
      user_id: user?.id || 1,
      user_name: user?.name || 'Reyhan Adinata',
      user_avatar: user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      content: newMessage,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: []
    };

    setMessages(prev => [...prev, msgObj]);

    if (socket) {
      socket.emit('send-message', msgObj);
    }

    setNewMessage('');
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (socket && user) {
      socket.emit('typing', { project_id: projectId, username: user.name });
    }
  };

  const addReaction = (msgId, emoji) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        const existing = m.reactions.find(r => r.emoji === emoji);
        if (existing) {
          return { ...m, reactions: m.reactions.map(r => r.emoji === emoji ? { ...r, count: r.count + 1 } : r) };
        } else {
          return { ...m, reactions: [...m.reactions, { emoji, count: 1 }] };
        }
      }
      return m;
    }));
  };

  const filteredMessages = messages.filter(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 flex flex-col h-[calc(100vh-12rem)] overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 font-extrabold flex items-center justify-center">
            💬
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Campfire Team Chat</h3>
            <div className="text-xs text-slate-400">E-Commerce Website Project Channel</div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium outline-none"
          />
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {filteredMessages.map((m) => (
          <div key={m.id} className="flex items-start gap-3.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              {m.user_name ? m.user_name[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm text-slate-900">{m.user_name}</span>
                <span className="text-[10px] text-slate-400">{m.created_at}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl rounded-tl-none inline-block max-w-xl text-slate-700 text-sm leading-relaxed shadow-2xs">
                {m.content}
              </div>

              {/* Reactions Bar */}
              <div className="flex items-center gap-1.5 mt-1.5">
                {m.reactions?.map((r, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                    {r.emoji} {r.count}
                  </span>
                ))}
                <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1 ml-2">
                  <button onClick={() => addReaction(m.id, '👍')} className="p-1 hover:bg-slate-100 rounded text-xs">👍</button>
                  <button onClick={() => addReaction(m.id, '🔥')} className="p-1 hover:bg-slate-100 rounded text-xs">🔥</button>
                  <button onClick={() => addReaction(m.id, '❤️')} className="p-1 hover:bg-slate-100 rounded text-xs">❤️</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {typingUser && (
        <div className="px-6 py-1 text-[11px] italic text-slate-400">
          {typingUser} is typing...
        </div>
      )}

      {/* Chat Input Bar */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <button type="button" className="p-2 rounded-xl border border-slate-200 hover:bg-white text-slate-500">
          <Paperclip className="w-4 h-4" />
        </button>
        <button type="button" className="p-2 rounded-xl border border-slate-200 hover:bg-white text-slate-500">
          <Smile className="w-4 h-4" />
        </button>

        <input
          type="text"
          placeholder="Write a message or @mention a team member..."
          value={newMessage}
          onChange={handleTyping}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500 bg-white"
        />

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md shadow-blue-500/20 flex items-center gap-1.5"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
