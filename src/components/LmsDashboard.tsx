import React, { useState } from 'react';
import {
  Zap,
  Flame,
  Trophy,
  BarChart3,
  Video,
  Calendar,
  Search,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { StudentProfile, ChapterModule, LiveClass } from '../types';

interface LmsDashboardProps {
  student: StudentProfile;
  liveSession: LiveClass;
  modules: ChapterModule[];
  onOpenLiveClass: () => void;
  onOpenLeaderboard: () => void;
  onOpenAnalisisNilai: () => void;
  onSelectModule: (module: ChapterModule) => void;
  darkMode?: boolean;
}

export const LmsDashboard: React.FC<LmsDashboardProps> = ({
  student,
  liveSession,
  modules,
  onOpenLiveClass,
  onOpenLeaderboard,
  onOpenAnalisisNilai,
  onSelectModule,
  darkMode = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('semua');

  // Filter modules based on search query and status chip
  const filteredModules = modules.filter((mod) => {
    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'semua') return true;
    if (activeFilter === 'sedang') return mod.status === 'sedang_dipelajari';
    if (activeFilter === 'belum') return mod.status === 'belum_dimulai';
    if (activeFilter === 'selesai') return mod.status === 'selesai';
    return true;
  });

  return (
    <div className="space-y-4 pb-24">
      {/* 1. Gamification Header Card (Purple Gradient) */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#7e22ce] via-[#6b21a8] to-[#4c1d95] p-5 text-white shadow-xl shadow-purple-900/30 border border-purple-400/30">
        {/* Glow circles */}
        <div className="absolute -top-14 -right-14 w-48 h-48 rounded-full bg-fuchsia-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-14 -left-14 w-48 h-48 rounded-full bg-indigo-500/25 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-bold text-white border border-white/20 mb-3 shadow-xs">
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span className="tracking-wide uppercase">RUANG BELAJAR DIGITAL LMS</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Halo, {student.name.split(' ')[0]}!
          </h2>

          {/* Motivational Subtitle */}
          <p className="text-xs text-purple-100/90 font-normal mt-1 max-w-sm leading-relaxed">
            Siap belajar hari ini? Tonton modul video interaktif, selesaikan kuis, dan tingkatkan XP kamu!
          </p>

          {/* Metrics Bar (Frosted 3 Columns) */}
          <div className="mt-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2.5 grid grid-cols-3 text-center divide-x divide-white/15 shadow-inner">
            {/* LEVEL */}
            <div className="px-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200 block">
                LEVEL
              </span>
              <span className="text-base font-extrabold text-white mt-0.5 block tracking-tight">
                Lvl {student.level}
              </span>
            </div>

            {/* TOTAL XP */}
            <div className="px-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200 block">
                TOTAL XP
              </span>
              <span className="text-base font-extrabold text-teal-300 mt-0.5 block tracking-tight">
                {student.xp.toLocaleString('id-ID')}
              </span>
            </div>

            {/* STREAK */}
            <div className="px-1 flex flex-col items-center justify-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200 block">
                STREAK
              </span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Flame className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
                <span className="text-base font-extrabold text-white tracking-tight">
                  {student.streakDays}d
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Shortcut Cards (3 Columns) */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Leaderboard Card */}
        <button
          onClick={onOpenLeaderboard}
          className={`flex flex-col items-center text-center p-3 rounded-[20px] border transition-all active:scale-95 ${
            darkMode
              ? 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50 shadow-md'
              : 'bg-white border-slate-100 hover:border-amber-200 shadow-sm'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center mb-2 shadow-xs">
            <Trophy className="w-5 h-5 fill-amber-500/20" />
          </div>
          <span
            className={`text-xs font-bold leading-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Leaderboard
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5 truncate w-full">
            Peringkat & Badge
          </span>
        </button>

        {/* Analisis Nilai Card */}
        <button
          onClick={onOpenAnalisisNilai}
          className={`flex flex-col items-center text-center p-3 rounded-[20px] border transition-all active:scale-95 ${
            darkMode
              ? 'bg-slate-900/90 border-slate-800 hover:border-indigo-500/50 shadow-md'
              : 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 shadow-xs">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span
            className={`text-xs font-bold leading-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Analisis Nilai
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5 truncate w-full">
            Grafik Radar
          </span>
        </button>

        {/* Live Class Card */}
        <button
          onClick={onOpenLiveClass}
          className={`flex flex-col items-center text-center p-3 rounded-[20px] border transition-all active:scale-95 ${
            darkMode
              ? 'bg-slate-900/90 border-slate-800 hover:border-rose-500/50 shadow-md'
              : 'bg-white border-slate-100 hover:border-rose-200 shadow-sm'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 flex items-center justify-center mb-2 shadow-xs">
            <Video className="w-5 h-5 fill-rose-500/20" />
          </div>
          <span
            className={`text-xs font-bold leading-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Live Class
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5 truncate w-full">
            Sesi Interactive
          </span>
        </button>
      </div>

      {/* 3. Live Teaching Terdekat Card */}
      <div
        className={`rounded-[22px] p-4 border transition-all ${
          darkMode
            ? 'bg-rose-950/20 border-rose-900/50 shadow-md'
            : 'bg-[#fff1f2] border-rose-200/80 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {/* Pulsating red live dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            LIVE TEACHING TERDEKAT
          </span>
        </div>

        {/* Title */}
        <h4
          className={`text-xs sm:text-sm font-bold leading-snug ${
            darkMode ? 'text-slate-100' : 'text-slate-900'
          }`}
        >
          {liveSession.title}
        </h4>

        {/* Schedule */}
        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {liveSession.date} {liveSession.time}
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-rose-600 dark:text-rose-400 font-semibold">
            {liveSession.participantsCount} Siswa Siap
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenLiveClass}
          className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold text-xs shadow-md shadow-rose-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <Video className="w-4 h-4 fill-white" />
          <span>Masuk Live</span>
        </button>
      </div>

      {/* 4. Modul & Bab Pembelajaran Section */}
      <div
        className={`rounded-[24px] p-5 border transition-all ${
          darkMode
            ? 'bg-slate-900/90 border-slate-800 shadow-md'
            : 'bg-white border-slate-100 shadow-sm'
        }`}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <h3
            className={`text-base font-extrabold tracking-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Modul & Bab Pembelajaran
          </h3>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {modules.length}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
          Pilih bab untuk mengakses rangkuman materi, video interaktif, kuis CBT, dan tugas kelas.
        </p>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari bab, mata pelajaran, atau topik..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium border transition-colors outline-none focus:ring-2 focus:ring-blue-500/30 ${
              darkMode
                ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
            }`}
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
          <button
            onClick={() => setActiveFilter('semua')}
            className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'semua'
                ? 'bg-blue-600 text-white shadow-xs'
                : darkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveFilter('sedang')}
            className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'sedang'
                ? 'bg-blue-600 text-white shadow-xs'
                : darkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sedang Dipelajari
          </button>
          <button
            onClick={() => setActiveFilter('belum')}
            className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'belum'
                ? 'bg-blue-600 text-white shadow-xs'
                : darkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Belum Dimulai
          </button>
          <button
            onClick={() => setActiveFilter('selesai')}
            className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'selesai'
                ? 'bg-blue-600 text-white shadow-xs'
                : darkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Selesai
          </button>
        </div>

        {/* Modules List */}
        <div className="space-y-3 mt-3">
          {filteredModules.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-semibold">Tidak ada modul yang cocok</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('semua');
                }}
                className="text-xs text-blue-600 font-bold mt-1 underline"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filteredModules.map((module) => {
              const isFinished = module.status === 'selesai';
              const isInProgress = module.status === 'sedang_dipelajari';

              return (
                <div
                  key={module.id}
                  onClick={() => onSelectModule(module)}
                  className={`group cursor-pointer rounded-2xl p-4 border transition-all active:scale-98 ${
                    darkMode
                      ? 'bg-slate-800/60 border-slate-750 hover:border-blue-500/60'
                      : 'bg-slate-50/70 border-slate-200/80 hover:border-blue-300 hover:bg-white shadow-xs'
                  }`}
                >
                  {/* Top: Subject Badge & XP */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white"
                      style={{ backgroundColor: module.color }}
                    >
                      {module.subject}
                    </span>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/40">
                      <Sparkles className="w-3 h-3 fill-amber-400" />
                      <span>+{module.xpReward} XP</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4
                    className={`text-xs sm:text-sm font-bold line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {module.title}
                  </h4>

                  {/* Description */}
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-normal">
                    {module.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      <span>Progres Belajar</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {module.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${module.progress}%`,
                          backgroundColor: isFinished
                            ? '#10b981'
                            : isInProgress
                            ? '#3b82f6'
                            : '#94a3b8',
                        }}
                      />
                    </div>
                  </div>

                  {/* Meta items */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3 text-slate-400" />
                        {module.completedVideos}/{module.totalVideos} Video
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-slate-400" />
                        {module.completedQuizzes}/{module.totalQuizzes} Kuis
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {module.estimatedMinutes}m
                      </span>
                    </div>

                    <div className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                      <span>Buka</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
