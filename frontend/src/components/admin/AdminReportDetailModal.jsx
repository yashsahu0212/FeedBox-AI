import React, { useState } from 'react';
import { getLocalHistory, getLocalComments } from '../../lib/supabase';

export default function AdminReportDetailModal({
  report,
  adminUser,
  onClose,
  onUpdateStatus,
  onAddComment
}) {
  const [prevReportId, setPrevReportId] = useState(report?.id);
  const [selectedStatus, setSelectedStatus] = useState(report?.status || 'submitted');
  const [statusNote, setStatusNote] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Keep selectedStatus in sync if report updates
  if (report && report.id !== prevReportId) {
    setPrevReportId(report.id);
    setSelectedStatus(report.status);
    setStatusNote('');
  }

  if (!report) return null;

  const history = getLocalHistory(report.id);
  const comments = getLocalComments(report.id);

  // Merge history and comments into a unified chronological timeline
  const mergedTimeline = [
    ...history.map(h => ({
      type: 'status',
      id: h.id,
      title: `Status changed to ${h.new_status}`,
      by: h.changed_by_name || 'Admin',
      note: h.note,
      timestamp: h.created_at
    })),
    ...comments.map(c => ({
      type: 'comment',
      id: c.id,
      title: 'Comment Added',
      by: `${c.admin_name} (${c.department_name})`,
      note: c.comment,
      timestamp: c.created_at
    }))
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const handleApplyStatus = async () => {
    if (selectedStatus === report.status && !statusNote.trim()) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(
        report.id,
        selectedStatus,
        statusNote.trim() || `Status updated from ${report.status} to ${selectedStatus}`
      );
      setStatusNote('');
      setSuccessMsg(`Status updated to ${selectedStatus.toUpperCase()}!`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (st) => {
    switch (st?.toLowerCase()) {
      case 'submitted':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'processing':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'rejected':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsUpdating(true);
    try {
      await onAddComment(report.id, newComment.trim());
      setNewComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border border-[#e5e2e1] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#e5e2e1] flex items-center justify-between bg-[#f7f3f2]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-[#39618c]">description</span>
            <div>
              <span className="font-mono text-xs text-[#77767b] font-bold block">
                TICKET #{report.id}
              </span>
              <h2 className="font-headline-md text-base sm:text-lg font-bold text-[#1c1b1c] line-clamp-1">
                {report.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#77767b] hover:text-[#1c1b1c] hover:bg-[#e5e2e1] rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-xl select-none">close</span>
          </button>
        </div>

        {/* TOP PINNED STATUS TRIAGE & MANAGEMENT BAR (NO SCROLLING NEEDED) */}
        <div className="bg-[#1b1b1e] text-white px-6 py-4 border-b border-[#313030] flex flex-col gap-3 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-lg">tune</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Live Status Control & Action Desk
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Current Status:</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(report.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {report.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Interactive Status Switcher Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'submitted', label: 'Submitted', icon: 'schedule' },
              { id: 'processing', label: 'Processing', icon: 'sync' },
              { id: 'resolved', label: 'Resolved', icon: 'check_circle' },
              { id: 'rejected', label: 'Rejected', icon: 'cancel' }
            ].map(({ id, label, icon }) => {
              const isSelected = (selectedStatus || '').toLowerCase() === id;
              const isCurrent = (report.status || '').toLowerCase() === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedStatus(id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? (id === 'resolved'
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-xs ring-2 ring-emerald-300'
                          : id === 'processing'
                          ? 'bg-blue-600 text-white border-blue-400 shadow-xs ring-2 ring-blue-300'
                          : id === 'submitted'
                          ? 'bg-amber-500 text-white border-amber-400 shadow-xs ring-2 ring-amber-300'
                          : 'bg-rose-600 text-white border-rose-400 shadow-xs ring-2 ring-rose-300')
                      : 'bg-[#2b2b2e] text-slate-300 border-[#3f3e42] hover:bg-[#38373b] hover:text-white'
                  }`}
                >
                  <span className={`material-symbols-outlined text-sm ${isSelected && id === 'processing' ? 'animate-spin' : ''}`}>
                    {icon}
                  </span>
                  <span>{label}</span>
                  {isCurrent && (
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-white/20 text-white font-mono ml-0.5">
                      Live
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Transition Note Input & Enter / Apply Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-xs text-slate-400">
                edit_note
              </span>
              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyStatus();
                  }
                }}
                placeholder="Status change note (e.g. Technician dispatched)... Press Enter or click button to save"
                className="w-full bg-[#2b2b2e] text-xs pl-8 pr-3 py-2.5 rounded-xl border border-[#3f3e42] text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>

            <button
              type="button"
              onClick={handleApplyStatus}
              disabled={isUpdating || ((selectedStatus || '').toLowerCase() === (report.status || '').toLowerCase() && !statusNote.trim())}
              className={`h-10 px-5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md whitespace-nowrap ${
                (selectedStatus || '').toLowerCase() !== (report.status || '').toLowerCase() || statusNote.trim()
                  ? 'bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold ring-2 ring-emerald-300 animate-pulse'
                  : 'bg-[#38373b] text-slate-400 cursor-not-allowed border border-[#47464b]'
              }`}
            >
              {isUpdating ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span>Enter / Apply Update</span>
                  <span className="material-symbols-outlined text-sm font-bold">keyboard_return</span>
                </>
              )}
            </button>
          </div>

          {/* Contextual notice */}
          {(selectedStatus || '').toLowerCase() !== (report.status || '').toLowerCase() && (
            <div className="text-[11px] text-amber-300 flex items-center gap-1.5 pt-0.5 animate-in fade-in">
              <span className="material-symbols-outlined text-sm">notification_important</span>
              <span>
                Target transition: <strong>{report.status}</strong> → <strong>{selectedStatus.toUpperCase()}</strong>. Click <strong>Enter / Apply Update</strong> (or press Enter key) to save change.
              </span>
            </div>
          )}

          {successMsg && (
            <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-0.5 animate-in fade-in">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Body Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT 7 COLS: Report Specs & Status Actions */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            {/* Badges & Editable Admin Overrides */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                report.priority === 'urgent'
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : report.priority === 'high'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {report.priority || report.urgency || 'MEDIUM'} Priority
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wider">
                {report.category || 'General'}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#d1e4ff] text-[#001d36] uppercase tracking-wider">
                Status: {report.status}
              </span>
            </div>

            {/* Description */}
            <div className="bg-[#f7f3f2] p-4 rounded-xl border border-[#e5e2e1]">
              <h3 className="text-xs font-bold text-[#47464b] uppercase mb-1.5 flex items-center justify-between">
                <span>Original Student Complaint</span>
                <span className="font-mono text-[10px] text-[#77767b]">Exact verbatim</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#1c1b1c] leading-relaxed whitespace-pre-line font-medium">
                “{report.description || report.original_text || report.title}”
              </p>
            </div>

            {/* Location & Times */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-[#e5e2e1]">
              <div>
                <span className="text-[#77767b] block font-bold">Extracted Location</span>
                <span className="font-semibold text-[#1c1b1c]">{report.location || 'Campus Main'}</span>
              </div>
              <div>
                <span className="text-[#77767b] block font-bold">Submission Timestamp</span>
                <span className="font-semibold text-[#1c1b1c]">
                  {new Date(report.created_at || Date.now()).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Department Assignment & Classification */}
            <div className="bg-[#f7f3f2] p-4 rounded-xl border border-[#e5e2e1] text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between font-bold text-[#1c1b1c]">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-[#39618c]">assignment_turned_in</span>
                  Department Assignment & Category
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1 text-slate-800">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#47464b] uppercase">Assigned Dept:</label>
                  <select
                    value={report.department_name || report.department || 'Hostel Committee'}
                    onChange={(e) => onUpdateStatus(report.id, report.status, `Reassigned department to ${e.target.value}`)}
                    className="bg-white border border-[#c8c5cb] rounded-lg p-1.5 font-bold text-xs cursor-pointer text-[#1c1b1c]"
                  >
                    <option value="CTS">CTS (Technical)</option>
                    <option value="Hostel Committee">Hostel Committee</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Security">Security</option>
                    <option value="Academic">Academic</option>
                    <option value="Accounts">Accounts / Finance</option>
                    <option value="Mess">Mess Services</option>
                    <option value="Transport">Transport</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#47464b] uppercase">Category:</label>
                  <select
                    value={['Complaint', 'Issue', 'Feedback', 'Compliment'].find(c => c.toLowerCase() === (report.category || '').toLowerCase()) || 'Issue'}
                    onChange={(e) => onUpdateStatus(report.id, report.status, `Updated category to ${e.target.value}`)}
                    className="bg-white border border-[#c8c5cb] rounded-lg p-1.5 font-bold text-xs cursor-pointer text-[#1c1b1c]"
                  >
                    <option value="Complaint">Complaint</option>
                    <option value="Issue">Issue</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Compliment">Compliment</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-[#47464b] uppercase">Urgency:</label>
                  <select
                    value={['Low', 'Medium', 'High', 'Critical'].find(u => u.toLowerCase() === (report.urgency || report.priority || '').toLowerCase()) || 'Medium'}
                    onChange={(e) => onUpdateStatus(report.id, report.status, `Changed urgency to ${e.target.value}`)}
                    className="bg-white border border-[#c8c5cb] rounded-lg p-1.5 font-bold text-xs cursor-pointer text-[#1c1b1c]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {report.ai_classification && (
                <div className="text-[11px] text-[#1c1b1c] mt-1 bg-white p-2.5 rounded border border-[#e5e2e1] flex flex-col gap-1">
                  <div><strong>Summary:</strong> {report.ai_classification.summary || report.title}</div>
                  <div><strong>Main Problem:</strong> {report.ai_classification.problem || report.description}</div>
                </div>
              )}
            </div>

            {/* Attachment Preview if available */}
            {report.attachment_url && (
              <div>
                <h3 className="text-xs font-bold text-[#47464b] uppercase mb-1">Attached Media</h3>
                <img
                  src={report.attachment_url}
                  alt="Report attachment"
                  className="w-full h-44 object-cover rounded-xl border border-[#e5e2e1]"
                />
              </div>
            )}

            {/* Quick Resolution Status Summary */}
            <div className="bg-slate-50 border border-[#e5e2e1] p-3 rounded-xl flex items-center justify-between text-xs">
              <span className="text-[#47464b] font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#39618c]">verified</span>
                Department Action Status
              </span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border ${getStatusBadge(report.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {report.status}
              </span>
            </div>

          </div>

          {/* RIGHT 5 COLS: Dynamic Timeline & Department Comments */}
          <div className="lg:col-span-5 flex flex-col gap-5 border-t lg:border-t-0 lg:border-l border-[#e5e2e1] pt-5 lg:pt-0 lg:pl-6">
            
            {/* Timeline */}
            <div>
              <h3 className="text-xs font-bold text-[#1c1b1c] uppercase tracking-wider mb-3">
                Report Activity Timeline
              </h3>
              <ol className="relative pl-5 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#e5e2e1]">
                {mergedTimeline.map((item) => (
                  <li key={item.id} className="relative">
                    <span
                      className={`absolute -left-5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${
                        item.type === 'status' ? 'bg-[#39618c]' : 'bg-emerald-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[10px] text-white">
                        {item.type === 'status' ? 'sync' : 'chat'}
                      </span>
                    </span>
                    <div className="flex flex-col text-xs">
                      <div className="flex items-baseline justify-between font-semibold text-[#1c1b1c]">
                        <span>{item.title}</span>
                        <time className="text-[10px] text-[#77767b] font-mono">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </time>
                      </div>
                      <span className="text-[11px] text-[#47464b] font-medium mt-0.5">By: {item.by}</span>
                      {item.note && (
                        <p className="text-[11px] text-[#77767b] italic bg-[#f7f3f2] p-1.5 rounded mt-1">
                          “{item.note}”
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Post Comment */}
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-2 pt-3 border-t border-[#e5e2e1]">
              <label htmlFor="admin-comment-input" className="text-xs font-bold text-[#1c1b1c]">
                Add Department Admin Comment
              </label>
              <textarea
                id="admin-comment-input"
                rows="2"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Post comment as ${adminUser.name} (${adminUser.department?.name || 'Admin'})...`}
                className="w-full bg-[#f7f3f2] text-xs p-2.5 rounded-xl border border-[#e5e2e1] text-[#1c1b1c] focus:outline-none focus:ring-2 focus:ring-[#1b1b1e] resize-none"
              ></textarea>
              <button
                type="submit"
                disabled={isUpdating || !newComment.trim()}
                className="h-9 bg-[#1b1b1e] text-white text-xs font-medium rounded-xl hover:bg-[#313030] disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>Post Comment</span>
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
