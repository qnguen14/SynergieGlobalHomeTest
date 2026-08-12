import React from 'react';
import { Calendar, Plus, RefreshCw, BookOpen, Sparkles } from 'lucide-react';

export default function Navbar({
  selectedDate,
  onDateChange,
  onTodayClick,
  onShowAllClick,
  isShowAll,
  onOpenCreateModal,
  onRefresh,
  loading
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-amber-200/60 px-4 lg:px-8 py-3.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center space-x-3.5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-2xl blur-xs opacity-70 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-400/20">
              <BookOpen className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                BrightPath
              </h1>
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            </div>
            <p className="text-[11px] font-bold text-amber-800 tracking-wider uppercase">Lesson Manager</p>
          </div>
        </div>

        {/* Date Filter Controls & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-slate-100/80 border border-slate-200 rounded-2xl p-1 shadow-inner">
            <Calendar className="w-4 h-4 text-amber-700 ml-2.5 mr-1" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-transparent text-sm text-slate-900 font-bold focus:outline-none px-2 py-1 cursor-pointer"
            />
            <button
              onClick={onTodayClick}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                !isShowAll && selectedDate === new Date().toISOString().split('T')[0]
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Today
            </button>
            <button
              onClick={onShowAllClick}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                isShowAll
                  ? 'bg-amber-400 text-slate-950 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Show All
            </button>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-2.5 bg-white hover:bg-amber-50 text-slate-700 hover:text-slate-950 rounded-2xl border border-slate-200 transition-all hover:scale-105 active:scale-95 shadow-xs disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-600' : ''}`} />
          </button>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-slate-950 text-sm font-extrabold px-4.5 py-2.5 rounded-2xl shadow-lg shadow-amber-400/25 border border-amber-400/40 transition-all hover:scale-[1.03] active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Lesson</span>
          </button>
        </div>
      </div>
    </header>
  );
}
