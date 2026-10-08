import React, { useState } from 'react';
import { getLocalHistory, getLocalComments } from '../../lib/supabase';

export default function AdminReportDetailModal({
  report,
  adminUser,
  onClose,
  onUpdateStatus,
  onAddComment
}) {
  const [statusNote, setStatusNote] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

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

  const handleStatusChange = async (targetStatus) => {
    if (targetStatus === report.status) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(report.id, targetStatus, statusNote);
      setStatusNote('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
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

            {/* AI Classification & Admin Override Contract */}
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-xs flex flex-col gap-2">
              <div className="flex items-center justify-between font-bold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base text-emerald-700">psychology</span>
                  AI Classification & Admin Override Contract
                </span>
                <span className="font-mono text-[10px] bg-emerald-100 px-2 py-0.5 rounded text-emerald-800">
                  Confidence: {((report.ai_classification?.confidence || 0.95) * 100).toFixed(0)}%
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1 text-slate-800">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-emerald-900 uppercase">Assigned Dept:</label>
                  <select
                    value={report.department_name || report.department || 'Hostel Committee'}
                    onChange={(e) => onUpdateStatus(report.id, report.status, `Reassigned department to ${e.target.value}`)}
                    className="bg-white border border-emerald-300 rounded-lg p-1.5 font-bold text-xs cursor-pointer"
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
                  <label className="text-[10px] font-bold text-emerald-900 uppercase">Category:</label>
                  <select
                    value={['Complaint', 'Issue', 'Feedback', 'Compliment'].find(c => c.toLowerCase() === (report.category || '').toLowerCase()) || 'Issue'}
                    onChange={(e) => onUpdateStatus(report.id, report.status, `Updated category to ${e.target.value}`)}
                    className="bg-white border border-emerald-300 rounded-lg p-1.5 font-bold text-xs cursor-pointer"
                  >
                    <option value="Complaint">Complaint</option>
                    <option value="Issue">Issue</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Compliment">Compliment</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-emerald-900 uppercase">Urgency:</label>
                  <select
                    value={['Low', 'Medium', 'High', 'Critical'].find(u => u.toLowerCase() === (report.urgency || report.priority || '').toLowerCase()) || 'Medium'}
                    onChange={(e) => onUpdateStatus(report.id, report.status, `Changed urgency to ${e.target.value}`)}
                    className="bg-white border border-emerald-300 rounded-lg p-1.5 font-bold text-xs cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {report.ai_classification && (
                <div className="text-[11px] text-emerald-900 mt-1 bg-white/90 p-2.5 rounded border border-emerald-200 flex flex-col gap-1">
                  <div><strong>AI Summary:</strong> {report.ai_classification.summary || report.title}</div>
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

            {/* STATUS UPDATE ACTION PANEL */}
            <div className="bg-[#1b1b1e] text-white p-4 sm:p-5 rounded-xl flex flex-col gap-3 shadow-md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Department Status Control
              </h3>

              {/* Status Note Input */}
              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Optional status transition note (e.g. Technician dispatched)..."
                className="w-full bg-[#313030] text-xs p-2.5 rounded-lg border border-[#47464b] text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-white"
              />

              {/* Transition Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <button
                  type="button"
                  disabled={isUpdating || report.status === 'submitted'}
                  onClick={() => handleStatusChange('submitted')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    report.status === 'submitted'
                      ? 'bg-amber-500 text-white border-amber-400'
                      : 'bg-[#313030] text-slate-300 border-[#47464b] hover:bg-amber-600 hover:text-white'
                  }`}
                >
                  Submitted
                </button>

                <button
                  type="button"
                  disabled={isUpdating || report.status === 'processing'}
                  onClick={() => handleStatusChange('processing')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    report.status === 'processing'
                      ? 'bg-blue-600 text-white border-blue-400'
                      : 'bg-[#313030] text-slate-300 border-[#47464b] hover:bg-blue-600 hover:text-white'
                  }`}
                >
                  Processing
                </button>

                <button
                  type="button"
                  disabled={isUpdating || report.status === 'resolved'}
                  onClick={() => handleStatusChange('resolved')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    report.status === 'resolved'
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-[#313030] text-slate-300 border-[#47464b] hover:bg-emerald-600 hover:text-white'
                  }`}
                >
                  Resolved
                </button>

                <button
                  type="button"
                  disabled={isUpdating || report.status === 'rejected'}
                  onClick={() => handleStatusChange('rejected')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    report.status === 'rejected'
                      ? 'bg-rose-600 text-white border-rose-400'
                      : 'bg-[#313030] text-slate-300 border-[#47464b] hover:bg-rose-600 hover:text-white'
                  }`}
                >
                  Rejected
                </button>
              </div>
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
