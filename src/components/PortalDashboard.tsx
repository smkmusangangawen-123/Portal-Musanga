import React from 'react';
import {
  GraduationCap,
  Building2,
  QrCode,
  LayoutGrid,
  ChevronRight,
  BookOpen,
  Wallet,
  BookMarked,
  MonitorPlay,
  Award,
  BarChart3,
  Bell,
  Receipt,
  FileText,
  Library,
  Trophy,
} from 'lucide-react';
import { StudentProfile, MenuItem } from '../types';

interface PortalDashboardProps {
  student: StudentProfile;
  menuItems: MenuItem[];
  onSelectMenu: (menuId: string) => void;
  onOpenQrAbsen: () => void;
  onOpenAverageScore: () => void;
  onOpenPendingTasks: () => void;
  onOpenAllMenu: () => void;
  darkMode?: boolean;
}

export const PortalDashboard: React.FC<PortalDashboardProps> = ({
  student,
  menuItems,
  onSelectMenu,
  onOpenQrAbsen,
  onOpenAverageScore,
  onOpenPendingTasks,
  onOpenAllMenu,
  darkMode = false,
}) => {
  // Map icon string to Lucide icon component
  const renderIcon = (iconName: string, color: string) => {
    const props = { className: 'w-6 h-6', style: { color } };
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen {...props} />;
      case 'Wallet':
        return <Wallet {...props} />;
      case 'BookMarked':
        return <BookMarked {...props} />;
      case 'MonitorPlay':
        return <MonitorPlay {...props} />;
      case 'Award':
        return <Award {...props} />;
      case 'BarChart3':
        return <BarChart3 {...props} />;
      case 'Bell':
        return <Bell {...props} />;
      case 'Receipt':
        return <Receipt {...props} />;
      case 'FileText':
        return <FileText {...props} />;
      case 'Library':
        return <Library {...props} />;
      case 'Trophy':
        return <Trophy {...props} />;
      case 'LayoutGrid':
        return <LayoutGrid {...props} />;
      default:
        return <BookOpen {...props} />;
    }
  };

  // Format currency
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val).replace('IDR', 'Rp');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* 1. Main Gradient Student Profile Card */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 p-5 text-white shadow-xl shadow-blue-700/20 border border-blue-400/30">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />

        {/* Top Row: Avatar, Student Info, QR Absen */}
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            {/* White rounded square avatar box with AS and green dot */}
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-md shadow-black/10 border border-white/60">
                <span className="text-blue-600 font-extrabold text-xl tracking-tight">
                  {student.avatarInitial}
                </span>
              </div>
              {/* Active Online Indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-blue-600 shadow-sm" />
            </div>

            {/* Greeting & Name */}
            <div>
              <span className="text-white/80 text-xs font-medium block">
                Selamat Malam,
              </span>
              <h2 className="text-white font-extrabold text-lg leading-tight tracking-tight mt-0.5">
                {student.name}
              </h2>

              {/* Class & Major Badges */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-semibold text-white border border-white/25 shadow-xs">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{student.grade}</span>
                </div>
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-semibold text-white border border-white/25 shadow-xs">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{student.major}</span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Absen Shortcut Button */}
          <button
            onClick={onOpenQrAbsen}
            aria-label="QR Absen"
            className="group flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 border border-white/25 backdrop-blur-md transition-all shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white mb-0.5">
              <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[10px] font-bold tracking-tight text-white/95">
              QR Absen
            </span>
          </button>
        </div>

        {/* Bottom Row: 3 Column Statistics */}
        <div className="relative z-10 grid grid-cols-3 gap-2.5 mt-5 pt-3.5 border-t border-white/15">
          {/* NISN */}
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-2 text-center border border-white/10">
            <span className="text-[10px] uppercase font-bold text-blue-100/90 tracking-wider block">
              NISN
            </span>
            <span className="text-xs font-extrabold text-white tracking-wide mt-0.5 block truncate">
              {student.nisn}
            </span>
          </div>

          {/* KEHADIRAN */}
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-2 text-center border border-white/10">
            <span className="text-[10px] uppercase font-bold text-blue-100/90 tracking-wider block">
              KEHADIRAN
            </span>
            <span className="text-xs font-extrabold text-white tracking-wide mt-0.5 block">
              {student.attendancePercent}%
            </span>
          </div>

          {/* TABUNGAN */}
          <div
            onClick={() => onSelectMenu('tabungan')}
            className="cursor-pointer rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm p-2 text-center border border-white/15 transition-all"
          >
            <span className="text-[10px] uppercase font-bold text-blue-100/90 tracking-wider block">
              TABUNGAN
            </span>
            <span className="text-xs font-extrabold text-white tracking-tight mt-0.5 block truncate">
              {formatRupiah(student.savingsBalance)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Menu Portal Siswa Section */}
      <div
        className={`rounded-[24px] p-5 border transition-all ${
          darkMode
            ? 'bg-slate-900/90 border-slate-800 shadow-md shadow-black/20'
            : 'bg-white border-slate-100 shadow-sm'
        }`}
      >
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <LayoutGrid className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <h3
              className={`text-xs font-extrabold tracking-wider uppercase ${
                darkMode ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              MENU PORTAL SISWA
            </h3>
          </div>

          <button
            onClick={onOpenAllMenu}
            className="flex items-center gap-0.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Columns Menu Grid matching visual layout */}
        <div className="grid grid-cols-4 gap-y-4 gap-x-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectMenu(item.id)}
              className="group flex flex-col items-center justify-start text-center focus:outline-none transition-all active:scale-95"
            >
              {/* Icon Container with Badge */}
              <div className="relative mb-1.5">
                <div
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center border transition-all shadow-xs group-hover:scale-105 ${
                    darkMode
                      ? 'bg-slate-800/80 border-slate-700/80 group-hover:border-blue-500'
                      : 'bg-slate-50 border-slate-100 group-hover:border-blue-200'
                  }`}
                  style={{
                    backgroundColor: darkMode ? undefined : `${item.color}0D`,
                    borderColor: darkMode ? undefined : `${item.color}25`,
                  }}
                >
                  {renderIcon(item.icon, item.color)}
                </div>

                {/* Badge Counter */}
                {item.badge !== undefined && (
                  <span
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-extrabold flex items-center justify-center shadow-sm border border-white dark:border-slate-900"
                    style={{ backgroundColor: item.badgeColor || '#ef4444' }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Menu Label */}
              <span
                className={`text-[11px] font-semibold leading-tight line-clamp-2 px-0.5 ${
                  darkMode
                    ? 'text-slate-300 group-hover:text-blue-400'
                    : 'text-slate-700 group-hover:text-blue-600'
                }`}
              >
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Bottom Summary Cards (2 Columns) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Rata-rata Nilai */}
        <div
          onClick={onOpenAverageScore}
          role="button"
          tabIndex={0}
          className={`cursor-pointer rounded-[22px] p-4 border transition-all active:scale-98 ${
            darkMode
              ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
              : 'bg-white border-slate-100 hover:border-blue-100 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <BarChart3 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
              {student.averageScore}
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
            Rata-rata Nilai
          </span>
          <h4
            className={`text-sm font-extrabold tracking-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {student.totalGradesCount} Nilai
          </h4>
        </div>

        {/* Card 2: Tugas Belum Selesai */}
        <div
          onClick={onOpenPendingTasks}
          role="button"
          tabIndex={0}
          className={`cursor-pointer rounded-[22px] p-4 border transition-all active:scale-98 ${
            darkMode
              ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
              : 'bg-white border-slate-100 hover:border-amber-100 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/80 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
              {student.pendingTasksCount}
            </span>
          </div>
          <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
            Tugas
          </span>
          <h4
            className={`text-sm font-extrabold tracking-tight ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Belum Selesai
          </h4>
        </div>
      </div>
    </div>
  );
};
