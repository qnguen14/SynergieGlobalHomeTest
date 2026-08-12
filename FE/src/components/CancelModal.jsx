import React, { useState } from 'react';
import { X, XCircle, AlertTriangle } from 'lucide-react';

export default function CancelModal({ isOpen, onClose, onConfirm, lesson }) {
  const [notes, setNotes] = useState('');

  if (!isOpen || !lesson) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(lesson.lessonID, notes);
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-300/40 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500">
          <div className="flex items-center space-x-2 text-slate-950">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-black text-slate-950">Cancel Lesson</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-900 hover:text-black p-1 rounded-xl hover:bg-black/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-xs text-slate-800 space-y-1">
            <p>
              Lesson ID: <strong className="text-slate-900 font-extrabold">{lesson.lessonID}</strong>
            </p>
            <p>
              Student: <strong className="text-slate-900 font-extrabold">{lesson.student}</strong>
            </p>
            <p className="text-slate-600 font-medium">
              Time: {lesson.date} at {lesson.startTime}
            </p>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              Reason / Cancellation Notes
            </label>
            <textarea
              rows="3"
              required
              placeholder="e.g. Family cancelled, sick leave, rescheduled..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-2xl border border-slate-200 transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5.5 py-2.5 text-sm font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 rounded-2xl border border-amber-400/40 shadow-lg shadow-amber-400/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <XCircle className="w-4 h-4" />
              <span>Confirm Cancellation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
