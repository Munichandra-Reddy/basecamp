import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onSuccess, onSwitchToRegister }) {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your registered email and password.');
      return;
    }
    const res = await login(email, password);
    if (res.success) {
      onClose();
      if (onSuccess) onSuccess();
    } else {
      setError(res.error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Login to WorkOrbit" maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
            <button type="button" className="text-xs font-semibold text-blue-600 hover:underline">Forgot Password?</button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-sm font-medium"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
            />
            <span>Remember me</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-md shadow-blue-500/20"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {onSwitchToRegister && (
          <div className="text-center pt-2 text-xs text-slate-600 font-medium">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-bold text-blue-600 hover:underline"
            >
              Create an Account
            </button>
          </div>
        )}
      </form>
    </Modal>
  );
}
