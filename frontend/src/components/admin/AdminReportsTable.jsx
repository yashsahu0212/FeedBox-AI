import React, { useState } from 'react';

export default function AdminReportsTable({ reports, onSelectReport }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Filter Reports
  const filteredReports = reports.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'all' || r.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesUrgency = urgencyFilter === 'all' || r.urgency.toLowerCase() === urgencyFilter.toLowerCase();

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      (r.id && r.id.toLowerCase().includes(q)) ||
      (r.location && r.location.toLowerCase().includes(q));

    return matchesStatus && matchesCategory && matchesUrgency && matchesSearch;
  });

  // Sort Reports
  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === 'urgency') {
      const urgencyRank = { critical: 4, high: 3, medium: 2, low: 1 };
      return (urgencyRank[b.urgency.toLowerCase()] || 0) - (urgencyRank[a.urgency.toLowerCase()] || 0);
    }
    if (sortBy === 'status') {
      const statusRank = { submitted: 4, processing: 3, resolved: 2, rejected: 1 };
      return (statusRank[b.status.toLowerCase()] || 0) - (statusRank[a.status.toLowerCase()] || 0);
    }
    return 0;
  });

  // Helper Badge Colors
  const getCategoryBadge = (category) => {
    switch (category?.toLowerCase()) {
      case 'complaint':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'feedback':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'compliment':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'issue':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'critical':
        return 'bg-red-600 text-white font-bold animate-pulse';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'low':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'processing':
        return 'bg-[#d1e4ff] text-[#001d36] border-[#a2cafb]';
      case 'resolved':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'rejected':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-[#e5e2e1] p-4 sm:p-6 flex flex-col gap-4">
      
      {/* Controls Strip */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#77767b] text-base select-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by title, ID, or location..."
            className="w-full bg-[#f7f3f2] text-xs pl-9 pr-8 py-2 rounded-xl border border-[#e5e2e1] text-[#1c1b1c] placeholder-[#77767b] focus:outline-none focus:ring-2 focus:ring-[#1b1b1e] focus:bg-white"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-[#77767b]">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#f7f3f2] text-xs px-3 py-2 rounded-xl border border-[#e5e2e1] text-[#1c1b1c] focus:outline-none"
          >
            <option value="all">Status: All</option>
            <option value="submitted">Submitted</option>
            <option value="processing">Processing</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#f7f3f2] text-xs px-3 py-2 rounded-xl border border-[#e5e2e1] text-[#1c1b1c] focus:outline-none"
          >
            <option value="all">Category: All</option>
            <option value="issue">Issue</option>
            <option value="complaint">Complaint</option>
            <option value="feedback">Feedback</option>
            <option value="compliment">Compliment</option>
          </select>

          {/* Urgency filter */}
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="bg-[#f7f3f2] text-xs px-3 py-2 rounded-xl border border-[#e5e2e1] text-[#1c1b1c] focus:outline-none"
          >
            <option value="all">Urgency: All</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#f7f3f2] text-xs px-3 py-2 rounded-xl border border-[#e5e2e1] text-[#1c1b1c] font-medium focus:outline-none"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="urgency">Sort: Highest Urgency</option>
            <option value="status">Sort: Status</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-[#e5e2e1]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#f7f3f2] text-[#47464b] font-semibold border-b border-[#e5e2e1]">
              <th className="py-3 px-4">Report ID</th>
              <th className="py-3 px-4">Title & Location</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Urgency</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Submitted</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e2e1] bg-white">
            {sortedReports.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-[#77767b]">
                  No reports matching current filter criteria.
                </td>
              </tr>
            ) : (
              sortedReports.map((report) => (
                <tr
                  key={report.id}
                  onClick={() => onSelectReport(report)}
                  className="hover:bg-[#f7f3f2]/60 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#1c1b1c] whitespace-nowrap">
                    {report.id.slice(0, 13)}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs sm:max-w-sm">
                    <div className="font-medium text-[#1c1b1c] line-clamp-1 hover:underline">
                      {report.title}
                    </div>
                    <div className="text-[11px] text-[#77767b] truncate mt-0.5">
                      📍 {report.location || 'Campus Wide'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${getCategoryBadge(report.category)}`}>
                      {report.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${getUrgencyBadge(report.urgency)}`}>
                      {report.urgency}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(report.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#47464b] text-[11px] whitespace-nowrap">
                    {new Date(report.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectReport(report);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#39618c] hover:underline"
                    >
                      <span>Manage</span>
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
