import React, { useState } from 'react';

export default function MyReportsView({
  tickets,
  selectedTicketId,
  onSelectTicket,
  onAddComment,
  navigateTo
}) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [commentText, setCommentText] = useState('');
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  // Filter tickets by category tab & search query
  const filteredTickets = tickets.filter(ticket => {
    const matchesCategory =
      activeFilter === 'All'
        ? true
        : activeFilter === 'Complaints'
        ? ticket.category === 'Complaint'
        : activeFilter === 'Feedback'
        ? ticket.category === 'Feedback'
        : activeFilter === 'Issues'
        ? ticket.category === 'Issue'
        : true;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      ticket.title.toLowerCase().includes(query) ||
      ticket.description.toLowerCase().includes(query) ||
      ticket.id.toLowerCase().includes(query) ||
      ticket.department.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  // Get currently selected ticket object
  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0] || null;

  const handleTicketClick = (id) => {
    onSelectTicket(id);
    setShowMobileDetail(true);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedTicket) return;
    onAddComment(selectedTicket.id, commentText.trim());
    setCommentText('');
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Complaint':
        return 'bg-red-50 text-red-800 border border-red-200';
      case 'Feedback':
        return 'bg-blue-50 text-blue-800 border border-blue-200';
      case 'Issue':
      default:
        return 'bg-amber-50 text-amber-800 border border-amber-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full py-6 sm:py-10 px-4 sm:px-6">
      <div className="grid grid-cols-12 gap-6 lg:gap-10">
        
        {/* LEFT COLUMN: Ticket List */}
        <div
          className={`col-span-12 lg:col-span-7 flex flex-col ${
            showMobileDetail ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Header & Desk Info */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-4">
            <div>
              <span className="font-label-sm text-xs uppercase tracking-wider text-[#47464b] font-medium">
                Student Desk
              </span>
              <h1 className="font-headline-lg text-2xl sm:text-3xl text-[#1c1b1c] tracking-tight mt-0.5 font-semibold">
                My Reports
              </h1>
            </div>
            <span className="self-start sm:self-auto font-code-sm text-xs text-[#47464b] bg-[#f1eded] px-2.5 py-1 rounded-md border border-[#e5e2e1] font-medium">
              {tickets.length} total tickets
            </span>
          </div>

          {/* Search bar */}
          <div className="relative mb-4">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#77767b] text-lg select-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by title, ID, or keywords..."
              className="w-full bg-white text-sm pl-9 pr-4 py-2 rounded-lg border border-[#e5e2e1] text-[#1c1b1c] placeholder-[#77767b] focus:outline-none focus:ring-2 focus:ring-[#1b1b1e] focus:border-transparent transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#77767b] hover:text-[#1c1b1c]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>

          {/* Filters Bar */}
          <nav
            aria-label="Filters"
            className="flex items-center gap-2 sm:gap-6 mb-6 border-b border-[#e5e2e1] pb-3 overflow-x-auto no-scrollbar scroll-smooth"
          >
            {['All', 'Complaints', 'Feedback', 'Issues'].map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`font-label-md text-xs sm:text-sm transition-colors whitespace-nowrap py-1 relative focus:outline-none ${
                    isActive
                      ? 'text-[#1c1b1c] font-semibold after:content-[""] after:absolute after:-bottom-3.5 after:left-0 after:right-0 after:h-0.5 after:bg-[#1b1b1e]'
                      : 'text-[#47464b] hover:text-[#1c1b1c]'
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </nav>

          {/* Tickets List */}
          <div className="flex flex-col space-y-3" role="list">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12 px-4 bg-white rounded-xl border border-[#e5e2e1]">
                <span className="material-symbols-outlined text-4xl text-[#77767b] mb-2 select-none">
                  inbox
                </span>
                <p className="text-base font-medium text-[#1c1b1c]">No tickets found</p>
                <p className="text-xs text-[#47464b] mt-1">Try resetting your filter or search query</p>
                <button
                  onClick={() => navigateTo('report-a-problem')}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#1b1b1e] text-white text-xs font-medium rounded-lg hover:bg-[#313030]"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Create New Report
                </button>
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const isSelected = selectedTicket && selectedTicket.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => handleTicketClick(ticket.id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTicketClick(ticket.id)}
                    role="button"
                    tabIndex={0}
                    className={`group text-left p-4 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white shadow-md ring-2 ring-[#1b1b1e] border-transparent'
                        : 'bg-white shadow-2xs border border-[#e5e2e1] hover:border-[#c8c5cb] hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-[11px] font-medium ${getCategoryBadgeClass(ticket.category)}`}>
                          {ticket.category}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-[11px] bg-[#f1eded] text-[#1c1b1c] font-medium border border-[#e5e2e1]">
                          {ticket.status}
                        </span>
                      </div>
                      <time className="font-code-sm text-xs text-[#47464b] shrink-0">
                        {ticket.submittedDate}
                      </time>
                    </div>

                    <h2 className="font-headline-sm text-base text-[#1c1b1c] font-medium group-hover:text-[#39618c] transition-colors leading-snug">
                      {ticket.title}
                    </h2>

                    <p className="font-body-sm text-xs text-[#47464b] mt-1.5 line-clamp-2 leading-relaxed">
                      {ticket.description}
                    </p>

                    <div className="mt-2 pt-2 border-t border-[#f7f3f2] flex items-center justify-between text-xs text-[#77767b]">
                      <span className="font-mono text-[11px]">{ticket.id}</span>
                      <span className="flex items-center gap-1 text-[#39618c] font-medium text-[11px] group-hover:underline">
                        View details
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Ticket Detail & Timeline Panel */}
        <aside
          className={`col-span-12 lg:col-span-5 flex flex-col ${
            showMobileDetail ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Back button for mobile */}
          {showMobileDetail && (
            <button
              onClick={() => setShowMobileDetail(false)}
              className="lg:hidden mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#1c1b1c] bg-white px-3 py-2 rounded-lg border border-[#e5e2e1] shadow-2xs hover:bg-[#f7f3f2]"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              <span>Back to all reports</span>
            </button>
          )}

          {selectedTicket ? (
            <div className="lg:sticky lg:top-20 bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-[#e5e2e1]">
              
              {/* Ticket Top bar */}
              <div className="flex items-center justify-between pb-4 border-b border-[#e5e2e1]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#47464b]">
                    confirmation_number
                  </span>
                  <span className="font-label-sm text-xs font-bold text-[#1c1b1c] tracking-wider font-mono">
                    {selectedTicket.id}
                  </span>
                </div>
                <span className="font-code-sm text-xs text-[#77767b]">
                  {selectedTicket.updatedTime || 'Recently updated'}
                </span>
              </div>

              {/* Title & Description */}
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClass(selectedTicket.category)}`}>
                    {selectedTicket.category}
                  </span>
                  <span className="text-xs font-medium text-[#39618c] bg-[#d1e4ff] px-2.5 py-0.5 rounded-full">
                    {selectedTicket.status}
                  </span>
                </div>

                <h3 className="font-headline-md text-lg sm:text-xl text-[#1c1b1c] font-bold tracking-tight leading-snug">
                  {selectedTicket.title}
                </h3>

                <p className="font-body-sm text-xs sm:text-sm text-[#47464b] mt-2.5 leading-relaxed bg-[#f7f3f2] p-3 rounded-lg border border-[#e5e2e1]">
                  {selectedTicket.description}
                </p>

                {/* Attached Photo preview if present */}
                {selectedTicket.attachedPhoto && (
                  <div className="mt-3">
                    <span className="text-xs text-[#77767b] font-medium block mb-1">Attached Media:</span>
                    <img
                      src={selectedTicket.attachedPhoto}
                      alt="User submission attachment"
                      className="w-full h-40 object-cover rounded-lg border border-[#e5e2e1]"
                    />
                  </div>
                )}
              </div>

              {/* Ticket Specs Table */}
              <div className="mt-5 pt-4 border-t border-[#e5e2e1] grid grid-cols-2 gap-y-2.5 font-body-sm text-xs sm:text-sm">
                <span className="text-[#47464b]">Department</span>
                <span className="text-[#1c1b1c] font-semibold text-right">{selectedTicket.department}</span>

                <span className="text-[#47464b]">Location</span>
                <span className="text-[#1c1b1c] font-medium text-right truncate pl-2">
                  {selectedTicket.location || 'Campus Wide'}
                </span>

                <span className="text-[#47464b]">Submitted</span>
                <span className="text-[#1c1b1c] font-medium text-right">{selectedTicket.submittedDate}</span>
              </div>

              {/* Status Timeline */}
              <div className="mt-6 pt-5 border-t border-[#e5e2e1]">
                <h4 className="font-label-md text-xs sm:text-sm text-[#1c1b1c] font-bold mb-4 tracking-tight uppercase text-[#47464b]">
                  Status Timeline
                </h4>

                <ol className="relative pl-6 space-y-5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#e5e2e1]">
                  {selectedTicket.timeline && selectedTicket.timeline.map((step, idx) => (
                    <li key={idx} className="relative">
                      <span
                        className={`absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${
                          step.active
                            ? 'bg-[#39618c]'
                            : step.done
                            ? 'bg-[#1b1b1e]'
                            : 'bg-[#e5e2e1]'
                        }`}
                      >
                        {step.done ? (
                          <span className="material-symbols-outlined text-[10px] text-white">check</span>
                        ) : step.active ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        ) : null}
                      </span>

                      <div className="flex flex-col">
                        <div className="flex items-baseline justify-between">
                          <span className={`font-label-md text-xs font-semibold ${step.active ? 'text-[#39618c]' : 'text-[#1c1b1c]'}`}>
                            {step.status}
                          </span>
                          <time className="font-code-sm text-[11px] text-[#77767b]">
                            {step.time}
                          </time>
                        </div>
                        <span className="font-body-sm text-xs text-[#47464b] mt-0.5">
                          {step.note}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Existing Comments list */}
              {selectedTicket.comments && selectedTicket.comments.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[#e5e2e1]">
                  <h4 className="text-xs font-bold text-[#47464b] uppercase mb-3">Updates & Discussion</h4>
                  <div className="space-y-2.5">
                    {selectedTicket.comments.map((c, idx) => (
                      <div key={idx} className="bg-[#f7f3f2] p-2.5 rounded-lg text-xs">
                        <div className="flex items-center justify-between text-[#77767b] mb-1 font-medium">
                          <span>{c.author}</span>
                          <span>{c.time}</span>
                        </div>
                        <p className="text-[#1c1b1c]">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mt-6 pt-4 border-t border-[#e5e2e1]">
                <label htmlFor="ticket-comment" className="block font-label-md text-xs font-semibold text-[#1c1b1c] mb-2">
                  Add comment or update
                </label>
                <div className="flex flex-col gap-2">
                  <textarea
                    id="ticket-comment"
                    rows="2"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Type an update or reply..."
                    className="w-full bg-[#f7f3f2] text-xs p-3 rounded-lg border border-[#e5e2e1] text-[#1c1b1c] focus:outline-none focus:ring-2 focus:ring-[#1b1b1e] resize-none"
                  ></textarea>
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="w-full inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-lg bg-[#1b1b1e] text-white font-label-md text-xs font-medium hover:bg-[#313030] disabled:opacity-50 transition-colors shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                    <span>Post Update</span>
                  </button>
                </div>
              </form>

            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 text-center text-[#77767b] border border-[#e5e2e1]">
              Select a report to view timeline and details
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}
