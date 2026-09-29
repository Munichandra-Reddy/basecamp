import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, User, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AuthView() {
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (isSignUp) {
      if (!name || !email || !password) {
        setErrorMsg('Please fill in all required fields.');
        setIsLoading(false);
        return;
      }
      const res = await register(name, email, password, confirmPassword);
      if (!res.success) {
        setErrorMsg(res.error || 'Registration failed.');
      }
    } else {
      if (!email || !password) {
        setErrorMsg('Please enter your email and password.');
        setIsLoading(false);
        return;
      }
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Invalid email or password.');
      }
    }
    setIsLoading(false);
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    await login('karthik@workorbit.io', 'demo1234');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden text-slate-100">
      {/* Glow Effects Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-slate-800/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/80 shadow-2xl space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-blue-500/30 mx-auto">
            W
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">WorkOrbit</h1>
            <p className="text-xs text-blue-400 font-mono font-semibold uppercase tracking-wider mt-0.5">
              Basecamp 2026 Work Management System
            </p>
          </div>
        </div>

        {/* Tab Toggle: Sign In / Create Account */}
        <div className="grid grid-cols-2 p-1 bg-slate-900/80 rounded-xl border border-slate-700/60 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg('');
            }}
            className={`py-2 rounded-lg transition ${!isSignUp ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg('');
            }}
            className={`py-2 rounded-lg transition ${isSignUp ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isSignUp && (
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Karthik Raja"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 transition font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 transition font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 transition font-medium"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase block mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 transition font-medium"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            <span>{isSignUp ? 'Create Workspace Account' : 'Sign In to WorkOrbit'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="pt-4 border-t border-slate-700/60 space-y-2">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-600/60 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>⚡ Demo Quick Login (Karthik Raja)</span>
          </button>
          <p className="text-[10px] text-slate-400 text-center">
            Secured with 256-bit encryption & Basecamp multi-workspace Auth
          </p>
        </div>
      </div>
    </div>
  );
}
