import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, Video } from 'lucide-react';
import api from '../../services/api';
import Modal from '../common/Modal';

const defaultEvents = [
  { id: 1, day: 24, title: 'API Architecture Review', type: 'Meeting', time: '10:00 AM', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 2, day: 25, title: 'Team Weekly Sync', type: 'Meeting', time: '2:00 PM', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 3, day: 27, title: 'Project Delivery Milestone', type: 'Milestone', time: '6:00 PM', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 4, day: 29, title: 'QA Integration Testing', type: 'Deadline', time: '5:00 PM', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
];

const loadCustomEvents = () => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('teamflow_custom_events') || '[]');
  } catch (e) {
    return [];
  }
};

const saveCustomEvent = (ev) => {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadCustomEvents();
    const filtered = existing.filter(e => String(e.id) !== String(ev.id));
    const updated = [ev, ...filtered];
    localStorage.setItem('teamflow_custom_events', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save calendar event to localStorage:', e);
  }
};

const getMergedEvents = (fetched = []) => {
  const customEvents = loadCustomEvents();
  const customMap = new Map();
  customEvents.forEach(e => customMap.set(String(e.id), e));

  const baseList = fetched.length > 0 ? fetched.map(e => ({
    id: e.id,
    day: e.start_time ? new Date(e.start_time).getDate() : 24,
    title: e.title,
    type: e.event_type || 'Meeting',
    time: e.start_time ? new Date(e.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
    color: e.event_type === 'Milestone' ? 'bg-amber-100 text-amber-700 border-amber-200' :
           e.event_type === 'Deadline' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
           e.event_type === 'Task' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'
  })) : defaultEvents;

  const combined = [...customEvents];
  baseList.forEach(e => {
    if (!customMap.has(String(e.id))) {
      combined.push(e);
    }
  });

  return combined;
};

export default function ScheduleCalendar() {
  const [currentView, setCurrentView] = useState('Month');
  const [events, setEvents] = useState(() => getMergedEvents());

  const [showModal, setShowModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('Meeting');
  const [eventDay, setEventDay] = useState(24);
  const [eventTime, setEventTime] = useState('10:00 AM');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/calendar/events')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setEvents(getMergedEvents(res.data));
        }
      })
      .catch(() => {});
  }, []);

  const openAddModal = (day = 24) => {
    setEventDay(day);
    setEventTitle('');
    setEventType('Meeting');
    setEventTime('10:00 AM');
    setShowModal(true);
  };

  const handleAddEventSubmit = async (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    setLoading(true);

    const colorMap = {
      Meeting: 'bg-blue-100 text-blue-700 border-blue-200',
      Milestone: 'bg-amber-100 text-amber-700 border-amber-200',
      Deadline: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Task: 'bg-purple-100 text-purple-700 border-purple-200'
    };

    const dayNum = Number(eventDay) || 24;

    const newEvent = {
      id: Date.now(),
      day: dayNum,
      title: eventTitle.trim(),
      type: eventType,
      time: eventTime.trim() || '10:00 AM',
      color: colorMap[eventType] || colorMap.Meeting
    };

    saveCustomEvent(newEvent);

    setEvents(prev => [...prev, newEvent]);

    try {
      const startTimeISO = `2026-09-${String(dayNum).padStart(2, '0')}T10:00:00`;
      await api.post('/calendar/events', {
        title: eventTitle.trim(),
        event_type: eventType,
        start_time: startTimeISO,
        end_time: startTimeISO
      });
    } catch (err) {
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-extrabold text-xl text-slate-900">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <span>September 2026</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-bold">
            {['Month', 'Week', 'Day'].map((v) => (
              <button
                key={v}
                onClick={() => setCurrentView(v)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  currentView === v ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={() => openAddModal(24)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Event</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-4">
        <div className="grid grid-cols-7 text-center text-xs font-extrabold text-slate-400 uppercase py-3 border-b border-slate-100">
          <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2">
          {daysInMonth.map((d) => {
            const dayEvents = events.filter(e => Number(e.day) === d);
            const isToday = d === 24;
            return (
              <div
                key={d}
                onClick={() => openAddModal(d)}
                className={`min-h-[100px] p-2 rounded-xl border transition cursor-pointer ${
                  isToday ? 'border-blue-500 bg-blue-50/20' : 'border-slate-100 hover:border-blue-300 bg-slate-50/30'
                }`}
              >
                <div className={`text-xs font-bold mb-1 flex items-center justify-between ${isToday ? 'text-blue-600 font-extrabold' : 'text-slate-700'}`}>
                  <span>{d} {isToday && '• Today'}</span>
                  <span className="text-[10px] text-slate-400 opacity-0 hover:opacity-100 transition">+</span>
                </div>

                <div className="space-y-1">
                  {dayEvents.map((ev, idx) => (
                    <div key={idx} className={`p-1.5 rounded-lg text-[10px] font-bold border truncate ${ev.color}`}>
                      <div className="truncate">{ev.title}</div>
                      <div className="text-[9px] opacity-80">{ev.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Event" maxWidth="max-w-md">
        <form onSubmit={handleAddEventSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Event Title</label>
            <input
              type="text"
              required
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="API Sync & Architecture Review"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none bg-white"
              >
                <option value="Meeting">Meeting</option>
                <option value="Milestone">Milestone</option>
                <option value="Deadline">Deadline</option>
                <option value="Task">Task</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Day of Month</label>
              <select
                value={eventDay}
                onChange={(e) => setEventDay(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-none bg-white"
              >
                {daysInMonth.map(d => (
                  <option key={d} value={d}>Day {d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Time</label>
            <input
              type="text"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              placeholder="10:00 AM"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-75"
          >
            {loading ? 'Adding Event...' : 'Add Event'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
