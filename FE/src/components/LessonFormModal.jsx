import React, { useState, useEffect } from 'react';
import { X, Save, Clock, User, DoorOpen, Award, Calendar, FileText, AlertTriangle } from 'lucide-react';

export default function LessonFormModal({ isOpen, onClose, onSubmit, initialData = null, allLessons = [] }) {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    durationMin: '60',
    student: '',
    tutorID: 'T1',
    room: 'R1',
    isExam: false,
    notes: '',
  });

  const [showOverbookConfirm, setShowOverbookConfirm] = useState(false);

  useEffect(() => {
    setShowOverbookConfirm(false);
    if (initialData) {
      setFormData({
        date: initialData.date || new Date().toISOString().split('T')[0],
        startTime: initialData.startTime || '09:00',
        durationMin: initialData.durationMin || '60',
        student: initialData.student || '',
        tutorID: initialData.tutorID || 'T1',
        room: initialData.room || 'R1',
        isExam: Boolean(initialData.isExam),
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        durationMin: '60',
        student: '',
        tutorID: 'T1',
        room: 'R1',
        isExam: false,
        notes: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Check if two students are booked for current modal state
  const isMultiStudentString = formData.student
    ? formData.student.split(/[,&/]/).filter((s) => s.trim().length > 0).length > 1
    : false;

  const parseMins = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };
  const startMins = parseMins(formData.startTime);
  const duration = parseInt(formData.durationMin || '60', 10);
  const endMins = startMins + duration;

  const hasOverlappingBooking = allLessons.some((other) => {
    if (initialData && other.lessonID === initialData.lessonID) return false;
    if (other.tutorID !== formData.tutorID) return false;
    if (other.date !== formData.date) return false;
    if (other.status === 2 || other.status === 'Cancelled') return false;

    const oStartMins = parseMins(other.startTime);
    const oDuration = parseInt(other.durationMin || '60', 10);
    const oEndMins = oStartMins + oDuration;

    return startMins < oEndMins && oStartMins < endMins;
  });

  const hasTwoStudents = isMultiStudentString || hasOverlappingBooking;

  // Count tutor's existing active bookings on the selected date
  const tutorBookingCount = allLessons.filter((l) => {
    if (initialData && l.lessonID === initialData.lessonID) return false;
    return l.tutorID === formData.tutorID && l.date === formData.date && l.status !== 2 && l.status !== 'Cancelled';
  }).length;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (tutorBookingCount >= 6 && !showOverbookConfirm) {
      setShowOverbookConfirm(true);
      return;
    }

    onSubmit({ ...formData, confirmOverbook: true });
    setShowOverbookConfirm(false);
  };

  const handleConfirmOverbook = () => {
    onSubmit({ ...formData, confirmOverbook: true });
    setShowOverbookConfirm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-300/40 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500">
          <h2 className="text-lg font-black text-slate-950 flex items-center">
            {isEdit ? 'Edit Lesson' : 'Create New Lesson'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-900 hover:text-black p-1 rounded-xl hover:bg-black/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Overbook Confirmation Banner */}
          {showOverbookConfirm && (
            <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-2xl animate-shake">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-amber-950">Tutor Daily Limit Confirmation</h4>
                  <p className="text-xs text-amber-900 font-semibold leading-relaxed">
                    Tutor <strong className="font-black text-slate-950">{formData.tutorID}</strong> already has{' '}
                    <strong className="font-black text-slate-950">{tutorBookingCount}</strong> active booking(s) on{' '}
                    <strong className="font-black text-slate-950">{formData.date}</strong>. Adding this booking will exceed the 6 bookings/day policy.
                  </p>
                  <p className="text-xs font-extrabold text-amber-950 pt-1">Do you wish to proceed with this booking?</p>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowOverbookConfirm(false)}
                  className="px-3.5 py-1.5 text-xs font-extrabold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOverbook}
                  className="px-4 py-1.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-500 border border-amber-500/40 rounded-xl shadow-xs transition-all"
                >
                  Confirm & Save
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-amber-600" /> Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" /> Start Time
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Duration */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1">Duration (minutes)</label>
              <select
                value={formData.durationMin}
                onChange={(e) => setFormData({ ...formData, durationMin: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
              >
                <option value="30">30 mins</option>
                <option value="45">45 mins</option>
                <option value="60">60 mins</option>
                <option value="90">90 mins</option>
                <option value="120">120 mins</option>
              </select>
            </div>

            {/* Room */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center">
                <DoorOpen className="w-3.5 h-3.5 mr-1 text-amber-600" /> Room
              </label>
              <input
                type="text"
                required
                placeholder="e.g. R1, R2"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
              />
            </div>
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center">
              <User className="w-3.5 h-3.5 mr-1 text-amber-600" /> Student Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Le Minh Chau"
              value={formData.student}
              onChange={(e) => setFormData({ ...formData, student: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
            />
          </div>

          {/* Tutor Select */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">Assigned Tutor</label>
            <select
              value={formData.tutorID}
              onChange={(e) => setFormData({ ...formData, tutorID: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
            >
              <option value="T1">T1 - Ngoc Anh (Maths)</option>
              <option value="T2">T2 - Pham Duc (English)</option>
              <option value="T3">T3 - Le Thu (Physics)</option>
            </select>
          </div>

          {/* Is Exam Toggle */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isExam"
                checked={formData.isExam}
                onChange={(e) => setFormData({ ...formData, isExam: e.target.checked })}
                className="w-4 h-4 rounded-lg text-amber-500 focus:ring-amber-400 bg-white border-slate-300 cursor-pointer"
              />
              <label htmlFor="isExam" className="text-sm font-extrabold text-slate-800 cursor-pointer flex items-center">
                <Award className="w-4 h-4 mr-1.5 text-amber-600" /> Mark as Exam Session
              </label>
            </div>
            {hasTwoStudents && !formData.isExam && (
              <div className="flex items-start space-x-2 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300/80 p-2.5 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Two students are booked at this time. Exam status is required and cannot be turned off.</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1 text-slate-500" /> Notes (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Additional information or instructions..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-2 px-5.5 py-2.5 text-sm font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 rounded-2xl border border-amber-400/40 shadow-lg shadow-amber-400/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{isEdit ? 'Save Changes' : 'Create Lesson'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
