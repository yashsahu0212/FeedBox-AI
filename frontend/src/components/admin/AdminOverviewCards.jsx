import React from 'react';

export default function AdminOverviewCards({ reports }) {
  const total = reports.length;
  const newCount = reports.filter(r => r.status === 'submitted').length;
  const processingCount = reports.filter(r => r.status === 'processing').length;
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;
  const highPriorityCount = reports.filter(r => r.urgency === 'critical' || r.urgency === 'high').length;

  const cards = [
    {
      title: 'Total Reports',
      count: total,
      icon: 'format_list_bulleted',
      color: 'text-[#1c1b1c]',
      bgColor: 'bg-white',
      borderColor: 'border-[#e5e2e1]',
      badge: 'All tickets'
    },
    {
      title: 'New Reports',
      count: newCount,
      icon: 'mark_email_unread',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50/40',
      borderColor: 'border-amber-200',
      badge: 'Needs triage'
    },
    {
      title: 'Processing',
      count: processingCount,
      icon: 'engineering',
      color: 'text-[#39618c]',
      bgColor: 'bg-blue-50/40',
      borderColor: 'border-blue-200',
      badge: 'Active work'
    },
    {
      title: 'Resolved',
      count: resolvedCount,
      icon: 'task_alt',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50/40',
      borderColor: 'border-emerald-200',
      badge: 'Completed'
    },
    {
      title: 'Critical / High Priority',
      count: highPriorityCount,
      icon: 'warning',
      color: 'text-red-700',
      bgColor: 'bg-red-50/40',
      borderColor: 'border-red-200',
      badge: 'Urgent action'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-xl border ${card.borderColor} ${card.bgColor} shadow-2xs flex flex-col justify-between transition-all hover:shadow-xs`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#47464b] truncate">{card.title}</span>
            <span className={`material-symbols-outlined text-lg ${card.color} select-none`}>
              {card.icon}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <span className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${card.color}`}>
              {card.count}
            </span>
            <span className="text-[10px] text-[#77767b] font-medium uppercase tracking-wider">
              {card.badge}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
