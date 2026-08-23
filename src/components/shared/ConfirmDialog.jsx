import React, { useState } from 'react';
import { AlertOctagon, X, Check } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "CONFIRM ACTION",
  confirmCode = null, // Optional text input match e.g. "SHUTDOWN"
  onConfirm,
  onCancel,
  severity = "danger"
}) => {
  const [typedCode, setTypedCode] = useState("");

  if (!isOpen) return null;

  const requiresCode = confirmCode !== null;
  const isCodeValid = !requiresCode || typedCode.trim().toUpperCase() === confirmCode.toUpperCase();

  const handleConfirm = () => {
    if (!isCodeValid) return;
    onConfirm();
    setTypedCode("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className={`w-full max-w-md p-6 rounded-xl border font-mono shadow-2xl glass-card ${
        severity === 'danger' ? 'border-red-500/60 shadow-danger-glow' : 'border-amber-500/60 shadow-warning-glow'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
            <h3 className="text-base font-bold tracking-wider uppercase text-slate-100">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-sm font-sans text-slate-300 leading-relaxed mb-4">
          {message}
        </p>

        {/* Code Confirmation Input if required */}
        {requiresCode && (
          <div className="mb-5 bg-slate-950/80 p-3 rounded border border-slate-800">
            <label className="block text-xs font-mono text-slate-400 mb-1">
              TYPE <span className="text-red-400 font-bold">{confirmCode}</span> TO AUTHORIZE:
            </label>
            <input
              type="text"
              value={typedCode}
              onChange={(e) => setTypedCode(e.target.value)}
              placeholder={`Type '${confirmCode}'`}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-sm text-cyan-300 font-mono focus:outline-none focus:border-red-500"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-mono font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600"
          >
            CANCEL
          </button>

          <button
            onClick={handleConfirm}
            disabled={!isCodeValid}
            className={`px-4 py-2 text-xs font-mono font-bold rounded flex items-center gap-1.5 transition-all ${
              isCodeValid
                ? severity === 'danger'
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-danger-glow'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-warning-glow'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{confirmText}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
