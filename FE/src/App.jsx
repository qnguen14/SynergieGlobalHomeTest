import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import LessonCard from './components/LessonCard';
import LessonFormModal from './components/LessonFormModal';
import CancelModal from './components/CancelModal';
import { api } from './services/api';
import { Search, Filter, AlertCircle, CheckCircle2, Loader2, BookOpen } from 'lucide-react';

export default function App() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Filters
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isShowAll, setIsShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, BOOKED, CANCELLED, EXAM

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellingLesson, setCancellingLesson] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadLessons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = isShowAll
        ? await api.getAllLessons()
        : await api.getLessons(selectedDate);
      setLessons(data);
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError(err.message || 'Failed to load lessons from server');
    } finally {
      setLoading(false);
    }
  }, [selectedDate, isShowAll]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  // Handle Date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsShowAll(false);
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setIsShowAll(false);
  };

  const handleShowAllClick = () => {
    setIsShowAll(true);
  };

  // Open Create / Edit Modal
  const handleOpenCreateModal = () => {
    setEditingLesson(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (lesson) => {
    setEditingLesson(lesson);
    setIsFormModalOpen(true);
  };

  // Submit Create / Edit Form
  const handleFormSubmit = async (formData) => {
    try {
      if (editingLesson) {
        await api.updateLesson(editingLesson.lessonID, formData);
        showToast('Lesson updated successfully!');
      } else {
        await api.createLesson(formData);
        showToast('New lesson created successfully!');
      }
      setIsFormModalOpen(false);
      setEditingLesson(null);
      loadLessons();
    } catch (err) {
      showToast(err.message || 'Failed to save lesson', 'error');
    }
  };

  // Open & Confirm Cancellation
  const handleOpenCancelModal = (lesson) => {
    setCancellingLesson(lesson);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async (id, notes) => {
    try {
      await api.cancelLesson(id, notes);
      showToast('Lesson cancelled successfully!');
      setIsCancelModalOpen(false);
      setCancellingLesson(null);
      loadLessons();
    } catch (err) {
      showToast(err.message || 'Failed to cancel lesson', 'error');
    }
  };

  // Toggle Exam
  const handleToggleExam = async (id) => {
    try {
      const updated = await api.toggleExam(id);
      showToast(`Exam status toggled to ${updated.isExam ? 'Exam' : 'Regular'}`);
      loadLessons();
    } catch (err) {
      showToast(err.message || 'Failed to toggle exam status', 'error');
    }
  };

  // Filter lessons locally
  const filteredLessons = lessons.filter((lesson) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      lesson.student?.toLowerCase().includes(searchLower) ||
      lesson.tutorID?.toLowerCase().includes(searchLower) ||
      lesson.room?.toLowerCase().includes(searchLower) ||
      lesson.lessonID?.toLowerCase().includes(searchLower);

    if (statusFilter === 'BOOKED') {
      return matchesSearch && (lesson.status === 1 || lesson.status === 'Booked');
    }
    if (statusFilter === 'CANCELLED') {
      return matchesSearch && (lesson.status === 2 || lesson.status === 'Cancelled');
    }
    if (statusFilter === 'EXAM') {
      return matchesSearch && lesson.isExam;
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-slate-50 text-slate-900 font-sans pb-16">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center space-x-2 px-4.5 py-3 rounded-2xl shadow-2xl border text-sm font-extrabold backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 border-amber-400/50 shadow-amber-400/30'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-slate-950" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        onTodayClick={handleTodayClick}
        onShowAllClick={handleShowAllClick}
        isShowAll={isShowAll}
        onOpenCreateModal={handleOpenCreateModal}
        onRefresh={loadLessons}
        loading={loading}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
        {/* Stats Overview */}
        <StatsOverview lessons={lessons} />

        {/* Search & Filter Toolbar */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-4 mb-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, tutor, room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 font-semibold focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-all"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-amber-600 mr-1 hidden sm:block" />
            {[
              { id: 'ALL', label: 'All Status' },
              { id: 'BOOKED', label: 'Booked' },
              { id: 'CANCELLED', label: 'Cancelled' },
              { id: 'EXAM', label: 'Exams Only' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
                  statusFilter === tab.id
                    ? 'bg-amber-400 text-slate-950 border border-amber-400/50 shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-amber-50 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin text-amber-500 mb-3" />
            <p className="text-sm font-bold">Fetching lessons from server...</p>
          </div>
        ) : error ? (
          <div className="bg-white border border-amber-200 rounded-3xl p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
            <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">Failed to Connect to API</h3>
            <p className="text-sm text-slate-600 mb-4">{error}</p>
            <button
              onClick={loadLessons}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-extrabold rounded-2xl transition-all shadow-md border border-amber-400/40"
            >
              Try Again
            </button>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="bg-white/80 border border-slate-200 rounded-3xl p-16 text-center max-w-md mx-auto my-12 shadow-xs backdrop-blur-sm">
            <BookOpen className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="text-lg font-extrabold text-slate-900 mb-1">No Lessons Found</h3>
            <p className="text-xs font-medium text-slate-500 mb-6">
              {isShowAll
                ? 'No lessons matching your search query'
                : `No lessons scheduled for ${selectedDate}`}
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 text-xs font-extrabold rounded-2xl transition-all shadow-md border border-amber-400/40"
            >
              + Create First Lesson
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLessons.map((lesson) => (
              <LessonCard
                key={lesson.lessonID}
                lesson={lesson}
                onEdit={handleOpenEditModal}
                onCancel={handleOpenCancelModal}
                onToggleExam={handleToggleExam}
              />
            ))}
          </div>
        )}
      </main>

      {/* Form Modal (Create / Edit) */}
      <LessonFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingLesson}
      />

      {/* Cancel Reason Modal */}
      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        lesson={cancellingLesson}
      />
    </div>
  );
}
