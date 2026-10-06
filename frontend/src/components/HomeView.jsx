import React from 'react';

export default function HomeView({ tickets, navigateTo, selectTicket }) {
  const recentTickets = tickets.slice(0, 4);

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Complaint':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'Feedback':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Issue':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-[#39618c] animate-pulse';
      case 'Resolved':
        return 'bg-emerald-600';
      case 'Reviewed':
        return 'bg-[#77767b]';
      default:
        return 'bg-[#c8c5cb]';
    }
  };

  const activeCount = tickets.filter(t => t.status === 'In Progress' || t.status === 'Submitted').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;

  return (
    <div className="w-full max-w-3xl mx-auto py-8 sm:py-12 md:py-16 px-4 sm:px-6">
      {/* Welcome & Action Section */}
      <section className="flex flex-col items-start">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-label-md text-xs sm:text-sm text-[#47464b] tracking-normal font-medium">
            Welcome back, Yash
          </span>
        </div>

        <h1 className="font-display-lg text-2xl sm:text-3xl md:text-4xl text-[#1c1b1c] tracking-tight mb-3 font-semibold leading-tight">
          Have something that needs attention?
        </h1>

        <p className="font-body-lg text-sm sm:text-base text-[#47464b] max-w-xl mb-6 sm:mb-8 leading-relaxed">
          Tell us what's happening around campus. We'll make sure it reaches the right department immediately.
        </p>

        {/* Action Buttons - Stacked on tiny screens, flex-row on sm and up */}
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3 w-full xs:w-auto">
          <button
            onClick={() => navigateTo('report-a-problem')}
            className="inline-flex items-center justify-center gap-2 h-11 px-5 bg-[#1b1b1e] text-white font-label-md text-sm rounded-xl shadow-sm hover:bg-[#313030] active:scale-[0.99] transition-all duration-150"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Report a Problem</span>
          </button>

          <button
            onClick={() => navigateTo('my-reports')}
            className="inline-flex items-center justify-center gap-2 h-11 px-5 bg-[#f7f3f2] text-[#1c1b1c] hover:bg-[#f1eded] border border-[#e5e2e1] font-label-md text-sm rounded-xl transition-all duration-150"
          >
            <span className="material-symbols-outlined text-[18px]">list_alt</span>
            <span>Track Status ({activeCount} active)</span>
          </button>
        </div>
      </section>

      {/* Stats Summary Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-8 sm:my-10">
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e5e2e1] shadow-2xs">
          <span className="text-xs text-[#47464b] font-medium block">Total Tickets</span>
          <span className="text-xl sm:text-2xl font-semibold text-[#1c1b1c] mt-1 block">{tickets.length}</span>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e5e2e1] shadow-2xs">
          <span className="text-xs text-[#39618c] font-medium block">Active / Pending</span>
          <span className="text-xl sm:text-2xl font-semibold text-[#39618c] mt-1 block">{activeCount}</span>
        </div>
        <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-[#e5e2e1] shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-xs text-emerald-700 font-medium block">Resolved Issues</span>
          <span className="text-xl sm:text-2xl font-semibold text-emerald-700 mt-1 block">{resolvedCount}</span>
        </div>
      </section>

      {/* Subtle Structural Hairline */}
      <div className="w-full h-px bg-[#e5e2e1] my-8 sm:my-12"></div>

      {/* Recent Reports Section */}
      <section className="flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-headline-md text-lg sm:text-xl text-[#1c1b1c] font-semibold">
            Recent Reports
          </h2>
          <button
            onClick={() => navigateTo('my-reports')}
            className="group inline-flex items-center gap-1 font-label-sm text-xs text-[#47464b] hover:text-[#1c1b1c] transition-colors focus:outline-none"
          >
            <span>View all ({tickets.length})</span>
            <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-0.5">
              chevron_right
            </span>
          </button>
        </div>

        {/* Clean list rows */}
        <div className="flex flex-col divide-y divide-[#e5e2e1] bg-white rounded-xl shadow-xs border border-[#e5e2e1] overflow-hidden">
          {recentTickets.map((ticket, index) => (
            <button
              key={ticket.id}
              onClick={() => {
                selectTicket(ticket.id);
                navigateTo('my-reports');
              }}
              className="group text-left flex items-center justify-between p-4 sm:p-5 hover:bg-[#f7f3f2]/80 transition-colors duration-150 focus:outline-none"
            >
              <div className="flex flex-col gap-1.5 min-w-0 pr-3">
                <span className="font-headline-sm text-sm sm:text-base text-[#1c1b1c] font-medium tracking-tight truncate group-hover:text-[#39618c] transition-colors">
                  {ticket.title}
                </span>

                <div className="flex flex-wrap items-center gap-2 font-code-sm text-xs text-[#47464b]">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${getCategoryBadgeClass(ticket.category)}`}>
                    {ticket.category}
                  </span>
                  <span className="text-[#c8c5cb]">•</span>
                  <span className="inline-flex items-center gap-1.5 text-[#1c1b1c] font-medium">
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(ticket.status)}`}></span>
                    {ticket.status}
                  </span>
                  <span className="text-[#c8c5cb] hidden xs:inline">•</span>
                  <span className="hidden xs:inline text-[#77767b]">{ticket.submittedDate}</span>
                </div>
              </div>

              <div className="flex items-center text-[#77767b] group-hover:text-[#1c1b1c] transition-colors pl-2 shrink-0">
                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
