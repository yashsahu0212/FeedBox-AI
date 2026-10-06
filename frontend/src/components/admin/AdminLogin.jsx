import React, { useState } from 'react';
import { loginAdminUser, DEMO_ADMINS, DEPARTMENTS_LIST } from '../../lib/supabase';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('cts.admin@college.edu');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const adminProfile = await loginAdminUser(email, password);
      setIsLoading(false);
      onLoginSuccess(adminProfile);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Invalid credentials or department mapping error.');
    }
  };

  const handleQuickDemoLogin = async (demoAdmin) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const adminProfile = await loginAdminUser(demoAdmin.email, 'password123');
      setIsLoading(false);
      onLoginSuccess(adminProfile);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center py-10 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-[#e5e2e1] p-6 sm:p-8 flex flex-col gap-6">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-[#1b1b1e] text-white flex items-center justify-center font-bold text-lg mb-3 shadow-sm">
            CAI
          </div>
          <span className="font-code-sm text-xs text-[#39618c] font-semibold uppercase tracking-wider">
            Supabase PostgreSQL Auth
          </span>
          <h1 className="font-display-lg text-2xl text-[#1c1b1c] font-bold mt-1">
            Department Admin Portal
          </h1>
          <p className="font-body-sm text-xs text-[#47464b] mt-1.5 leading-relaxed">
            Authenticated department authorization. System automatically maps your role to your assigned department dashboard.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-base select-none">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="admin-email" className="block text-xs font-semibold text-[#1c1b1c] mb-1">
              Admin Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@college.edu"
              className="w-full bg-[#f7f3f2] text-xs p-3 rounded-xl border border-[#e5e2e1] text-[#1c1b1c] focus:outline-none focus:ring-2 focus:ring-[#1b1b1e] focus:bg-white transition-all"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold text-[#1c1b1c] mb-1">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#f7f3f2] text-xs p-3 rounded-xl border border-[#e5e2e1] text-[#1c1b1c] focus:outline-none focus:ring-2 focus:ring-[#1b1b1e] focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-[#1b1b1e] text-white font-label-md text-xs font-medium rounded-xl hover:bg-[#313030] active:scale-[0.99] disabled:opacity-50 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                <span>Authenticating with Supabase...</span>
              </>
            ) : (
              <>
                <span>Login to Department Desk</span>
                <span className="material-symbols-outlined text-base">login</span>
              </>
            )}
          </button>
        </form>

        {/* Separation Hairline */}
        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e5e2e1]"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono">
            <span className="bg-white px-2 text-[#77767b]">Fast Demo Department Switcher</span>
          </div>
        </div>

        {/* Quick Demo Department Switcher Buttons */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] text-[#47464b] font-medium text-center">
            Click to test department-specific RLS & Dashboards:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {DEMO_ADMINS.slice(0, 9).map((admin) => (
              <button
                key={admin.deptCode}
                type="button"
                onClick={() => handleQuickDemoLogin(admin)}
                className="px-2 py-1.5 rounded-lg border border-[#e5e2e1] bg-[#f7f3f2] hover:bg-[#1b1b1e] hover:text-white transition-all text-left text-[11px] flex flex-col cursor-pointer"
              >
                <span className="font-bold">{admin.deptCode}</span>
                <span className="text-[10px] opacity-80 truncate">{admin.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
