import React, { useState } from 'react';
import {
  loginStudentUser,
  loginAdminUser,
  DEMO_STUDENTS,
  DEMO_ADMINS
} from '../lib/supabase';

export default function LoginPage({ onLoginSuccess }) {
  const [activeRoleTab, setActiveRoleTab] = useState('student'); // 'student' | 'admin'
  
  // Student form state
  const [studentInput, setStudentInput] = useState('student@college.edu');
  const [studentPassword, setStudentPassword] = useState('student123');

  // Admin form state
  const [adminEmail, setAdminEmail] = useState('cts.admin@college.edu');
  const [adminPassword, setAdminPassword] = useState('password123');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Student Form Submit
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const userProfile = await loginStudentUser(studentInput, studentPassword);
      setIsLoading(false);
      onLoginSuccess(userProfile);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Invalid student credentials.');
    }
  };

  // Handle Admin Form Submit
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const adminProfile = await loginAdminUser(adminEmail, adminPassword);
      setIsLoading(false);
      onLoginSuccess(adminProfile);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Invalid admin credentials or department mapping error.');
    }
  };

  // Quick Demo Login Handler
  const handleQuickStudentLogin = async (student) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const userProfile = await loginStudentUser(student.email, 'student123');
      setIsLoading(false);
      onLoginSuccess(userProfile);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message);
    }
  };

  const handleQuickAdminLogin = async (admin) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const adminProfile = await loginAdminUser(admin.email, 'password123');
      setIsLoading(false);
      onLoginSuccess(adminProfile);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8f8] flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 selection:bg-[#e2dfe1]">
      
      {/* Background Decor Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-100/40 blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-amber-100/30 blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-slate-200/40 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Branding & Portal Benefits */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1b1b1e] text-white flex items-center justify-center font-bold text-xl tracking-tighter shadow-md">
              CAI
            </div>
            <div>
              <span className="font-code-sm text-xs text-[#39618c] font-bold uppercase tracking-wider block">
                Campus AI Maintenance Portal
              </span>
              <h1 className="font-headline-sm font-bold text-2xl text-[#1c1b1c] tracking-tight">
                CampusAI Portal
              </h1>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1c1b1c] tracking-tight leading-snug">
              Unified Campus Issue Reporting & Resolution Desk
            </h2>
            <p className="font-body-sm text-sm text-[#47464b] mt-2 leading-relaxed">
              Please sign in with your credentials. Authenticated access ensures student report tracking and department RLS security.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-col gap-3.5 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#e5e2e1] shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#39618c] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">smart_toy</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1c1b1c]">Automatic AI Routing</h4>
                <p className="text-[11px] text-[#77767b]">Reports are classified & dispatched directly to the responsible department.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#e5e2e1] shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">verified_user</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1c1b1c]">Role-Based Security</h4>
                <p className="text-[11px] text-[#77767b]">Dedicated interfaces for Student submissions and Department Staff management.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/70 border border-[#e5e2e1] shadow-2xs">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">timeline</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1c1b1c]">Real-Time Status Tracking</h4>
                <p className="text-[11px] text-[#77767b]">Live resolution updates, timeline logs, and direct comments from staff.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Unified Dual Login Form Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl border border-[#e5e2e1] p-6 sm:p-8 flex flex-col gap-6">
          
          {/* Dual Role Selector Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-[#f7f3f2] rounded-2xl border border-[#e5e2e1]">
            <button
              type="button"
              onClick={() => {
                setActiveRoleTab('student');
                setErrorMsg('');
              }}
              className={`py-2.5 px-3 rounded-xl font-label-md text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeRoleTab === 'student'
                  ? 'bg-white text-[#1c1b1c] shadow-xs'
                  : 'text-[#77767b] hover:text-[#1c1b1c]'
              }`}
            >
              <span className="material-symbols-outlined text-base">school</span>
              <span>Student Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRoleTab('admin');
                setErrorMsg('');
              }}
              className={`py-2.5 px-3 rounded-xl font-label-md text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeRoleTab === 'admin'
                  ? 'bg-[#1b1b1e] text-white shadow-xs'
                  : 'text-[#77767b] hover:text-[#1c1b1c]'
              }`}
            >
              <span className="material-symbols-outlined text-base">shield_person</span>
              <span>Admin Staff Login</span>
            </button>
          </div>

          {/* Alert Message Box */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-base shrink-0 select-none">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form Header */}
          <div>
            <h3 className="text-lg font-bold text-[#1c1b1c]">
              {activeRoleTab === 'student' ? 'Student Account Portal' : 'Department Staff Authorization'}
            </h3>
            <p className="text-xs text-[#77767b] mt-0.5">
              {activeRoleTab === 'student'
                ? 'Sign in using your institutional email or Roll Number to access your tickets.'
                : 'Sign in with your department email to manage ticket queues and RLS data.'}
            </p>
          </div>

          {/* STUDENT LOGIN FORM */}
          {activeRoleTab === 'student' && (
            <form onSubmit={handleStudentSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="student-id" className="block text-xs font-semibold text-[#1c1b1c] mb-1.5">
                  Email Address or Roll Number
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-[#77767b]">
                    badge
                  </span>
                  <input
                    id="student-id"
                    type="text"
                    required
                    value={studentInput}
                    onChange={(e) => setStudentInput(e.target.value)}
                    placeholder="student@college.edu or 21CS042"
                    className="w-full bg-[#f7f3f2] text-xs pl-10 pr-3 py-3 rounded-xl border border-[#e5e2e1] text-[#1c1b1c] focus:outline-none focus:ring-2 focus:ring-[#1b1b1e] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="student-pass" className="block text-xs font-semibold text-[#1c1b1c] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-[#77767b]">
                    lock
                  </span>
                  <input
                    id="student-pass"
                    type="password"
                    required
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#f7f3f2] text-xs pl-10 pr-3 py-3 rounded-xl border border-[#e5e2e1] text-[#1c1b1c] focus:outline-none focus:ring-2 focus:ring-[#1b1b1e] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#1b1b1e] text-white font-label-md text-xs font-medium rounded-xl hover:bg-[#313030] active:scale-[0.99] disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    <span>Signing in as Student...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Student Portal</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ADMIN STAFF LOGIN FORM */}
          {activeRoleTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="admin-email-input" className="block text-xs font-semibold text-[#1c1b1c] mb-1.5">
                  Department Admin Email
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-[#77767b]">
                    mail
                  </span>
                  <input
                    id="admin-email-input"
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="cts.admin@college.edu"
                    className="w-full bg-[#f7f3f2] text-xs pl-10 pr-3 py-3 rounded-xl border border-[#e5e2e1] text-[#1c1b1c] focus:outline-none focus:ring-2 focus:ring-[#1b1b1e] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-pass-input" className="block text-xs font-semibold text-[#1c1b1c] mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-[#77767b]">
                    key
                  </span>
                  <input
                    id="admin-pass-input"
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#f7f3f2] text-xs pl-10 pr-3 py-3 rounded-xl border border-[#e5e2e1] text-[#1c1b1c] focus:outline-none focus:ring-2 focus:ring-[#1b1b1e] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#39618c] text-white font-label-md text-xs font-semibold rounded-xl hover:bg-[#2c4e73] active:scale-[0.99] disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    <span>Authenticating Department Admin...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate Admin Staff</span>
                    <span className="material-symbols-outlined text-base">verified</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Hairline Divider */}
          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#e5e2e1]"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-white px-2 text-[#77767b]">
                {activeRoleTab === 'student' ? 'Quick Demo Student Accounts' : 'Quick Demo Admin Departments'}
              </span>
            </div>
          </div>

          {/* QUICK DEMO ACCOUNTS */}
          {activeRoleTab === 'student' ? (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] text-[#77767b] font-medium text-center">
                Click any demo profile for instant student login:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {DEMO_STUDENTS.map((st) => (
                  <button
                    key={st.rollNumber}
                    type="button"
                    onClick={() => handleQuickStudentLogin(st)}
                    className="p-2.5 rounded-xl border border-[#e5e2e1] bg-[#f7f3f2] hover:bg-[#1b1b1e] hover:text-white transition-all text-left flex items-center gap-2.5 cursor-pointer group"
                  >
                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-black/10"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate group-hover:text-white">{st.name}</p>
                      <p className="text-[10px] opacity-75 truncate">{st.rollNumber}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] text-[#77767b] font-medium text-center">
                Click to test department-specific RLS & Dashboards:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {DEMO_ADMINS.slice(0, 6).map((admin) => (
                  <button
                    key={admin.deptCode}
                    type="button"
                    onClick={() => handleQuickAdminLogin(admin)}
                    className="px-2.5 py-2 rounded-xl border border-[#e5e2e1] bg-[#f7f3f2] hover:bg-[#39618c] hover:text-white transition-all text-left text-[11px] flex flex-col cursor-pointer"
                  >
                    <span className="font-bold">{admin.deptCode} Desk</span>
                    <span className="text-[10px] opacity-80 truncate">{admin.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
