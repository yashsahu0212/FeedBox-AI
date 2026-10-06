import React, { useEffect } from 'react';

export default function ToastNotification({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full bg-[#1b1b1e] text-white p-4 rounded-xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200 border border-[#47464b]">
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined text-emerald-400 text-xl">
          {type === 'success' ? 'check_circle' : 'info'}
        </span>
        <p className="text-sm font-medium text-slate-100">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}
