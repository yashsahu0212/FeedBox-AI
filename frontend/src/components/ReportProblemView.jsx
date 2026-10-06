import React, { useState } from 'react';

export default function ReportProblemView({ onSubmitReport, nearbyActivity = [] }) {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Issue');
  const [attachedImage, setAttachedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Auto detect department based on description keywords
  const detectDepartment = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('wifi') || lower.includes('internet') || lower.includes('computer') || lower.includes('login') || lower.includes('software')) {
      return 'IT Services';
    }
    if (lower.includes('projector') || lower.includes('mic') || lower.includes('audio') || lower.includes('speaker') || lower.includes('screen')) {
      return 'AV & Classroom Tech';
    }
    if (lower.includes('clean') || lower.includes('chair') || lower.includes('desk') || lower.includes('space') || lower.includes('seating')) {
      return 'Campus Operations';
    }
    return 'Facilities & Maintenance';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`Science Complex, Room 204 (Lat: ${position.coords.latitude.toFixed(2)})`);
        },
        () => {
          setLocation('Science Complex, Room 204');
        }
      );
    } else {
      setLocation('Science Complex, Room 204');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    const autoDept = detectDepartment(description);
    const newTicket = {
      title: description.slice(0, 55).trim() + (description.length > 55 ? '...' : ''),
      description: description.trim(),
      location: location.trim() || 'Science Complex, Room 204',
      category: category,
      department: autoDept,
      attachedPhoto: attachedImage
    };

    setTimeout(() => {
      const created = onSubmitReport(newTicket);
      setSubmittedTicket(created);
      setIsSubmitting(false);
    }, 600);
  };

  const resetForm = () => {
    setDescription('');
    setLocation('');
    setCategory('Issue');
    setAttachedImage(null);
    setSubmittedTicket(null);
  };

  return (
    <div className="max-w-2xl mx-auto w-full py-6 sm:py-12 px-4 sm:px-6 flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#47464b]">
          <span>Campus Operations</span>
          <span className="text-[#c8c5cb]">/</span>
          <span className="text-[#1c1b1c] font-semibold">New Dispatch</span>
        </div>
        <h1 className="font-display-lg text-2xl sm:text-3xl md:text-4xl text-[#1c1b1c] tracking-tight font-semibold">
          What’s happening?
        </h1>
        <p className="font-body-lg text-sm sm:text-base text-[#47464b] leading-relaxed">
          Describe the problem or share your feedback. We'll automatically route it to the appropriate team.
        </p>
      </div>

      {/* Primary Form Card */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e2e1] p-4 sm:p-6 flex flex-col gap-4">
          
          {/* Category Pill Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#47464b] mr-1">Type:</span>
            {['Issue', 'Complaint', 'Feedback'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  category === cat
                    ? 'bg-[#1b1b1e] text-white shadow-2xs'
                    : 'bg-[#f7f3f2] text-[#47464b] hover:bg-[#e5e2e1]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Textarea Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="problem-description" className="sr-only">
              Detailed description of the issue or feedback
            </label>
            <textarea
              id="problem-description"
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what happened... (e.g., 'The AC in classroom 204 has not been working for two days' or 'The water fountain on 3rd floor is leaking')"
              className="w-full bg-transparent font-body-lg text-sm sm:text-base text-[#1c1b1c] placeholder:text-[#77767b] focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Image Attachment Preview */}
          {attachedImage && (
            <div className="relative inline-block self-start mt-1">
              <img
                src={attachedImage}
                alt="Attached preview"
                className="w-24 h-24 object-cover rounded-xl border border-[#e5e2e1] shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition-colors"
                title="Remove photo"
              >
                <span className="material-symbols-outlined text-xs block">close</span>
              </button>
            </div>
          )}

          {/* Separation hairline */}
          <div className="h-px w-full bg-[#e5e2e1]"></div>

          {/* Controls: Location & Photo Attachment & Submit */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Location Input with Geolocate Button */}
            <div className="flex items-center gap-2 flex-1 bg-[#f7f3f2] px-3 py-2 rounded-xl border border-[#e5e2e1]">
              <button
                type="button"
                onClick={handleGeolocate}
                className="text-[#77767b] hover:text-[#1c1b1c] focus:outline-none"
                title="Detect current location"
              >
                <span className="material-symbols-outlined text-lg select-none">location_on</span>
              </button>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location (e.g. Science Complex, Room 204)"
                className="w-full bg-transparent font-body-sm text-xs sm:text-sm text-[#1c1b1c] placeholder:text-[#77767b] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              {/* Photo Upload Trigger */}
              <label className="h-10 px-3.5 rounded-xl bg-[#f7f3f2] text-[#47464b] hover:text-[#1c1b1c] hover:bg-[#f1eded] border border-[#e5e2e1] transition-colors flex items-center gap-1.5 font-label-md text-xs cursor-pointer select-none">
                <span className="material-symbols-outlined text-lg select-none">attach_file</span>
                <span className="hidden xs:inline">Attach Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="h-10 px-5 rounded-xl bg-[#1b1b1e] text-white hover:bg-[#313030] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-label-md text-xs sm:text-sm shadow-xs cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">sync</span>
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Report</span>
                    <span className="material-symbols-outlined text-base select-none">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Quick Guide Callout */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 text-[#47464b] font-code-sm text-xs">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-emerald-600 select-none">verified</span>
            Automatic department routing to <strong className="text-[#1c1b1c]">{detectDepartment(description)}</strong>
          </span>
          <span className="text-[#77767b]">Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#c8c5cb] text-[#1c1b1c]">Ctrl / ⌘</kbd> + <kbd class="px-1.5 py-0.5 rounded bg-white border border-[#c8c5cb] text-[#1c1b1c]">Enter</kbd> to send</span>
        </div>
      </form>

      {/* Confirmation Banner if Ticket Submitted */}
      {submittedTicket && (
        <div className="flex flex-col gap-3 transition-all duration-300 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between">
            <span className="font-code-sm text-xs font-bold uppercase tracking-wider text-[#47464b]">
              Live Dispatch Status
            </span>
            <button
              type="button"
              onClick={resetForm}
              className="font-code-sm text-xs text-[#39618c] font-semibold hover:underline cursor-pointer"
            >
              Reset / Send Another
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-[#e5e2e1] p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl select-none">check_circle</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-base sm:text-lg text-[#1c1b1c] font-bold">
                    Report submitted successfully
                  </h2>
                  <p className="font-body-sm text-xs text-[#47464b]">
                    Ticket #{submittedTicket.id} • Created just now
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d1e4ff] text-[#001d36] font-label-sm text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39618c]"></span>
                  {submittedTicket.category}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f1eded] text-[#1c1b1c] font-label-sm text-xs font-medium">
                  {submittedTicket.status}
                </span>
              </div>
            </div>

            {/* Description Recap */}
            <div className="bg-[#f7f3f2] p-4 rounded-xl flex flex-col gap-2 border border-[#e5e2e1]">
              <p className="font-body-md text-xs sm:text-sm text-[#1c1b1c] leading-normal italic">
                “{submittedTicket.description}”
              </p>
              <div className="flex flex-wrap items-center gap-2 text-[#47464b] font-label-sm text-xs pt-1 border-t border-[#e5e2e1]">
                <span className="material-symbols-outlined text-sm select-none">domain</span>
                <span>Routed to <strong className="text-[#1c1b1c] font-semibold">{submittedTicket.department}</strong></span>
                <span>•</span>
                <span className="material-symbols-outlined text-sm select-none">place</span>
                <span>{submittedTicket.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[#47464b]">Estimated triage response: Within 2 hours</span>
            </div>
          </div>
        </div>
      )}

      {/* Campus Activity in Vicinity Stream */}
      <div className="flex flex-col gap-3 pt-2">
        <h3 className="font-headline-sm text-base text-[#1c1b1c] font-bold">
          Campus Activity in Your Vicinity
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {nearbyActivity.map((act) => (
            <div
              key={act.id}
              className="bg-white p-4 rounded-xl shadow-2xs border border-[#e5e2e1] flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#f1eded] text-[#47464b] font-label-sm text-[11px] font-medium">
                  {act.category}
                </span>
                <span className="font-code-sm text-xs text-[#77767b]">{act.timeAgo}</span>
              </div>

              <p className="font-body-sm text-xs text-[#1c1b1c] line-clamp-2 leading-relaxed">
                {act.title}
              </p>

              <div className="flex items-center gap-1.5 text-[#47464b] font-code-sm text-[11px] pt-2 border-t border-[#f7f3f2]">
                <span className="w-2 h-2 rounded-full bg-[#39618c]"></span>
                <span>{act.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
