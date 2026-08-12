import React from 'react';
import { Clock, User, DoorOpen, Award, Edit3, XCircle, FileText, Calendar } from 'lucide-react';

export default function LessonCard({ lesson, onEdit, onCancel, onToggleExam }) {
  // Status helper: 1=Booked, 2=Cancelled, 3=NoShow
  const getStatusBadge = (status) => {
    if (status === 1 || status === 'Booked') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-400 text-slate-950 border border-amber-500/40 shadow-xs">
          Booked
        </span>
      );
    }
    if (status === 2 || status === 'Cancelled') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
          Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
        No Show
      </span>
    );
  };

  const isCancelled = lesson.status === 2 || lesson.status === 'Cancelled';

  return (
    <div
      className={`group relative bg-white border ${
        isCancelled
          ? 'border-slate-200/60 bg-slate-50/50 opacity-75'
          : 'border-slate-200/80 hover:border-amber-400/80 hover:shadow-xl hover:-translate-y-1'
      } rounded-3xl p-5 shadow-xs transition-all duration-300 flex flex-col justify-between`}
    >
      {/* Top Bar: ID, Time, Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-extrabold bg-slate-900 text-amber-400 px-2.5 py-0.5 rounded-lg">
              {lesson.lessonID}
            </span>
            <div className="flex items-center text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-xl border border-slate-200/80">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              <span>{lesson.startTime}</span>
              <span className="mx-1 text-slate-400">•</span>
              <span>{lesson.durationMin}m</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {lesson.isExam && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-xs border border-amber-400">
                <Award className="w-3 h-3 mr-1 stroke-[2.5]" /> EXAM
              </span>
            )}
            {getStatusBadge(lesson.status)}
          </div>
        </div>

        {/* Date & Student Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-xs font-semibold text-slate-500">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
            <span>{lesson.date}</span>
          </div>

          <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors flex items-center">
            <User className="w-4.5 h-4.5 mr-2 text-amber-500" />
            {lesson.student}
          </h3>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-1">
            <span className="bg-amber-50/70 px-2.5 py-1 rounded-xl border border-amber-200/60 font-semibold">
              Tutor: <strong className="text-slate-900 font-extrabold">{lesson.tutor?.tutorName || lesson.tutorID}</strong>
            </span>
            <span className="bg-amber-50/70 px-2.5 py-1 rounded-xl border border-amber-200/60 font-semibold flex items-center">
              <DoorOpen className="w-3.5 h-3.5 mr-1 text-amber-600" />
              Room: <strong className="text-slate-900 font-extrabold ml-1">{lesson.room}</strong>
            </span>
          </div>
        </div>

        {/* Notes */}
        {lesson.notes && (
          <div className="mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs text-slate-700 flex items-start space-x-2">
            <FileText className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
            <span className="line-clamp-2 italic font-medium">{lesson.notes}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onToggleExam(lesson.lessonID)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 ${
            lesson.isExam
              ? 'bg-slate-900 text-amber-400 hover:bg-slate-800 shadow-xs'
              : 'bg-amber-400 hover:bg-amber-500 text-slate-950 border border-amber-500/30 shadow-xs'
          }`}
          title="Toggle Exam Status"
        >
          <Award className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{lesson.isExam ? 'Exam Active' : 'Set Exam'}</span>
        </button>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onEdit(lesson)}
            className="p-2 text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-amber-400 rounded-xl border border-slate-200 transition-all duration-200 shadow-xs"
            title="Edit Lesson"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {!isCancelled && (
            <button
              onClick={() => onCancel(lesson)}
              className="p-2 text-slate-500 hover:text-slate-950 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-all duration-200 shadow-xs"
              title="Cancel Lesson"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
