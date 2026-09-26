import React, { useState } from 'react';
import { Settings, Shield, User, Bell, Lock, Building2, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';

export default function SettingsTabs() {
  const { user, updateProfile } = useAuth();
  const { activeWorkspace, updateWorkspaceSettings } = useWorkspace();
  const [activeTab, setActiveTab] = useState('RBAC Roles');

  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [wsName, setWsName] = useState(activeWorkspace?.name || '');
  const [wsLoading, setWsLoading] = useState(false);
  const [wsSuccess, setWsSuccess] = useState(false);

  React.useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
    }
  }, [user]);

  React.useEffect(() => {
    if (activeWorkspace) {
      setWsName(activeWorkspace.name || '');
    }
  }, [activeWorkspace]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileName.trim() || !profileEmail.trim()) return;
    setProfileLoading(true);
    setProfileSuccess(false);

    await updateProfile(profileName.trim(), profileEmail.trim());

    setProfileLoading(false);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3500);
  };

  const handleSaveWorkspaceSettings = async (e) => {
    e.preventDefault();
    if (!wsName.trim()) return;
    setWsLoading(true);
    setWsSuccess(false);

    await updateWorkspaceSettings(activeWorkspace?.id || 1, wsName.trim());

    setWsLoading(false);
    setWsSuccess(true);
    setTimeout(() => setWsSuccess(false), 3500);
  };

  const rbacMatrix = [
    { feature: 'Create project', admin: true, manager: true, member: false, guest: false },
    { feature: 'Delete project', admin: true, manager: true, member: false, guest: false },
    { feature: 'Create task', admin: true, manager: true, member: true, guest: false },
    { feature: 'Comment', admin: true, manager: true, member: true, guest: true },
    { feature: 'Upload files', admin: true, manager: true, member: true, guest: 'Limited' },
    { feature: 'Manage members', admin: true, manager: true, member: false, guest: false }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Workspace & User Settings</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage permissions, profile, security, and workspace preferences.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 mt-4 overflow-x-auto">
          {['RBAC Roles', 'Workspace Settings', 'User Profile', 'Security & 2FA'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === t ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content: RBAC Matrix (Requirement 20 format) */}
      {activeTab === 'RBAC Roles' && (
        <div className="card-atlas p-6 space-y-4">
          <div>
            <h2 className="font-bold text-lg text-slate-900">Roles & Permissions Matrix (RBAC)</h2>
            <p className="text-xs text-slate-500">Default permissions applied across roles in {activeWorkspace?.name}.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-extrabold text-slate-700 uppercase">
                <tr>
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4">Admin</th>
                  <th className="py-3 px-4">Manager</th>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Guest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {rbacMatrix.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-bold">{r.feature}</td>
                    <td className="py-3 px-4">{r.admin ? <Check className="w-4 h-4 text-emerald-600 font-bold" /> : <X className="w-4 h-4 text-slate-300" />}</td>
                    <td className="py-3 px-4">{r.manager ? <Check className="w-4 h-4 text-emerald-600 font-bold" /> : <X className="w-4 h-4 text-slate-300" />}</td>
                    <td className="py-3 px-4">{r.member ? <Check className="w-4 h-4 text-emerald-600 font-bold" /> : <X className="w-4 h-4 text-slate-300" />}</td>
                    <td className="py-3 px-4">
                      {typeof r.guest === 'string' ? (
                        <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-2 py-0.5 rounded">{r.guest}</span>
                      ) : r.guest ? (
                        <Check className="w-4 h-4 text-emerald-600 font-bold" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'Workspace Settings' && (
        <form onSubmit={handleSaveWorkspaceSettings} className="card-atlas p-6 space-y-4 max-w-xl">
          <h2 className="font-bold text-lg text-slate-900">Workspace Information</h2>

          {wsSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Workspace settings saved successfully!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Workspace Name</label>
            <input
              type="text"
              required
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subscription Tier</label>
            <input type="text" disabled defaultValue={activeWorkspace?.subscription_plan || 'Pro'} className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-bold text-blue-600 bg-slate-50" />
          </div>
          <button
            type="submit"
            disabled={wsLoading}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm active:scale-95 disabled:opacity-75"
          >
            {wsLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      )}

      {activeTab === 'User Profile' && (
        <form onSubmit={handleUpdateProfile} className="card-atlas p-6 space-y-4 max-w-xl">
          <h2 className="font-bold text-lg text-slate-900">User Profile</h2>

          {profileSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              required
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email</label>
            <input
              type="email"
              required
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={profileLoading}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-sm active:scale-95 disabled:opacity-75"
          >
            {profileLoading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      )}

      {activeTab === 'Security & 2FA' && (
        <div className="card-atlas p-6 space-y-4 max-w-xl">
          <h2 className="font-bold text-lg text-slate-900">Security & Two-Factor Authentication</h2>
          <p className="text-xs text-slate-500">Protect your account with extra security authentication layers.</p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-sm text-slate-900">Two-Factor Authentication (2FA)</div>
              <div className="text-xs text-slate-500">Use authenticator apps for secure access.</div>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-200">Enabled</span>
          </div>
        </div>
      )}
    </div>
  );
}
