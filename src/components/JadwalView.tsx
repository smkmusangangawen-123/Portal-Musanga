import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle2, Bell } from 'lucide-react';
import { weeklySchedule } from '../data/mockData';

interface JadwalViewProps {
  darkMode?: boolean;
}

export const JadwalView: React.FC<JadwalViewProps> = ({ darkMode = false }) => {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'] as const;
  const [selectedDay, setSelectedDay] = useState<string>('Senin');

  const filtered = weeklySchedule.filter((s) => s.day === selectedDay);

  return (
    <div className="space-y-4 pb-28">
      {/* Header */}
      <div className="rounded-[24px] bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 p-5 text-white shadow-xl shadow-blue-900/20">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-5 h-5" />
          <h2 className="text-xl font-extrabold tracking-tight">Jadwal Pelajaran Kelas</h2>
        </div>
        <p className="text-xs text-blue-100">
          Semester Ganjil TA 2026/2027 • Kelas X-A IPA (Ruang 10-A)
        </p>
      </div>

      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-1 min-w-[68px] py-2 rounded-2xl text-xs font-bold text-center transition-all ${
              selectedDay === day
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : darkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule Items for Day */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <p className="text-xs font-semibold">Tidak ada jadwal pelajaran di hari {selectedDay}.</p>
          </div>
        ) : (
          filtered.map((item, idx) => {
            const isFirst = idx === 0 && selectedDay === 'Senin';
            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-150 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase text-white tracking-wider"
                    style={{ backgroundColor: item.color }}
                  >
                    Jam Ke-{idx + 1}
                  </span>

                  {isFirst && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Aktif Hari Ini
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-extrabold text-slate-800 dark:text-white leading-snug">
                  {item.subject}
                </h4>

                <div className="mt-2.5 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.time} WIB</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.teacher}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.room}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
