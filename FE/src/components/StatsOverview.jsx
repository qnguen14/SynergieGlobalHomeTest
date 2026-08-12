import React from 'react';
import { Calendar, CheckCircle2, XCircle, Award } from 'lucide-react';

export default function StatsOverview({ lessons = [] }) {
  const total = lessons.length;
  const booked = lessons.filter((l) => l.status === 1 || l.status === 'Booked').length;
  const cancelled = lessons.filter((l) => l.status === 2 || l.status === 'Cancelled').length;
  const exams = lessons.filter((l) => l.isExam).length;

  const stats = [
    {
      title: 'Total Lessons',
      value: total,
      icon: Calendar,
    },
    {
      title: 'Booked',
      value: booked,
      icon: CheckCircle2,
    },
    {
      title: 'Cancelled',
      value: cancelled,
      icon: XCircle,
    },
    {
      title: 'Exam Sessions',
      value: exams,
      icon: Award,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-white border border-amber-200/70 rounded-3xl p-4.5 flex items-center justify-between shadow-xs transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-amber-300"
          >
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {stat.title}
              </p>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 border border-amber-300/60 text-amber-900 flex items-center justify-center shadow-xs">
              <Icon className="w-5.5 h-5.5 stroke-[2.2]" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
