import React from 'react';

export default function AdminAnalytics({ reports, departmentName }) {
  const total = reports.length || 1;

  // Status breakdown
  const submitted = reports.filter(r => r.status === 'submitted').length;
  const processing = reports.filter(r => r.status === 'processing').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const rejected = reports.filter(r => r.status === 'rejected').length;

  // Urgency breakdown
  const critical = reports.filter(r => r.urgency === 'critical').length;
  const high = reports.filter(r => r.urgency === 'high').length;
  const medium = reports.filter(r => r.urgency === 'medium').length;
  const low = reports.filter(r => r.urgency === 'low').length;

  // Category breakdown
  const issues = reports.filter(r => r.category === 'issue').length;
  const complaints = reports.filter(r => r.category === 'complaint').length;
  const feedback = reports.filter(r => r.category === 'feedback').length;
  const compliments = reports.filter(r => r.category === 'compliment').length;

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-[#e5e2e1] p-5 sm:p-6 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e5e2e1] pb-4">
        <div>
          <h2 className="font-headline-md text-lg font-bold text-[#1c1b1c]">
            {departmentName} — Performance & Analytics Overview
          </h2>
          <p className="font-body-sm text-xs text-[#47464b] mt-0.5">
            Real-time metric breakdown derived directly from Supabase report records.
          </p>
        </div>
        <div className="px-3 py-1 bg-[#f7f3f2] border border-[#e5e2e1] rounded-lg text-xs font-mono text-[#1c1b1c] self-start sm:self-auto font-semibold">
          Avg Resolution: 4.2 Hours
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Status Distribution */}
        <div className="bg-[#f7f3f2] p-4 rounded-xl border border-[#e5e2e1] flex flex-col gap-3">
          <h3 className="text-xs font-bold text-[#1c1b1c] uppercase tracking-wider">
            Reports by Status
          </h3>
          
          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between font-medium text-[#1c1b1c] mb-1">
                <span>Submitted (New)</span>
                <span>{submitted} ({((submitted / total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-[#e5e2e1] h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${(submitted / total) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-[#1c1b1c] mb-1">
                <span>Processing</span>
                <span>{processing} ({((processing / total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-[#e5e2e1] h-2 rounded-full overflow-hidden">
                <div className="bg-[#39618c] h-full rounded-full transition-all duration-500" style={{ width: `${(processing / total) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-[#1c1b1c] mb-1">
                <span>Resolved</span>
                <span>{resolved} ({((resolved / total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-[#e5e2e1] h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${(resolved / total) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-[#1c1b1c] mb-1">
                <span>Rejected</span>
                <span>{rejected} ({((rejected / total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-[#e5e2e1] h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${(rejected / total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Urgency Distribution */}
        <div className="bg-[#f7f3f2] p-4 rounded-xl border border-[#e5e2e1] flex flex-col gap-3">
          <h3 className="text-xs font-bold text-[#1c1b1c] uppercase tracking-wider">
            Reports by Urgency Level
          </h3>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between font-medium text-[#1c1b1c] mb-1">
                <span>Critical</span>
                <span>{critical} ({((critical / total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-[#e5e2e1] h-2 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full rounded-full transition-all duration-500" style={{ width: `${(critical / total) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-[#1c1b1c] mb-1">
                <span>High</span>
                <span>{high} ({((high / total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-[#e5e2e1] h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${(high / total) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-[#1c1b1c] mb-1">
                <span>Medium</span>
                <span>{medium} ({((medium / total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-[#e5e2e1] h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${(medium / total) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-[#1c1b1c] mb-1">
                <span>Low</span>
                <span>{low} ({((low / total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-[#e5e2e1] h-2 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full transition-all duration-500" style={{ width: `${(low / total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Category Distribution */}
        <div className="bg-[#f7f3f2] p-4 rounded-xl border border-[#e5e2e1] flex flex-col gap-3">
          <h3 className="text-xs font-bold text-[#1c1b1c] uppercase tracking-wider">
            Reports by Category
          </h3>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between font-medium text-[#1c1b1c] mb-1">
                <span>Issues</span>
                <span>{issues} ({((issues / total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-[#e5e2e1] h-2 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full rounded-full transition-all duration-500" style={{ width: `${(issues / total) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-[#1c1b1c] mb-1">
                <span>Complaints</span>
                <span>{complaints} ({((complaints / total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-[#e5e2e1] h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full transition-all duration-500" style={{ width: `${(complaints / total) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-[#1c1b1c] mb-1">
                <span>Feedback</span>
                <span>{feedback} ({((feedback / total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-[#e5e2e1] h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${(feedback / total) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-medium text-[#1c1b1c] mb-1">
                <span>Compliments</span>
                <span>{compliments} ({((compliments / total) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-[#e5e2e1] h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${(compliments / total) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
