import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  School,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Briefcase,
} from 'lucide-react';
import { AuthUser } from '../types';
import {
  defaultAdminUser,
  defaultStudentUser,
  defaultGuruUser,
  defaultKaryawanUser,
} from '../data/mockData';

interface LoginViewProps {
  onLogin: (user: AuthUser) => void;
  darkMode?: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, darkMode = false }) => {
  const [roleTab, setRoleTab] = useState<'student' | 'admin'>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCredentialsHint, setShowCredentialsHint] = useState(true);

  // Quick autofill & submit
  const handleQuickLogin = (role: 'student' | 'admin' | 'guru' | 'karyawan') => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      if (role === 'admin') {
        onLogin(defaultAdminUser);
      } else if (role === 'guru') {
        onLogin(defaultGuruUser);
      } else if (role === 'karyawan') {
        onLogin(defaultKaryawanUser);
      } else {
        onLogin(defaultStudentUser);
      }
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage(
        roleTab === 'student'
          ? 'Mohon masukkan NISN atau Email Siswa Anda.'
          : 'Mohon masukkan NIP atau Email Admin/Staf.'
      );
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Mohon masukkan kata sandi Anda.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (roleTab === 'admin') {
        // Admin credentials check (accept admin / admin123 or any reasonable input)
        const isOfficialAdmin =
          identifier.toLowerCase().includes('admin') ||
          identifier.includes('19820315') ||
          identifier.toLowerCase().includes('bambang');

        if (password.length >= 3) {
          onLogin({
            ...defaultAdminUser,
            name: isOfficialAdmin ? defaultAdminUser.name : `Admin (${identifier})`,
            email: identifier.includes('@') ? identifier : `${identifier}@smkdigital.sch.id`,
            identifier: identifier,
          });
        } else {
          setErrorMessage('Kata sandi admin salah. Gunakan sandi: admin123');
        }
      } else {
        // Student credentials check
        if (password.length >= 3) {
          onLogin({
            ...defaultStudentUser,
            name: identifier === '123456789' ? defaultStudentUser.name : `Siswa (${identifier})`,
            identifier: identifier,
          });
        } else {
          setErrorMessage('Kata sandi salah. Gunakan sandi: 123456');
        }
      }
    }, 700);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden transition-colors ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-b from-blue-50/70 via-white to-slate-100 text-slate-900'
      }`}
    >
      {/* Decorative background blobs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/15 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-500/15 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* School / Portal Header Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 mb-3 border border-white/30">
            <School className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            SMK / SMA DIGITAL
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Portal Edukasi, LMS & E-Administrasi Terpadu
          </p>
        </div>

        {/* Main Auth Card */}
        <div
          className={`rounded-[28px] border shadow-xl p-5 sm:p-7 backdrop-blur-sm transition-all ${
            darkMode
              ? 'bg-slate-900/90 border-slate-800 shadow-slate-950/50'
              : 'bg-white border-slate-200/80 shadow-slate-300/40'
          }`}
        >
          {/* Role Segmented Tabs */}
          <div className="p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 flex gap-1 mb-5">
            <button
              type="button"
              onClick={() => {
                setRoleTab('student');
                setErrorMessage(null);
                setIdentifier('123456789');
                setPassword('123456');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                roleTab === 'student'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Portal Siswa</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRoleTab('admin');
                setErrorMessage(null);
                setIdentifier('admin@smkdigital.sch.id');
                setPassword('admin123');
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                roleTab === 'admin'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin / Tata Usaha</span>
            </button>
          </div>

          {/* Form Header Info */}
          <div className="mb-4">
            <h2 className="text-base font-extrabold text-slate-800 dark:text-white">
              {roleTab === 'student' ? 'Masuk ke Akun Siswa' : 'Masuk Backoffice Admin / Guru'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {roleTab === 'student'
                ? 'Akses jadwal, materi LMS, presensi harian & administrasi sekolah.'
                : 'Kelola data siswa, konfirmasi SPP, presensi & siaran pengumuman.'}
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {roleTab === 'student' ? 'NISN / Email Siswa' : 'NIP / Email Staf / Username'}
              </label>
              <div
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all ${
                  darkMode
                    ? 'bg-slate-800/80 border-slate-700 focus-within:border-blue-500 text-white'
                    : 'bg-slate-50 border-slate-200 focus-within:border-blue-600 text-slate-900'
                }`}
              >
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    roleTab === 'student'
                      ? '123456789 atau email siswa'
                      : 'admin@smkdigital.sch.id / NIP'
                  }
                  className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Kata Sandi / PIN
                </label>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold cursor-pointer hover:underline">
                  Lupa Sandi?
                </span>
              </div>
              <div
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all ${
                  darkMode
                    ? 'bg-slate-800/80 border-slate-700 focus-within:border-blue-500 text-white'
                    : 'bg-slate-50 border-slate-200 focus-within:border-blue-600 text-slate-900'
                }`}
              >
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full bg-transparent text-xs font-semibold outline-none placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 accent-blue-600"
                />
                <span>Ingat sesi masuk saya</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-extrabold text-xs text-white shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50 ${
                roleTab === 'student'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25'
                  : 'bg-gradient-to-r from-indigo-600 to-slate-800 hover:from-indigo-700 hover:to-slate-900 shadow-indigo-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke {roleTab === 'student' ? 'Portal Siswa' : 'Panel Admin'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Demo Logins Section */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block text-center">
              ⚡ Akun Demo Instan (1-Klik Langsung Masuk)
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="p-2 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100/70 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-bold">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Siswa</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate mt-0.5">
                  Ahmad Siswa
                </div>
                <div className="text-[10px] text-slate-400">NISN: 123456789</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('guru')}
                className="p-2 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/70 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Guru / Pengajar</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate mt-0.5">
                  Dra. Sri Wahyuni
                </div>
                <div className="text-[10px] text-slate-400">Guru Matematika</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('karyawan')}
                className="p-2 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 hover:bg-amber-100/70 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Karyawan TU</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate mt-0.5">
                  Hendra Gunawan
                </div>
                <div className="text-[10px] text-slate-400">Kasir & Keuangan</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-100/70 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Super Admin</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate mt-0.5">
                  Drs. H. Bambang
                </div>
                <div className="text-[10px] text-slate-400">Kepala TU & Sistem</div>
              </button>
            </div>
          </div>

          {/* Quick Credential Hint */}
          {showCredentialsHint && (
            <div className="mt-4 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start justify-between gap-2">
              <div className="flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Kredensial Pengujian:
                  </span>
                  <div className="mt-0.5">
                    <strong>Admin:</strong> admin@smkdigital.sch.id / admin123
                  </div>
                  <div>
                    <strong>Siswa:</strong> 123456789 / 123456
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowCredentialsHint(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Footer Security Badge */}
        <div className="mt-6 text-center text-xs text-slate-400 space-y-1">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Koneksi Aman SSL 256-bit • Terintegrasi Dapodik</span>
          </div>
          <p className="text-[10px]">© 2026 SMK/SMA Digital. Hak Cipta Dilindungi Undang-Undang.</p>
        </div>
      </div>
    </div>
  );
};
