import React, { useState } from 'react';
import { classifyComplaintAI } from '../lib/aiClassifier';

export default function ReportProblemView({ onSubmitReport, nearbyActivity = [] }) {
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [category, setCategory] = useState('Issue');
  const [attachedImage, setAttachedImage] = useState(null);
  
  // AI Submission & Result State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [submittedTicket, setSubmittedTicket] = useState(null);

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
          setLocationText(`Science Complex, Room 204 (Lat: ${position.coords.latitude.toFixed(2)})`);
        },
        () => {
          setLocationText('Science Complex, Room 204');
        }
      );
    } else {
      setLocationText('Science Complex, Room 204');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsAnalyzing(true);
    setAiResult(null);

    const fullText = locationText.trim() ? `${description.trim()} in ${locationText.trim()}` : description.trim();

    try {
      // 1. Run LLM AI Agent Classifier
      const classification = await classifyComplaintAI(fullText);
      setAiResult(classification);

      const locDisplay = typeof classification.location === 'string'
        ? classification.location
        : (classification.location?.hostel_block || locationText.trim() || null);

      const newTicket = {
        title: classification.summary || description.slice(0, 55).trim(),
        description: description.trim(),
        location: locDisplay || 'Campus Main',
        category: classification.category || 'Issue',
        urgency: classification.urgency || 'Medium',
        department: classification.department || 'Administration',
        problem: classification.problem || description.trim(),
        suggested_action: classification.suggested_action || null,
        attachedPhoto: attachedImage,
        aiClassification: classification
      };

      const created = onSubmitReport(newTicket);
      setSubmittedTicket(created);
    } catch (err) {
      console.error('AI Classification failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setDescription('');
    setLocationText('');
    setCategory('Issue');
    setAttachedImage(null);
    setAiResult(null);
    setSubmittedTicket(null);
  };

  return (
    <div className="max-w-2xl mx-auto w-full py-6 sm:py-12 px-4 sm:px-6 flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#47464b]">
          <span className="flex items-center gap-1 text-[#39618c] font-bold">
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            AI Automated Dispatch
          </span>
          <span className="text-[#c8c5cb]">/</span>
          <span className="text-[#1c1b1c] font-semibold">New Report</span>
        </div>
        <h1 className="font-display-lg text-2xl sm:text-3xl md:text-4xl text-[#1c1b1c] tracking-tight font-semibold">
          What’s happening?
        </h1>
        <p className="font-body-lg text-sm sm:text-base text-[#47464b] leading-relaxed">
          Describe your problem or feedback in natural language or Hinglish. Our AI automatically classifies, extracts location, and routes it to the right department.
        </p>
      </div>

      {/* Primary Form Card */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e5e2e1] p-4 sm:p-6 flex flex-col gap-4">
          
          {/* AI Automated Intent & Category Indicator */}
          <div className="flex items-center gap-2 text-xs text-[#39618c] font-bold bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-200/60 self-start shadow-2xs">
            <span className="material-symbols-outlined text-sm text-[#39618c]">smart_toy</span>
            <span>AI Automated Intent & Department Detection Active</span>
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
              placeholder="e.g. 'My door latch is broken and want to replace it as soon as possible in block 3 7th floor B 701' or 'wifi nhi chal raha'"
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
                className="text-[#77767b] hover:text-[#1c1b1c] focus:outline-none cursor-pointer"
                title="Detect current location"
              >
                <span className="material-symbols-outlined text-lg select-none">location_on</span>
              </button>
              <input
                type="text"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="Optional location (e.g. Block 3, 7th floor B 701)"
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
                disabled={isAnalyzing || !description.trim()}
                className="h-10 px-5 rounded-xl bg-[#1b1b1e] text-white hover:bg-[#313030] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-label-md text-xs sm:text-sm shadow-xs cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">smart_toy</span>
                    <span>Analyzing your complaint...</span>
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
          <span className="flex items-center gap-1.5 text-[#39618c] font-semibold">
            <span className="material-symbols-outlined text-base text-emerald-600 select-none">auto_awesome</span>
            AI Engine auto-extracts department, location & urgency
          </span>
          <span className="text-[#77767b]">Supports Hinglish ("wifi nhi chal raha")</span>
        </div>
      </form>

      {/* AI Analyzing Loading Banner */}
      {isAnalyzing && (
        <div className="p-6 bg-white rounded-2xl shadow-md border border-[#e5e2e1] flex flex-col items-center justify-center text-center gap-3 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-[#39618c] flex items-center justify-center animate-bounce">
            <span className="material-symbols-outlined text-2xl select-none">smart_toy</span>
          </div>
          <div>
            <h3 className="font-headline-md text-base text-[#1c1b1c] font-bold">Analyzing your complaint...</h3>
            <p className="font-body-sm text-xs text-[#77767b] mt-1">
              Parsing natural language, extracting location & matching department rules via n8n AI engine...
            </p>
          </div>
        </div>
      )}

      {/* SECTION 16: CONFIRMATION & CLASSIFICATION SUMMARY CARD */}
      {submittedTicket && aiResult && (
        <div className="flex flex-col gap-3 transition-all duration-300 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between">
            <span className="font-code-sm text-xs font-bold uppercase tracking-wider text-[#39618c] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-emerald-500">verified</span>
              AI Classification & Routing Confirmation
            </span>
            <button
              type="button"
              onClick={resetForm}
              className="font-code-sm text-xs text-[#39618c] font-semibold hover:underline cursor-pointer"
            >
              Submit Another Report
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-[#e5e2e1] p-5 sm:p-6 flex flex-col gap-5">
            
            {/* Header: Status & ID */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e2e1] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <span className="material-symbols-outlined text-xl select-none">check_circle</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-base sm:text-lg text-[#1c1b1c] font-bold">
                    Report Dispatched & Categorized
                  </h2>
                  <p className="font-body-sm text-xs text-[#47464b]">
                    Ticket ID: <span className="font-mono font-bold text-[#1c1b1c]">{submittedTicket.id}</span> • Confidence: {(aiResult.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  Submitted
                </span>
              </div>
            </div>

            {/* Multi-Issue Warning Banner */}
            {aiResult.multiple_issues && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-amber-600">call_split</span>
                <span>
                  <strong>Multi-Issue Complaint Detected:</strong> Automatically split into {aiResult.issues.length} separate department tickets for parallel handling!
                </span>
              </div>
            )}

            {/* Structured Classification Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#f7f3f2] p-4 rounded-xl border border-[#e5e2e1]">
              
              {/* Category */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#77767b] font-bold">
                  Category:
                </span>
                <span className="text-xs font-bold text-[#1c1b1c] bg-white px-2.5 py-1 rounded-lg border border-[#e5e2e1] self-start shadow-2xs">
                  {aiResult.category}
                </span>
              </div>

              {/* Urgency */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#77767b] font-bold">
                  Urgency:
                </span>
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider inline-block ${
                    aiResult.urgency === 'Critical'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : aiResult.urgency === 'High'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : aiResult.urgency === 'Medium'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {aiResult.urgency}
                  </span>
                </div>
              </div>

              {/* Department */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#77767b] font-bold">
                  Department:
                </span>
                <span className="text-xs font-bold text-[#1c1b1c] bg-white px-2.5 py-1 rounded-lg border border-[#e5e2e1] self-start shadow-2xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-[#39618c]">domain</span>
                  {aiResult.department || 'Administration'}
                </span>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#77767b] font-bold">
                  Location:
                </span>
                <span className="text-xs font-medium text-[#1c1b1c]">
                  {aiResult.location || <span className="text-[#77767b] italic">null (Not specified)</span>}
                </span>
              </div>

            </div>

            {/* Problem, Summary & Suggested Action */}
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-[11px] font-bold text-[#47464b] block mb-0.5">AI Summary & Problem:</span>
                <p className="text-xs text-[#1c1b1c] font-medium bg-[#f7f3f2] p-3 rounded-xl border border-[#e5e2e1]">
                  <strong>Summary:</strong> {aiResult.summary}<br/>
                  <strong>Main Problem:</strong> {aiResult.problem}
                </p>
              </div>

              {aiResult.suggested_action && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-emerald-700 shrink-0">build</span>
                  <span><strong>Suggested Action:</strong> {aiResult.suggested_action}</span>
                </div>
              )}

              {/* Explanation Note */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#001d36] flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#39618c] shrink-0">info</span>
                <span>{aiResult.reason}</span>
              </div>
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

