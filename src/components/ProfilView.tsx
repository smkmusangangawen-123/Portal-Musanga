import React from 'react';
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  School,
  QrCode,
  Moon,
  Sun,
  Bell,
  RotateCcw,
  Sparkles,
  Award,
  LogOut,
} from 'lucide-react';
import { StudentProfile } from '../types';

interface ProfilViewProps {
  student: StudentProfile;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenQr: () => void;
  onResetData: () => void;
  onLogout: () => void;
}

export const ProfilView: React.FC<ProfilViewProps> = ({
  student,
  darkMode,
  onToggleTheme,
  onOpenQr,
  onResetData,
  onLogout,
}) => {
  return (
    <div className="space-y-4 pb-28">
      {/* Profile Header Card */}
      <div className="rounded-[24px] bg-gradient-to-br from-indigo-700 via-blue-600 to-blue-800 p-5 text-white shadow-xl shadow-blue-900/20 text-center relative overflow-hidden">
        <div className="w-20 h-20 rounded-3xl bg-white text-blue-600 font-black text-2xl flex items-center justify-center mx-auto shadow-md border-2 border-white/50 relative">
          {student.avatarInitial}
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
        </div>

        <h2 className="text-lg font-extrabold mt-3">{student.name}</h2>
        <p className="text-xs text-blue-200">
          NISN: {student.nisn} • {student.grade} {student.major}
        </p>

        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={onOpenQr}
            className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 backdrop-blur-md transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Kartu Pelajar QR</span>
          </button>
        </div>
      </div>

      {/* Academic Highlights */}
      <div className="grid grid-cols-3 gap-2.5">
        <div
          className={`p-3 rounded-2xl text-center border ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-150 shadow-xs'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Level</span>
          <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
            Lvl {student.level}
          </span>
        </div>

        <div
          className={`p-3 rounded-2xl text-center border ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-150 shadow-xs'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total XP</span>
          <span className="text-base font-extrabold text-teal-600 dark:text-teal-400">
            {student.xp.toLocaleString('id-ID')}
          </span>
        </div>

        <div
          className={`p-3 rounded-2xl text-center border ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-150 shadow-xs'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Kehadiran</span>
          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
            {student.attendancePercent}%
          </span>
        </div>
      </div>

      {/* Student Biodata Information */}
      <div
        className={`p-5 rounded-[24px] border space-y-3 ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-150 shadow-xs'
        }`}
      >
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Informasi Akademis & Biodata
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 font-medium">Nama Lengkap</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{student.name}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 font-medium">Nomor Induk Siswa (NIS)</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">202610045</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 font-medium">Wali Kelas</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Dra. Sri Wahyuni, M.Pd
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-400 font-medium">Kontak Darurat Orang Tua</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              0812-3456-7890 (Bpk. Siswoyo)
            </span>
          </div>

          <div className="flex justify-between py-1.5">
            <span className="text-slate-400 font-medium">Email Portal Siswa</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">
              ahmad.siswa@smkdigital.sch.id
            </span>
          </div>
        </div>
      </div>

      {/* App Settings */}
      <div
        className={`p-5 rounded-[24px] border space-y-3 ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-150 shadow-xs'
        }`}
      >
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          Pengaturan Aplikasi
        </h3>

        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2.5">
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            <span className="font-bold">Mode Tampilan Gelap (Dark Mode)</span>
          </div>
          <button
            onClick={onToggleTheme}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              darkMode ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <button
          onClick={onResetData}
          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Data Demo ke Kondisi Semula</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-950/70 transition-all shadow-2xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar dari Akun Siswa (Ganti Akun)</span>
        </button>
      </div>
    </div>
  );
};
