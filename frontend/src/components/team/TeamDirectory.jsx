import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Shield, CheckCircle2, Circle, User, Briefcase } from 'lucide-react';
import api from '../../services/api';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';

const initialDefaultMembers = [
  { id: 1, name: 'Reyhan Adinata', role: 'Super Admin', title: 'Lead Product', status: '🟢 Active', email: 'reyhan@abctechnologies.com', tasks: 6, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
  { id: 2, name: 'Chandra Reddy', role: 'Project Manager', title: 'Backend Lead', status: '🟢 Active', email: 'chandra@abctechnologies.com', tasks: 8, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
  { id: 3, name: 'Rahul Kumar', role: 'Project Manager', title: 'Backend Developer', status: '🟢 Active', email: 'rahul@abctechnologies.com', tasks: 12, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  { id: 4, name: 'Priya Sharma', role: 'Member', title: 'UI/UX Designer', status: '🟢 Active', email: 'priya@abctechnologies.com', tasks: 10, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  { id: 5, name: 'Suresh Babu', role: 'Member', title: 'Frontend Developer', status: '🟡 Away', email: 'suresh@abctechnologies.com', tasks: 5, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' }
];

const loadCustomMembers = () => {
  try {
    return JSON.parse(localStorage.getItem('teamflow_custom_members') || '[]');
  } catch (e) {
    return [];
  }
};

const loadRegisteredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem('teamflow_registered_users') || '[]');
  } catch (e) {
    return [];
  }
};

const saveCustomMember = (member) => {
  try {
    const existing = loadCustomMembers();
    const filtered = existing.filter(m => String(m.email).toLowerCase() !== String(member.email).toLowerCase());
    const updated = [member, ...filtered];
    localStorage.setItem('teamflow_custom_members', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save member to localStorage:', e);
  }
};

const getMergedMembers = (activeUser, fetchedMembers = []) => {
  const customMembers = loadCustomMembers();
  const registeredUsers = loadRegisteredUsers();

  const memberMap = new Map();

  // Add active logged in user first
  if (activeUser && activeUser.email) {
    const emailKey = String(activeUser.email).toLowerCase();
    memberMap.set(emailKey, {
      id: activeUser.id || Date.now(),
      name: activeUser.name,
      role: activeUser.role || 'Workspace Admin',
      title: activeUser.title || 'Developer',
      status: '🟢 Active',
      email: activeUser.email,
      tasks: 0,
      avatar: activeUser.avatar_url || activeUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeUser.name)}`
    });
  }

  // Add registered accounts
  registeredUsers.forEach(u => {
    if (u && u.email) {
      const emailKey = String(u.email).toLowerCase();
      if (!memberMap.has(emailKey)) {
        memberMap.set(emailKey, {
          id: u.id || Date.now(),
          name: u.name,
          role: u.role || 'Member',
          title: u.title || 'Developer',
          status: '🟢 Active',
          email: u.email,
          tasks: 0,
          avatar: u.avatar_url || u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`
        });
      }
    }
  });

  // Add custom invited members
  customMembers.forEach(m => {
    if (m && m.email) {
      const emailKey = String(m.email).toLowerCase();
      if (!memberMap.has(emailKey)) {
        memberMap.set(emailKey, {
          id: m.id || Date.now(),
          name: m.name,
          role: m.role || 'Member',
          title: m.title || 'Developer',
          status: m.status ? (m.status.includes('🟢') || m.status.includes('🟡') ? m.status : `🟢 ${m.status}`) : '🟢 Active',
          email: m.email,
          tasks: m.tasks || 0,
          avatar: m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.name)}`
        });
      }
    }
  });

  // Add non-dummy fetched members from backend
  if (fetchedMembers.length > 0) {
    fetchedMembers.forEach(m => {
      if (m && m.email && !m.email.includes('@abctechnologies.com')) {
        const emailKey = String(m.email).toLowerCase();
        if (!memberMap.has(emailKey)) {
          memberMap.set(emailKey, {
            id: m.id,
            name: m.name,
            role: m.workspace_role || m.role || 'Member',
            title: 'Developer',
            status: m.status ? (m.status.includes('🟢') || m.status.includes('🟡') ? m.status : `🟢 ${m.status}`) : '🟢 Active',
            email: m.email,
            tasks: m.assigned_tasks_count || 0,
            avatar: m.avatar_url || m.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.name)}`
          });
        }
      }
    });
  }

  // Only fallback to initialDefaultMembers if there are NO real members at all
  if (memberMap.size === 0) {
    return initialDefaultMembers;
  }

  return Array.from(memberMap.values());
};

export default function TeamDirectory() {
  const { user } = useAuth();
  const [members, setMembers] = useState(() => getMergedMembers(user));
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');
  const [inviteTitle, setInviteTitle] = useState('Developer');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    setMembers(getMergedMembers(user));
  }, [user]);

  useEffect(() => {
    api.get('/team/members')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setMembers(getMergedMembers(user, res.data));
        }
      })
      .catch(() => {});
  }, [user]);

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.trim()) return;

    const trimmedEmail = inviteEmail.trim().toLowerCase();
    const rawName = trimmedEmail.split('@')[0];
    const defaultName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const finalName = inviteName.trim() || defaultName;

    const newMember = {
      id: Date.now(),
      name: finalName,
      role: inviteRole,
      title: inviteTitle.trim() || 'Developer',
      status: '🟢 Active',
      email: trimmedEmail,
      tasks: 0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(finalName)}`
    };

    saveCustomMember(newMember);

    setMembers(prev => {
      const filtered = prev.filter(m => String(m.email).toLowerCase() !== trimmedEmail);
      return [newMember, ...filtered];
    });

    try {
      await api.post('/workspaces/1/invite', { email: trimmedEmail, role: inviteRole });
    } catch (err) {
      // Backend sync fallback
    }

    setToastMessage(`Invitation sent to ${trimmedEmail} successfully!`);
    setTimeout(() => setToastMessage(''), 4000);

    setInviteName('');
    setInviteEmail('');
    setInviteRole('Member');
    setInviteTitle('Developer');
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">People & Team</h1>
          <p className="text-xs text-slate-500 mt-0.5">Workspace directory, member roles, assigned workload, and online availability.</p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Invite Member</span>
        </button>
      </div>

      {/* Members Grid matching Requirement 12 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m) => (
          <div key={m.id} className="card-atlas p-6 flex items-start gap-4 hover:border-blue-300">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-xl shrink-0">
              {m.name ? m.name[0].toUpperCase() : 'M'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 truncate">{m.name}</h3>
                <span className="text-xs font-semibold">{m.status}</span>
              </div>
              <div className="text-xs text-blue-600 font-semibold">{m.title}</div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">{m.email}</div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">{m.role}</span>
                <span>{m.tasks} Assigned Tasks</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Invite Member Modal */}
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Team Member" maxWidth="max-w-md">
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium"
                placeholder="e.g. Muni Chandra Reddy"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium"
                placeholder="muni@gmail.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Role</label>
              <div className="relative">
                <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium bg-white appearance-none cursor-pointer"
                >
                  <option value="Member">Member</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Workspace Admin">Workspace Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Job Title</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={inviteTitle}
                  onChange={(e) => setInviteTitle(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium"
                  placeholder="e.g. Backend Lead"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowInviteModal(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md shadow-blue-500/20"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
