import React from 'react';
import { Sun, Moon, Bell, Wifi, Battery, Signal, LogOut } from 'lucide-react';
import { StudentProfile } from '../types';

interface HeaderProps {
  title: string;
  student: StudentProfile;
  darkMode: boolean;
  onToggleTheme: () => void;
  unreadNotifications: number;
  onNotificationClick: () => void;
  onLogout?: () => void;
  currentTime?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  student,
  darkMode,
  onToggleTheme,
  unreadNotifications,
  onNotificationClick,
  onLogout,
  currentTime = '19:49',
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b193d] text-white shadow-md select-none transition-colors">
      {/* Mobile Top Status Bar */}
      <div className="flex items-center justify-between px-5 pt-2 pb-1 text-[11px] font-medium tracking-tight text-white/90">
        <span className="font-semibold text-xs tracking-wider">{currentTime}</span>
        <div className="flex items-center gap-2">
          <Signal className="w-3.5 h-3.5 fill-current opacity-90" />
          <span className="text-[10px] font-bold opacity-90">4G</span>
          <Wifi className="w-3.5 h-3.5 opacity-90" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px] font-semibold">100%</span>
            <Battery className="w-3.5 h-3.5 fill-current opacity-90" />
          </div>
        </div>
      </div>

      {/* Main App Bar Header */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Avatar with Initial & Page Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white text-base shadow-sm shadow-indigo-900/50 border border-white/20">
            {student.avatarInitial.charAt(0) || 'A'}
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold leading-tight tracking-tight text-white">
              {title}
            </h1>
            <span className="text-xs text-blue-200/90 font-medium">
              {student.name}
            </span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Ganti Tema"
            className="w-9 h-9 rounded-full bg-blue-900/60 border border-blue-700/60 flex items-center justify-center text-amber-300 hover:bg-blue-800/80 active:scale-95 transition-all shadow-sm"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-300 fill-amber-300/30" />
            ) : (
              <Moon className="w-4 h-4 text-blue-200 fill-blue-200/30" />
            )}
          </button>

          {/* Notification Bell with Badge */}
          <button
            onClick={onNotificationClick}
            aria-label="Notifikasi"
            className="relative w-9 h-9 rounded-full bg-blue-900/60 border border-blue-700/60 flex items-center justify-center text-white/90 hover:bg-blue-800/80 active:scale-95 transition-all shadow-sm"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse border border-[#0b193d]">
                {unreadNotifications > 99 ? '99+' : unreadNotifications}
              </span>
            )}
          </button>

          {/* Quick Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              aria-label="Keluar / Ganti Akun"
              title="Keluar / Ganti Akun"
              className="w-9 h-9 rounded-full bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-300 hover:bg-rose-900/80 active:scale-95 transition-all shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
