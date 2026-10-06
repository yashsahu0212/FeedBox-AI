import React, { useState, useEffect } from 'react';
import AdminOverviewCards from './AdminOverviewCards';
import AdminReportsTable from './AdminReportsTable';
import AdminReportDetailModal from './AdminReportDetailModal';
import AdminAnalytics from './AdminAnalytics';
import {
  getDepartmentReports,
  updateReportStatusInDb,
  postReportCommentInDb,
  logoutAdminUser,
  DEPARTMENTS_LIST,
  DEMO_ADMINS,
  loginAdminUser
} from '../../lib/supabase';

export default function AdminDashboard({ adminUser, onLogout, onSwitchAdmin }) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' | 'analytics'
  const [toastAlert, setToastAlert] = useState('');

  const isSuperAdmin = adminUser.role === 'super_admin';
  const deptName = isSuperAdmin ? 'Super Admin (All Departments)' : (adminUser.department?.name || 'Department Desk');

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await getDepartmentReports(adminUser.department_id, isSuperAdmin);
      setReports(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [adminUser]);

  const handleUpdateStatus = async (reportId, newStatus, note) => {
    const updated = await updateReportStatusInDb(reportId, newStatus, note, adminUser);
    setToastAlert(`Report #${reportId.slice(0, 10)} status updated to ${newStatus.toUpperCase()}`);
    loadReports();
    if (selectedReport && selectedReport.id === reportId) {
      setSelectedReport(updated);
    }
  };

  const handleAddComment = async (reportId, commentText) => {
    await postReportCommentInDb(reportId, commentText, adminUser);
    setToastAlert('Department admin comment posted');
    loadReports();
  };

  const handleQuickDepartmentChange = async (e) => {
    const code = e.target.value;
    const targetAdmin = DEMO_ADMINS.find(a => a.deptCode === code);
    if (targetAdmin) {
      const profile = await loginAdminUser(targetAdmin.email, 'password123');
      onSwitchAdmin(profile);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full py-6 sm:py-10 px-4 sm:px-6 flex flex-col gap-6">
      
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl shadow-xs border border-[#e5e2e1] p-5 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Left: Department Title & Status */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#1b1b1e] text-white flex items-center justify-center font-bold text-base shadow-2xs shrink-0">
            {isSuperAdmin ? 'SA' : (adminUser.department?.code || 'DEPT')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-label-sm text-xs uppercase tracking-wider text-[#39618c] font-bold">
                Logged in as {adminUser.name}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h1 className="font-display-lg text-2xl sm:text-3xl text-[#1c1b1c] font-semibold tracking-tight">
              {deptName} Dashboard
            </h1>
          </div>
        </div>

        {/* Right: Quick Switcher & Logout */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#e5e2e1]">
          {/* Department Switcher Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#f7f3f2] px-3 py-1.5 rounded-xl border border-[#e5e2e1] text-xs">
            <span className="text-[#77767b] font-medium hidden sm:inline">Switch Dept:</span>
            <select
              value={adminUser.department?.code || 'CTS'}
              onChange={handleQuickDepartmentChange}
              className="bg-transparent font-bold text-[#1c1b1c] focus:outline-none cursor-pointer"
            >
              {DEPARTMENTS_LIST.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              logoutAdminUser();
              onLogout();
            }}
            className="px-3.5 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base select-none">logout</span>
            <span>Sign Out</span>
          </button>
        </div>

      </div>

      {/* RLS Enforcement Notice */}
      <div className="px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#001d36] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-[#39618c] select-none">shield_lock</span>
          <span>
            <strong>Supabase RLS Policy Active:</strong> {isSuperAdmin ? 'Super-admin unrestricted access.' : `Authorized exclusively to view & manage reports for ${deptName}. Reports assigned to other departments are restricted.`}
          </span>
        </div>
        <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-blue-200 hidden sm:inline">
          RLS: auth.uid() = department_id
        </span>
      </div>

      {/* Overview Metric Cards */}
      <AdminOverviewCards reports={reports} />

      {/* Tab Navigation */}
      <div className="flex items-center gap-4 border-b border-[#e5e2e1] pb-2">
        <button
          onClick={() => setActiveTab('reports')}
          className={`font-label-md text-xs sm:text-sm font-semibold pb-2 border-b-2 transition-colors flex items-center gap-1.5 focus:outline-none ${
            activeTab === 'reports'
              ? 'text-[#1c1b1c] border-[#1b1b1e]'
              : 'text-[#77767b] border-transparent hover:text-[#1c1b1c]'
          }`}
        >
          <span className="material-symbols-outlined text-base">list_alt</span>
          <span>Reports Management ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`font-label-md text-xs sm:text-sm font-semibold pb-2 border-b-2 transition-colors flex items-center gap-1.5 focus:outline-none ${
            activeTab === 'analytics'
              ? 'text-[#1c1b1c] border-[#1b1b1e]'
              : 'text-[#77767b] border-transparent hover:text-[#1c1b1c]'
          }`}
        >
          <span className="material-symbols-outlined text-base">analytics</span>
          <span>Department Analytics</span>
        </button>
      </div>

      {/* Main Tab Content */}
      {isLoading ? (
        <div className="p-12 text-center text-[#77767b] bg-white rounded-2xl border border-[#e5e2e1]">
          <span className="material-symbols-outlined text-3xl animate-spin mb-2 select-none">sync</span>
          <p className="text-sm font-medium">Fetching department reports from Supabase...</p>
        </div>
      ) : activeTab === 'reports' ? (
        <AdminReportsTable
          reports={reports}
          onSelectReport={(rep) => setSelectedReport(rep)}
        />
      ) : (
        <AdminAnalytics
          reports={reports}
          departmentName={deptName}
        />
      )}

      {/* Detailed Inspection Modal */}
      {selectedReport && (
        <AdminReportDetailModal
          report={selectedReport}
          adminUser={adminUser}
          onClose={() => setSelectedReport(null)}
          onUpdateStatus={handleUpdateStatus}
          onAddComment={handleAddComment}
        />
      )}

      {/* Notification Toast */}
      {toastAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1b1b1e] text-white px-4 py-3 rounded-xl shadow-xl text-xs flex items-center gap-2 border border-[#47464b] animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
          <span>{toastAlert}</span>
          <button onClick={() => setToastAlert('')} className="ml-2 text-slate-400 hover:text-white">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

    </div>
  );
}
